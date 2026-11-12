import { CONFIDENCE_META, HUMAN_BOTTLENECK_META } from '@/lib/roles/impactMeta';
import type { AssessmentConfidence, HumanBottleneck, Role, TaskAssessment, TaskImpactMode } from '@/types/role';

export type RoleInsights = {
  replaceNowScore: number;
  augmentNowScore: number;
  humanCoreScore: number;
  confidenceScore: number;
  confidenceLabel: AssessmentConfidence;
  pressureDrivers: string[];
  topExposedTasks: TaskAssessment[];
  topHumanCoreTasks: TaskAssessment[];
  bottleneckCounts: Array<{ bottleneck: HumanBottleneck; count: number }>;
};

const CONFIDENCE_TO_SCORE: Record<AssessmentConfidence, number> = {
  high: 100,
  medium: 67,
  low: 34
};

const IMPACT_PRIORITY: Record<TaskImpactMode, number> = {
  replace_now: 0,
  augment_now: 1,
  assist_only: 2,
  human_core: 3
};

const CONFIDENCE_PRIORITY: Record<AssessmentConfidence, number> = {
  high: 0,
  medium: 1,
  low: 2
};

function getConfidenceLabel(confidenceScore: number): AssessmentConfidence {
  if (confidenceScore >= 80) {
    return 'high';
  }

  if (confidenceScore >= 55) {
    return 'medium';
  }

  return 'low';
}

function sortTasksByExposure(left: TaskAssessment, right: TaskAssessment): number {
  const impactDifference = IMPACT_PRIORITY[left.impactMode] - IMPACT_PRIORITY[right.impactMode];

  if (impactDifference !== 0) {
    return impactDifference;
  }

  const confidenceDifference = CONFIDENCE_PRIORITY[left.confidence] - CONFIDENCE_PRIORITY[right.confidence];

  if (confidenceDifference !== 0) {
    return confidenceDifference;
  }

  return left.task.localeCompare(right.task);
}

function sortTasksByHumanCore(left: TaskAssessment, right: TaskAssessment): number {
  const confidenceDifference = CONFIDENCE_PRIORITY[left.confidence] - CONFIDENCE_PRIORITY[right.confidence];

  if (confidenceDifference !== 0) {
    return confidenceDifference;
  }

  return left.task.localeCompare(right.task);
}

function getPressureDrivers(role: Role): string[] {
  const toolCounts = new Map<string, number>();

  role.taskAssessments.forEach((task) => {
    if (task.impactMode === 'human_core') {
      return;
    }

    task.tools.forEach((tool) => {
      toolCounts.set(tool, (toolCounts.get(tool) ?? 0) + 1);
    });
  });

  return [...toolCounts.entries()]
    .sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1];
      }

      return left[0].localeCompare(right[0]);
    })
    .slice(0, 4)
    .map(([tool]) => tool);
}

function getBottleneckCounts(role: Role): Array<{ bottleneck: HumanBottleneck; count: number }> {
  const counts = new Map<HumanBottleneck, number>();

  role.taskAssessments.forEach((task) => {
    if (!task.bottleneck) {
      return;
    }

    counts.set(task.bottleneck, (counts.get(task.bottleneck) ?? 0) + 1);
  });

  return [...counts.entries()]
    .map(([bottleneck, count]) => ({ bottleneck, count }))
    .sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }

      return HUMAN_BOTTLENECK_META[left.bottleneck].label.localeCompare(HUMAN_BOTTLENECK_META[right.bottleneck].label);
    });
}

function getConfidenceScore(role: Role): number {
  if (role.taskAssessments.length === 0) {
    return 0;
  }

  const total = role.taskAssessments.reduce((sum, task) => {
    return sum + CONFIDENCE_TO_SCORE[task.confidence];
  }, 0);

  return Math.round(total / role.taskAssessments.length);
}

export function getRoleInsights(role: Role): RoleInsights {
  const confidenceScore = getConfidenceScore(role);

  return {
    replaceNowScore: role.impactProfile.replaceNowPct,
    augmentNowScore: role.impactProfile.augmentNowPct,
    humanCoreScore: role.impactProfile.humanCorePct,
    confidenceScore,
    confidenceLabel: getConfidenceLabel(confidenceScore),
    pressureDrivers: getPressureDrivers(role),
    topExposedTasks: role.taskAssessments
      .filter((task) => task.impactMode !== 'human_core')
      .slice()
      .sort(sortTasksByExposure)
      .slice(0, 3),
    topHumanCoreTasks: role.taskAssessments
      .filter((task) => task.impactMode === 'human_core')
      .slice()
      .sort(sortTasksByHumanCore)
      .slice(0, 3),
    bottleneckCounts: getBottleneckCounts(role)
  };
}

export function getConfidenceMetaForScore(confidenceScore: number) {
  return CONFIDENCE_META[getConfidenceLabel(confidenceScore)];
}
