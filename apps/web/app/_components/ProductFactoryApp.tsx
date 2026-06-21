"use client";

import { useEffect, useRef, useState } from "react";
import type {
  IBusinessIdea,
  IGeneratedBlueprint,
  ISelectedSkill,
  IWorkflowStep,
  TBlueprintStage,
  TGenerationMode,
  TSkillsSource,
} from "@/types/blueprint";
import { DEFAULT_GENERATION_MODE, PROTECTED_SKILL_IDS } from "@/types/blueprint";
import { DEFAULT_BUSINESS_IDEA } from "@/lib/default-idea";
import {
  BlueprintRequestError,
  fetchAvailableSkills,
  fetchFullBlueprint,
  fetchProductSpec,
} from "@/lib/blueprint-client";
import { buildFinalSelectedSkills } from "@/lib/skill-selection";
import { INITIAL_WORKFLOW_STEPS, withStepStatus } from "@/lib/workflow";
import type { ISkillMetadata } from "@ai-product-factory/skill-tools";
import { IntroScreen } from "./IntroScreen";
import { IdeaForm } from "./IdeaForm";
import { WorkflowProgress } from "./WorkflowProgress";
import { GenerationLoadingBanner } from "./GenerationLoadingBanner";
import { SpecApproval } from "./SpecApproval";
import { ResultsTabs } from "./ResultsTabs";

const STEP_DELAY_MS = 700;

function withProtectedSkills(ids: string[]): string[] {
  return Array.from(new Set([...PROTECTED_SKILL_IDS, ...ids]));
}

export function ProductFactoryApp() {
  const [stage, setStage] = useState<TBlueprintStage>("intro");
  const [idea, setIdea] = useState<IBusinessIdea>(DEFAULT_BUSINESS_IDEA);
  const [steps, setSteps] = useState<IWorkflowStep[]>(INITIAL_WORKFLOW_STEPS);
  const [blueprint, setBlueprint] = useState<IGeneratedBlueprint | null>(null);
  const [recommendedSkills, setRecommendedSkills] = useState<ISelectedSkill[]>([]);
  const [availableSkills, setAvailableSkills] = useState<ISkillMetadata[]>([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [skillsSource, setSkillsSource] = useState<TSkillsSource | null>(null);
  const [generationMode, setGenerationMode] = useState<TGenerationMode>(DEFAULT_GENERATION_MODE);
  const [blueprintGenerationMode, setBlueprintGenerationMode] = useState<TGenerationMode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [canOfferDemoFallback, setCanOfferDemoFallback] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, []);

  function wait(delayMs: number): Promise<void> {
    return new Promise((resolve) => {
      timers.current.push(setTimeout(resolve, delayMs));
    });
  }

  function markStep(id: IWorkflowStep["id"], status: IWorkflowStep["status"]) {
    setSteps((prev) => withStepStatus(prev, id, status));
  }

  async function handleIdeaSubmit(submittedIdea: IBusinessIdea) {
    setIdea(submittedIdea);
    setSteps(INITIAL_WORKFLOW_STEPS);
    setError(null);
    setStage("generating-spec");
    markStep("business-analyst", "in-progress");

    try {
      const [specResult, skills] = await Promise.all([
        fetchProductSpec(submittedIdea),
        fetchAvailableSkills().catch(() => [] as ISkillMetadata[]),
        wait(STEP_DELAY_MS),
      ]);
      setBlueprint((prev) => ({
        ...(prev ?? blankBlueprint()),
        productSpec: specResult.productSpec,
        mvpScope: specResult.mvpScope,
      }));
      setRecommendedSkills(specResult.selectedSkills);
      setAvailableSkills(skills);
      setSkillsSource(specResult.skillsSource);
      setSelectedSkillIds(withProtectedSkills(specResult.selectedSkills.map((skill) => skill.id)));
      setSteps((prev) =>
        prev.map((step) =>
          step.id === "business-analyst" ? { ...step, status: "done" } : { ...step, status: "blocked" },
        ),
      );
      setStage("spec-approval");
    } catch (caughtError) {
      markStep("business-analyst", "error");
      setError(toErrorMessage(caughtError, "Failed to generate the Product Spec."));
    }
  }

  function handleSkillSelectionChange(ids: string[]) {
    setSelectedSkillIds(withProtectedSkills(ids));
  }

  function handleResetSkills() {
    setSelectedSkillIds(withProtectedSkills(recommendedSkills.map((skill) => skill.id)));
  }

  /**
   * Runs the blueprint stage with whatever `generationMode` is currently
   * selected. On a Live Gemini failure (unavailable, rate-limited,
   * timeout, or invalid output — see BlueprintRequestError.code), the
   * server's clear message is shown and the user can either retry the
   * same mode or use "Switch to Demo Mode," which flips the mode and
   * immediately retries deterministically — Demo Mode always works, so
   * this never leaves the user stuck.
   */
  async function handleApprove(modeOverride?: TGenerationMode) {
    if (!blueprint) return;
    const modeForThisAttempt = modeOverride ?? generationMode;
    if (modeOverride) setGenerationMode(modeOverride);

    setError(null);
    setCanOfferDemoFallback(false);
    setStage("generating-blueprint");
    markStep("architect", "in-progress");
    markStep("security", "in-progress");
    markStep("planning", "in-progress");
    markStep("evaluation", "in-progress");

    try {
      const [result] = await Promise.all([
        fetchFullBlueprint(
          idea,
          blueprint.productSpec,
          blueprint.mvpScope,
          selectedSkillIds,
          modeForThisAttempt,
        ),
        wait(STEP_DELAY_MS),
      ]);
      setBlueprint((prev) => ({
        ...(prev ?? blankBlueprint()),
        ...result,
      }));
      setBlueprintGenerationMode(result.generationMode);
      setSteps((prev) =>
        prev.map((step) =>
          step.id === "business-analyst" ? step : { ...step, status: "done" },
        ),
      );
      setStage("results");
    } catch (caughtError) {
      setSteps((prev) =>
        prev.map((step) =>
          step.id === "business-analyst" ? step : { ...step, status: "error" },
        ),
      );
      setError(toErrorMessage(caughtError, "Failed to generate the blueprint."));
      // Only offer the one-click Demo Mode fallback for Live-specific
      // failures, not for generic network/500 errors on Demo Mode itself
      // (which would just repeat the same failure).
      setCanOfferDemoFallback(
        modeForThisAttempt === "live" &&
          caughtError instanceof BlueprintRequestError &&
          ["unavailable", "rate_limited", "timeout", "invalid_output", "provider_error"].includes(
            caughtError.code ?? "",
          ),
      );
    }
  }

  function handleRequestChanges() {
    setError(null);
    setStage("idea-form");
  }

  /**
   * Returns to the skill selection / approval step from the results
   * screen, preserving the current Product Spec, recommended skills,
   * available catalog, and the user's current skill selection — only the
   * stage changes. No idea re-entry, no new spec/skill fetch. Re-approving
   * sends the (possibly adjusted) selectedSkillIds and generationMode to
   * /api/blueprint again, regenerating Architecture/Security/Roadmap/
   * Tasks/Readiness Score.
   */
  function handleAdjustSkills() {
    setError(null);
    setCanOfferDemoFallback(false);
    setSteps((prev) =>
      prev.map((step) => (step.id === "business-analyst" ? step : { ...step, status: "blocked" })),
    );
    setStage("spec-approval");
  }

  function handleStartOver() {
    setStage("intro");
    setIdea(DEFAULT_BUSINESS_IDEA);
    setSteps(INITIAL_WORKFLOW_STEPS);
    setBlueprint(null);
    setRecommendedSkills([]);
    setAvailableSkills([]);
    setSelectedSkillIds([]);
    setSkillsSource(null);
    setGenerationMode(DEFAULT_GENERATION_MODE);
    setBlueprintGenerationMode(null);
    setError(null);
    setCanOfferDemoFallback(false);
  }

  if (stage === "intro") {
    return <IntroScreen onStart={() => setStage("idea-form")} />;
  }

  if (stage === "idea-form") {
    return (
      <IdeaForm
        initialIdea={idea}
        generationMode={generationMode}
        onGenerationModeChange={setGenerationMode}
        onSubmit={handleIdeaSubmit}
      />
    );
  }

  if (stage === "generating-spec") {
    return (
      <div>
        <WorkflowProgress steps={steps} />
        {error && (
          <ErrorBanner message={error} onRetry={() => handleIdeaSubmit(idea)} onBack={handleRequestChanges} />
        )}
      </div>
    );
  }

  if (stage === "spec-approval" && blueprint) {
    return (
      <div>
        <WorkflowProgress steps={steps} />
        <SpecApproval
          productSpecMarkdown={blueprint.productSpec}
          mvpScopeMarkdown={blueprint.mvpScope}
          recommendedSkills={recommendedSkills}
          skillsSource={skillsSource}
          availableSkills={availableSkills}
          selectedSkillIds={selectedSkillIds}
          onSkillSelectionChange={handleSkillSelectionChange}
          onResetSkills={handleResetSkills}
          generationMode={generationMode}
          onGenerationModeChange={setGenerationMode}
          onApprove={() => handleApprove()}
          onRequestChanges={handleRequestChanges}
        />
      </div>
    );
  }

  if (stage === "generating-blueprint") {
    return (
      <div>
        {!error && (
          <GenerationLoadingBanner
            generationMode={generationMode}
            selectedSkills={buildFinalSelectedSkills(selectedSkillIds, recommendedSkills, availableSkills)}
          />
        )}
        <WorkflowProgress steps={steps} />
        {error && (
          <ErrorBanner
            message={error}
            onRetry={() => handleApprove()}
            onBack={handleRequestChanges}
            onUseDemoMode={canOfferDemoFallback ? () => handleApprove("demo") : undefined}
          />
        )}
      </div>
    );
  }

  if (stage === "results" && blueprint) {
    return (
      <ResultsTabs
        blueprint={blueprint}
        selectedSkills={buildFinalSelectedSkills(selectedSkillIds, recommendedSkills, availableSkills)}
        skillsSource={skillsSource}
        blueprintGenerationMode={blueprintGenerationMode}
        onStartOver={handleStartOver}
        onAdjustSkills={handleAdjustSkills}
      />
    );
  }

  return null;
}

function blankBlueprint(): IGeneratedBlueprint {
  return {
    productSpec: "",
    mvpScope: "",
    architecture: "",
    security: "",
    roadmap: "",
    tasks: "",
    readinessScore: "",
  };
}

function toErrorMessage(caughtError: unknown, fallback: string): string {
  return caughtError instanceof Error ? caughtError.message : fallback;
}

function ErrorBanner({
  message,
  onRetry,
  onBack,
  onUseDemoMode,
}: {
  message: string;
  onRetry: () => void;
  onBack: () => void;
  onUseDemoMode?: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl space-y-3 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">
      <p>{message}</p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
        >
          Try again
        </button>
        {onUseDemoMode && (
          <button
            type="button"
            onClick={onUseDemoMode}
            className="rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            Switch to Demo Mode
          </button>
        )}
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-red-300 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
        >
          Edit idea
        </button>
      </div>
    </div>
  );
}
