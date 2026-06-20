import type { IBusinessIdea } from "@/types/blueprint";
import type { IBusinessAnalystOutput } from "@/types/agents";
import { businessAnalystAgent } from "./agents/business-analyst";
import { architectAgent } from "./agents/architect";
import { securityAgent } from "./agents/security";
import { planningAgent } from "./agents/planning";
import { evaluationAgent } from "./agents/evaluation";
import { recommendSkillsDirect as recommendSkills } from "@ai-product-factory/skill-tools";
import type { ISkillRecommendation } from "@ai-product-factory/skill-tools";

export interface IBlueprintStageResult {
  architecture: string;
  security: string;
  roadmap: string;
  tasks: string;
  readinessScore: string;
}

export interface ISpecStageResult extends IBusinessAnalystOutput {
  selectedSkills: ISkillRecommendation[];
}

/**
 * Business Analyst stage, run before the human approval gate.
 *
 * Also runs the Skill Router (recommendSkills) against the raw idea, since
 * AI_Product_Factory_PROJECT_PLAN.md lists "skill routing based on project
 * needs" as part of intake, ahead of Architecture/Security/Roadmap.
 */
export async function runSpecStage(idea: IBusinessIdea): Promise<ISpecStageResult> {
  const [analystOutput, selectedSkills] = await Promise.all([
    businessAnalystAgent.run({ idea }),
    recommendSkills(idea, 5),
  ]);

  return { ...analystOutput, selectedSkills };
}

/**
 * Architect -> Security -> Planning -> Evaluation, run only after the
 * Product Spec has been approved by the user. Each agent receives the
 * prior agents' output, matching the input chain in
 * AI_Product_Factory_PROJECT_PLAN.md section 5.
 */
export async function runBlueprintStage(
  idea: IBusinessIdea,
  productSpec: string,
  mvpScope: string,
): Promise<IBlueprintStageResult> {
  const { architecture } = await architectAgent.run({ idea, productSpec });
  const { security } = await securityAgent.run({ idea, productSpec, architecture });
  const { roadmap, tasks } = await planningAgent.run({
    idea,
    productSpec,
    architecture,
    security,
  });
  const { readinessScore } = await evaluationAgent.run({
    idea,
    productSpec,
    mvpScope,
    architecture,
    security,
    roadmap,
    tasks,
  });

  return { architecture, security, roadmap, tasks, readinessScore };
}
