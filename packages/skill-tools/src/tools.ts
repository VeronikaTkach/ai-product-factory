import { getAllSkillMetadata } from "./metadata";
import { parseFrontmatter, readSkillMarkdown } from "./reader";
import { recommendSkills as buildRecommendations } from "./recommender";
import { scoreReadiness as computeReadiness } from "./readiness";
import {
  GetSkillInputSchema,
  RecommendSkillsInputSchema,
  ScoreReadinessInputSchema,
} from "./schemas";
import { inferTags } from "./tags";
import type { ISkillDetail, ISkillMetadata, ISkillRecommendation, IReadinessResult } from "./types";

/**
 * Read-only skill tool layer, shared by apps/web (in-process) and
 * packages/mcp-skill-server (as MCP tools: list_skills, get_skill,
 * recommend_skills, score_readiness).
 *
 * Each function validates its own input with Zod, since callers may invoke
 * these directly with no HTTP route or MCP transport validation in front.
 * None of them write files, execute commands, or accept a caller-supplied
 * filesystem path — see reader.ts for the path-traversal-safe design.
 */

export async function listSkills(): Promise<ISkillMetadata[]> {
  return getAllSkillMetadata();
}

export async function getSkill(rawInput: unknown): Promise<ISkillDetail> {
  const { id } = GetSkillInputSchema.parse(rawInput);
  const markdown = await readSkillMarkdown(id);
  if (!markdown) {
    throw new Error(`Skill not found: ${id}`);
  }
  const { name, description, body } = parseFrontmatter(markdown);
  const resolvedDescription = description ?? "";
  return {
    id,
    name: name ?? id,
    description: resolvedDescription,
    tags: inferTags(resolvedDescription),
    content: body,
  };
}

export async function recommendSkills(rawInput: unknown): Promise<ISkillRecommendation[]> {
  const { idea, limit } = RecommendSkillsInputSchema.parse(rawInput);
  return buildRecommendations(idea, limit);
}

export function scoreReadiness(rawInput: unknown): IReadinessResult {
  const parsed = ScoreReadinessInputSchema.parse(rawInput);
  return computeReadiness(parsed);
}
