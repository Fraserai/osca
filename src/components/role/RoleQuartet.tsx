'use client';

import { CONFIDENCE_META } from '@/lib/roles/impactMeta';
import type { RoleTaskDrilldownState } from '@/lib/roles/drilldown';
import type { RoleInsights } from '@/lib/roles/insights';
import type { TaskImpactMode } from '@/types/role';

type RoleQuartetProps = {
  insights: RoleInsights;
  drilldownState?: RoleTaskDrilldownState;
  onImpactModeToggle?: (impactMode: Extract<TaskImpactMode, 'replace_now' | 'augment_now' | 'human_core'>) => void;
  compact?: boolean;
};

const QUARTET_ITEMS = [
  { key: 'replace_now', label: 'Replace now', valueKey: 'replaceNowScore', sublabel: 'direct substitution share' },
  { key: 'augment_now', label: 'Augment now', valueKey: 'augmentNowScore', sublabel: 'human-owned, AI-heavy work' },
  { key: 'human_core', label: 'Human core', valueKey: 'humanCoreScore', sublabel: 'still blocked today' }
] as const;

export default function RoleQuartet({ insights, drilldownState, onImpactModeToggle, compact = false }: RoleQuartetProps) {
  return (
    <div className={`grid gap-3 ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2 2xl:grid-cols-4'}`}>
      {QUARTET_ITEMS.map((item) => {
        const impactMode = item.key;
        const active = drilldownState?.impactMode === impactMode;
        const value = insights[item.valueKey];
        const baseClassName = compact ? 'rounded-[18px] p-4' : 'rounded-[22px] p-5';

        if (onImpactModeToggle) {
          return (
            <button
              key={impactMode}
              type="button"
              onClick={() => onImpactModeToggle(impactMode)}
              aria-pressed={active}
              className={`${baseClassName} border text-left transition ${
                active
                  ? 'border-slate-900 bg-slate-900 text-white shadow-[0_16px_40px_rgba(15,23,42,0.16)]'
                  : 'border-slate-200 bg-slate-50 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <div className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${active ? 'text-white/70' : 'text-slate-500'}`}>{item.label}</div>
              <div className={`mt-3 font-mono text-[28px] font-bold tracking-[-0.05em] ${active ? 'text-white' : 'text-slate-900'}`}>{value}%</div>
              <div className={`mt-2 text-[13px] leading-6 ${active ? 'text-white/75' : 'text-slate-500'}`}>{item.sublabel}</div>
            </button>
          );
        }

        return (
          <div key={impactMode} className={`${baseClassName} border border-slate-200 bg-slate-50`}>
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{item.label}</div>
            <div className="mt-3 font-mono text-[28px] font-bold tracking-[-0.05em] text-slate-900">{value}%</div>
            <div className="mt-2 text-[13px] leading-6 text-slate-500">{item.sublabel}</div>
          </div>
        );
      })}

      <div className={`${compact ? 'rounded-[18px] p-4' : 'rounded-[22px] p-5'} border border-slate-200 bg-slate-50`}>
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Confidence</div>
        <div className="mt-3 flex items-center gap-3">
          <div className="font-mono text-[28px] font-bold tracking-[-0.05em] text-slate-900">{insights.confidenceScore}</div>
          <span
            className="rounded-full px-3 py-1 text-[11px] font-medium"
            style={{
              backgroundColor: CONFIDENCE_META[insights.confidenceLabel].tint,
              color: CONFIDENCE_META[insights.confidenceLabel].text,
              border: `1px solid ${CONFIDENCE_META[insights.confidenceLabel].border}`
            }}
          >
            {CONFIDENCE_META[insights.confidenceLabel].label}
          </span>
        </div>
        <div className="mt-2 text-[13px] leading-6 text-slate-500">Assessment confidence only. It does not change the score.</div>
      </div>
    </div>
  );
}
