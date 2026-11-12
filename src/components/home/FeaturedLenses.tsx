'use client';

import { motion } from 'framer-motion';
import RiskBadge from '@/components/shared/RiskBadge';
import ScorePill from '@/components/shared/ScorePill';
import TimelineBadge from '@/components/shared/TimelineBadge';
import { designTokens } from '@/lib/design/tokens';
import { getFeaturedLenses } from '@/lib/roles/featured';
import type { Role } from '@/types/role';

type FeaturedLensesProps = {
  roles: Role[];
  onOpenRole: (code: string) => void;
};

const LENS_STYLES = {
  'risk-now': {
    background: designTokens.gradients.lensNow,
    accent: designTokens.colors.accentCoral
  },
  watchlist: {
    background: designTokens.gradients.lensNear,
    accent: designTokens.colors.accentGold
  },
  anchors: {
    background: designTokens.gradients.lensSafe,
    accent: designTokens.colors.accentTeal
  }
} as const;

export default function FeaturedLenses({ roles, onOpenRole }: FeaturedLensesProps) {
  const lenses = getFeaturedLenses(roles);

  return (
    <motion.section
      className="grid gap-4 xl:grid-cols-3"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      {lenses.map((lens) => {
        const style = LENS_STYLES[lens.id];

        return (
          <div
            key={lens.id}
            className="rounded-[28px] border border-slate-200 p-5 shadow-[0_18px_42px_rgba(15,23,42,0.05)]"
            style={{ background: style.background, boxShadow: designTokens.shadows.subtle }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{lens.title}</div>
              <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: style.accent }} />
            </div>
            <p className="mt-3 text-[14px] leading-7 text-slate-600">{lens.description}</p>
            <div className="mt-5 space-y-3">
              {lens.roles.map((role) => (
                <button
                  key={role.code}
                  type="button"
                  onClick={() => onOpenRole(role.code)}
                  className="w-full rounded-[22px] border border-white/80 bg-white/90 p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">OSCA {role.code}</div>
                      <div className="mt-2 text-[16px] font-semibold leading-6 text-slate-900">{role.title}</div>
                    </div>
                    <ScorePill score={role.score} />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <RiskBadge score={role.score} />
                    <TimelineBadge timeline={role.timeline} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </motion.section>
  );
}
