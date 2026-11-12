import type { Metadata } from 'next';
import { getRoleMetadataDescription } from '@/lib/roles/narrative';
import { getRolePath, getRoleShareImagePath } from '@/lib/roles/paths';
import { SITE_TITLE } from '@/lib/site';
import type { Role } from '@/types/role';

export function getRolePageTitle(role: Role): string {
  return `${role.title} | ${SITE_TITLE}`;
}

export function buildRoleMetadata(role: Role): Metadata {
  const title = getRolePageTitle(role);
  const description = getRoleMetadataDescription(role);
  const path = getRolePath(role.code);
  const imagePath = getRoleShareImagePath(role.code);

  return {
    title,
    description,
    alternates: {
      canonical: path
    },
    openGraph: {
      title,
      description,
      url: path,
      type: 'article',
      images: [
        {
          url: imagePath,
          width: 1200,
          height: 630,
          alt: `${role.title} AI INDEX share image`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imagePath]
    }
  };
}
