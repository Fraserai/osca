'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import RiskBadge from '@/components/shared/RiskBadge';
import ScorePill from '@/components/shared/ScorePill';
import SectionCard from '@/components/shared/SectionCard';
import TimelineBadge from '@/components/shared/TimelineBadge';
import { getRolePath } from '@/lib/roles/paths';
import type { AgentBlueprint, RoleFactorySummary } from '@/lib/factory/types';
import type { Role } from '@/types/role';

type FactoryHeroProps = {
  role: Role;
  summary: RoleFactorySummary;
  bestFit: AgentBlueprint;
};

export default function FactoryHero({ role, summary, bestFit }: FactoryHeroProps) {
  const previewApps = role.workstack.apps.slice(0, 4);
  const previewTasks = role.primaryTasks.slice(0, 4);

  return (
    <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
      <SectionCard className="overflow-hidden border-slate-200 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.96)_42%,rgba(236,244,255,0.96)_100%)] p-0">
        <div className="p-5 sm:p-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
            <div className="min-w-0">
              <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500 shadow-sm">
                Agent Factory · OSCA {role.code}
              </div>
              <h1 className="mt-4 max-w-[16ch] font-serif-display text-[42px] leading-[0.94] tracking-[-0.05em] text-slate-900 sm:text-[56px]">
                {role.title}
              </h1>
              <p className="mt-4 max-w-[780px] text-[17px] leading-8 text-slate-700">{summary.summary}</p>
              <p className="mt-3 max-w-[760px] text-[14px] leading-7 text-slate-500">{summary.promise}</p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <RiskBadge score={role.score} />
                <TimelineBadge timeline={role.timeline} />
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-600 shadow-sm">{summary.grounding}</span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-600 shadow-sm">
                  {summary.blueprintCount} blueprint{summary.blueprintCount === 1 ? '' : 's'}
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Daily apps</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {previewApps.map((app) => (
                      <span key={app} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-600 shadow-sm">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Core work modules</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {previewTasks.map((task) => (
                      <span key={task} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] text-slate-600">
                        {task}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={getRolePath(role.code)}
                  className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2.5 text-[13px] font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Back to occupation report
                </Link>
                <div className="text-[13px] text-slate-500">
                  Recommended starting point: <span className="font-medium text-slate-700">{bestFit.autonomyTier}</span> {bestFit.archetype}
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">AI INDEX score</div>
                    <div className="mt-3">
                      <ScorePill score={role.score} className="px-4 py-2 text-[16px]" />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Timeline</div>
                    <div className="mt-3">
                      <TimelineBadge timeline={role.timeline} className="text-[11px]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Best fit blueprint</div>
                <div className="mt-3 text-[24px] font-semibold leading-8 text-slate-900">{bestFit.autonomyTier}</div>
                <div className="mt-1 text-[15px] text-slate-700">{bestFit.archetype}</div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="font-mono text-[28px] font-bold tracking-[-0.05em] text-slate-900">{bestFit.score}</div>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] text-slate-600">{bestFit.fitLabel}</span>
                </div>
                <div className="mt-3 text-[13px] leading-6 text-slate-500">{bestFit.summary}</div>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </motion.div>
  );
}
