import type { IAgent, IEvaluationInput, IEvaluationOutput } from "@/types/agents";
import { scoreReadiness } from "@ai-product-factory/skill-tools";
import type { IReadinessComponentScore } from "@ai-product-factory/skill-tools";

/**
 * Demo-mode implementation: delegates the actual scoring to
 * packages/skill-tools' scoreReadiness (a deterministic, content-length
 * heuristic shared with the public MCP server's score_readiness tool)
 * instead of a fixed template, so the score and interpretation below
 * change when the upstream agents' output changes.
 */
export const evaluationAgent: IAgent<IEvaluationInput, IEvaluationOutput> = {
  id: "evaluation",
  run({ idea, productSpec, mvpScope, architecture, security, roadmap, tasks }) {
    const name = idea.productName || "Untitled Product";
    const { components, finalScore } = scoreReadiness({
      productSpec,
      mvpScope,
      architecture,
      security,
      roadmap,
      tasks,
    });

    const componentRows = components
      .map((component) => `| ${component.component} | ${component.score}/100 | ${component.notes} |`)
      .join("\n");

    const readinessScore = `# Readiness Score: ${name}

## Component Scores

| Component | Score | Notes |
|---|---|---|
${componentRows}

## Final Readiness Score

\`\`\`text
Readiness Score: ${finalScore}/100
\`\`\`

## Interpretation

${buildInterpretation(components, finalScore)}
`;

    return { readinessScore };
  },
};

function buildInterpretation(components: IReadinessComponentScore[], finalScore: number): string {
  const sorted = [...components].sort((a, b) => a.score - b.score);
  const weakest = sorted[0];
  const strongest = sorted[sorted.length - 1];

  let tier: string;
  if (finalScore >= 85) {
    tier = "This blueprint is implementation-ready; remaining gaps are minor refinements.";
  } else if (finalScore >= 70) {
    tier = "This blueprint is mostly ready for implementation, with some gaps to address first.";
  } else {
    tier = "This blueprint needs more work before implementation should start.";
  }

  const weakestNote =
    weakest.score < 85
      ? `The weakest area is ${weakest.component} (${weakest.score}/100) — expand that section before relying on the rest of the plan.`
      : `All components scored close together; ${strongest.component} is the strongest at ${strongest.score}/100.`;

  return [
    tier,
    weakestNote,
    "Review the Approval-Required Actions in the Security tab before implementation begins, regardless of the score above.",
  ].join(" ");
}
