export type ResponseFormat = "markdown" | "json";

export interface SkillRecord {
  id: string;
  category: string;
  name: string;
  title: string;
  description: string;
  directoryPath: string;
  skillPath: string;
  references: string[];
}

export interface SearchSkillsInput {
  query: string;
  category?: string;
  limit?: number;
}

export interface LoadedSkill {
  skill: SkillRecord;
  content: string;
  truncated: boolean;
  maxChars: number;
}

export interface RouteIntentInput {
  message: string;
  context?: {
    files?: string[];
    mode?: string;
    previousErrors?: string;
  };
  limit?: number;
}

export interface RouteRecommendation {
  skill: SkillRecord;
  confidence: number;
  reason: string;
  score?: number;
}

export interface RouteWorkflowStep {
  skill: SkillRecord;
  role: "prepare" | "primary" | "support" | "quality";
  reason: string;
}

export interface RouteDecisionEntry {
  skillId: string;
  score: number;
  matchedSignals: string[];
  scoreBreakdown: Record<string, number>;
  reason: string;
}

export interface RouteIntentResult {
  recommended: RouteRecommendation[];
  taskMode: string;
  workflow: RouteWorkflowStep[];
  ruleHierarchy: string[];
  decisionTrail: RouteDecisionEntry[];
  nextAction: string;
}

export interface ValidationSummary {
  command: string;
  total: number;
  valid: number;
  invalid: number;
  output: string;
}
