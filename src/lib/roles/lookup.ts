import type { Role } from '@/types/role';
import { getAllRoles } from '@/lib/roles/data';

export function getRoleByCodeFromRoles(roles: Role[], code: string): Role | null {
  return roles.find((role) => role.code === code) ?? null;
}

export async function getRoleByCode(code: string): Promise<Role | null> {
  return getRoleByCodeFromRoles(await getAllRoles(), code);
}

