import { getRiskLabel, getSimpleRiskScore } from '@/lib/oscaIndex';
import { getRoleMetadataDescription } from '@/lib/roles/narrative';
import { getRolePath, getRoleShareImagePath } from '@/lib/roles/paths';
import { getSiteUrl, SITE_TITLE } from '@/lib/site';
import type { Role } from '@/types/role';

export function getRoleShareUrl(code: string): string {
  return `${getSiteUrl()}${getRolePath(code)}`;
}

export function getRoleShareImageUrl(code: string): string {
  return `${getSiteUrl()}${getRoleShareImagePath(code)}`;
}

export function getRoleSnapshotText(role: Role): string {
  return `${role.title} (${role.code}) — ${SITE_TITLE}

Risk score: ${getSimpleRiskScore(role.score)}/10
Status: ${getRiskLabel(role.score)}
Tasks at risk now: ${role.taskAutomationCount}/${role.taskAssessments.length}

${getRoleMetadataDescription(role)}`;
}
