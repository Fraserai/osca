import Link from 'next/link';
import { SITE_TITLE } from '@/lib/site';

export default function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-slate-200 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-400">{SITE_TITLE}</div>
        <div className="flex flex-wrap items-center gap-4 text-[12px] text-slate-500">
          <Link href="/" className="transition hover:text-slate-900">
            Index
          </Link>
          <Link href="/methodology" className="transition hover:text-slate-900">
            Methodology
          </Link>
        </div>
      </div>
    </footer>
  );
}
