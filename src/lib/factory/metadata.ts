import type { Metadata } from 'next';
import { getRoleFactoryWorkspace } from '@/lib/factory/blueprints';
import { getRoleFactoryPath, getRoleShareImagePath } from '@/lib/roles/paths';
import { SITE_TITLE } from '@/lib/site';
import type { Role } from '@/types/role';

export function buildFactoryMetadata(role: Role): Metadata {
  const { summary, blueprints } = getRoleFactoryWorkspace(role);
  const bestFit = blueprints[0];
  const title = `${role.title} Agent Factory | ${SITE_TITLE}`;
  const description = `${summary.summary} Top blueprint: ${bestFit.autonomyTier} ${bestFit.archetype.toLowerCase()} with a ${bestFit.score}/100 fit score.`;
  const path = getRoleFactoryPath(role.code);
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
          alt: `${role.title} Agent Factory share image`
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
