import type { IBusinessIdea, TGenerationMode } from "@/types/blueprint";
import type { IBlueprintStageResult, ISpecStageResult } from "@/server/orchestrator";
import type { ISkillMetadata } from "@ai-product-factory/skill-tools";

export class BlueprintRequestError extends Error {
  constructor(
    message: string,
    readonly code?: string,
  ) {
    super(message);
    this.name = "BlueprintRequestError";
  }
}

async function postBlueprint<TResponse>(body: unknown): Promise<TResponse> {
  const response = await fetch("/api/blueprint", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    // Carries the anonymous rate-limit cookie (src/server/anon-id.ts) for
    // Live Gemini Mode; harmless and unused for Demo Mode requests.
    credentials: "same-origin",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new BlueprintRequestError(
      payload.error ?? `Request failed with status ${response.status}`,
      payload.code,
    );
  }

  return response.json() as Promise<TResponse>;
}

export function fetchProductSpec(idea: IBusinessIdea): Promise<ISpecStageResult> {
  return postBlueprint<ISpecStageResult>({ stage: "spec", idea });
}

export function fetchFullBlueprint(
  idea: IBusinessIdea,
  productSpec: string,
  mvpScope: string,
  finalSelectedSkillIds: string[],
  generationMode: TGenerationMode,
): Promise<IBlueprintStageResult> {
  return postBlueprint<IBlueprintStageResult>({
    stage: "blueprint",
    idea,
    productSpec,
    mvpScope,
    finalSelectedSkillIds,
    generationMode,
  });
}

export async function fetchAvailableSkills(): Promise<ISkillMetadata[]> {
  const response = await fetch("/api/skills");
  if (!response.ok) {
    throw new Error(`Failed to load skills (status ${response.status})`);
  }
  const payload = (await response.json()) as { skills: ISkillMetadata[] };
  return payload.skills;
}
