export type TMarketType = "b2b" | "b2c" | "b2b2c" | "marketplace";

export interface IBusinessIdea {
  productName: string;
  industry: string;
  businessDescription: string;
  targetUsers: string;
  geography: string;
  marketType: TMarketType;
  problemStatement: string;
  currentAlternatives: string;
  coreIdea: string;
  keyFeatures: string;
  budget: string;
  timeline: string;
  teamSize: string;
  hasPersonalData: boolean;
  hasFinancialData: boolean;
  hasHealthData: boolean;
  sensitiveInfoNotes: string;
}

export type TAgentId =
  | "business-analyst"
  | "architect"
  | "security"
  | "planning"
  | "evaluation";

export type TWorkflowStepStatus =
  | "pending"
  | "in-progress"
  | "done"
  | "blocked"
  | "error";

export interface IWorkflowStep {
  id: TAgentId;
  label: string;
  description: string;
  status: TWorkflowStepStatus;
}

export type TBlueprintStage =
  | "intro"
  | "idea-form"
  | "generating-spec"
  | "spec-approval"
  | "generating-blueprint"
  | "results";

export type TResultTabId =
  | "product-spec"
  | "mvp-scope"
  | "architecture"
  | "security"
  | "roadmap"
  | "tasks"
  | "readiness-score";

export interface IResultTab {
  id: TResultTabId;
  label: string;
  markdown: string;
}

export interface IGeneratedBlueprint {
  productSpec: string;
  mvpScope: string;
  architecture: string;
  security: string;
  roadmap: string;
  tasks: string;
  readinessScore: string;
}

export interface ISelectedSkill {
  id: string;
  name: string;
  reason: string;
}

/** Where selectedSkills came from: the public MCP server, or the local skill-tools fallback. */
export type TSkillsSource = "mcp" | "local";

/**
 * Generation mode for the blueprint stage only. The spec stage always runs
 * deterministically regardless of this value — see
 * src/server/orchestrator.ts and docs/architecture.md, "Live Gemini Mode".
 *
 * - "demo": deterministic, skill-informed templates (apps/web/src/server/agents/*).
 *           Always available; the default; requires no env configuration.
 * - "live": server-side Gemini call using the same selected skills as
 *           prompt context. Only runs if the server has ENABLE_LIVE_AI=true,
 *           LLM_PROVIDER=gemini, and LLM_API_KEY configured, and the
 *           per-user daily quota (LIVE_AI_DAILY_LIMIT) isn't exhausted.
 */
export type TGenerationMode = "demo" | "live";

export const DEFAULT_GENERATION_MODE: TGenerationMode = "demo";

/**
 * Skills that must always be selected and cannot be removed via the manual
 * skill selector. spec-driven-development underpins the Product Spec
 * itself, so it stays selected regardless of MCP/local recommendation or
 * user edits. Enforced both client-side (disabled checkbox) and
 * server-side (orchestrator merges this in before generating the
 * blueprint) — see src/server/orchestrator.ts.
 */
export const PROTECTED_SKILL_IDS: readonly string[] = ["spec-driven-development"];
