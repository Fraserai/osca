import type { TaskAssessment } from '@/types/role';

export const TASK_STATUS_META: Record<
  TaskAssessment['aiCapable'],
  { short: string; label: string; tint: string; text: string; border: string; rail: string }
> = {
  yes: {
    short: 'Yes',
    label: 'Can do today',
    tint: '#ECFDF5',
    text: '#047857',
    border: '#A7F3D0',
    rail: '#10B981'
  },
  partial: {
    short: 'Partial',
    label: 'Partial support',
    tint: '#FFF7ED',
    text: '#C2410C',
    border: '#FED7AA',
    rail: '#F97316'
  },
  no: {
    short: 'No',
    label: 'Human required',
    tint: '#F8FAFC',
    text: '#475569',
    border: '#CBD5E1',
    rail: '#64748B'
  }
};
