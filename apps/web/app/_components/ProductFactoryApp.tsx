"use client";

import { useEffect, useRef, useState } from "react";
import type {
  IBusinessIdea,
  IGeneratedBlueprint,
  ISelectedSkill,
  IWorkflowStep,
  TBlueprintStage,
  TSkillsSource,
} from "@/types/blueprint";
import { DEFAULT_BUSINESS_IDEA } from "@/lib/default-idea";
import { fetchFullBlueprint, fetchProductSpec } from "@/lib/blueprint-client";
import { INITIAL_WORKFLOW_STEPS, withStepStatus } from "@/lib/workflow";
import { IntroScreen } from "./IntroScreen";
import { IdeaForm } from "./IdeaForm";
import { WorkflowProgress } from "./WorkflowProgress";
import { SpecApproval } from "./SpecApproval";
import { ResultsTabs } from "./ResultsTabs";

const STEP_DELAY_MS = 700;

export function ProductFactoryApp() {
  const [stage, setStage] = useState<TBlueprintStage>("intro");
  const [idea, setIdea] = useState<IBusinessIdea>(DEFAULT_BUSINESS_IDEA);
  const [steps, setSteps] = useState<IWorkflowStep[]>(INITIAL_WORKFLOW_STEPS);
  const [blueprint, setBlueprint] = useState<IGeneratedBlueprint | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<ISelectedSkill[]>([]);
  const [skillsSource, setSkillsSource] = useState<TSkillsSource | null>(null);
  const [error, setError] = useState<string | null>(null);
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
      const [specResult] = await Promise.all([
        fetchProductSpec(submittedIdea),
        wait(STEP_DELAY_MS),
      ]);
      setBlueprint((prev) => ({
        ...(prev ?? blankBlueprint()),
        productSpec: specResult.productSpec,
        mvpScope: specResult.mvpScope,
      }));
      setSelectedSkills(specResult.selectedSkills);
      setSkillsSource(specResult.skillsSource);
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

  async function handleApprove() {
    if (!blueprint) return;
    setError(null);
    setStage("generating-blueprint");
    markStep("architect", "in-progress");
    markStep("security", "in-progress");
    markStep("planning", "in-progress");
    markStep("evaluation", "in-progress");

    try {
      const [result] = await Promise.all([
        fetchFullBlueprint(idea, blueprint.productSpec, blueprint.mvpScope),
        wait(STEP_DELAY_MS),
      ]);
      setBlueprint((prev) => ({
        ...(prev ?? blankBlueprint()),
        ...result,
      }));
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
    }
  }

  function handleRequestChanges() {
    setError(null);
    setStage("idea-form");
  }

  function handleStartOver() {
    setStage("intro");
    setIdea(DEFAULT_BUSINESS_IDEA);
    setSteps(INITIAL_WORKFLOW_STEPS);
    setBlueprint(null);
    setSelectedSkills([]);
    setSkillsSource(null);
    setError(null);
  }

  if (stage === "intro") {
    return <IntroScreen onStart={() => setStage("idea-form")} />;
  }

  if (stage === "idea-form") {
    return <IdeaForm initialIdea={idea} onSubmit={handleIdeaSubmit} />;
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
          selectedSkills={selectedSkills}
          skillsSource={skillsSource}
          onApprove={handleApprove}
          onRequestChanges={handleRequestChanges}
        />
      </div>
    );
  }

  if (stage === "generating-blueprint") {
    return (
      <div>
        <WorkflowProgress steps={steps} />
        {error && <ErrorBanner message={error} onRetry={handleApprove} onBack={handleRequestChanges} />}
      </div>
    );
  }

  if (stage === "results" && blueprint) {
    return (
      <ResultsTabs
        blueprint={blueprint}
        selectedSkills={selectedSkills}
        skillsSource={skillsSource}
        onStartOver={handleStartOver}
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
}: {
  message: string;
  onRetry: () => void;
  onBack: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl space-y-3 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">
      <p>{message}</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
        >
          Try again
        </button>
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
