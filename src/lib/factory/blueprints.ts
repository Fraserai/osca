import { getRoleInsights } from '@/lib/roles/insights';
import { HUMAN_BOTTLENECK_META } from '@/lib/roles/impactMeta';
import type { RoleInsights } from '@/lib/roles/insights';
import type {
  AgentBlueprint,
  AutonomyTier,
  BlueprintFitLabel,
  BlueprintScoreBreakdown,
  BlueprintStage,
  RoleFactorySummary
} from '@/lib/factory/types';
import type { AiCapability, AssessmentConfidence, HumanBottleneck, Role, TaskAssessment, TaskImpactMode } from '@/types/role';

type TierCandidate = {
  tier: AutonomyTier;
  score: number;
  fitLabel: BlueprintFitLabel;
  autonomyFit: number;
  implementationEase: number;
  eligible: boolean;
  coveredTasks: TaskAssessment[];
  excludedTasks: TaskAssessment[];
  bottlenecks: HumanBottleneck[];
  connectorSurface: string[];
  agentLayer: string[];
};

type RoleSignals = {
  totalTasks: number;
  rolePressure: number;
  digitalFit: number;
  confidence: number;
  replaceNow: number;
  augmentNow: number;
  assistOnly: number;
  humanCore: number;
  toolCoverage: number;
  physicalBlocker: number;
  liveSensingBlocker: number;
  relationshipBlocker: number;
  regulationBlocker: number;
  coordinationBlocker: number;
  judgmentBlocker: number;
  accountabilityBlocker: number;
  heavyBlockerShare: number;
  observationSignal: number;
  copilotSignal: number;
  coordinationSignal: number;
  operatorSignal: number;
  insights: RoleInsights;
};

const TIER_ORDER: AutonomyTier[] = ['T4', 'T3', 'T2', 'T1'];
const DIGITAL_CAPABILITIES = new Set<AiCapability>([
  'text_generation',
  'data_analysis',
  'code_software',
  'image_design',
  'voice_communication',
  'reasoning_strategy'
]);

const OBSERVATION_KEYWORDS = /\b(monitor|review|audit|analyse|analyze|inspect|track|report|investigate|research|document|assess)\b/i;
const COPILOT_KEYWORDS = /\b(draft|prepare|advise|recommend|support|assist|respond|interpret|communicate|calculate|write)\b/i;
const COORDINATION_KEYWORDS = /\b(coordinat|schedule|route|assign|allocate|liais|handoff|dispatch|arrange|workflow|process|follow up)\b/i;
const OPERATOR_KEYWORDS = /\b(enter|process|record|compile|calculate|reconcile|generate|issue|update|verify|transcribe|maintain)\b/i;

const CONFIDENCE_BONUS: Record<AssessmentConfidence, number> = {
  high: 6,
  medium: 3,
  low: 0
};

const TIER_IMPACT_WEIGHTS: Record<AutonomyTier, Record<TaskImpactMode, number>> = {
  T1: { replace_now: 12, augment_now: 24, assist_only: 26, human_core: 18 },
  T2: { replace_now: 14, augment_now: 30, assist_only: 22, human_core: 12 },
  T3: { replace_now: 18, augment_now: 24, assist_only: 30, human_core: 8 },
  T4: { replace_now: 34, augment_now: 16, assist_only: 18, human_core: -20 }
};

const TIER_CAPABILITY_WEIGHTS: Record<AutonomyTier, Record<AiCapability, number>> = {
  T1: {
    text_generation: 14,
    data_analysis: 18,
    code_software: 10,
    image_design: 6,
    voice_communication: 8,
    reasoning_strategy: 18,
    physical: -32,
    interpersonal: 5,
    sensory: -28
  },
  T2: {
    text_generation: 14,
    data_analysis: 12,
    code_software: 10,
    image_design: 8,
    voice_communication: 12,
    reasoning_strategy: 16,
    physical: -26,
    interpersonal: 10,
    sensory: -20
  },
  T3: {
    text_generation: 10,
    data_analysis: 10,
    code_software: 10,
    image_design: 4,
    voice_communication: 12,
    reasoning_strategy: 14,
    physical: -26,
    interpersonal: 8,
    sensory: -20
  },
  T4: {
    text_generation: 12,
    data_analysis: 10,
    code_software: 12,
    image_design: 8,
    voice_communication: 10,
    reasoning_strategy: 10,
    physical: -40,
    interpersonal: -10,
    sensory: -35
  }
};

const TIER_BOTTLENECK_WEIGHTS: Record<AutonomyTier, Partial<Record<HumanBottleneck, number>>> = {
  T1: {
    judgment: 10,
    accountability: 8,
    coordination: 6,
    regulation: 8,
    relationship: 2,
    physical_presence: -36,
    live_sensing: -32
  },
  T2: {
    judgment: 12,
    accountability: 12,
    relationship: 10,
    coordination: 5,
    regulation: 6,
    physical_presence: -30,
    live_sensing: -26
  },
  T3: {
    coordination: 16,
    accountability: 8,
    judgment: 6,
    relationship: 4,
    regulation: 4,
    physical_presence: -26,
    live_sensing: -22
  },
  T4: {
    coordination: 4,
    judgment: -10,
    accountability: -10,
    relationship: -20,
    regulation: -20,
    physical_presence: -40,
    live_sensing: -36
  }
};

const BOTTLENECK_GUARDRAILS: Record<HumanBottleneck, string> = {
  judgment: 'Keep edge-case interpretation and final decision quality with a human owner.',
  accountability: 'Keep approvals, exceptions, and liability-bearing sign-off with a human.',
  relationship: 'Keep sensitive conversations and trust-heavy interactions human-led.',
  physical_presence: 'Keep real-world execution and on-site handling with a human team.',
  live_sensing: 'Keep live inspection in changing environments under human control.',
  regulation: 'Keep regulated decisions and compliance accountability with a human owner.',
  coordination: 'Keep cross-team exception handling and escalation control with a human.'
};

const GENERIC_AGENT_LAYER_BY_CAPABILITY: Record<AiCapability, string> = {
  text_generation: 'Frontier language models',
  data_analysis: 'Retrieval and analytics layer',
  code_software: 'Execution and API runtimes',
  image_design: 'Creative generation models',
  voice_communication: 'Voice agent layer',
  reasoning_strategy: 'Workflow orchestration layer',
  physical: 'Human field execution',
  interpersonal: 'Human approval queue',
  sensory: 'Human inspection step'
};

const CONNECTOR_PRIORITY_BY_TIER: Record<AutonomyTier, string[]> = {
  T1: ['Docs', 'Analytics', 'Monitoring', 'Knowledge Base', 'File Storage', 'Email', 'Calendar', 'Messaging', 'CRM', 'Ticketing', 'Scheduling', 'ERP', 'Case Management', 'eSignature', 'Clinical Records', 'CMS'],
  T2: ['Email', 'Calendar', 'Docs', 'CRM', 'Knowledge Base', 'Messaging', 'Scheduling', 'Ticketing', 'File Storage', 'Analytics', 'ERP', 'Case Management', 'eSignature', 'Clinical Records', 'CMS', 'Monitoring'],
  T3: ['Ticketing', 'Scheduling', 'CRM', 'ERP', 'Case Management', 'Messaging', 'Docs', 'Knowledge Base', 'Email', 'Calendar', 'Analytics', 'File Storage', 'CMS', 'Monitoring', 'eSignature', 'Clinical Records'],
  T4: ['ERP', 'CRM', 'Ticketing', 'Case Management', 'eSignature', 'CMS', 'Analytics', 'Scheduling', 'Docs', 'Knowledge Base', 'Monitoring', 'Email', 'Calendar', 'File Storage', 'Messaging', 'Clinical Records']
};

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function percent(count: number, total: number): number {
  if (total === 0) {
    return 0;
  }

  return Math.round((count / total) * 100);
}

function countTasks(role: Role, predicate: (task: TaskAssessment) => boolean): number {
  return role.taskAssessments.filter(predicate).length;
}

function getRegexSignal(role: Role, regex: RegExp): number {
  return percent(
    countTasks(role, (task) => regex.test(task.task)),
    role.taskAssessments.length
  );
}

function getSignals(role: Role): RoleSignals {
  const totalTasks = Math.max(role.taskAssessments.length, 1);
  const insights = getRoleInsights(role);

  const digitalFit = percent(
    countTasks(
      role,
      (task) =>
        DIGITAL_CAPABILITIES.has(task.capability) &&
        task.bottleneck !== 'physical_presence' &&
        task.bottleneck !== 'live_sensing'
    ),
    totalTasks
  );

  const toolCoverage = percent(countTasks(role, (task) => task.tools.length > 0), totalTasks);
  const physicalBlocker = percent(countTasks(role, (task) => task.bottleneck === 'physical_presence'), totalTasks);
  const liveSensingBlocker = percent(countTasks(role, (task) => task.bottleneck === 'live_sensing'), totalTasks);
  const relationshipBlocker = percent(countTasks(role, (task) => task.bottleneck === 'relationship'), totalTasks);
  const regulationBlocker = percent(countTasks(role, (task) => task.bottleneck === 'regulation'), totalTasks);
  const coordinationBlocker = percent(countTasks(role, (task) => task.bottleneck === 'coordination'), totalTasks);
  const judgmentBlocker = percent(countTasks(role, (task) => task.bottleneck === 'judgment'), totalTasks);
  const accountabilityBlocker = percent(countTasks(role, (task) => task.bottleneck === 'accountability'), totalTasks);

  return {
    totalTasks,
    rolePressure: role.score,
    digitalFit,
    confidence: insights.confidenceScore,
    replaceNow: role.impactProfile.replaceNowPct,
    augmentNow: role.impactProfile.augmentNowPct,
    assistOnly: role.impactProfile.assistOnlyPct,
    humanCore: role.impactProfile.humanCorePct,
    toolCoverage,
    physicalBlocker,
    liveSensingBlocker,
    relationshipBlocker,
    regulationBlocker,
    coordinationBlocker,
    judgmentBlocker,
    accountabilityBlocker,
    heavyBlockerShare: clamp(physicalBlocker + liveSensingBlocker + relationshipBlocker + regulationBlocker),
    observationSignal: getRegexSignal(role, OBSERVATION_KEYWORDS),
    copilotSignal: getRegexSignal(role, COPILOT_KEYWORDS),
    coordinationSignal: clamp(
      percent(
        countTasks(role, (task) => task.bottleneck === 'coordination' || COORDINATION_KEYWORDS.test(task.task)),
        totalTasks
      )
    ),
    operatorSignal: clamp(
      percent(
        countTasks(role, (task) => task.impactMode === 'replace_now' || OPERATOR_KEYWORDS.test(task.task)),
        totalTasks
      )
    ),
    insights
  };
}

function getAutonomyFit(tier: AutonomyTier, signals: RoleSignals): number {
  switch (tier) {
    case 'T1':
      return clamp(
        Math.round(
          signals.digitalFit * 0.35 +
            signals.observationSignal * 0.25 +
            signals.assistOnly * 0.2 +
            (100 - signals.physicalBlocker - signals.liveSensingBlocker) * 0.2
        )
      );
    case 'T2':
      return clamp(
        Math.round(
          signals.augmentNow * 0.45 +
            (signals.judgmentBlocker + signals.accountabilityBlocker + signals.relationshipBlocker) * 0.25 +
            signals.digitalFit * 0.2 +
            signals.copilotSignal * 0.1
        )
      );
    case 'T3':
      return clamp(
        Math.round(
          signals.coordinationBlocker * 0.35 +
            (signals.assistOnly + signals.augmentNow) * 0.3 +
            signals.digitalFit * 0.2 +
            signals.coordinationSignal * 0.15
        )
      );
    case 'T4':
      return clamp(
        Math.round(
          signals.replaceNow * 0.5 +
            signals.digitalFit * 0.25 +
            (100 - signals.humanCore) * 0.15 +
            (100 - signals.heavyBlockerShare) * 0.1
        )
      );
  }
}

function getImplementationEase(tier: AutonomyTier, signals: RoleSignals): number {
  switch (tier) {
    case 'T1':
      return clamp(
        Math.round(signals.digitalFit * 0.35 + signals.toolCoverage * 0.2 + signals.confidence * 0.2 + (100 - signals.heavyBlockerShare) * 0.25)
      );
    case 'T2':
      return clamp(
        Math.round(
          signals.digitalFit * 0.25 +
            signals.toolCoverage * 0.2 +
            signals.confidence * 0.2 +
            (100 - signals.physicalBlocker - signals.liveSensingBlocker) * 0.15 +
            (signals.judgmentBlocker + signals.accountabilityBlocker + signals.relationshipBlocker) * 0.2
        )
      );
    case 'T3':
      return clamp(
        Math.round(
          signals.digitalFit * 0.25 +
            signals.toolCoverage * 0.25 +
            signals.confidence * 0.2 +
            signals.coordinationSignal * 0.15 +
            (100 - signals.heavyBlockerShare) * 0.15
        )
      );
    case 'T4':
      return clamp(
        Math.round(
          signals.digitalFit * 0.35 +
            signals.toolCoverage * 0.25 +
            signals.confidence * 0.15 +
            (100 - signals.humanCore) * 0.1 +
            (100 - signals.heavyBlockerShare) * 0.15
        )
      );
  }
}

function isTierEligible(tier: AutonomyTier, signals: RoleSignals): boolean {
  switch (tier) {
    case 'T1':
      return signals.digitalFit >= 18 || signals.rolePressure >= 30;
    case 'T2':
      return signals.augmentNow >= 15 || signals.judgmentBlocker + signals.accountabilityBlocker + signals.relationshipBlocker >= 18;
    case 'T3':
      return signals.coordinationBlocker >= 10 || signals.coordinationSignal >= 18 || signals.assistOnly + signals.augmentNow >= 25;
    case 'T4':
      return signals.replaceNow >= 35 && signals.humanCore <= 45 && signals.heavyBlockerShare <= 30;
  }
}

function getFitLabel(score: number): BlueprintFitLabel {
  if (score >= 75) {
    return 'Strong fit';
  }

  if (score >= 55) {
    return 'Viable';
  }

  return 'Exploratory';
}

function getKeywordBonus(tier: AutonomyTier, taskText: string): number {
  switch (tier) {
    case 'T1':
      return OBSERVATION_KEYWORDS.test(taskText) ? 10 : 0;
    case 'T2':
      return COPILOT_KEYWORDS.test(taskText) ? 8 : 0;
    case 'T3':
      return COORDINATION_KEYWORDS.test(taskText) ? 10 : 0;
    case 'T4':
      return OPERATOR_KEYWORDS.test(taskText) ? 10 : 0;
  }
}

function getTaskFitScore(task: TaskAssessment, tier: AutonomyTier): number {
  const bottleneckWeight = task.bottleneck ? (TIER_BOTTLENECK_WEIGHTS[tier][task.bottleneck] ?? 0) : 0;

  return (
    50 +
    TIER_IMPACT_WEIGHTS[tier][task.impactMode] +
    TIER_CAPABILITY_WEIGHTS[tier][task.capability] +
    bottleneckWeight +
    CONFIDENCE_BONUS[task.confidence] +
    Math.min(task.tools.length, 2) * 2 +
    getKeywordBonus(tier, task.task)
  );
}

function sortTasksForTier(role: Role, tier: AutonomyTier, descending = true): TaskAssessment[] {
  return role.taskAssessments
    .slice()
    .sort((left, right) => {
      const leftScore = getTaskFitScore(left, tier);
      const rightScore = getTaskFitScore(right, tier);

      if (leftScore !== rightScore) {
        return descending ? rightScore - leftScore : leftScore - rightScore;
      }

      return left.task.localeCompare(right.task);
    });
}

function getTopBottlenecks(tasks: TaskAssessment[]): HumanBottleneck[] {
  const counts = new Map<HumanBottleneck, number>();

  tasks.forEach((task) => {
    if (!task.bottleneck) {
      return;
    }

    counts.set(task.bottleneck, (counts.get(task.bottleneck) ?? 0) + 1);
  });

  return [...counts.entries()]
    .sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1];
      }

      return HUMAN_BOTTLENECK_META[left[0]].label.localeCompare(HUMAN_BOTTLENECK_META[right[0]].label);
    })
    .slice(0, 3)
    .map(([bottleneck]) => bottleneck);
}

function getConnectorSurface(role: Role, tier: AutonomyTier, signals: RoleSignals): string[] {
  const roleConnectors = role.workstack.connectors.slice(0, 4);

  const filteredConnectors =
    tier === 'T4'
      ? roleConnectors.filter((connector) => {
          if (connector === 'Clinical Records' && signals.regulationBlocker + signals.relationshipBlocker >= 25) {
            return false;
          }

          if (connector === 'Case Management' && signals.relationshipBlocker + signals.judgmentBlocker >= 35) {
            return false;
          }

          return true;
        })
      : roleConnectors;

  const connectorPool = filteredConnectors.length > 0 ? filteredConnectors : roleConnectors;
  const priority = CONNECTOR_PRIORITY_BY_TIER[tier];

  return connectorPool
    .slice()
    .sort((left, right) => {
      const leftIndex = priority.indexOf(left);
      const rightIndex = priority.indexOf(right);
      const normalizedLeftIndex = leftIndex === -1 ? priority.length : leftIndex;
      const normalizedRightIndex = rightIndex === -1 ? priority.length : rightIndex;

      if (normalizedLeftIndex !== normalizedRightIndex) {
        return normalizedLeftIndex - normalizedRightIndex;
      }

      return left.localeCompare(right);
    })
    .slice(0, 4);
}

function getAgentLayer(coveredTasks: TaskAssessment[], insights: RoleInsights): string[] {
  const toolCounts = new Map<string, number>();

  coveredTasks.forEach((task) => {
    task.tools.forEach((tool) => {
      toolCounts.set(tool, (toolCounts.get(tool) ?? 0) + 1);
    });
  });

  const rankedTools = [...toolCounts.entries()]
    .sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1];
      }

      return left[0].localeCompare(right[0]);
    })
    .map(([tool]) => tool);

  if (rankedTools.length >= 3) {
    return rankedTools.slice(0, 4);
  }

  const capabilityCounts = new Map<AiCapability, number>();
  coveredTasks.forEach((task) => {
    capabilityCounts.set(task.capability, (capabilityCounts.get(task.capability) ?? 0) + 1);
  });

  const genericTools = [...capabilityCounts.entries()]
    .sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1];
      }

      return left[0].localeCompare(right[0]);
    })
    .map(([capability]) => GENERIC_AGENT_LAYER_BY_CAPABILITY[capability])
    .filter((tool, index, list) => list.indexOf(tool) === index);

  return [...rankedTools, ...genericTools, ...insights.pressureDrivers]
    .filter((tool, index, list) => list.indexOf(tool) === index)
    .slice(0, 4);
}

function getScoreBreakdown(rolePressure: number, digitalFit: number, autonomyFit: number, implementationEase: number): BlueprintScoreBreakdown {
  return {
    rolePressure: Math.round(rolePressure),
    digitalFit: Math.round(digitalFit),
    autonomyFit: Math.round(autonomyFit),
    implementationEase: Math.round(implementationEase)
  };
}

function getBuildStages(role: Role, blueprint: Pick<AgentBlueprint, 'autonomyTier' | 'title'>): BlueprintStage[] {
  return [
    {
      stage: 'prototype',
      label: 'Prototype',
      description: `Validate the ${blueprint.title.toLowerCase()} against ${role.title.toLowerCase()} with a narrow prompt, a fixed task scope, and human review on every output.`
    },
    {
      stage: 'pilot',
      label: 'Pilot',
      description: `Connect the blueprint to a limited workflow, add approval gates, and measure handoff quality before widening the task set.`
    },
    {
      stage: 'production',
      label: 'Production',
      description: `Move to a stable deployment path with audit logs, exception handling, role-based access, and the right private or on-prem controls.`
    }
  ];
}

function getTitleForTier(role: Role, tier: AutonomyTier): { title: string; archetype: AgentBlueprint['archetype'] } {
  switch (tier) {
    case 'T1':
      return { title: `${role.title} Observation Agent`, archetype: 'Observation Agent' };
    case 'T2':
      return { title: `${role.title} Copilot`, archetype: 'Copilot Agent' };
    case 'T3':
      return { title: `${role.title} Workflow Coordinator`, archetype: 'Workflow Coordinator' };
    case 'T4':
      return { title: `${role.title} Operator Agent`, archetype: 'Operator Agent' };
  }
}

function getTierSummary(role: Role, tier: AutonomyTier, coveredTasks: TaskAssessment[]): { summary: string; thesis: string; whatItHandles: string[]; whatStaysHuman: string[] } {
  switch (tier) {
    case 'T1':
      return {
        summary: 'A monitoring-first blueprint that watches the workflow, summarises activity, and flags decision points for the team.',
        thesis: `${role.title} is a good candidate for an observation layer before deeper autonomy, because the role still benefits from human ownership while structured signals can be monitored continuously.`,
        whatItHandles: [
          'Monitor queues, inputs, and exceptions around the covered task set.',
          'Summarise activity, anomalies, and recommended next steps.',
          'Surface decision points to the human owner without taking final action.'
        ],
        whatStaysHuman: [
          'Final interpretation of complex or ambiguous cases.',
          'Accountability for approvals, exceptions, and escalation thresholds.',
          'Relationship-heavy or real-world steps that need a human touch.'
        ]
      };
    case 'T2':
      return {
        summary: 'A copilot blueprint that takes first-pass ownership of the repeatable knowledge work, then hands judgment, sign-off, and sensitive edges back to a human.',
        thesis: `${role.title} is best approached as a copilot pattern when AI can do a large share of the work but the human still owns the decision, the relationship, or the approval.`,
        whatItHandles: [
          'Draft, prepare, and structure the work before human review.',
          'Speed up research, documentation, and repetitive digital steps.',
          'Hand off decisions and edge cases where the role owner still matters.'
        ],
        whatStaysHuman: [
          'Final sign-off, approvals, and exception handling.',
          'Sensitive conversations, trust-heavy steps, and stakeholder judgment.',
          'Any work where outcomes shift under real-world context.'
        ]
      };
    case 'T3':
      return {
        summary: 'A coordination blueprint that moves requests, documents, and handoffs through a controlled workflow while keeping escalations visible.',
        thesis: `${role.title} has enough structured workflow movement to support a coordinator pattern that routes work, keeps status current, and escalates exceptions instead of trying to replace the human owner outright.`,
        whatItHandles: [
          'Route work across systems, queues, and handoff points.',
          'Trigger next-step actions, reminders, and status updates.',
          'Escalate blocked or ambiguous items back to the team.'
        ],
        whatStaysHuman: [
          'Cross-team exceptions that need judgment or priority calls.',
          'Relationship-heavy coordination and negotiation.',
          'Final responsibility for service quality and operating policy.'
        ]
      };
    case 'T4':
      return {
        summary: 'An operator blueprint that runs repeatable digital work end to end when the rules are stable and exceptions are tightly controlled.',
        thesis: `${role.title} is a candidate for operator-style automation on its most repeatable digital work, provided the human team still owns the exception path and any regulated decisions.`,
        whatItHandles: [
          'Execute repeatable digital tasks end to end inside clear rules.',
          'Keep throughput high on structured work with low variance.',
          'Escalate anything outside the rule set back to a human owner.'
        ],
        whatStaysHuman: [
          'Exceptions, appeals, and non-standard edge cases.',
          'Accountability where policy, liability, or trust still matter.',
          'Any physical, sensory, or regulated work that remains blocked.'
        ]
      };
  }
}

function buildBlueprint(role: Role, tier: AutonomyTier, signals: RoleSignals): TierCandidate {
  const autonomyFit = getAutonomyFit(tier, signals);
  const implementationEase = getImplementationEase(tier, signals);
  const score = clamp(Math.round(signals.rolePressure * 0.35 + signals.digitalFit * 0.25 + autonomyFit * 0.25 + implementationEase * 0.15));
  const eligible = isTierEligible(tier, signals);
  const coveredTasks = sortTasksForTier(role, tier, true).slice(0, 4);
  const coveredTaskKeys = new Set(coveredTasks.map((task) => task.task));
  const excludedTasks = sortTasksForTier(role, tier, false)
    .filter((task) => !coveredTaskKeys.has(task.task))
    .slice(0, 3);

  return {
    tier,
    score,
    fitLabel: getFitLabel(score),
    autonomyFit,
    implementationEase,
    eligible,
    coveredTasks,
    excludedTasks,
    bottlenecks: getTopBottlenecks([...coveredTasks, ...excludedTasks]),
    connectorSurface: getConnectorSurface(role, tier, signals),
    agentLayer: getAgentLayer(coveredTasks, signals.insights)
  };
}

function finalizeBlueprint(role: Role, candidate: TierCandidate, signals: RoleSignals): AgentBlueprint {
  const { title, archetype } = getTitleForTier(role, candidate.tier);
  const summaryData = getTierSummary(role, candidate.tier, candidate.coveredTasks);
  const bottlenecks = candidate.bottlenecks.slice(0, 3);
  const guardrails =
    bottlenecks.length > 0
      ? bottlenecks.map((bottleneck) => BOTTLENECK_GUARDRAILS[bottleneck])
      : ['Keep approvals, exception handling, and final accountability with the human team.'];

  return {
    id: `${role.code}-${candidate.tier.toLowerCase()}`,
    roleCode: role.code,
    title,
    archetype,
    autonomyTier: candidate.tier,
    score: candidate.score,
    fitLabel: candidate.fitLabel,
    summary: summaryData.summary,
    thesis: summaryData.thesis,
    whatItHandles: summaryData.whatItHandles,
    whatStaysHuman: summaryData.whatStaysHuman,
    coveredTasks: candidate.coveredTasks.map((task) => task.task),
    excludedTasks: candidate.excludedTasks.map((task) => task.task),
    humanGuardrails: guardrails,
    bottlenecks,
    dailyApps: role.workstack.apps.slice(0, 4),
    connectorSurface: candidate.connectorSurface,
    agentLayer: candidate.agentLayer,
    buildStages: getBuildStages(role, { autonomyTier: candidate.tier, title }),
    scoreBreakdown: getScoreBreakdown(signals.rolePressure, signals.digitalFit, candidate.autonomyFit, candidate.implementationEase)
  };
}

function getCandidateOrder(left: TierCandidate, right: TierCandidate): number {
  if (right.score !== left.score) {
    return right.score - left.score;
  }

  return TIER_ORDER.indexOf(left.tier) - TIER_ORDER.indexOf(right.tier);
}

function selectCandidates(role: Role, signals: RoleSignals): TierCandidate[] {
  const candidates = (['T1', 'T2', 'T3', 'T4'] as AutonomyTier[]).map((tier) => buildBlueprint(role, tier, signals));
  const eligible = candidates.filter((candidate) => candidate.eligible).sort(getCandidateOrder);

  const selected = eligible.filter((candidate) => candidate.score >= 45).slice(0, 3);

  if (selected.length >= 2) {
    return selected;
  }

  const fallback = candidates
    .filter((candidate) => candidate.tier !== 'T4' || candidate.eligible)
    .sort(getCandidateOrder);

  fallback.forEach((candidate) => {
    if (selected.find((item) => item.tier === candidate.tier)) {
      return;
    }

    if (selected.length < 2) {
      selected.push(candidate);
    }
  });

  return selected.sort(getCandidateOrder).slice(0, 3);
}

function getFactorySummary(role: Role, blueprints: AgentBlueprint[]): RoleFactorySummary {
  const bestFit = blueprints[0];
  const summary =
    bestFit.autonomyTier === 'T4'
      ? `Best fit for agentisation: operator-led delivery. ${role.impactProfile.replaceNowPct}% of the listed work already looks replaceable, while ${role.impactProfile.humanCorePct}% still needs strong human ownership.`
      : bestFit.autonomyTier === 'T3'
        ? `Best fit for agentisation: workflow coordination. The role has enough structured digital work to move requests, handoffs, and exceptions through a controlled agent layer.`
        : bestFit.autonomyTier === 'T2'
          ? `Best fit for agentisation: copilot-led execution. AI can take a large share of the work while humans retain judgment, approvals, and sensitive relationship steps.`
          : `Best fit for agentisation: observation first. Start by monitoring queues, summarising activity, and surfacing human decision points before deeper autonomy.`;

  return {
    roleCode: role.code,
    roleTitle: role.title,
    summary,
    promise: 'This role is exposed to AI. Here are the best agent blueprints to build against it.',
    grounding: `${role.majorName} · ${role.unitGroup} · Skill level ${role.skillLevel}`,
    blueprintCount: blueprints.length,
    bestFitBlueprintId: bestFit.id
  };
}

export function getRoleFactoryBlueprints(role: Role): AgentBlueprint[] {
  const signals = getSignals(role);
  const candidates = selectCandidates(role, signals);

  return candidates.map((candidate) => finalizeBlueprint(role, candidate, signals));
}

export function getRoleFactorySummary(role: Role): RoleFactorySummary {
  return getFactorySummary(role, getRoleFactoryBlueprints(role));
}

export function getRoleFactoryWorkspace(role: Role): { summary: RoleFactorySummary; blueprints: AgentBlueprint[] } {
  const blueprints = getRoleFactoryBlueprints(role);

  return {
    summary: getFactorySummary(role, blueprints),
    blueprints
  };
}
