import type { Role, TaskAssessment } from '@/types/role';

export type RoleToolDriver = {
  label: string;
  count: number;
};

function dedupePreservingOrder(values: string[]): string[] {
  const seen = new Set<string>();

  return values.filter((value) => {
    if (seen.has(value)) {
      return false;
    }

    seen.add(value);
    return true;
  });
}

export function getTaskToolList(task: Pick<TaskAssessment, 'tools'>, limit = 4): string[] {
  return dedupePreservingOrder(task.tools).slice(0, limit);
}

export function getRoleToolDrivers(role: Role, limit = 6): RoleToolDriver[] {
  const counts = new Map<string, number>();

  role.taskAssessments.forEach((task) => {
    dedupePreservingOrder(task.tools).forEach((tool) => {
      counts.set(tool, (counts.get(tool) ?? 0) + 1);
    });
  });

  return [...counts.entries()]
    .sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1];
      }

      return left[0].localeCompare(right[0]);
    })
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}
