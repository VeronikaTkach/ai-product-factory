import type { IBusinessIdea } from "@/types/blueprint";
import type { ISkillContextEntry } from "@/server/skill-context";

export interface IBlueprintPromptInput {
  idea: IBusinessIdea;
  productSpec: string;
  mvpScope: string;
  skillContext: ISkillContextEntry[];
}

/**
 * Builds the single combined prompt for the Live Gemini blueprint stage.
 * One call produces four sections (as JSON) so one user-facing "generate"
 * action == one Gemini API call == one unit of daily quota.
 *
 * Readiness Score is deliberately NOT requested here — it's computed
 * afterward by the same deterministic Evaluation agent Demo Mode uses (see
 * orchestrator.ts and src/server/schemas.ts's LiveBlueprintContentSchema),
 * so the score is consistently rich (component scores, interpretation,
 * skills applied, "How to Improve This Score") in both modes instead of
 * depending on whatever the model felt like writing.
 *
 * Skill guidance is included verbatim (truncated) so the model's output is
 * actually informed by the user's final skill selection, mirroring what
 * the deterministic path does via skill-enrichment.ts — but here the
 * model decides how to weave the guidance in, rather than appending fixed
 * bullets.
 */
export function buildBlueprintPrompt(input: IBlueprintPromptInput): string {
  const { idea, productSpec, mvpScope, skillContext } = input;

  const skillsSection =
    skillContext.length > 0
      ? skillContext
          .map((skill) => `### ${skill.name} (${skill.id})\n${skill.description}\n\n${skill.content}`)
          .join("\n\n")
      : "No specific skill guidance was selected; use general best practices.";

  return `You are the Architect, Security, Planning, and Evaluation agents of "AI Product Factory" — a tool that turns a business idea into an implementation-ready MVP blueprint. The Product Specification below has already been approved by the user. Do not regenerate it; use it as input.

Apply the guidance from the selected skills below where relevant to the idea. Do not just restate the skill names — use their substance to shape what you write.

# Selected Skills Guidance

${skillsSection}

# Approved Product Specification

${productSpec}

# MVP Scope

${mvpScope}

# Original Business Idea (for additional context only)

- Product name: ${idea.productName}
- Industry: ${idea.industry || "not specified"}
- Target users: ${idea.targetUsers || "not specified"}
- Market type: ${idea.marketType}
- Key features: ${idea.keyFeatures || "not specified"}
- Handles personal data: ${idea.hasPersonalData}
- Handles financial data: ${idea.hasFinancialData}
- Handles health data: ${idea.hasHealthData}

# Task

Produce a JSON object with exactly these four string keys, each containing Markdown content for that section of the blueprint. Do NOT include a readiness score or scoring table anywhere — that is computed separately by this application, not by you.

- "architecture": Technical Architecture — recommended stack, system architecture diagram (as a fenced text code block), data model, scalability and deployment notes.
- "security": Security and Threat Model — data classification, a STRIDE threat model (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege), security risks, approval-required actions, and recommendations.
- "roadmap": Roadmap — milestones and delivery phases.
- "tasks": Task Breakdown — a checklist of concrete implementation tasks grouped by milestone.

Use Markdown headings (##) inside each section, consistent with a real engineering planning document. Keep each section concise and focused — a few short paragraphs or a handful of bullets per heading, not exhaustive essays. Respond with ONLY the JSON object — no surrounding prose, no Markdown code fence around the JSON itself.`;
}
