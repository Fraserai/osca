import { cache } from 'react';
import { buildOccupations } from '@/lib/oscaData';
import { computeIndustryRisk } from '@/lib/oscaIndex';

export const getAllRoles = cache(async () => buildOccupations());

export const getIndustryRiskData = cache(async () => {
  const roles = await getAllRoles();
  return computeIndustryRisk(roles);
});

export const getIndexData = cache(async () => {
  const roles = await getAllRoles();
  return {
    roles,
    industryRisk: computeIndustryRisk(roles)
  };
});

