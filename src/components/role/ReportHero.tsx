'use client';

import { motion } from 'framer-motion';
import RiskBadge from '@/components/shared/RiskBadge';
import ScorePill from '@/components/shared/ScorePill';
import SectionCard from '@/components/shared/SectionCard';
import { getRoleReportSummary } from '@/lib/roles/narrative';
import { getRoleToolDrivers } from '@/lib/roles/tooling';
import type { Role } from '@/types/role';

type ReportHeroProps = {
  role: Role;
};

export default function ReportHero({ role }: ReportHeroProps) {
  const toolDrivers = getRoleToolDrivers(role, 8);

  return (
    <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
      <SectionCard className="overflow-hidden border-slate-200 bg-[linear-gradient(140deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.96)_46%,rgba(255,247,237,0.94)_100%)] p-0">
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="min-w-0 flex-1">
              <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500 shadow-sm">
                OSCA {role.code}
              </div>
              <h1 className="mt-4 max-w-[15ch] font-serif-display text-[44px] leading-[0.92] tracking-[-0.05em] text-slate-900 sm:text-[58px]">{role.title}</h1>
              <p className="mt-3 max-w-[760px] text-[16px] leading-8 text-slate-600">{getRoleReportSummary(role)}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <RiskBadge score={role.score} />
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-600 shadow-sm">
                  {role.taskAutomationCount}/{role.taskAssessments.length} tasks at risk now
                </span>
              </div>
              {toolDrivers.length > 0 ? (
                <div className="mt-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">AI tools and models in play today</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {toolDrivers.map((tool) => (
                      <span key={`${role.code}-${tool.label}`} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-600 shadow-sm">
                        {tool.label}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Risk score</div>
              <div className="mt-3">
                <ScorePill score={role.score} className="px-5 py-2.5 text-[18px]" />
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </motion.div>
  );
}
