'use client';

import { HUMAN_BOTTLENECK_META } from '@/lib/roles/impactMeta';
import type { RoleTaskDrilldownState } from '@/lib/roles/drilldown';
import type { RoleInsights } from '@/lib/roles/insights';
import type { HumanBottleneck } from '@/types/role';

type RoleWhySummaryProps = {
  insights: RoleInsights;
  drilldownState?: RoleTaskDrilldownState;
  onBottleneckToggle?: (bottleneck: HumanBottleneck) => void;
  compact?: boolean;
};

function renderTaskList(tasks: RoleInsights['topExposedTasks']) {
  if (tasks.length === 0) {
    return <div className="text-[13px] leading-6 text-slate-500">No dominant task cluster stands out yet.</div>;
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div key={task.task} className="text-[13px] leading-6 text-slate-700">
          {task.task}
        </div>
      ))}
    </div>
  );
}

export default function RoleWhySummary({ insights, drilldownState, onBottleneckToggle, compact = false }: RoleWhySummaryProps) {
  const cardClassName = compact ? 'rounded-[18px] p-4' : 'rounded-[22px] p-5';

  return (
    <div className={`grid gap-3 ${compact ? 'md:grid-cols-2' : 'xl:grid-cols-2'}`}>
      <div className={`${cardClassName} border border-slate-200 bg-slate-50`}>
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Most exposed</div>
        <div className="mt-3">{renderTaskList(insights.topExposedTasks)}</div>
      </div>

      <div className={`${cardClassName} border border-slate-200 bg-slate-50`}>
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Still human-led</div>
        <div className="mt-3">{renderTaskList(insights.topHumanCoreTasks)}</div>
      </div>

      <div className={`${cardClassName} border border-slate-200 bg-slate-50`}>
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Main blockers</div>
        {insights.bottleneckCounts.length === 0 ? (
          <div className="mt-3 text-[13px] leading-6 text-slate-500">No single human bottleneck dominates this role.</div>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {insights.bottleneckCounts.map(({ bottleneck, count }) => {
              const active = drilldownState?.bottleneck === bottleneck;

              if (onBottleneckToggle) {
                return (
                  <button
                    key={bottleneck}
                    type="button"
                    onClick={() => onBottleneckToggle(bottleneck)}
                    aria-pressed={active}
                    className={`rounded-full border px-3 py-1 text-[12px] transition ${
                      active ? 'border-slate-900 bg-slate-900 text-white shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {HUMAN_BOTTLENECK_META[bottleneck].label} · {count}
                  </button>
                );
              }

              return (
                <span key={bottleneck} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] text-slate-600">
                  {HUMAN_BOTTLENECK_META[bottleneck].label} · {count}
                </span>
              );
            })}
          </div>
        )}
      </div>

      <div className={`${cardClassName} border border-slate-200 bg-slate-50`}>
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Pressure drivers</div>
        {insights.pressureDrivers.length === 0 ? (
          <div className="mt-3 text-[13px] leading-6 text-slate-500">No tool cluster dominates the exposed task set.</div>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {insights.pressureDrivers.map((tool) => (
              <span key={tool} className="rounded-full bg-slate-900 px-3 py-1 text-[12px] text-white">
                {tool}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
