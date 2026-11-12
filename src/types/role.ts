export type AiCapable = 'yes' | 'partial' | 'no';

export type AiCapability =
  | 'text_generation'
  | 'data_analysis'
  | 'code_software'
  | 'image_design'
  | 'voice_communication'
  | 'reasoning_strategy'
  | 'physical'
  | 'interpersonal'
  | 'sensory';

export type AutomationTimeline = 'Now' | '2-3 years' | '5+ years';

export type TaskImpactMode = 'replace_now' | 'augment_now' | 'assist_only' | 'human_core';

export type HumanBottleneck =
  | 'judgment'
  | 'accountability'
  | 'relationship'
  | 'physical_presence'
  | 'live_sensing'
  | 'regulation'
  | 'coordination';

export type AssessmentConfidence = 'high' | 'medium' | 'low';

export type TaskAssessment = {
  task: string;
  aiCapable: AiCapable;
  capability: AiCapability;
  impactMode: TaskImpactMode;
  bottleneck: HumanBottleneck | null;
  confidence: AssessmentConfidence;
  assessmentSource: 'rule' | 'curated';
  tools: string[];
  reasoning: string;
  isFallback?: boolean;
};

export type ImpactProfile = {
  replaceNowPct: number;
  augmentNowPct: number;
  assistOnlyPct: number;
  humanCorePct: number;
  primaryImpactMode: TaskImpactMode;
  primaryBottlenecks: HumanBottleneck[];
  curatedTaskCount: number;
};

export type RoleWorkstack = {
  apps: string[];
  connectors: string[];
};

export type Role = {
  id: string;
  code: string;
  title: string;
  description: string;
  majorGroup: string;
  majorName: string;
  unitGroup: string;
  skillLevel: number;
  baselineScore: number;
  score: number;
  salary: number;
  leadStatement: string;
  tasks: string[];
  primaryTasks: string[];
  workstack: RoleWorkstack;
  taskAssessments: TaskAssessment[];
  hasTaskFallback: boolean;
  taskAutomationCount: number;
  taskAutomationPct: number;
  timeline: AutomationTimeline;
  impactProfile: ImpactProfile;
  automatableValue: number;
  estimatedSavings: number;
};

export type IndustryRisk = {
  code: string;
  name: string;
  employed: number;
  avgScore: number;
  avgSalary: number;
  atRiskPct: number;
  criticalPct: number;
  highPct: number;
  exposureValue: number;
};
