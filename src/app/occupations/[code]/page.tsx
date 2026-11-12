import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import OccupationReportShell from '@/components/role/OccupationReportShell';
import { getAllRoles } from '@/lib/roles/data';
import { getRoleByCode, getRoleByCodeFromRoles } from '@/lib/roles/lookup';
import { buildRoleMetadata } from '@/lib/roles/metadata';
import { SITE_TITLE } from '@/lib/site';

type OccupationPageProps = {
  params: Promise<{ code: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const roles = await getAllRoles();
  return roles.map((role) => ({ code: role.code }));
}

export async function generateMetadata({ params }: OccupationPageProps): Promise<Metadata> {
  const { code } = await params;
  const role = await getRoleByCode(code);

  if (!role) {
    return {
      title: `Occupation Not Found | ${SITE_TITLE}`
    };
  }

  return buildRoleMetadata(role);
}

export default async function OccupationReportPage({ params }: OccupationPageProps) {
  const { code } = await params;
  const roles = await getAllRoles();
  const role = getRoleByCodeFromRoles(roles, code);

  if (!role) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      <OccupationReportShell role={role} />
    </main>
  );
}
