import { Analytics } from '@vercel/analytics/react';
import type { Metadata, Viewport } from 'next';
import { designTokens } from '@/lib/design/tokens';
import { getSiteUrl, SITE_DESCRIPTION, SITE_TITLE } from '@/lib/site';
import './globals.css';

export const viewport: Viewport = {
  themeColor: designTokens.colors.canvas,
  colorScheme: 'light'
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_TITLE,
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: '/',
    siteName: SITE_TITLE,
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: `${SITE_TITLE} share image`
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/twitter-image']
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f7f4ee] text-slate-900 antialiased">
        {children}
        {process.env.NODE_ENV === 'production' ? <Analytics /> : null}
      </body>
    </html>
  );
}
