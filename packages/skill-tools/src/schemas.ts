import { z } from "zod";

/**
 * Validation boundary for the skill tool functions
 * (listSkills, getSkill, recommendSkills, scoreReadiness).
 *
 * Every tool validates its own input with these schemas, not just whatever
 * HTTP/MCP transport sits in front of it — both apps/web's API route and
 * packages/mcp-skill-server's MCP transport call into the same functions.
 */

export const SkillIdSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9-]+$/, "Skill id must be lowercase kebab-case");

export const GetSkillInputSchema = z.object({
  id: SkillIdSchema,
});

/**
 * Minimal idea signal used for skill recommendation. Intentionally smaller
 * than the AI Product Factory web app's full business-idea form: this is
 * the public tool/MCP contract, so it only asks for what recommendSkills
 * actually uses, and every field defaults so a partial caller still works.
 */
export const IdeaSignalSchema = z.object({
  businessDescription: z.string().default(""),
  coreIdea: z.string().default(""),
  keyFeatures: z.string().default(""),
  problemStatement: z.string().default(""),
  hasPersonalData: z.boolean().default(false),
  hasFinancialData: z.boolean().default(false),
  hasHealthData: z.boolean().default(false),
  sensitiveInfoNotes: z.string().default(""),
});

export const RecommendSkillsInputSchema = z.object({
  idea: IdeaSignalSchema,
  limit: z.number().int().min(1).max(10).default(5),
});

export const ScoreReadinessInputSchema = z.object({
  productSpec: z.string().min(1),
  mvpScope: z.string().min(1),
  architecture: z.string().min(1),
  security: z.string().min(1),
  roadmap: z.string().min(1),
  tasks: z.string().min(1),
});

export type TGetSkillInput = z.infer<typeof GetSkillInputSchema>;
export type TIdeaSignal = z.infer<typeof IdeaSignalSchema>;
export type TRecommendSkillsInput = z.infer<typeof RecommendSkillsInputSchema>;
export type TScoreReadinessInput = z.infer<typeof ScoreReadinessInputSchema>;

/**
 * Output-shape schemas. Used by packages/mcp-skill-server to declare each
 * MCP tool's outputSchema/structuredContent; also available to any other
 * consumer that wants to validate a tool's result at a boundary.
 */
export const SkillMetadataSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
});

export const SkillDetailSchema = SkillMetadataSchema.extend({
  content: z.string(),
});

export const SkillRecommendationSchema = z.object({
  id: z.string(),
  name: z.string(),
  reason: z.string(),
});

export const ReadinessComponentScoreSchema = z.object({
  component: z.string(),
  score: z.number(),
  notes: z.string(),
});

export const ReadinessResultSchema = z.object({
  components: z.array(ReadinessComponentScoreSchema),
  finalScore: z.number(),
});
