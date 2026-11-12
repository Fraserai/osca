'use client';

import { motion } from 'framer-motion';
import SectionCard from '@/components/shared/SectionCard';
import { HUMAN_BOTTLENECK_META } from '@/lib/roles/impactMeta';
import type { AgentBlueprint } from '@/lib/factory/types';
import type { Role } from '@/types/role';

type BlueprintDetailProps = {
  role: Role;
  blueprint: AgentBlueprint;
};

function renderList(values: string[], emptyState: string) {
  if (values.length === 0) {
    return <div className="text-[14px] leading-7 text-slate-500">{emptyState}</div>;
  }

  return (
    <div className="space-y-2">
      {values.map((value) => (
        <div key={value} className="text-[14px] leading-7 text-slate-700">
          {value}
        </div>
      ))}
    </div>
  );
}

function renderChips(values: string[], className: string) {
  if (values.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {values.map((value) => (
        <span key={value} className={className}>
          {value}
        </span>
      ))}
    </div>
  );
}

export default function BlueprintDetail({ role, blueprint }: BlueprintDetailProps) {
  return (
    <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
      <SectionCard className="bg-[linear-gradient(145deg,#ffffff_0%,#f8fafc_48%,#fff7ed_100%)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Selected blueprint</div>
            <h2 className="mt-3 font-serif-display text-[36px] leading-[0.96] text-slate-900">{blueprint.title}</h2>
            <p className="mt-4 max-w-[820px] text-[15px] leading-8 text-slate-600">{blueprint.thesis}</p>
          </div>
          <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_16px_36px_rgba(15,23,42,0.06)]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Blueprint score</div>
            <div className="mt-3 flex items-center gap-3">
              <div className="font-mono text-[34px] font-bold tracking-[-0.05em] text-slate-900">{blueprint.score}</div>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] text-slate-600">{blueprint.fitLabel}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          <div className="rounded-[22px] border border-slate-200 bg-white p-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">What it would handle</div>
            <div className="mt-3">{renderList(blueprint.whatItHandles, 'This blueprint keeps the role tightly scoped.')}</div>
          </div>
          <div className="rounded-[22px] border border-slate-200 bg-white p-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">What stays human</div>
            <div className="mt-3">{renderList(blueprint.whatStaysHuman, 'No additional human guardrails are dominating this blueprint.')}</div>
          </div>
          <div className="rounded-[22px] border border-slate-200 bg-white p-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Covered task set</div>
            <div className="mt-3">{renderList(blueprint.coveredTasks, 'No dominant covered task set surfaced.')}</div>
          </div>
          <div className="rounded-[22px] border border-slate-200 bg-white p-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Excluded task set</div>
            <div className="mt-3">{renderList(blueprint.excludedTasks, 'No clear exclusion cluster surfaced.')}</div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[22px] border border-slate-200 bg-white p-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Guardrails and blockers</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {blueprint.bottlenecks.map((bottleneck) => (
                <span key={bottleneck} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[12px] text-slate-600">
                  {HUMAN_BOTTLENECK_META[bottleneck].label}
                </span>
              ))}
            </div>
            <div className="mt-4">{renderList(blueprint.humanGuardrails, 'Keep approvals, escalation paths, and auditability with the team.')}</div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[22px] border border-slate-200 bg-white p-5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Operating stack</div>
              <div className="mt-4 space-y-4">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Daily apps</div>
                  {renderChips(blueprint.dailyApps, 'rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] text-slate-700')}
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Connector surface</div>
                  {renderChips(blueprint.connectorSurface, 'rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[12px] text-slate-600')}
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Agent layer</div>
                  {renderChips(blueprint.agentLayer, 'rounded-full bg-slate-900 px-3 py-1 text-[12px] text-white')}
                </div>
              </div>
            </div>

            <div className="rounded-[22px] border border-slate-200 bg-white p-5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Core work modules</div>
              <div className="mt-3 text-[13px] leading-6 text-slate-500">
                This blueprint is grounded in the role's day-to-day operating modules, then narrowed to the best-fit covered task set and connector surface.
              </div>
              {renderChips(role.primaryTasks, 'rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[12px] text-slate-600')}
            </div>

            <div className="rounded-[22px] border border-slate-200 bg-white p-5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Score breakdown</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[18px] border border-slate-200 bg-slate-50 p-3">
                  <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Role pressure</div>
                  <div className="mt-2 font-mono text-[22px] font-bold tracking-[-0.05em] text-slate-900">{blueprint.scoreBreakdown.rolePressure}</div>
                </div>
                <div className="rounded-[18px] border border-slate-200 bg-slate-50 p-3">
                  <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Digital fit</div>
                  <div className="mt-2 font-mono text-[22px] font-bold tracking-[-0.05em] text-slate-900">{blueprint.scoreBreakdown.digitalFit}</div>
                </div>
                <div className="rounded-[18px] border border-slate-200 bg-slate-50 p-3">
                  <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Autonomy fit</div>
                  <div className="mt-2 font-mono text-[22px] font-bold tracking-[-0.05em] text-slate-900">{blueprint.scoreBreakdown.autonomyFit}</div>
                </div>
                <div className="rounded-[18px] border border-slate-200 bg-slate-50 p-3">
                  <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Implementation ease</div>
                  <div className="mt-2 font-mono text-[22px] font-bold tracking-[-0.05em] text-slate-900">{blueprint.scoreBreakdown.implementationEase}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </motion.div>
  );
}
