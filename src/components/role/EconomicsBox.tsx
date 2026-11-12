'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import SectionCard from '@/components/shared/SectionCard';
import { formatCurrency } from '@/lib/cost';
import { compactCurrency } from '@/lib/oscaIndex';
import type { Role } from '@/types/role';

type EconomicsBoxProps = {
  role: Role;
};

export default function EconomicsBox({ role }: EconomicsBoxProps) {
  return (
    <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}>
      <SectionCard className="bg-white/95">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Economics, Simplified</div>
        <h2 className="mt-3 font-serif-display text-[34px] leading-[0.96] text-slate-900">A rough salary-versus-automation snapshot.</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Annual salary</div>
            <div className="mt-3 font-mono text-[30px] font-bold tracking-[-0.05em] text-slate-900">{formatCurrency(role.salary)}</div>
            <div className="mt-2 text-[13px] text-slate-500">Current benchmark salary estimate.</div>
          </div>
          <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">AI could save</div>
            <div className="mt-3 font-mono text-[30px] font-bold tracking-[-0.05em] text-slate-900">{compactCurrency(role.estimatedSavings)}</div>
            <div className="mt-2 text-[13px] text-slate-500">Simple heuristic: salary multiplied by score.</div>
          </div>
          <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Automatable share</div>
            <div className="mt-3 font-mono text-[30px] font-bold tracking-[-0.05em] text-slate-900">{role.taskAutomationPct}%</div>
            <div className="mt-2 text-[13px] text-slate-500">Based on listed OSCA tasks, not a payroll model.</div>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link href="/methodology#how-to-read-scores" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[12px] text-slate-600 transition hover:border-slate-300">
            Read methodology
          </Link>
          <span className="text-[12px] text-slate-500">{role.unitGroup}</span>
        </div>
      </SectionCard>
    </motion.div>
  );
}
