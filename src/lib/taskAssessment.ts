import { IMPACT_MODE_ORDER, IMPACT_MODE_TO_AI_CAPABLE } from '@/lib/roles/impactMeta';
import { getCapabilityDefinition, getCapabilityScoreLift, getCapabilityTools } from '@/lib/frontierRegistry';
import type {
  AiCapability,
  AutomationTimeline,
  ImpactProfile,
  TaskAssessment,
  TaskImpactMode,
  HumanBottleneck,
  AssessmentConfidence
} from '@/types/role';
import type { TaskImpactOverrideRecord } from '@/data/taskImpactOverrides';

type TaskAssessmentSummary = {
  hasFallback: boolean;
  taskAssessments: TaskAssessment[];
  taskAutomationCount: number;
  taskAutomationPct: number;
  impactProfile: ImpactProfile;
};

type ImpactDecision = {
  impactMode: TaskImpactMode;
  bottleneck: HumanBottleneck | null;
  confidence: AssessmentConfidence;
};

const TASK_FALLBACK_NOTE = 'OSCA does not list main tasks for this occupation, so the lead statement is shown instead.';

const NEGOTIATION_PATTERNS = ['negotiat', 'public hearing', 'forum', 'convention', 'seminar'];
const CARE_PATTERNS = ['care for', 'care of', 'therap', 'counsel', 'supports children', 'child', 'patient care', 'nursing care'];
const PHYSICAL_PATTERNS = [
  'install',
  'repair',
  'maintains equipment',
  'maintains machinery',
  'maintains vehicles',
  'operate machinery',
  'operate equipment',
  'operates machinery',
  'operates equipment',
  'operates vehicle',
  'construct',
  'build structures',
  'cook',
  'drive',
  'transport',
  'clean',
  'harvest',
  'weld',
  'assemble',
  'fabricat',
  'drill',
  'lay',
  'patrol',
  'lift',
  'load',
  'unload'
];
const SENSORY_PATTERNS = ['inspect', 'monitor field', 'emergency response', 'taste', 'smell', 'tactile', 'weather', 'crop conditions', 'surveillance'];
const MANAGEMENT_PATTERNS = ['lead', 'manage', 'develop staff', 'supervise', 'mentor', 'coach', 'liaise', 'advise', 'train', 'oversee'];
const VOICE_PATTERNS = [
  'call',
  'phone',
  'switchboard',
  'contact centre',
  'meeting',
  'transcript',
  'interview',
  'answer enquiries',
  'telephone',
  'booking',
  'appointment',
  'reservation',
  'reception',
  'take messages',
  'outbound',
  'inbound',
  'lead qualification'
];
const CODE_PATTERNS = [
  'software',
  'programming',
  'code',
  'database',
  'web',
  'debug',
  'deploy',
  'system design',
  'develop digital',
  'test',
  'testing',
  'qa',
  'quality assurance',
  'script',
  'automation',
  'integration',
  'configure',
  'maintenance of software'
];
const IMAGE_PATTERNS = [
  'graphic design',
  'visual design',
  'draw',
  'illustrat',
  'layout',
  'graphic',
  'pre-press',
  'photograph',
  'presentation deck',
  'artwork',
  'visual',
  'retouch',
  'storyboard',
  'design asset',
  'brand asset'
];
const DATA_PATTERNS = [
  'analyse',
  'analysis',
  'research',
  'forecast',
  'budget',
  'financial report',
  'data',
  'statistical',
  'audit',
  'model',
  'review',
  'evaluate',
  'reconcile',
  'spreadsheet',
  'application',
  'applications',
  'claims',
  'invoice',
  'billing',
  'payroll',
  'form',
  'forms',
  'records',
  'triage',
  'intake',
  'schedule'
];
const TEXT_PATTERNS = [
  'write',
  'draft',
  'prepare reports',
  'prepare associated reports',
  'correspondence',
  'submission',
  'document',
  'summar',
  'translate',
  'copy',
  'caption',
  'briefing',
  'minutes',
  'case note',
  'knowledge base'
];
const REASONING_PATTERNS = ['determine', 'implement', 'policy', 'strategy', 'planning', 'compliance', 'legal', 'investment', 'advises on', 'interprets'];

const RELATIONSHIP_HARD_PATTERNS = [
  'beneficiar',
  'claimant',
  'patient',
  'visitor',
  'debtor',
  'hardship',
  'complaint',
  'complaints',
  'dispute',
  'queries',
  'query',
  'welcomes',
  'interviews',
  'in person'
];

const REGULATION_PATTERNS = [
  'compliance',
  'legislation',
  'regulatory',
  'policy guidelines',
  'policy standards',
  'legal action',
  'legal proceedings',
  'coverage applies',
  'guidelines',
  'standards',
  'entitlements',
  'eligibility',
  'mortgages',
  'court'
];

const ACCOUNTABILITY_PATTERNS = [
  'authoris',
  'approve',
  'approvals',
  'determines',
  'signs',
  'oversees',
  'implements decisions',
  'issues instructions',
  'responsible',
  'liability'
];

const COORDINATION_PATTERNS = [
  'coordinates',
  'collaborat',
  'works with',
  'communicates with',
  'contacts',
  'responds to',
  'answers enquiries',
  'provides support',
  'schedules',
  'arranges',
  'liaising with',
  'directs them'
];

const TRANSCRIPTION_PATTERNS = ['transcrib', 'caption', 'word processing', 'data entry', 'typing', 'proofread', 'edits documents'];
const SCRIPTED_VOICE_PATTERNS = [
  'outbound calls',
  'scripts and guidelines',
  'promote products',
  'telemarket',
  'switchboard',
  'takes messages',
  'bookings',
  'booking enquiries',
  'appointment scheduling',
  'qualifies leads',
  'collections'
];
const STRUCTURED_OUTPUT_PATTERNS = [
  'prepares documents',
  'prepares papers',
  'processes applications',
  'updates information',
  'creates records',
  'stores and retrieves',
  'records file',
  'document movements',
  'issues documentation',
  'input',
  'output information',
  'processes',
  'allocates',
  'records amounts',
  'maintains accurate records',
  'filing',
  'registry',
  'word processing',
  'updates crm',
  'updates records',
  'books appointments',
  'maintains schedules',
  'triages requests',
  'processes invoices',
  'processes claims',
  'maintains databases'
];
const INVESTIGATION_PATTERNS = ['investigat', 'fraud', 'validity of claims', 'assess', 'determines eligibility', 'interprets policy', 'decision making'];
const SUPPORT_ONLY_PATTERNS = ['follows up', 'arranges appointments', 'arranges dispatch', 'contacts', 'responds to', 'answers enquiries'];
const DIGITAL_WORKFLOW_PATTERNS = [
  'booking',
  'appointment',
  'reservation',
  'schedule',
  'scheduling',
  'triage',
  'intake',
  'route',
  'routing',
  'dispatch',
  'portal',
  'ticket',
  'crm',
  'case management',
  'application',
  'applications',
  'forms',
  'records',
  'database',
  'registry',
  'invoice',
  'billing',
  'payroll',
  'timesheet',
  'reconcile',
  'reporting'
];
const RESEARCH_SYNTHESIS_PATTERNS = [
  'desk research',
  'background research',
  'market research',
  'prepare briefings',
  'prepare reports',
  'summar',
  'compile',
  'literature review',
  'monitor trends'
];
const CODE_AUTOMATION_PATTERNS = ['test', 'testing', 'qa', 'quality assurance', 'script', 'automation', 'debug', 'bug', 'refactor', 'integration', 'deploy'];
const CODE_GOVERNANCE_PATTERNS = ['architecture', 'security', 'incident', 'approve release', 'platform strategy', 'governance'];
const CREATIVE_PRODUCTION_PATTERNS = ['layout', 'pre-press', 'presentation', 'asset', 'social media', 'retouch', 'storyboard', 'graphic'];

function includesAny(value: string, patterns: string[]): boolean {
  return patterns.some((pattern) => value.includes(pattern));
}

function getImpactModeCount(taskAssessments: TaskAssessment[], impactMode: TaskImpactMode): number {
  return taskAssessments.filter((task) => task.impactMode === impactMode).length;
}

function allocatePercentages(taskAssessments: TaskAssessment[]): Record<TaskImpactMode, number> {
  if (taskAssessments.length === 0) {
    return {
      replace_now: 0,
      augment_now: 0,
      assist_only: 0,
      human_core: 0
    };
  }

  const entries = IMPACT_MODE_ORDER.map((impactMode) => {
    const exact = (getImpactModeCount(taskAssessments, impactMode) / taskAssessments.length) * 100;
    const base = Math.floor(exact);

    return {
      impactMode,
      exact,
      base,
      remainder: exact - base
    };
  });

  let remaining = 100 - entries.reduce((sum, entry) => sum + entry.base, 0);

  entries
    .slice()
    .sort((left, right) => {
      if (right.remainder !== left.remainder) {
        return right.remainder - left.remainder;
      }

      return IMPACT_MODE_ORDER.indexOf(left.impactMode) - IMPACT_MODE_ORDER.indexOf(right.impactMode);
    })
    .slice(0, remaining)
    .forEach((entry) => {
      entry.base += 1;
      remaining -= 1;
    });

  return Object.fromEntries(entries.map((entry) => [entry.impactMode, entry.base])) as Record<TaskImpactMode, number>;
}

function getPrimaryImpactMode(taskAssessments: TaskAssessment[]): TaskImpactMode {
  return [...IMPACT_MODE_ORDER]
    .sort((left, right) => {
      const rightCount = getImpactModeCount(taskAssessments, right);
      const leftCount = getImpactModeCount(taskAssessments, left);

      if (rightCount !== leftCount) {
        return rightCount - leftCount;
      }

      return IMPACT_MODE_ORDER.indexOf(left) - IMPACT_MODE_ORDER.indexOf(right);
    })[0];
}

function getPrimaryBottlenecks(taskAssessments: TaskAssessment[]): HumanBottleneck[] {
  const counts = new Map<HumanBottleneck, number>();

  taskAssessments.forEach((task) => {
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

      return left[0].localeCompare(right[0]);
    })
    .slice(0, 3)
    .map(([bottleneck]) => bottleneck);
}

function buildImpactProfile(taskAssessments: TaskAssessment[]): ImpactProfile {
  const percentages = allocatePercentages(taskAssessments);

  return {
    replaceNowPct: percentages.replace_now,
    augmentNowPct: percentages.augment_now,
    assistOnlyPct: percentages.assist_only,
    humanCorePct: percentages.human_core,
    primaryImpactMode: getPrimaryImpactMode(taskAssessments),
    primaryBottlenecks: getPrimaryBottlenecks(taskAssessments),
    curatedTaskCount: taskAssessments.filter((task) => task.assessmentSource === 'curated').length
  };
}

function buildTaskSummary(taskAssessments: TaskAssessment[], hasFallback: boolean): TaskAssessmentSummary {
  const taskAutomationCount = taskAssessments.filter((task) => task.aiCapable !== 'no').length;
  const taskAutomationPct = taskAssessments.length > 0 ? Math.round((taskAutomationCount / taskAssessments.length) * 100) : 0;

  return {
    hasFallback,
    taskAssessments,
    taskAutomationCount,
    taskAutomationPct,
    impactProfile: buildImpactProfile(taskAssessments)
  };
}

function getTaskPressureWeight(task: TaskAssessment): number {
  if (task.impactMode === 'replace_now') {
    return 1;
  }

  if (task.impactMode === 'augment_now') {
    return 0.72;
  }

  if (task.impactMode === 'assist_only') {
    return 0.42;
  }

  return 0.08;
}

function getTaskPressureScore(taskAssessments: TaskAssessment[]): number {
  if (taskAssessments.length === 0) {
    return 0;
  }

  const weightedTotal = taskAssessments.reduce((sum, task) => sum + getTaskPressureWeight(task), 0) / taskAssessments.length;
  return Math.round(weightedTotal * 100);
}

function getFrontierCapabilityBoost(taskAssessments: TaskAssessment[]): number {
  if (taskAssessments.length === 0) {
    return 0;
  }

  const weightedLift =
    taskAssessments.reduce((sum, task) => {
      return sum + getCapabilityScoreLift(task.capability) * getTaskPressureWeight(task);
    }, 0) / taskAssessments.length;

  return Math.round(weightedLift);
}

function determineCapability(normalizedTask: string): AiCapability {
  if (includesAny(normalizedTask, NEGOTIATION_PATTERNS) || includesAny(normalizedTask, CARE_PATTERNS)) {
    return 'interpersonal';
  }

  if (includesAny(normalizedTask, PHYSICAL_PATTERNS)) {
    return 'physical';
  }

  if (includesAny(normalizedTask, SENSORY_PATTERNS)) {
    return 'sensory';
  }

  if (
    includesAny(normalizedTask, MANAGEMENT_PATTERNS) &&
    !includesAny(normalizedTask, CODE_PATTERNS) &&
    !includesAny(normalizedTask, DATA_PATTERNS) &&
    !includesAny(normalizedTask, TEXT_PATTERNS)
  ) {
    return 'interpersonal';
  }

  if (includesAny(normalizedTask, CODE_PATTERNS)) {
    return 'code_software';
  }

  if (includesAny(normalizedTask, IMAGE_PATTERNS)) {
    return 'image_design';
  }

  if (includesAny(normalizedTask, VOICE_PATTERNS)) {
    return 'voice_communication';
  }

  if (includesAny(normalizedTask, DATA_PATTERNS)) {
    return 'data_analysis';
  }

  if (includesAny(normalizedTask, TEXT_PATTERNS)) {
    return 'text_generation';
  }

  if (includesAny(normalizedTask, REASONING_PATTERNS)) {
    return 'reasoning_strategy';
  }

  return 'reasoning_strategy';
}

function pickAugmentBottleneck(normalizedTask: string): HumanBottleneck {
  if (includesAny(normalizedTask, REGULATION_PATTERNS)) {
    return 'regulation';
  }

  if (includesAny(normalizedTask, ACCOUNTABILITY_PATTERNS)) {
    return 'accountability';
  }

  if (includesAny(normalizedTask, RELATIONSHIP_HARD_PATTERNS)) {
    return 'relationship';
  }

  if (includesAny(normalizedTask, COORDINATION_PATTERNS)) {
    return 'coordination';
  }

  return 'judgment';
}

function determineImpact(normalizedTask: string, capability: AiCapability): ImpactDecision {
  if (capability === 'physical') {
    return {
      impactMode: 'human_core',
      bottleneck: 'physical_presence',
      confidence: 'high'
    };
  }

  if (capability === 'sensory') {
    return {
      impactMode: 'human_core',
      bottleneck: 'live_sensing',
      confidence: 'high'
    };
  }

  if (includesAny(normalizedTask, CARE_PATTERNS) || includesAny(normalizedTask, RELATIONSHIP_HARD_PATTERNS) || includesAny(normalizedTask, NEGOTIATION_PATTERNS)) {
    return {
      impactMode: 'human_core',
      bottleneck: 'relationship',
      confidence: 'high'
    };
  }

  if (capability === 'code_software' && includesAny(normalizedTask, CODE_AUTOMATION_PATTERNS) && !includesAny(normalizedTask, CODE_GOVERNANCE_PATTERNS)) {
    return {
      impactMode: 'replace_now',
      bottleneck: null,
      confidence: 'high'
    };
  }

  if (includesAny(normalizedTask, REGULATION_PATTERNS) || includesAny(normalizedTask, ACCOUNTABILITY_PATTERNS) || includesAny(normalizedTask, INVESTIGATION_PATTERNS)) {
    return {
      impactMode: 'augment_now',
      bottleneck: pickAugmentBottleneck(normalizedTask),
      confidence: 'high'
    };
  }

  if (includesAny(normalizedTask, DIGITAL_WORKFLOW_PATTERNS) && !includesAny(normalizedTask, RELATIONSHIP_HARD_PATTERNS)) {
    return {
      impactMode: 'replace_now',
      bottleneck: null,
      confidence: capability === 'voice_communication' || capability === 'code_software' ? 'high' : 'medium'
    };
  }

  if (includesAny(normalizedTask, SUPPORT_ONLY_PATTERNS) || includesAny(normalizedTask, COORDINATION_PATTERNS)) {
    return {
      impactMode: 'assist_only',
      bottleneck: includesAny(normalizedTask, ['complaint', 'complaints', 'queries', 'query']) ? 'relationship' : 'coordination',
      confidence: 'medium'
    };
  }

  if (capability === 'voice_communication') {
    if (includesAny(normalizedTask, TRANSCRIPTION_PATTERNS) || includesAny(normalizedTask, SCRIPTED_VOICE_PATTERNS)) {
      return {
        impactMode: 'replace_now',
        bottleneck: null,
        confidence: 'high'
      };
    }

    if (includesAny(normalizedTask, ['complaint', 'complaints', 'query', 'queries', 'interview'])) {
      return {
        impactMode: 'augment_now',
        bottleneck: 'relationship',
        confidence: 'medium'
      };
    }

    return {
      impactMode: 'augment_now',
      bottleneck: 'relationship',
      confidence: 'medium'
    };
  }

  if (capability === 'text_generation') {
    if (includesAny(normalizedTask, ['reviews', 'clarify', 'legal', 'compliance'])) {
      return {
        impactMode: 'augment_now',
        bottleneck: pickAugmentBottleneck(normalizedTask),
        confidence: 'medium'
      };
    }

    if (includesAny(normalizedTask, RESEARCH_SYNTHESIS_PATTERNS) || includesAny(normalizedTask, STRUCTURED_OUTPUT_PATTERNS)) {
      return {
        impactMode: 'replace_now',
        bottleneck: null,
        confidence: 'high'
      };
    }

    return {
      impactMode: 'replace_now',
      bottleneck: null,
      confidence: includesAny(normalizedTask, TRANSCRIPTION_PATTERNS) ? 'high' : 'medium'
    };
  }

  if (capability === 'data_analysis') {
    if (includesAny(normalizedTask, ['audit', 'reviews', 'assesses', 'determines', 'fraud'])) {
      return {
        impactMode: 'augment_now',
        bottleneck: pickAugmentBottleneck(normalizedTask),
        confidence: 'high'
      };
    }

    if (
      includesAny(normalizedTask, RESEARCH_SYNTHESIS_PATTERNS) ||
      includesAny(normalizedTask, STRUCTURED_OUTPUT_PATTERNS) ||
      includesAny(normalizedTask, ['processes', 'allocates', 'records', 'reconciliations', 'spreadsheet', 'triage', 'intake'])
    ) {
      return {
        impactMode: 'replace_now',
        bottleneck: null,
        confidence: includesAny(normalizedTask, ['audit', 'fraud']) ? 'medium' : 'high'
      };
    }

    return {
      impactMode: 'augment_now',
      bottleneck: 'judgment',
      confidence: 'medium'
    };
  }

  if (capability === 'code_software') {
    if (includesAny(normalizedTask, CODE_GOVERNANCE_PATTERNS)) {
      return {
        impactMode: 'augment_now',
        bottleneck: 'accountability',
        confidence: 'high'
      };
    }

    if (includesAny(normalizedTask, CODE_AUTOMATION_PATTERNS)) {
      return {
        impactMode: 'replace_now',
        bottleneck: null,
        confidence: 'high'
      };
    }

    return {
      impactMode: 'augment_now',
      bottleneck: 'accountability',
      confidence: 'high'
    };
  }

  if (capability === 'image_design') {
    if (includesAny(normalizedTask, CREATIVE_PRODUCTION_PATTERNS)) {
      return {
        impactMode: 'replace_now',
        bottleneck: null,
        confidence: 'medium'
      };
    }

    return {
      impactMode: 'augment_now',
      bottleneck: 'judgment',
      confidence: 'medium'
    };
  }

  if (capability === 'reasoning_strategy') {
    if (includesAny(normalizedTask, RESEARCH_SYNTHESIS_PATTERNS) || includesAny(normalizedTask, STRUCTURED_OUTPUT_PATTERNS)) {
      return {
        impactMode: 'replace_now',
        bottleneck: null,
        confidence: 'medium'
      };
    }

    return {
      impactMode: 'augment_now',
      bottleneck: pickAugmentBottleneck(normalizedTask),
      confidence: 'medium'
    };
  }

  if (capability === 'interpersonal') {
    if (includesAny(normalizedTask, MANAGEMENT_PATTERNS)) {
      return {
        impactMode: 'augment_now',
        bottleneck: 'coordination',
        confidence: 'medium'
      };
    }

    return {
      impactMode: 'human_core',
      bottleneck: 'relationship',
      confidence: 'high'
    };
  }

  if (includesAny(normalizedTask, STRUCTURED_OUTPUT_PATTERNS)) {
    return {
      impactMode: 'replace_now',
      bottleneck: null,
      confidence: 'medium'
    };
  }

  return {
    impactMode: 'augment_now',
    bottleneck: 'judgment',
    confidence: 'low'
  };
}

function buildReasoning(capability: AiCapability, impactMode: TaskImpactMode, bottleneck: HumanBottleneck | null): string {
  if (impactMode === 'replace_now') {
    if (capability === 'voice_communication') {
      return 'This is structured voice workflow that current voice agents can already run end-to-end across intake, routing, and follow-up.';
    }

    if (capability === 'data_analysis') {
      return 'This is repeatable digital operations work that current spreadsheet, browser, and research agents can already process end-to-end.';
    }

    if (capability === 'code_software') {
      return 'This is routine implementation work that modern coding agents can now write, test, and ship with limited human intervention.';
    }

    if (capability === 'image_design') {
      return 'This is asset-production work that current multimodal image systems can now generate and iterate rapidly.';
    }

    if (capability === 'text_generation') {
      return 'This is structured written output that frontier language and research agents can now produce end-to-end.';
    }

    return 'This is structured digital work that the March 2026 frontier stack can already execute end-to-end today.';
  }

  if (impactMode === 'assist_only') {
    if (bottleneck === 'relationship') {
      return 'AI can help with prep, drafting, and follow-up here, but the live human interaction still carries the task.';
    }

    return 'AI can reduce admin and throughput around this task, but a human still needs to coordinate the actual work.';
  }

  if (impactMode === 'human_core') {
    if (bottleneck === 'physical_presence') {
      return 'This task depends on physical presence and real-world execution that AI still cannot deliver reliably.';
    }

    if (bottleneck === 'live_sensing') {
      return 'This task depends on live inspection, scene reading, or environmental judgment in changing conditions.';
    }

    if (bottleneck === 'relationship') {
      return 'This task depends on trust, persuasion, empathy, negotiation, or other sensitive human interaction.';
    }

    if (bottleneck === 'accountability') {
      return 'This task still needs formal human ownership, approval, or liability.';
    }

    if (bottleneck === 'regulation') {
      return 'This task involves regulated responsibility that still sits with a human.';
    }

    return 'This task remains fundamentally human-led today.';
  }

  if (bottleneck === 'regulation') {
    return 'AI can do a large share of the analysis or drafting here, but formal policy, legal, or compliance responsibility still sits with a human.';
  }

  if (bottleneck === 'accountability') {
    return 'AI can accelerate much of the work here, but a human still owns approval, liability, or sign-off.';
  }

  if (bottleneck === 'relationship') {
    return 'AI can help shape the work here, but the human still has to carry the relationship or deliver the advice.';
  }

  if (bottleneck === 'coordination') {
    return 'AI can help organise the task, but a human still needs to orchestrate people, timing, and execution.';
  }

  return 'AI can handle a large share of this task, but a human still needs to make the call in the ambiguous parts.';
}

function getTaskTools(capability: AiCapability, impactMode: TaskImpactMode): string[] {
  if (IMPACT_MODE_TO_AI_CAPABLE[impactMode] === 'no') {
    return [];
  }

  return getCapabilityTools(capability, impactMode);
}

function applyFallbackConfidence(taskAssessment: TaskAssessment, hasFallback: boolean): TaskAssessment {
  if (!hasFallback) {
    return taskAssessment;
  }

  return {
    ...taskAssessment,
    confidence: 'low'
  };
}

export function normaliseTaskText(value: string): string {
  return value
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function getCapabilityMeta(capability: AiCapability) {
  return getCapabilityDefinition(capability);
}

export function getTaskFallbackNote(): string {
  return TASK_FALLBACK_NOTE;
}

export function getFrontierAdjustedScore(baseScore: number, taskAssessments: TaskAssessment[]): number {
  if (taskAssessments.length === 0) {
    return baseScore;
  }

  const taskPressureScore = getTaskPressureScore(taskAssessments);
  const frontierCapabilityBoost = getFrontierCapabilityBoost(taskAssessments);
  const blendedScore = Math.round(baseScore * 0.55 + taskPressureScore * 0.45 + frontierCapabilityBoost);

  return Math.max(baseScore, Math.min(100, blendedScore));
}

export function getTimelineBand(score: number, taskAutomationPct: number): AutomationTimeline {
  if (score >= 70 && taskAutomationPct >= 70) {
    return 'Now';
  }

  if ((score >= 40 && score <= 69) || (taskAutomationPct >= 40 && taskAutomationPct <= 69)) {
    return '2-3 years';
  }

  return '5+ years';
}

export function assessTask(task: string): TaskAssessment {
  const normalizedTask = normaliseTaskText(task);
  const capability = determineCapability(normalizedTask);
  const impactDecision = determineImpact(normalizedTask, capability);

  return {
    task,
    aiCapable: IMPACT_MODE_TO_AI_CAPABLE[impactDecision.impactMode],
    capability,
    impactMode: impactDecision.impactMode,
    bottleneck: impactDecision.bottleneck,
    confidence: impactDecision.confidence,
    assessmentSource: 'rule',
    tools: getTaskTools(capability, impactDecision.impactMode),
    reasoning: buildReasoning(capability, impactDecision.impactMode, impactDecision.bottleneck)
  };
}

export function summariseTaskAssessments(taskAssessments: TaskAssessment[], hasFallback: boolean): TaskAssessmentSummary {
  return buildTaskSummary(taskAssessments, hasFallback);
}

export function applyCuratedTaskImpactOverrides(
  taskAssessments: TaskAssessment[],
  overridesForRole: Map<string, TaskImpactOverrideRecord>
): TaskAssessment[] {
  return taskAssessments.map((task) => {
    const override = overridesForRole.get(normaliseTaskText(task.task));

    if (!override) {
      return task;
    }

    const impactMode = override.impactMode;
    const bottleneck = override.bottleneck;

    return {
      ...task,
      aiCapable: IMPACT_MODE_TO_AI_CAPABLE[impactMode],
      impactMode,
      bottleneck,
      confidence: override.confidence,
      assessmentSource: 'curated',
      tools: getTaskTools(task.capability, impactMode),
      reasoning: override.reasoning ?? buildReasoning(task.capability, impactMode, bottleneck)
    };
  });
}

export function assessRoleTasks(tasks: string[], leadStatement: string): TaskAssessmentSummary {
  const hasFallback = tasks.length === 0;
  const sourceTasks = hasFallback ? [leadStatement] : tasks;
  const taskAssessments = sourceTasks.map((task) =>
    applyFallbackConfidence(
      {
        ...assessTask(task),
        isFallback: hasFallback
      },
      hasFallback
    )
  );

  return buildTaskSummary(taskAssessments, hasFallback);
}
