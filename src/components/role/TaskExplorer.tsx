'use client';

import { motion } from 'framer-motion';
import SectionCard from '@/components/shared/SectionCard';
import TaskListItem from '@/components/role/TaskListItem';
import { getSimpleTaskState } from '@/lib/oscaIndex';
import type { Role } from '@/types/role';

type TaskExplorerProps = {
  role: Role;
};

export default function TaskExplorer({ role }: TaskExplorerProps) {
  const atRiskTasks = role.taskAssessments.filter((task) => getSimpleTaskState(task) === 'at_risk_now');
  const stillHumanTasks = role.taskAssessments.filter((task) => getSimpleTaskState(task) === 'not_yet');

  return (
    <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}>
      <SectionCard className="bg-white/95">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Tasks</div>
            <h2 className="mt-3 font-serif-display text-[34px] leading-[0.96] text-slate-900">What looks exposed already, and what does not.</h2>
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-600">
            {atRiskTasks.length} of {role.taskAssessments.length} at risk now
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <section className="rounded-[22px] border border-rose-200 bg-rose-50/50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-700">At risk now</div>
                <div className="mt-1 text-[13px] text-slate-600">Tasks that already look exposed to AI.</div>
              </div>
              <div className="rounded-full border border-rose-200 bg-white px-3 py-1 font-mono text-[11px] text-rose-700">{atRiskTasks.length}</div>
            </div>
            <div className="mt-4 space-y-3">
              {atRiskTasks.length === 0 ? (
                <div className="rounded-[18px] border border-dashed border-rose-200 bg-white px-4 py-8 text-center text-[13px] text-slate-500">
                  No listed tasks are marked at risk right now.
                </div>
              ) : (
                atRiskTasks.map((task) => <TaskListItem key={`${role.code}-${task.task}`} task={task} />)
              )}
            </div>
          </section>

          <section className="rounded-[22px] border border-emerald-200 bg-emerald-50/50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">Still human</div>
                <div className="mt-1 text-[13px] text-slate-600">Tasks that still look human-led for now.</div>
              </div>
              <div className="rounded-full border border-emerald-200 bg-white px-3 py-1 font-mono text-[11px] text-emerald-700">{stillHumanTasks.length}</div>
            </div>
            <div className="mt-4 space-y-3">
              {stillHumanTasks.length === 0 ? (
                <div className="rounded-[18px] border border-dashed border-emerald-200 bg-white px-4 py-8 text-center text-[13px] text-slate-500">
                  No listed tasks stay clearly human-led in this role.
                </div>
              ) : (
                stillHumanTasks.map((task) => <TaskListItem key={`${role.code}-${task.task}`} task={task} />)
              )}
            </div>
          </section>
        </div>
      </SectionCard>
    </motion.div>
  );
}
