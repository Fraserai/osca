import type { Role } from '@/types/role';

type FeaturedLens = {
  id: 'risk-now' | 'watchlist' | 'anchors';
  title: string;
  description: string;
  roles: Role[];
};

function sortByDescendingPressure(left: Role, right: Role): number {
  if (right.score !== left.score) {
    return right.score - left.score;
  }

  if (right.taskAutomationPct !== left.taskAutomationPct) {
    return right.taskAutomationPct - left.taskAutomationPct;
  }

  return left.code.localeCompare(right.code);
}

function sortByHumanAnchor(left: Role, right: Role): number {
  if (left.score !== right.score) {
    return left.score - right.score;
  }

  if (right.salary !== left.salary) {
    return right.salary - left.salary;
  }

  return left.code.localeCompare(right.code);
}

export function getFeaturedLenses(roles: Role[]): FeaturedLens[] {
  return [
    {
      id: 'risk-now',
      title: 'At Risk Now',
      description: 'Roles already sitting in the highest-pressure window based on score and task automation share.',
      roles: roles.filter((role) => role.timeline === 'Now').sort(sortByDescendingPressure).slice(0, 6)
    },
    {
      id: 'watchlist',
      title: 'Near-Term Watchlist',
      description: 'Roles with strong current exposure signals that look likely to move faster over the next few years.',
      roles: roles.filter((role) => role.timeline === '2-3 years').sort(sortByDescendingPressure).slice(0, 6)
    },
    {
      id: 'anchors',
      title: 'Human-Essential Anchors',
      description: 'Lower-score roles where the work still leans on care, presence, field judgment, or physical execution.',
      roles: roles.filter((role) => role.timeline === '5+ years').sort(sortByHumanAnchor).slice(0, 6)
    }
  ];
}
