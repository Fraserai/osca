'use client';

import ReportHero from '@/components/role/ReportHero';
import TaskExplorer from '@/components/role/TaskExplorer';
import SiteFooter from '@/components/SiteFooter';
import type { Role } from '@/types/role';

type OccupationReportShellProps = {
  role: Role;
};

export default function OccupationReportShell({ role }: OccupationReportShellProps) {
  return (
    <div className="space-y-6">
      <ReportHero role={role} />
      <TaskExplorer role={role} />
      <SiteFooter />
    </div>
  );
}
