import type { AutomationTimeline, IndustryRisk, Role, TaskAssessment } from '@/types/role';

export const MAJOR_GROUP_LABELS = [
  { value: 'All', label: 'All' },
  { value: '1', label: '1 Managers' },
  { value: '2', label: '2 Professionals' },
  { value: '3', label: '3 Technicians & Trades' },
  { value: '4', label: '4 Community & Personal Service' },
  { value: '5', label: '5 Clerical & Admin' },
  { value: '6', label: '6 Sales' },
  { value: '7', label: '7 Machinery Operators & Drivers' },
  { value: '8', label: '8 Labourers' }
] as const;

export const PER_PAGE = 50;
export const TIMELINE_OPTIONS = ['All', 'Now', '2-3 years', '5+ years'] as const;
export const TIMELINE_LABELS: Record<AutomationTimeline, string> = {
  Now: 'At risk today',
  '2-3 years': 'Near-term risk',
  '5+ years': 'Long-term safe'
};

export type SimpleRiskState = 'at_risk' | 'safer_for_now';
export type SimpleTaskState = 'at_risk_now' | 'not_yet';

const INDUSTRIES: Record<
  string,
  {
    name: string;
    employed: number;
    occupationMix: Record<string, number>;
  }
> = {
  A: { name: 'Agriculture, Forestry & Fishing', employed: 299000, occupationMix: { '15': 25, '16': 5, '84': 20, '71': 10, '73': 10, '36': 10, '17': 5, '89': 15 } },
  B: { name: 'Mining', employed: 290000, occupationMix: { '13': 10, '24': 10, '31': 15, '72': 20, '71': 15, '82': 10, '17': 5, '33': 5, '89': 10 } },
  C: { name: 'Manufacturing', employed: 874000, occupationMix: { '13': 8, '32': 15, '35': 8, '71': 20, '83': 20, '17': 5, '55': 5, '54': 5, '24': 4, '89': 10 } },
  D: { name: 'Electricity, Gas, Water & Waste', employed: 162000, occupationMix: { '13': 10, '24': 15, '34': 20, '31': 15, '17': 10, '55': 5, '71': 10, '82': 10, '89': 5 } },
  E: { name: 'Construction', employed: 1314000, occupationMix: { '13': 10, '33': 30, '34': 15, '82': 20, '72': 5, '17': 5, '55': 5, '31': 5, '89': 5 } },
  F: { name: 'Wholesale Trade', employed: 372000, occupationMix: { '17': 10, '61': 15, '63': 15, '54': 15, '55': 10, '73': 10, '22': 5, '71': 5, '89': 15 } },
  G: { name: 'Retail Trade', employed: 1260000, occupationMix: { '16': 10, '62': 30, '63': 25, '55': 5, '17': 5, '85': 5, '54': 5, '51': 5, '89': 10 } },
  H: { name: 'Accommodation & Food Services', employed: 984000, occupationMix: { '16': 10, '43': 30, '35': 15, '85': 20, '42': 5, '17': 5, '62': 5, '89': 10 } },
  I: { name: 'Transport, Postal & Warehousing', employed: 669000, occupationMix: { '73': 30, '54': 15, '72': 10, '17': 10, '55': 10, '71': 5, '89': 10, '13': 5, '31': 5 } },
  J: { name: 'Information Media & Telecomms', employed: 206000, occupationMix: { '27': 30, '23': 20, '22': 10, '31': 10, '17': 10, '11': 5, '51': 5, '55': 5, '89': 5 } },
  K: { name: 'Financial & Insurance Services', employed: 498000, occupationMix: { '21': 20, '22': 15, '11': 15, '51': 15, '55': 10, '61': 5, '17': 5, '27': 10, '53': 5 } },
  L: { name: 'Rental, Hiring & Real Estate', employed: 217000, occupationMix: { '61': 25, '37': 15, '17': 15, '51': 10, '22': 10, '55': 10, '16': 10, '89': 5 } },
  M: { name: 'Professional, Scientific & Technical', employed: 1375000, occupationMix: { '21': 15, '22': 15, '27': 15, '24': 15, '28': 10, '23': 5, '11': 5, '31': 5, '51': 5, '17': 5, '55': 5 } },
  N: { name: 'Administrative & Support Services', employed: 480000, occupationMix: { '51': 15, '53': 15, '55': 10, '81': 15, '17': 10, '22': 10, '54': 5, '84': 5, '89': 15 } },
  O: { name: 'Public Administration & Safety', employed: 919000, occupationMix: { '11': 10, '22': 15, '45': 20, '17': 10, '51': 10, '53': 10, '28': 5, '55': 5, '12': 5, '89': 10 } },
  P: { name: 'Education & Training', employed: 1175000, occupationMix: { '25': 40, '14': 10, '42': 15, '51': 10, '17': 5, '22': 5, '81': 5, '89': 10 } },
  Q: { name: 'Health Care & Social Assistance', employed: 2044000, occupationMix: { '26': 25, '41': 15, '42': 20, '14': 5, '52': 10, '51': 5, '17': 5, '81': 5, '28': 5, '89': 5 } },
  R: { name: 'Arts & Recreation Services', employed: 265000, occupationMix: { '23': 25, '44': 20, '16': 10, '17': 10, '42': 5, '81': 10, '62': 5, '89': 15 } },
  S: { name: 'Other Services', employed: 509000, occupationMix: { '37': 20, '32': 15, '39': 10, '44': 10, '17': 10, '51': 5, '81': 10, '22': 5, '89': 15 } }
};

export function getSimpleRiskScore(score: number): number {
  return Math.min(10, Math.max(1, Math.round(score / 10)));
}

export function getSimpleRiskState(score: number): SimpleRiskState {
  return getSimpleRiskScore(score) >= 5 ? 'at_risk' : 'safer_for_now';
}

export function getRiskLabel(score: number): 'At risk' | 'Safer for now' {
  return getSimpleRiskState(score) === 'at_risk' ? 'At risk' : 'Safer for now';
}

export function getRiskTone(score: number) {
  if (getSimpleRiskState(score) === 'at_risk') {
    return {
      fill: '#DC2626',
      text: '#FFFFFF',
      tint: '#FEF2F2',
      border: '#FECACA',
      badge: '#FEE2E2'
    };
  }

  return {
    fill: '#16A34A',
    text: '#FFFFFF',
    tint: '#F0FDF4',
    border: '#BBF7D0',
    badge: '#DCFCE7'
  };
}

export function getTimelineTone(timeline: AutomationTimeline) {
  if (timeline === 'Now') {
    return { fill: '#DC2626', tint: '#FEF2F2', border: '#FECACA' };
  }

  if (timeline === '2-3 years') {
    return { fill: '#D97706', tint: '#FFF7ED', border: '#FED7AA' };
  }

  return { fill: '#16A34A', tint: '#F0FDF4', border: '#BBF7D0' };
}

export function compactCurrency(value: number): string {
  if (Math.abs(value) >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${Math.round(value)}`;
}

export function getSimpleTaskState(task: Pick<TaskAssessment, 'impactMode'>): SimpleTaskState {
  return task.impactMode === 'human_core' ? 'not_yet' : 'at_risk_now';
}

export function getSimpleTaskLabel(task: Pick<TaskAssessment, 'impactMode'> | SimpleTaskState): 'At risk now' | 'Not yet' {
  const state = typeof task === 'string' ? task : getSimpleTaskState(task);
  return state === 'at_risk_now' ? 'At risk now' : 'Not yet';
}

export function getSimpleTaskTone(task: Pick<TaskAssessment, 'impactMode'> | SimpleTaskState) {
  const state = typeof task === 'string' ? task : getSimpleTaskState(task);

  if (state === 'at_risk_now') {
    return {
      fill: '#DC2626',
      tint: '#FEF2F2',
      border: '#FECACA'
    };
  }

  return {
    fill: '#16A34A',
    tint: '#F0FDF4',
    border: '#BBF7D0'
  };
}

export function computeIndustryRisk(roles: Role[]): IndustryRisk[] {
  const averagesBySubMajor = new Map<string, { scoreTotal: number; salaryTotal: number; taskAutomationTotal: number; count: number }>();

  roles.forEach((role) => {
    const subMajor = role.code.slice(0, 2);
    const current = averagesBySubMajor.get(subMajor) ?? { scoreTotal: 0, salaryTotal: 0, taskAutomationTotal: 0, count: 0 };
    current.scoreTotal += role.score;
    current.salaryTotal += role.salary;
    current.taskAutomationTotal += role.taskAutomationPct;
    current.count += 1;
    averagesBySubMajor.set(subMajor, current);
  });

  return Object.entries(INDUSTRIES)
    .map(([code, industry]) => {
      let weightedScore = 0;
      let weightedSalary = 0;
      let totalWeight = 0;
      let criticalPct = 0;
      let highPct = 0;

      Object.entries(industry.occupationMix).forEach(([subMajor, weight]) => {
        const averages = averagesBySubMajor.get(subMajor);
        const avgScore = averages ? averages.scoreTotal / averages.count : 30;
        const avgSalary = averages ? averages.salaryTotal / averages.count : 70000;

        weightedScore += avgScore * weight;
        weightedSalary += avgSalary * weight;
        totalWeight += weight;

        if (avgScore >= 80) {
          criticalPct += weight;
        } else if (avgScore >= 60) {
          highPct += weight;
        }
      });

      const avgScore = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 30;
      const avgSalary = totalWeight > 0 ? Math.round(weightedSalary / totalWeight) : 70000;
      const atRiskPct = Math.round(
        rolesForSubMajors(industry.occupationMix, averagesBySubMajor).reduce((sum, entry) => {
          return sum + (entry.avgScore >= 70 && entry.taskAutomationPct >= 70 ? entry.weight : 0);
        }, 0)
      );

      return {
        code,
        name: industry.name,
        employed: industry.employed,
        avgScore,
        avgSalary,
        atRiskPct,
        criticalPct: Math.round(criticalPct),
        highPct: Math.round(highPct),
        exposureValue: Math.round(industry.employed * avgSalary * (avgScore / 100))
      };
    })
    .sort((left, right) => right.avgScore - left.avgScore);
}

function rolesForSubMajors(
  occupationMix: Record<string, number>,
  averagesBySubMajor: Map<string, { scoreTotal: number; salaryTotal: number; taskAutomationTotal: number; count: number }>
) {
  return Object.entries(occupationMix).map(([subMajor, weight]) => {
    const averages = averagesBySubMajor.get(subMajor);
    const avgScore = averages ? averages.scoreTotal / averages.count : 30;
    const avgSalary = averages ? averages.salaryTotal / averages.count : 70000;
    const taskAutomationPct = averages ? averages.taskAutomationTotal / averages.count : 30;

    return {
      subMajor,
      weight,
      avgScore,
      avgSalary,
      taskAutomationPct
    };
  });
}
