export const SITE_TITLE = 'AI INDEX';
export const SITE_DESCRIPTION = 'Search Australian jobs, see a simple 1-10 AI risk score, and review which tasks already look exposed.';

export const DATASET_VERSION_LABEL = 'AI job-risk index';
export const DATA_LAST_UPDATED_LABEL = 'March 24, 2026';
export const DATA_LAST_UPDATED_ISO = '2026-03-24';

export const DATA_SOURCES = [
  'ABS OSCA 2024 v1.0 occupation structure and descriptions',
  'Deterministic task-level AI risk assessments based on OSCA main task lists',
  'A simple public 1-10 score derived from the internal 0-100 comparison model',
  'Current AI tools and models verified against official vendor releases as of March 24, 2026'
] as const;

export function getSiteUrl(): string {
  const deployedUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;

  if (!deployedUrl) {
    return 'http://localhost:3000';
  }

  return deployedUrl.startsWith('http') ? deployedUrl : `https://${deployedUrl}`;
}
