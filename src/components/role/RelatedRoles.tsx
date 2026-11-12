'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import RiskBadge from '@/components/shared/RiskBadge';
import ScorePill from '@/components/shared/ScorePill';
import SectionCard from '@/components/shared/SectionCard';
import TimelineBadge from '@/components/shared/TimelineBadge';
import { compactCurrency } from '@/lib/oscaIndex';
import { getRolePath } from '@/lib/roles/paths';
import type { Role } from '@/types/role';

type RelatedRolesProps = {
  roles: Role[];
};

export default function RelatedRoles({ roles }: RelatedRolesProps) {
  return (
    <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
      <SectionCard className="bg-white/95">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Related Roles</div>
        <h2 className="mt-3 font-serif-display text-[34px] leading-[0.96] text-slate-900">Closest report pages in the same major occupation family.</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {roles.map((role) => (
            <Link
              key={role.code}
              href={getRolePath(role.code)}
              className="group rounded-[24px] border border-slate-200 bg-[linear-gradient(145deg,#ffffff_0%,#f8fafc_100%)] p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_52px_rgba(15,23,42,0.1)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">OSCA {role.code}</div>
                  <div className="mt-3 text-[20px] font-semibold leading-7 text-slate-900">{role.title}</div>
                </div>
                <ScorePill score={role.score} />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <RiskBadge score={role.score} />
                <TimelineBadge timeline={role.timeline} />
              </div>
              <div className="mt-5 text-[13px] leading-6 text-slate-500">
                Salary approx. {compactCurrency(role.salary)}/yr · {role.impactProfile.replaceNowPct}% replace now · {role.impactProfile.humanCorePct}% human core.
              </div>
            </Link>
          ))}
        </div>
      </SectionCard>
    </motion.div>
  );
}
