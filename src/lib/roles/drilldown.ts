import type { AiCapable, AiCapability, HumanBottleneck, TaskAssessment, TaskImpactMode } from '@/types/role';

export type RoleTaskDrilldownState = {
  impactMode: TaskImpactMode | 'all';
  status: AiCapable | 'all';
  capability: AiCapability | 'all';
  bottleneck: HumanBottleneck | 'all';
};

export const DEFAULT_ROLE_TASK_DRILLDOWN_STATE: RoleTaskDrilldownState = {
  impactMode: 'all',
  status: 'all',
  capability: 'all',
  bottleneck: 'all'
};

export function filterTasksByDrilldown(tasks: TaskAssessment[], drilldownState: RoleTaskDrilldownState): TaskAssessment[] {
  return tasks.filter((task) => {
    const matchesImpactMode = drilldownState.impactMode === 'all' || task.impactMode === drilldownState.impactMode;
    const matchesStatus = drilldownState.status === 'all' || task.aiCapable === drilldownState.status;
    const matchesCapability = drilldownState.capability === 'all' || task.capability === drilldownState.capability;
    const matchesBottleneck = drilldownState.bottleneck === 'all' || task.bottleneck === drilldownState.bottleneck;

    return matchesImpactMode && matchesStatus && matchesCapability && matchesBottleneck;
  });
}

export function hasActiveTaskDrilldown(drilldownState: RoleTaskDrilldownState): boolean {
  return Object.values(drilldownState).some((value) => value !== 'all');
}
