import { z } from "zod";

/**
 * Server-side request/response boundary validation.
 * Mirrors IBusinessIdea / IGeneratedBlueprint in src/types/blueprint.ts.
 * Kept independent (not generated from the TS types) so the API contract
 * is explicit and reviewable on its own.
 */
export const BusinessIdeaSchema = z.object({
  productName: z.string().min(1, "productName is required"),
  industry: z.string().default(""),
  businessDescription: z.string().min(1, "businessDescription is required"),
  targetUsers: z.string().default(""),
  geography: z.string().default(""),
  marketType: z.enum(["b2b", "b2c", "b2b2c", "marketplace"]).default("marketplace"),
  problemStatement: z.string().min(1, "problemStatement is required"),
  currentAlternatives: z.string().default(""),
  coreIdea: z.string().min(1, "coreIdea is required"),
  keyFeatures: z.string().default(""),
  budget: z.string().default(""),
  timeline: z.string().default(""),
  teamSize: z.string().default(""),
  hasPersonalData: z.boolean().default(false),
  hasFinancialData: z.boolean().default(false),
  hasHealthData: z.boolean().default(false),
  sensitiveInfoNotes: z.string().default(""),
});

export const BlueprintRequestSchema = z.discriminatedUnion("stage", [
  z.object({
    stage: z.literal("spec"),
    idea: BusinessIdeaSchema,
  }),
  z.object({
    stage: z.literal("blueprint"),
    idea: BusinessIdeaSchema,
    productSpec: z.string().min(1, "productSpec is required"),
    mvpScope: z.string().min(1, "mvpScope is required"),
  }),
]);

export const SelectedSkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  reason: z.string(),
});

export const SpecResponseSchema = z.object({
  productSpec: z.string().min(1),
  mvpScope: z.string().min(1),
  selectedSkills: z.array(SelectedSkillSchema).default([]),
  skillsSource: z.enum(["mcp", "local"]).default("local"),
});

export const BlueprintResponseSchema = z.object({
  architecture: z.string().min(1),
  security: z.string().min(1),
  roadmap: z.string().min(1),
  tasks: z.string().min(1),
  readinessScore: z.string().min(1),
});

export type TBlueprintRequest = z.infer<typeof BlueprintRequestSchema>;
export type TSpecResponse = z.infer<typeof SpecResponseSchema>;
export type TBlueprintResponse = z.infer<typeof BlueprintResponseSchema>;
