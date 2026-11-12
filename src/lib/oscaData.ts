import 'server-only';

import { cache } from 'react';
import { getCuratedImpactScopeRoleCodes, validateAndIndexTaskImpactOverrides } from '@/lib/taskImpactCuration';
import { applyCuratedTaskImpactOverrides, assessRoleTasks, getFrontierAdjustedScore, getTimelineBand, summariseTaskAssessments } from '@/lib/taskAssessment';
import occupations from '@/data/oscaOccupations.json';
import descriptions from '@/data/oscaRoles.json';
import salaries from '@/data/salaryMap.json';
import scores from '@/data/allScores.json';
import type { Role } from '@/types/role';

type OccupationSeed = {
  code: string;
  title: string;
  skill_level: number;
  major_group: string;
  major_name: string;
  unit_group: string;
};

type DescriptionSeed = {
  id: string;
  description: string;
  leadStatement: string;
  tasks: string[];
  primaryTasks?: string[];
  tooling?: string[];
  connectors?: string[];
  taskFallbackNote?: string;
};

type ScoreMap = Record<string, number>;
type SalaryMap = Record<string, number>;

export const buildOccupations = cache(async (): Promise<Role[]> => {
  const occupationSeeds = occupations as OccupationSeed[];
  const descriptionSeeds = descriptions as DescriptionSeed[];
  const scoreMap = scores as ScoreMap;
  const salaryMap = salaries as SalaryMap;

  const descriptionByCode = new Map(descriptionSeeds.map((role) => [role.id, role]));

  const deterministicSeeds = occupationSeeds.map((occupation) => {
    const code = occupation.code;
    const descriptionSeed = descriptionByCode.get(code);
    const salary = salaryMap[code] ?? 100000;
    const baselineScore = scoreMap[code] ?? 30;
    const taskSummary = assessRoleTasks(descriptionSeed?.tasks ?? [], descriptionSeed?.leadStatement ?? descriptionSeed?.description ?? '');
    const score = getFrontierAdjustedScore(baselineScore, taskSummary.taskAssessments);

    return {
      occupation,
      descriptionSeed,
      salary,
      baselineScore,
      score,
      taskSummary
    };
  });

  const curatedScopeRoleCodes = getCuratedImpactScopeRoleCodes(
    deterministicSeeds.map((seed) => ({
      code: seed.occupation.code,
      score: seed.score,
      taskAutomationPct: seed.taskSummary.taskAutomationPct,
      taskAssessments: seed.taskSummary.taskAssessments
    }))
  );
  const { overridesByRole } = validateAndIndexTaskImpactOverrides(
    deterministicSeeds.map((seed) => ({
      code: seed.occupation.code,
      score: seed.score,
      taskAutomationPct: seed.taskSummary.taskAutomationPct,
      taskAssessments: seed.taskSummary.taskAssessments
    })),
    curatedScopeRoleCodes
  );

  const result = deterministicSeeds
    .map((seed) => {
      const { occupation, descriptionSeed, salary, baselineScore } = seed;
      const code = occupation.code;
      const roleOverrides = overridesByRole.get(code);
      const taskSummary = roleOverrides
        ? summariseTaskAssessments(applyCuratedTaskImpactOverrides(seed.taskSummary.taskAssessments, roleOverrides), seed.taskSummary.hasFallback)
        : seed.taskSummary;
      const score = getFrontierAdjustedScore(baselineScore, taskSummary.taskAssessments);
      const automatableValue = Math.round(salary * (score / 100));

      return {
        id: code,
        code,
        title: occupation.title,
        description: descriptionSeed?.description ?? '',
        leadStatement: descriptionSeed?.leadStatement ?? descriptionSeed?.description ?? '',
        tasks: descriptionSeed?.tasks ?? [],
        primaryTasks: descriptionSeed?.primaryTasks?.slice(0, 4) ?? [],
        workstack: {
          apps: descriptionSeed?.tooling?.slice(0, 4) ?? [],
          connectors: descriptionSeed?.connectors?.slice(0, 4) ?? []
        },
        taskAssessments: taskSummary.taskAssessments,
        hasTaskFallback: taskSummary.hasFallback,
        taskAutomationCount: taskSummary.taskAutomationCount,
        taskAutomationPct: taskSummary.taskAutomationPct,
        timeline: getTimelineBand(score, taskSummary.taskAutomationPct),
        impactProfile: taskSummary.impactProfile,
        majorGroup: occupation.major_group,
        majorName: occupation.major_name,
        unitGroup: occupation.unit_group,
        skillLevel: occupation.skill_level,
        baselineScore,
        score,
        salary,
        automatableValue,
        estimatedSavings: automatableValue
      };
    })
    .sort((left, right) => left.code.localeCompare(right.code));

  return result;
});
