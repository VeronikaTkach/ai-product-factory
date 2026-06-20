export interface ISkillMetadata {
  id: string;
  name: string;
  description: string;
  tags: string[];
}

export interface ISkillDetail extends ISkillMetadata {
  content: string;
}

export interface ISkillRecommendation {
  id: string;
  name: string;
  reason: string;
}

export interface IReadinessComponentScore {
  component: string;
  score: number;
  notes: string;
}

export interface IReadinessResult {
  components: IReadinessComponentScore[];
  finalScore: number;
}
