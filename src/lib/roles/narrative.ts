import { getRiskLabel, getSimpleRiskScore, getSimpleRiskState, getSimpleTaskState } from '@/lib/oscaIndex';
import { HUMAN_BOTTLENECK_META } from '@/lib/roles/impactMeta';
import type { AiCapability, HumanBottleneck, Role } from '@/types/role';

const CAPABILITY_FOCUS: Record<AiCapability, string> = {
  text_generation: 'writing and documentation',
  data_analysis: 'analysis and research',
  code_software: 'software and structured technical work',
  image_design: 'visual production work',
  voice_communication: 'phone and scripted communication work',
  reasoning_strategy: 'planning and structured review work',
  physical: 'physical work in the real world',
  interpersonal: 'relationship and people-facing work',
  sensory: 'live sensing and environment-based work'
};

function formatList(values: string[]): string {
  if (values.length === 0) {
    return 'human judgment';
  }

  if (values.length === 1) {
    return values[0];
  }

  if (values.length === 2) {
    return `${values[0]} and ${values[1]}`;
  }

  return `${values.slice(0, -1).join(', ')}, and ${values[values.length - 1]}`;
}

function getTopCapabilityLabel(role: Role, predicate: (task: Role['taskAssessments'][number]) => boolean): string | null {
  const counts = new Map<AiCapability, number>();

  role.taskAssessments.forEach((task) => {
    if (!predicate(task)) {
      return;
    }

    counts.set(task.capability, (counts.get(task.capability) ?? 0) + 1);
  });

  const top = [...counts.entries()].sort((left, right) => {
    if (right[1] !== left[1]) {
      return right[1] - left[1];
    }

    return left[0].localeCompare(right[0]);
  })[0];

  return top ? CAPABILITY_FOCUS[top[0]] : null;
}

export function getRolePrimaryBottleneckSummary(role: Role): string {
  return formatList(role.impactProfile.primaryBottlenecks.map((bottleneck) => HUMAN_BOTTLENECK_META[bottleneck].label.toLowerCase()));
}

export function getRoleFocusSummary(role: Role): { atRisk: string; human: string } {
  return {
    atRisk: getTopCapabilityLabel(role, (task) => getSimpleTaskState(task) === 'at_risk_now') ?? 'structured digital work',
    human: getTopCapabilityLabel(role, (task) => getSimpleTaskState(task) === 'not_yet') ?? 'human review and judgment'
  };
}

export function getRoleMetadataDescription(role: Role): string {
  const simpleRisk = getSimpleRiskScore(role.score);
  const state = getRiskLabel(role.score).toLowerCase();

  return `${role.title} scores ${simpleRisk}/10 on AI job risk and is ${state}. ${role.taskAutomationCount} of ${role.taskAssessments.length} listed tasks already look exposed to AI.`;
}

export function getRoleVerdict(role: Role): string {
  const state = getSimpleRiskState(role.score);
  const focus = getRoleFocusSummary(role);

  if (state === 'at_risk') {
    return `${role.taskAutomationCount} of ${role.taskAssessments.length} listed tasks already look exposed to AI, especially around ${focus.atRisk}.`;
  }

  return `${role.taskAssessments.length - role.taskAutomationCount} of ${role.taskAssessments.length} listed tasks still look human-led, especially around ${focus.human}.`;
}

export function getRoleReportSummary(role: Role): string {
  const state = getSimpleRiskState(role.score);
  const focus = getRoleFocusSummary(role);
  const blockers = getRolePrimaryBottleneckSummary(role);

  if (state === 'at_risk') {
    return `${role.title} is at risk right now. The biggest exposure is in ${focus.atRisk}, while the main blockers are ${blockers}.`;
  }

  return `${role.title} looks safer for now. More of the role still depends on ${focus.human}, with ${blockers} slowing full replacement.`;
}

export function getRolePrimaryBottlenecks(role: Role): HumanBottleneck[] {
  return role.impactProfile.primaryBottlenecks;
}
