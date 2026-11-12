'use client';

import { motion } from 'framer-motion';
import SectionCard from '@/components/shared/SectionCard';
import type { AgentBlueprint } from '@/lib/factory/types';

type BuildPipelineProps = {
  blueprint: AgentBlueprint;
};

export default function BuildPipeline({ blueprint }: BuildPipelineProps) {
  return (
    <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}>
      <SectionCard className="bg-white/95">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Rapid build pipeline</div>
        <h2 className="mt-3 font-serif-display text-[34px] leading-[0.96] text-slate-900">Prototype, pilot, then production.</h2>
        <p className="mt-4 max-w-[760px] text-[15px] leading-8 text-slate-600">
          Every blueprint uses the same operational path: validate it quickly, integrate it with human oversight, then deploy it on the right controlled stack.
        </p>

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {blueprint.buildStages.map((stage, index) => (
            <div key={stage.stage} className="rounded-[24px] border border-slate-200 bg-[linear-gradient(145deg,#ffffff_0%,#f8fafc_100%)] p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Stage {index + 1}</div>
                <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] text-slate-600">{stage.label}</div>
              </div>
              <div className="mt-4 text-[22px] font-semibold text-slate-900">{stage.label}</div>
              <p className="mt-4 text-[14px] leading-7 text-slate-600">{stage.description}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </motion.div>
  );
}
