import type { HumanBottleneck } from '@/types/role';

export type AutonomyTier = 'T1' | 'T2' | 'T3' | 'T4';

export type BlueprintFitLabel = 'Strong fit' | 'Viable' | 'Exploratory';

export type BuildStage = 'prototype' | 'pilot' | 'production';

export type BlueprintStage = {
  stage: BuildStage;
  label: string;
  description: string;
};

export type BlueprintScoreBreakdown = {
  rolePressure: number;
  digitalFit: number;
  autonomyFit: number;
  implementationEase: number;
};

export type AgentBlueprint = {
  id: string;
  roleCode: string;
  title: string;
  archetype: 'Observation Agent' | 'Copilot Agent' | 'Workflow Coordinator' | 'Operator Agent';
  autonomyTier: AutonomyTier;
  score: number;
  fitLabel: BlueprintFitLabel;
  summary: string;
  thesis: string;
  whatItHandles: string[];
  whatStaysHuman: string[];
  coveredTasks: string[];
  excludedTasks: string[];
  humanGuardrails: string[];
  bottlenecks: HumanBottleneck[];
  dailyApps: string[];
  connectorSurface: string[];
  agentLayer: string[];
  buildStages: BlueprintStage[];
  scoreBreakdown: BlueprintScoreBreakdown;
};

export type RoleFactorySummary = {
  roleCode: string;
  roleTitle: string;
  summary: string;
  promise: string;
  grounding: string;
  blueprintCount: number;
  bestFitBlueprintId: string;
};
