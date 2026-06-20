import type { IWorkflowStep, TWorkflowStepStatus } from "@/types/blueprint";

export const INITIAL_WORKFLOW_STEPS: IWorkflowStep[] = [
  {
    id: "business-analyst",
    label: "Business Analyst",
    description: "Generates the Product Specification and MVP boundaries.",
    status: "pending",
  },
  {
    id: "architect",
    label: "Architect",
    description: "Recommends stack, architecture, and data model.",
    status: "pending",
  },
  {
    id: "security",
    label: "Security",
    description: "Classifies data and builds the STRIDE threat model.",
    status: "pending",
  },
  {
    id: "planning",
    label: "Planning",
    description: "Builds the roadmap and task breakdown.",
    status: "pending",
  },
  {
    id: "evaluation",
    label: "Evaluation",
    description: "Calculates the readiness score.",
    status: "pending",
  },
];

export function withStepStatus(
  steps: IWorkflowStep[],
  id: IWorkflowStep["id"],
  status: TWorkflowStepStatus,
): IWorkflowStep[] {
  return steps.map((step) => (step.id === id ? { ...step, status } : step));
}
