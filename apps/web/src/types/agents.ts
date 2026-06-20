import type { IBusinessIdea } from "./blueprint";
import type { TAgentId } from "./blueprint";

export interface IAgent<TInput, TOutput> {
  id: TAgentId;
  run(input: TInput): TOutput | Promise<TOutput>;
}

export interface IBusinessAnalystInput {
  idea: IBusinessIdea;
}

export interface IBusinessAnalystOutput {
  productSpec: string;
  mvpScope: string;
}

export interface IArchitectInput {
  idea: IBusinessIdea;
  productSpec: string;
}

export interface IArchitectOutput {
  architecture: string;
}

export interface ISecurityInput {
  idea: IBusinessIdea;
  productSpec: string;
  architecture: string;
}

export interface ISecurityOutput {
  security: string;
}

export interface IPlanningInput {
  idea: IBusinessIdea;
  productSpec: string;
  architecture: string;
  security: string;
}

export interface IPlanningOutput {
  roadmap: string;
  tasks: string;
}

export interface IEvaluationInput {
  idea: IBusinessIdea;
  productSpec: string;
  mvpScope: string;
  architecture: string;
  security: string;
  roadmap: string;
  tasks: string;
}

export interface IEvaluationOutput {
  readinessScore: string;
}
