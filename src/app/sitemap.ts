import type { MetadataRoute } from 'next';
import { getAllRoles } from '@/lib/roles/data';
import { getRolePath } from '@/lib/roles/paths';
import { DATA_LAST_UPDATED_ISO, getSiteUrl } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const lastModified = new Date(DATA_LAST_UPDATED_ISO);
  const roles = await getAllRoles();

  return [
    {
      url: siteUrl,
      lastModified
    },
    {
      url: `${siteUrl}/methodology`,
      lastModified
    },
    ...roles.map((role) => ({
      url: `${siteUrl}${getRolePath(role.code)}`,
      lastModified
    }))
  ];
}
