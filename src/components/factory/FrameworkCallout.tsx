'use client';

import { motion } from 'framer-motion';
import SectionCard from '@/components/shared/SectionCard';

export default function FrameworkCallout() {
  return (
    <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
      <SectionCard className="bg-[linear-gradient(145deg,#ffffff_0%,#fff7ed_48%,#ffffff_100%)]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Methodology layer</div>
        <h2 className="mt-3 font-serif-display text-[34px] leading-[0.96] text-slate-900">Vertical Intelligence Framework</h2>
        <p className="mt-4 max-w-[820px] text-[15px] leading-8 text-slate-600">
          Agent Factory uses the framework as a build lens, not a rebrand. Each blueprint is grounded in the occupation, shaped by the T1-T4 autonomy model, and carried through a rapid delivery path from prototype to production.
        </p>

        <div className="mt-6 grid gap-4 xl:grid-cols-4">
          <div className="rounded-[22px] border border-slate-200 bg-white p-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Vertical agents</div>
            <div className="mt-3 text-[18px] font-semibold text-slate-900">Built from the role, not from a generic prompt.</div>
          </div>
          <div className="rounded-[22px] border border-slate-200 bg-white p-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Role grounding</div>
            <div className="mt-3 text-[18px] font-semibold text-slate-900">Each blueprint stays tied to the task mix, blockers, and pressure profile already in AI INDEX.</div>
          </div>
          <div className="rounded-[22px] border border-slate-200 bg-white p-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Autonomy model</div>
            <div className="mt-3 text-[18px] font-semibold text-slate-900">T1 observation through T4 operation, without forcing every role into full autonomy.</div>
          </div>
          <div className="rounded-[22px] border border-slate-200 bg-white p-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Rapid build pipeline</div>
            <div className="mt-3 text-[18px] font-semibold text-slate-900">Prototype, pilot, then production with the right controls at each step.</div>
          </div>
        </div>
      </SectionCard>
    </motion.div>
  );
}
