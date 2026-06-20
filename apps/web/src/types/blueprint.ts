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
