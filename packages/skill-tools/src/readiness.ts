import type { TScoreReadinessInput } from "./schemas";
import type { IReadinessComponentScore, IReadinessResult } from "./types";

/**
 * Deterministic, demo-mode readiness heuristic. Scores by content length,
 * not by understanding the content — a placeholder for a real evaluation
 * model, kept separate from the AI Product Factory Evaluation agent's own
 * fixed-template output so it can be reused as a standalone tool.
 */
export function scoreReadiness(input: TScoreReadinessInput): IReadinessResult {
  const components: IReadinessComponentScore[] = [
    scoreComponent("Specification completeness", `${input.productSpec}\n${input.mvpScope}`),
    scoreComponent("Architecture coverage", input.architecture),
    scoreComponent("Security coverage", input.security),
    scoreComponent("Delivery readiness", `${input.roadmap}\n${input.tasks}`),
  ];

  const finalScore = Math.round(
    components.reduce((sum, component) => sum + component.score, 0) / components.length,
  );

  return { components, finalScore };
}

function scoreComponent(component: string, text: string): IReadinessComponentScore {
  const length = text.trim().length;
  if (length === 0) {
    return { component, score: 0, notes: "No content provided." };
  }
  const score = Math.max(40, Math.min(95, 40 + Math.round(length / 40)));
  return {
    component,
    score,
    notes: "Demo-mode heuristic score based on content length, not a live evaluation model.",
  };
}
