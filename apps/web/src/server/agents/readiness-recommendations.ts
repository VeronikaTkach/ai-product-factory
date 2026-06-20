import type { IBusinessIdea } from "@/types/blueprint";
import type { IReadinessComponentScore } from "@ai-product-factory/skill-tools";
import { detectSecuritySignals } from "./security-signals";

/**
 * Deterministic "How to improve this score" recommendations. No LLM call:
 * every line is derived from (a) the weakest scored component, (b) the
 * same idea signals security.ts uses (sensitive data, payments, messaging,
 * moderation), and (c) which of a small set of relevant skills are already
 * selected. Recommendations are intentionally specific — a skill is only
 * recommended when a concrete signal makes it relevant, never as a blanket
 * "select more skills" suggestion, and skill recommendations are kept
 * separate from process/safeguard recommendations so neither category
 * crowds out the other.
 *
 * Recomputed fresh on every blueprint generation from the current idea and
 * the user's final selectedSkillIds, so the list changes when the user
 * adjusts their skill selection and regenerates.
 */

export interface IReadinessRecommendationsInput {
  idea: IBusinessIdea;
  selectedSkillIds: string[];
  components: IReadinessComponentScore[];
}

const COMPONENT_EXPANSION_TIPS: Record<string, string> = {
  "Specification completeness":
    "Add more detail to the Product Spec and MVP Scope — target users, problem statement, and constraints all factor into this score.",
  "Architecture coverage":
    "Expand the Technical Architecture section — add data model detail, integration points, or scalability notes.",
  "Security coverage":
    "Expand the Security and Threat Model section — add detail to the STRIDE rows, Security Risks, or Recommendations.",
  "Delivery readiness":
    "Expand the Roadmap and Tasks — add milestone detail, dependencies, or a more complete task breakdown.",
};

export function buildReadinessRecommendations(input: IReadinessRecommendationsInput): string[] {
  const { idea, selectedSkillIds, components } = input;
  const signals = detectSecuritySignals(idea);
  const selected = new Set(selectedSkillIds);
  const recommendations: string[] = [];

  const weakest = [...components].sort((a, b) => a.score - b.score)[0];
  if (weakest && weakest.score < 85) {
    const tip = COMPONENT_EXPANSION_TIPS[weakest.component];
    recommendations.push(
      `${weakest.component} is the weakest area (${weakest.score}/100).${tip ? ` ${tip}` : ""}`,
    );
  }

  const hasSensitiveData = signals.hasPersonalData || signals.hasFinancialData || signals.hasHealthData;
  if (hasSensitiveData && !selected.has("agent-security-review")) {
    recommendations.push(
      "Add the `agent-security-review` skill — this idea handles sensitive data, and that skill adds a security checklist, an approval gate for high-risk actions, and sensitive-data classification notes to the Security section.",
    );
  }

  if (signals.hasFinancialData && !selected.has("agentic-commerce-rules")) {
    recommendations.push(
      "Add the `agentic-commerce-rules` skill — this idea involves payments, and that skill adds explicit payment/payout/refund controls and fraud/dispute handling to the Security section.",
    );
  }

  if (signals.hasUserGeneratedContent && !selected.has("database-design-rules")) {
    recommendations.push(
      "Add the `database-design-rules` skill — user-generated content needs explicit ownership checks and data constraints, which that skill adds to the Architecture section.",
    );
  }

  if (signals.hasModerationOrReviews && !selected.has("observability-rules")) {
    recommendations.push(
      "Add the `observability-rules` skill — moderation and reviews need an audit trail, which that skill adds (audit logs, traces) to the Architecture and Security sections.",
    );
  }

  if (
    weakest?.component === "Delivery readiness" &&
    weakest.score < 85 &&
    !selected.has("testing-patterns")
  ) {
    recommendations.push(
      "Add the `testing-patterns` skill — it adds an explicit test strategy and regression-test tasks, directly improving delivery readiness.",
    );
  }

  if (signals.hasFinancialData) {
    recommendations.push(
      "Require an explicit human approval step before enabling payments or payouts in production — no skill automates this; it has to be a process decision.",
    );
  }

  if (signals.hasModerationOrReviews) {
    recommendations.push(
      "Require an explicit human approval step before admin moderation actions (removing a listing, suspending a user) go live.",
    );
  }

  if (signals.hasMessaging && hasSensitiveData) {
    recommendations.push(
      "Confirm message contents are never logged or exported as the messaging feature evolves — this is a standing safeguard, not a one-time fix.",
    );
  }

  return recommendations;
}
