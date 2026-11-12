import type { AiCapable, AssessmentConfidence, HumanBottleneck, TaskImpactMode } from '@/types/role';

export const IMPACT_MODE_ORDER: TaskImpactMode[] = ['replace_now', 'augment_now', 'assist_only', 'human_core'];

export const IMPACT_MODE_TO_AI_CAPABLE: Record<TaskImpactMode, AiCapable> = {
  replace_now: 'yes',
  augment_now: 'partial',
  assist_only: 'partial',
  human_core: 'no'
};

export const IMPACT_MODE_META: Record<
  TaskImpactMode,
  { short: string; label: string; description: string; tint: string; text: string; border: string; rail: string }
> = {
  replace_now: {
    short: 'Replace',
    label: 'Replace now',
    description: 'AI can execute most of this task end-to-end today.',
    tint: '#FEF2F2',
    text: '#B91C1C',
    border: '#FECACA',
    rail: '#DC2626'
  },
  augment_now: {
    short: 'Augment',
    label: 'Augment now',
    description: 'AI can do a large share of the work, but a human still owns key judgment or sign-off.',
    tint: '#FFF7ED',
    text: '#C2410C',
    border: '#FED7AA',
    rail: '#F97316'
  },
  assist_only: {
    short: 'Assist',
    label: 'Assist only',
    description: 'AI helps with prep, admin, or throughput around the task, not the core ownership.',
    tint: '#EFF6FF',
    text: '#1D4ED8',
    border: '#BFDBFE',
    rail: '#3B82F6'
  },
  human_core: {
    short: 'Human',
    label: 'Human core',
    description: 'The core of this task still depends on a human today.',
    tint: '#F0FDFA',
    text: '#0F766E',
    border: '#99F6E4',
    rail: '#14B8A6'
  }
};

export const HUMAN_BOTTLENECK_META: Record<HumanBottleneck, { label: string; description: string }> = {
  judgment: {
    label: 'Judgment',
    description: 'Human interpretation or decision-making still changes the outcome.'
  },
  accountability: {
    label: 'Accountability',
    description: 'A human still needs to own approval, liability, or sign-off.'
  },
  relationship: {
    label: 'Relationship',
    description: 'Trust, sensitivity, persuasion, or live human interaction still matter.'
  },
  physical_presence: {
    label: 'Physical Presence',
    description: 'The task still depends on bodies, tools, or real-world execution.'
  },
  live_sensing: {
    label: 'Live Sensing',
    description: 'The task depends on inspection or environmental judgment in changing conditions.'
  },
  regulation: {
    label: 'Regulation',
    description: 'Formal policy, legal, or compliance responsibility still sits with a human.'
  },
  coordination: {
    label: 'Coordination',
    description: 'A human still needs to orchestrate people, timing, and handoffs.'
  }
};

export const CONFIDENCE_META: Record<AssessmentConfidence, { label: string; tint: string; text: string; border: string }> = {
  high: {
    label: 'High confidence',
    tint: '#ECFDF5',
    text: '#047857',
    border: '#A7F3D0'
  },
  medium: {
    label: 'Medium confidence',
    tint: '#FFF7ED',
    text: '#B45309',
    border: '#FCD34D'
  },
  low: {
    label: 'Low confidence',
    tint: '#F8FAFC',
    text: '#475569',
    border: '#CBD5E1'
  }
};
