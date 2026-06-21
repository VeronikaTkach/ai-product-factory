import {
  PROTECTED_SKILL_IDS,
  type IBusinessIdea,
  type TGenerationMode,
  type TSkillsSource,
} from "@/types/blueprint";
import type { IBusinessAnalystOutput } from "@/types/agents";
import { businessAnalystAgent } from "./agents/business-analyst";
import { architectAgent } from "./agents/architect";
import { securityAgent } from "./agents/security";
import { planningAgent } from "./agents/planning";
import { evaluationAgent } from "./agents/evaluation";
import { recommendSkillsDirect as recommendSkillsLocal } from "@ai-product-factory/skill-tools";
import type { ISkillRecommendation } from "@ai-product-factory/skill-tools";
import { fetchRecommendedSkillsFromMcp } from "./mcp-client";
import { generateLiveBlueprint } from "./llm/blueprint-generator";

const SKILLS_LIMIT = 5;

export interface IBlueprintStageResult {
  architecture: string;
  security: string;
  roadmap: string;
  tasks: string;
  readinessScore: string;
  generationMode: TGenerationMode;
}

export interface ISpecStageResult extends IBusinessAnalystOutput {
  selectedSkills: ISkillRecommendation[];
  skillsSource: TSkillsSource;
}

/**
 * Business Analyst stage, run before the human approval gate.
 *
 * Also runs the Skill Router against the raw idea, since
 * AI_Product_Factory_PROJECT_PLAN.md lists "skill routing based on project
 * needs" as part of intake, ahead of Architecture/Security/Roadmap.
 *
 * Skill routing is MCP-first with a local fallback: if MCP_SERVER_URL is
 * configured, the public MCP server's recommend_skills tool is tried
 * first (bounded by MCP_TIMEOUT_MS); on any failure — or if it's not
 * configured at all — @ai-product-factory/skill-tools is used in-process.
 * Either path produces the same shape; only `skillsSource` differs.
 */
export async function runSpecStage(idea: IBusinessIdea): Promise<ISpecStageResult> {
  const [analystOutput, { skills: selectedSkills, source: skillsSource }] = await Promise.all([
    businessAnalystAgent.run({ idea }),
    resolveSelectedSkills(idea),
  ]);

  return { ...analystOutput, selectedSkills, skillsSource };
}

async function resolveSelectedSkills(
  idea: IBusinessIdea,
): Promise<{ skills: ISkillRecommendation[]; source: TSkillsSource }> {
  const remoteSkills = await fetchRecommendedSkillsFromMcp(idea, SKILLS_LIMIT);
  if (remoteSkills) {
    return { skills: remoteSkills, source: "mcp" };
  }
  return { skills: await recommendSkillsLocal(idea, SKILLS_LIMIT), source: "local" };
}

/**
 * Architect -> Security -> Planning -> Evaluation, run only after the
 * Product Spec has been approved by the user. Each agent receives the
 * prior agents' output, matching the input chain in
 * AI_Product_Factory_PROJECT_PLAN.md section 5.
 *
 * `finalSelectedSkillIds` is the user-adjusted skill set from the manual
 * skill selector (recommended skills plus any the user added/removed).
 * PROTECTED_SKILL_IDS is merged in server-side regardless of what the
 * client sent, so spec-driven-development is never silently dropped.
 *
 * `generationMode` branches Architecture/Security/Roadmap/Tasks:
 * - "demo" (default): the three deterministic agents below (Architect,
 *   Security, Planning), each adding skill-informed notes via
 *   src/server/agents/skill-enrichment.ts.
 * - "live": a single Gemini call (src/server/llm/blueprint-generator.ts)
 *   using the same selectedSkillIds as prompt context instead of those
 *   three agents. Availability (ENABLE_LIVE_AI/LLM_PROVIDER/LLM_API_KEY)
 *   and the daily quota are checked by the route handler BEFORE this
 *   function is called — by the time we get here with generationMode
 *   "live", the request has already been cleared to attempt a real Gemini
 *   call. Any failure during the call itself (timeout, invalid output,
 *   provider error) propagates as a LiveGenerationError for the route
 *   handler to map to a clear HTTP response — this function does not
 *   swallow it or silently substitute demo content.
 *
 * Readiness Score is NOT branched: the Evaluation agent always runs,
 * deterministically, in both modes, scoring whatever Architecture/
 * Security/Roadmap/Tasks text it was given (demo-generated or
 * Gemini-generated) with the same heuristic, skill-applied list, and "How
 * to Improve This Score" recommendations either way. This is what keeps
 * the Readiness Score tab consistently rich regardless of generationMode.
 */
export async function runBlueprintStage(
  idea: IBusinessIdea,
  productSpec: string,
  mvpScope: string,
  finalSelectedSkillIds: string[],
  generationMode: TGenerationMode,
): Promise<IBlueprintStageResult> {
  const selectedSkillIds = Array.from(new Set([...PROTECTED_SKILL_IDS, ...finalSelectedSkillIds]));

  if (generationMode === "live") {
    const live = await generateLiveBlueprint({ idea, productSpec, mvpScope, selectedSkillIds });
    const { readinessScore } = await evaluationAgent.run({
      idea,
      productSpec,
      mvpScope,
      architecture: live.architecture,
      security: live.security,
      roadmap: live.roadmap,
      tasks: live.tasks,
      selectedSkillIds,
    });
    return { ...live, readinessScore, generationMode: "live" };
  }

  const { architecture } = await architectAgent.run({ idea, productSpec, selectedSkillIds });
  const { security } = await securityAgent.run({ idea, productSpec, architecture, selectedSkillIds });
  const { roadmap, tasks } = await planningAgent.run({
    idea,
    productSpec,
    architecture,
    security,
    selectedSkillIds,
  });
  const { readinessScore } = await evaluationAgent.run({
    idea,
    productSpec,
    mvpScope,
    architecture,
    security,
    roadmap,
    tasks,
    selectedSkillIds,
  });

  return { architecture, security, roadmap, tasks, readinessScore, generationMode: "demo" };
}
