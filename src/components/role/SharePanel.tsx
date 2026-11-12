'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import SectionCard from '@/components/shared/SectionCard';
import { getRoleShareImagePath } from '@/lib/roles/paths';
import { getRoleShareUrl, getRoleSnapshotText } from '@/lib/roles/share';
import type { Role } from '@/types/role';

type SharePanelProps = {
  role: Role;
};

type ShareState = 'idle' | 'link' | 'snapshot' | 'error';

export default function SharePanel({ role }: SharePanelProps) {
  const [shareState, setShareState] = useState<ShareState>('idle');

  async function copyText(value: string, successState: Exclude<ShareState, 'idle' | 'error'>) {
    try {
      await navigator.clipboard.writeText(value);
      setShareState(successState);
      window.setTimeout(() => setShareState('idle'), 1800);
    } catch {
      setShareState('error');
    }
  }

  return (
    <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}>
      <SectionCard className="bg-[linear-gradient(145deg,#ffffff_0%,#fff7ed_100%)]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Share Panel</div>
        <h2 className="mt-3 font-serif-display text-[34px] leading-[0.96] text-slate-900">Turn this occupation report into a link, snapshot, or share card.</h2>
        <p className="mt-4 max-w-[760px] text-[15px] leading-8 text-slate-600">
          Every share action is deterministic from the current role data, using the same score, timeline, and replace-versus-augment logic shown on the page.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <button
            type="button"
            onClick={() => copyText(getRoleShareUrl(role.code), 'link')}
            className="rounded-[22px] border border-slate-200 bg-white p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
          >
            <div className="text-[15px] font-semibold text-slate-900">Copy link</div>
            <div className="mt-2 text-[13px] leading-6 text-slate-500">Copy the canonical report URL for this occupation.</div>
          </button>
          <button
            type="button"
            onClick={() => copyText(getRoleSnapshotText(role), 'snapshot')}
            className="rounded-[22px] border border-slate-200 bg-white p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
          >
            <div className="text-[15px] font-semibold text-slate-900">Copy snapshot</div>
            <div className="mt-2 text-[13px] leading-6 text-slate-500">Copy a short score, timeline, and impact-profile summary.</div>
          </button>
          <a
            href={getRoleShareImagePath(role.code)}
            target="_blank"
            rel="noreferrer"
            className="rounded-[22px] border border-slate-200 bg-white p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
          >
            <div className="text-[15px] font-semibold text-slate-900">Open share image</div>
            <div className="mt-2 text-[13px] leading-6 text-slate-500">Open the role-specific social image in a new tab.</div>
          </a>
        </div>
        <div className="mt-4 text-[13px] text-slate-500">
          {shareState === 'link' ? 'Canonical report link copied.' : null}
          {shareState === 'snapshot' ? 'Snapshot text copied.' : null}
          {shareState === 'error' ? 'Clipboard access was blocked in this browser.' : null}
          {shareState === 'idle' ? 'Share cards and metadata use the same canonical route and role summary helpers.' : null}
        </div>
      </SectionCard>
    </motion.div>
  );
}
