import { TASK_IMPACT_OVERRIDES, TASK_IMPACT_OVERRIDE_DATA_VERSION, type TaskImpactOverrideRecord } from '@/data/taskImpactOverrides';
import type { TaskAssessment } from '@/types/role';
import { normaliseTaskText } from '@/lib/taskAssessment';

type RoleTaskSeed = {
  code: string;
  score: number;
  taskAutomationPct: number;
  taskAssessments: TaskAssessment[];
};

export const CURATED_IMPACT_SCOPE_SIZE = 150;

export function getCuratedImpactScopeRoleCodes(roleSeeds: RoleTaskSeed[]): string[] {
  return [...roleSeeds]
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      if (right.taskAutomationPct !== left.taskAutomationPct) {
        return right.taskAutomationPct - left.taskAutomationPct;
      }

      return left.code.localeCompare(right.code);
    })
    .slice(0, CURATED_IMPACT_SCOPE_SIZE)
    .map((role) => role.code);
}

export function validateAndIndexTaskImpactOverrides(roleSeeds: RoleTaskSeed[], scopeRoleCodes: string[]) {
  const scope = new Set(scopeRoleCodes);
  const tasksByRole = new Map(
    roleSeeds.map((role) => [
      role.code,
      new Set(role.taskAssessments.map((task) => normaliseTaskText(task.task)))
    ])
  );
  const overridesByRole = new Map<string, Map<string, TaskImpactOverrideRecord>>();
  const seen = new Set<string>();
  const errors: string[] = [];

  for (const override of TASK_IMPACT_OVERRIDES) {
    const normalizedTask = normaliseTaskText(override.taskText);
    const key = `${override.roleCode}::${normalizedTask}`;

    if (seen.has(key)) {
      errors.push(`Duplicate curated impact override for ${override.roleCode}: "${override.taskText}"`);
      continue;
    }

    seen.add(key);

    if (!scope.has(override.roleCode)) {
      errors.push(`Curated impact override for ${override.roleCode} falls outside the top-${CURATED_IMPACT_SCOPE_SIZE} pressure scope.`);
      continue;
    }

    const tasks = tasksByRole.get(override.roleCode);

    if (!tasks) {
      errors.push(`Curated impact override references unknown role code ${override.roleCode}.`);
      continue;
    }

    if (!tasks.has(normalizedTask)) {
      errors.push(`Curated impact override task not found for ${override.roleCode}: "${override.taskText}"`);
      continue;
    }

    const roleOverrides = overridesByRole.get(override.roleCode) ?? new Map<string, TaskImpactOverrideRecord>();
    roleOverrides.set(normalizedTask, override);
    overridesByRole.set(override.roleCode, roleOverrides);
  }

  if (errors.length > 0) {
    throw new Error(`Task impact curation validation failed:\n${errors.join('\n')}`);
  }

  return {
    dataVersion: TASK_IMPACT_OVERRIDE_DATA_VERSION,
    overridesByRole
  };
}
