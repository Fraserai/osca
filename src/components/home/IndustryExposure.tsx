'use client';

import { motion } from 'framer-motion';
import SectionCard from '@/components/shared/SectionCard';
import { compactCurrency, getRiskTone } from '@/lib/oscaIndex';
import type { IndustryRisk } from '@/types/role';

type IndustryExposureProps = {
  industryRisk: IndustryRisk[];
  expanded: boolean;
  onToggle: () => void;
};

export default function IndustryExposure({ industryRisk, expanded, onToggle }: IndustryExposureProps) {
  const maxExposure = Math.max(...industryRisk.map((industry) => industry.exposureValue), 1);

  return (
    <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}>
      <SectionCard>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Industry Exposure</div>
            <h2 className="mt-2 font-serif-display text-[30px] leading-[1] text-slate-900">Where the exposure clusters by sector.</h2>
            <p className="mt-3 max-w-[760px] text-[14px] leading-7 text-slate-600">
              This view uses approximate ANZSIC workforce mixes to show relative exposure. It is directional, not payroll-precise.
            </p>
          </div>
          <button
            type="button"
            onClick={onToggle}
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-600 transition hover:border-slate-300 hover:bg-white"
          >
            {expanded ? 'Hide industry exposure' : 'Show industry exposure'}
          </button>
        </div>

        {expanded ? (
          <div className="mt-6 space-y-3">
            {industryRisk.map((industry) => {
              const tone = getRiskTone(industry.avgScore);

              return (
                <div key={industry.code} className="rounded-[20px] border border-slate-200 bg-slate-50/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[15px] font-semibold text-slate-900">{industry.name}</div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${(industry.exposureValue / maxExposure) * 100}%`, backgroundColor: tone.fill }} />
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-right">
                      <div>
                        <div className="font-mono text-[11px] text-slate-500">Employed</div>
                        <div className="font-mono text-[14px] text-slate-900">{Math.round(industry.employed / 1000)}K</div>
                      </div>
                      <div>
                        <div className="font-mono text-[11px] text-slate-500">Avg score</div>
                        <div className="font-mono text-[14px] text-slate-900">{industry.avgScore}</div>
                      </div>
                      <div>
                        <div className="font-mono text-[11px] text-slate-500">At risk</div>
                        <div className="font-mono text-[14px] text-slate-900">{industry.atRiskPct}%</div>
                      </div>
                      <div>
                        <div className="font-mono text-[11px] text-slate-500">Exposure</div>
                        <div className="font-mono text-[14px] text-slate-900">{compactCurrency(industry.exposureValue)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </SectionCard>
    </motion.div>
  );
}
