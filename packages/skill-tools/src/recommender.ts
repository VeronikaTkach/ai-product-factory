import { getAllSkillMetadata } from "./metadata";
import type { TIdeaSignal } from "./schemas";
import type { ISkillMetadata, ISkillRecommendation } from "./types";

/**
 * Deterministic, rule-based Skill Router. No LLM call: each rule maps an
 * idea signal (always-on, data sensitivity, or a keyword match against the
 * idea's own text) to a skill id already present in agent-skill-kit/skills.
 * Skills with no matching rule are simply never recommended.
 */
const KEYWORD_RULES: Array<{ skillId: string; keywords: string[] }> = [
  {
    skillId: "react-enterprise-rules",
    keywords: ["app", "frontend", "website", "dashboard", "portal", "ui"],
  },
  {
    skillId: "database-design-rules",
    keywords: ["database", "store", "record", "catalog", "persist", "history"],
  },
  {
    skillId: "a2a-agent-design",
    keywords: ["agent", "workflow", "automation", "multi-agent", "assistant"],
  },
  {
    skillId: "mcp-tool-consumption",
    keywords: ["api", "integration", "tool", "mcp", "third-party", "webhook"],
  },
  {
    skillId: "observability-rules",
    keywords: ["audit", "monitor", "compliance", "transaction history"],
  },
  {
    skillId: "pwa-rules",
    keywords: ["offline", "mobile app", "installable", "push notification"],
  },
  {
    skillId: "agentic-commerce-rules",
    keywords: ["payment", "checkout", "purchase", "order", "commerce", "marketplace"],
  },
];

export async function recommendSkills(
  idea: TIdeaSignal,
  limit = 5,
): Promise<ISkillRecommendation[]> {
  const allSkills = await getAllSkillMetadata();
  const byId = new Map(allSkills.map((skill) => [skill.id, skill]));
  const ideaText = [idea.businessDescription, idea.coreIdea, idea.keyFeatures, idea.problemStatement]
    .join(" ")
    .toLowerCase();

  const picks: ISkillRecommendation[] = [];

  addPick(
    picks,
    byId,
    "spec-driven-development",
    "Every submitted idea needs a structured Product Spec and acceptance criteria before downstream agents run.",
  );

  if (idea.hasPersonalData || idea.hasFinancialData || idea.hasHealthData || idea.sensitiveInfoNotes) {
    addPick(
      picks,
      byId,
      "agent-security-review",
      "This idea handles personal, financial, or health data, so a security review gate is required.",
    );
  }

  addPick(
    picks,
    byId,
    "testing-patterns",
    "The roadmap and task breakdown should define a test strategy alongside delivery milestones.",
  );

  for (const rule of KEYWORD_RULES) {
    if (picks.some((pick) => pick.id === rule.skillId)) continue;
    const matchedKeyword = rule.keywords.find((keyword) => ideaText.includes(keyword));
    if (matchedKeyword) {
      addPick(
        picks,
        byId,
        rule.skillId,
        `The idea mentions "${matchedKeyword}", which this skill directly covers.`,
      );
    }
  }

  return picks.slice(0, limit);
}

function addPick(
  picks: ISkillRecommendation[],
  byId: Map<string, ISkillMetadata>,
  skillId: string,
  reason: string,
): void {
  const skill = byId.get(skillId);
  if (!skill) return;
  picks.push({ id: skill.id, name: skill.name, reason });
}
