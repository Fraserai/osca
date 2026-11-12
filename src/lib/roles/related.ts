import type { AutomationTimeline, Role } from '@/types/role';

const TIMELINE_ORDER: Record<AutomationTimeline, number> = {
  Now: 0,
  '2-3 years': 1,
  '5+ years': 2
};

export function getRelatedRoles(role: Role, roles: Role[]): Role[] {
  return roles
    .filter((candidate) => candidate.code !== role.code)
    .sort((left, right) => {
      const leftSameMajor = left.majorGroup === role.majorGroup ? 0 : 1;
      const rightSameMajor = right.majorGroup === role.majorGroup ? 0 : 1;

      if (leftSameMajor !== rightSameMajor) {
        return leftSameMajor - rightSameMajor;
      }

      const leftScoreDistance = Math.abs(left.score - role.score);
      const rightScoreDistance = Math.abs(right.score - role.score);
      if (leftScoreDistance !== rightScoreDistance) {
        return leftScoreDistance - rightScoreDistance;
      }

      const leftTimelineDistance = Math.abs(TIMELINE_ORDER[left.timeline] - TIMELINE_ORDER[role.timeline]);
      const rightTimelineDistance = Math.abs(TIMELINE_ORDER[right.timeline] - TIMELINE_ORDER[role.timeline]);
      if (leftTimelineDistance !== rightTimelineDistance) {
        return leftTimelineDistance - rightTimelineDistance;
      }

      return left.code.localeCompare(right.code);
    })
    .slice(0, 3);
}

