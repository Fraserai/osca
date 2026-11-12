'use client';

import { motion } from 'framer-motion';
import SmartSearchInput from '@/components/shared/SmartSearchInput';
import { designTokens } from '@/lib/design/tokens';
import { SITE_TITLE } from '@/lib/site';
import type { Role } from '@/types/role';

type HeroProps = {
  roles: Role[];
  rolesCount: number;
  filteredCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  onSelectRole: (role: Role) => void;
};

export default function Hero({ roles, rolesCount, filteredCount, search, onSearchChange, onSelectRole }: HeroProps) {
  return (
    <motion.section
      className="osca-section relative overflow-hidden border p-4 sm:p-5"
      style={{
        borderRadius: designTokens.radii.section,
        background: designTokens.gradients.hero,
        borderColor: designTokens.colors.border,
        boxShadow: designTokens.shadows.card
      }}
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative z-10 max-w-[820px]">
        <h1 className="text-[34px] font-bold leading-[0.92] tracking-[-0.05em] text-slate-900 sm:text-[54px]">{SITE_TITLE}</h1>
        <p className="mt-2 max-w-[620px] text-[15px] leading-6 text-slate-600">
          Search a job to see if it is at risk or safer for now.
        </p>

        <div className="mt-4 rounded-[26px] border border-slate-200 bg-white/94 p-4 shadow-[0_18px_42px_rgba(15,23,42,0.06)] sm:p-5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Search the index</label>
          <div className="mt-3">
            <SmartSearchInput
              roles={roles}
              value={search}
              onChange={onSearchChange}
              onSelectRole={onSelectRole}
              placeholder="Search roles or codes..."
              inputClassName="w-full rounded-[18px] border border-slate-200 bg-slate-50 px-5 py-4 text-[15px] text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-[12px] text-slate-500">
          <span className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
            <span className="font-mono text-[12px] font-semibold text-slate-900">{rolesCount.toLocaleString()}</span>{' '}
            roles
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
            <span className="font-mono text-[12px] font-semibold text-slate-900">{filteredCount.toLocaleString()}</span>{' '}
            in view
          </span>
        </div>
      </div>
    </motion.section>
  );
}
