'use client';

import { motion } from 'framer-motion';
import type { AgentBlueprint } from '@/lib/factory/types';

type BlueprintSelectorProps = {
  blueprints: AgentBlueprint[];
  selectedBlueprintId: string;
  onSelect: (blueprintId: string) => void;
};

export default function BlueprintSelector({ blueprints, selectedBlueprintId, onSelect }: BlueprintSelectorProps) {
  return (
    <motion.section initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Blueprint selector</div>
      <h2 className="mt-3 font-serif-display text-[34px] leading-[0.96] text-slate-900">Choose the best operating model for this role.</h2>
      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        {blueprints.map((blueprint) => {
          const active = blueprint.id === selectedBlueprintId;

          return (
            <button
              key={blueprint.id}
              type="button"
              onClick={() => onSelect(blueprint.id)}
              aria-pressed={active}
              className={`rounded-[24px] border p-5 text-left transition duration-200 ${
                active
                  ? 'border-slate-900 bg-slate-900 text-white shadow-[0_24px_56px_rgba(15,23,42,0.18)]'
                  : 'border-slate-200 bg-white shadow-[0_16px_36px_rgba(15,23,42,0.05)] hover:-translate-y-1 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${active ? 'text-white/65' : 'text-slate-500'}`}>{blueprint.autonomyTier}</div>
                  <div className="mt-3 text-[22px] font-semibold leading-8">{blueprint.archetype}</div>
                </div>
                <div className={`rounded-full px-3 py-1 text-[11px] ${active ? 'border border-white/20 bg-white/10 text-white' : 'border border-slate-200 bg-slate-50 text-slate-600'}`}>
                  {blueprint.fitLabel}
                </div>
              </div>

              <div className="mt-4 flex items-end justify-between gap-4">
                <div className="font-mono text-[34px] font-bold tracking-[-0.05em]">{blueprint.score}</div>
                <div className={`text-[12px] ${active ? 'text-white/70' : 'text-slate-500'}`}>fit score</div>
              </div>

              <p className={`mt-4 text-[14px] leading-7 ${active ? 'text-white/82' : 'text-slate-600'}`}>{blueprint.summary}</p>
            </button>
          );
        })}
      </div>
    </motion.section>
  );
}
