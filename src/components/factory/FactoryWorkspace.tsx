'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import BlueprintDetail from '@/components/factory/BlueprintDetail';
import BlueprintSelector from '@/components/factory/BlueprintSelector';
import BuildPipeline from '@/components/factory/BuildPipeline';
import FactoryHero from '@/components/factory/FactoryHero';
import FrameworkCallout from '@/components/factory/FrameworkCallout';
import SectionCard from '@/components/shared/SectionCard';
import { getRolePath } from '@/lib/roles/paths';
import type { AgentBlueprint, RoleFactorySummary } from '@/lib/factory/types';
import type { Role } from '@/types/role';

type FactoryWorkspaceProps = {
  role: Role;
  summary: RoleFactorySummary;
  blueprints: AgentBlueprint[];
};

export default function FactoryWorkspace({ role, summary, blueprints }: FactoryWorkspaceProps) {
  const [selectedBlueprintId, setSelectedBlueprintId] = useState(blueprints[0]?.id ?? '');

  useEffect(() => {
    setSelectedBlueprintId(blueprints[0]?.id ?? '');
  }, [role.code, blueprints]);

  const selectedBlueprint = useMemo(() => {
    return blueprints.find((blueprint) => blueprint.id === selectedBlueprintId) ?? blueprints[0];
  }, [blueprints, selectedBlueprintId]);

  if (!selectedBlueprint) {
    return null;
  }

  return (
    <div className="space-y-6">
      <FactoryHero role={role} summary={summary} bestFit={blueprints[0]} />
      <BlueprintSelector blueprints={blueprints} selectedBlueprintId={selectedBlueprint.id} onSelect={setSelectedBlueprintId} />
      <BlueprintDetail role={role} blueprint={selectedBlueprint} />
      <BuildPipeline blueprint={selectedBlueprint} />
      <FrameworkCallout />
      <SectionCard className="bg-white/95">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Back to report</div>
            <div className="mt-3 text-[20px] font-semibold text-slate-900">Return to the canonical occupation report for score, tasks, and share tools.</div>
          </div>
          <Link
            href={getRolePath(role.code)}
            className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2.5 text-[13px] font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Open occupation report
          </Link>
        </div>
      </SectionCard>
    </div>
  );
}
