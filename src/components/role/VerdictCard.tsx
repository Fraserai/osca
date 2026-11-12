'use client';

import { motion } from 'framer-motion';
import RoleWhySummary from '@/components/role/RoleWhySummary';
import SectionCard from '@/components/shared/SectionCard';
import type { RoleTaskDrilldownState } from '@/lib/roles/drilldown';
import type { RoleInsights } from '@/lib/roles/insights';
import { getRoleVerdict } from '@/lib/roles/narrative';
import type { HumanBottleneck, Role } from '@/types/role';

type VerdictCardProps = {
  role: Role;
  insights: RoleInsights;
  drilldownState: RoleTaskDrilldownState;
  onBottleneckToggle: (bottleneck: HumanBottleneck) => void;
};

export default function VerdictCard({ role, insights, drilldownState, onBottleneckToggle }: VerdictCardProps) {
  return (
    <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}>
      <SectionCard className="bg-white/95">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Plain-Language Verdict</div>
        <h2 className="mt-3 font-serif-display text-[34px] leading-[0.96] text-slate-900">Where the role is exposed, and where it stays human-led.</h2>
        <p className="mt-4 max-w-[920px] text-[15px] leading-8 text-slate-600">{getRoleVerdict(role)}</p>
        <div className="mt-6">
          <RoleWhySummary insights={insights} drilldownState={drilldownState} onBottleneckToggle={onBottleneckToggle} />
        </div>
      </SectionCard>
    </motion.div>
  );
}
