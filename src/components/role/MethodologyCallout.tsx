'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import SectionCard from '@/components/shared/SectionCard';

export default function MethodologyCallout() {
  return (
    <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}>
      <SectionCard className="bg-white/95 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[14px] leading-7 text-slate-600">The 1-10 score is a simple comparison tool. Read the methodology for the assumptions behind the score and task labels.</p>
          <Link
            href="/methodology"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-[12px] text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
          >
            Methodology
          </Link>
        </div>
      </SectionCard>
    </motion.div>
  );
}
