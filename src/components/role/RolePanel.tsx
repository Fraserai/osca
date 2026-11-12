'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import TimelineBadge from '@/components/shared/TimelineBadge';
import TaskListItem from '@/components/role/TaskListItem';
import RiskBadge from '@/components/shared/RiskBadge';
import ScorePill from '@/components/shared/ScorePill';
import { compactCurrency, getSimpleTaskState } from '@/lib/oscaIndex';
import { getRolePath } from '@/lib/roles/paths';
import { getRoleReportSummary } from '@/lib/roles/narrative';
import { getRelatedRoles } from '@/lib/roles/related';
import { getRoleShareUrl } from '@/lib/roles/share';
import { getRoleToolDrivers } from '@/lib/roles/tooling';
import type { Role } from '@/types/role';

type RolePanelProps = {
  role: Role | null;
  roles: Role[];
  onClose: () => void;
  onSelectRole: (role: Role) => void;
};

export default function RolePanel({ role, roles, onClose, onSelectRole }: RolePanelProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');

  useEffect(() => {
    if (!role) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeydown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [onClose, role]);

  useEffect(() => {
    setCopyState('idle');
  }, [role?.code]);

  const relatedRoles = useMemo(() => {
    if (!role) {
      return [];
    }

    return getRelatedRoles(role, roles);
  }, [role, roles]);

  if (!role) {
    return null;
  }

  const atRiskTasks = role.taskAssessments.filter((task) => getSimpleTaskState(task) === 'at_risk_now');
  const stillHumanTasks = role.taskAssessments.filter((task) => getSimpleTaskState(task) === 'not_yet');
  const toolDrivers = getRoleToolDrivers(role, 6);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(getRoleShareUrl(role.code));
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 1800);
    } catch {
      setCopyState('error');
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-slate-900/22 backdrop-blur-[2px]"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
      >
        <motion.div
          className="fixed inset-x-0 bottom-0 h-[88vh] rounded-t-[30px] border border-slate-200 bg-[#fbfbfd] p-5 shadow-[0_-20px_60px_rgba(15,23,42,0.18)] sm:inset-y-0 sm:right-0 sm:left-auto sm:h-full sm:w-[600px] sm:rounded-none sm:border-l sm:border-t-0"
          onClick={(event) => event.stopPropagation()}
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">OSCA {role.code}</div>
                <h2 className="mt-3 font-serif-display text-[34px] leading-[0.95] text-slate-900">{role.title}</h2>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <RiskBadge score={role.score} />
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-600 shadow-sm">
                    {role.taskAutomationCount}/{role.taskAssessments.length} tasks at risk now
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <ScorePill score={role.score} className="px-4 py-2 text-[16px]" />
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[12px] text-slate-600 transition hover:border-slate-300"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="mt-5 flex-1 space-y-5 overflow-y-auto pr-1">
              <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Quick read</div>
                <p className="mt-3 text-[14px] leading-7 text-slate-700">{getRoleReportSummary(role)}</p>
                {toolDrivers.length > 0 ? (
                  <div className="mt-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">AI tools and models in play today</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {toolDrivers.map((tool) => (
                        <span key={`${role.code}-panel-${tool.label}`} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] text-slate-600">
                          {tool.label}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Risk window</div>
                    <div className="mt-2">
                      <TimelineBadge timeline={role.timeline} />
                    </div>
                  </div>
                  <div className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Salary estimate</div>
                    <div className="mt-2 text-[14px] font-semibold text-slate-900">{compactCurrency(role.salary)}/yr</div>
                  </div>
                  <div className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Tasks at risk now</div>
                    <div className="mt-2 text-[14px] font-semibold text-slate-900">
                      {role.taskAutomationCount}/{role.taskAssessments.length}
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link
                    href={getRolePath(role.code)}
                    className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-[12px] text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
                  >
                    Open full report
                  </Link>
                  <button
                    type="button"
                    onClick={copyLink}
                    className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-[12px] text-slate-600 transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900"
                  >
                    {copyState === 'copied' ? 'Link copied' : copyState === 'error' ? 'Copy blocked' : 'Copy link'}
                  </button>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">At risk now</div>
                <div className="mt-2 text-[13px] text-slate-500">{atRiskTasks.length} tasks already look exposed to AI.</div>
                <div className="mt-4 space-y-3">
                  {atRiskTasks.length === 0 ? (
                    <div className="rounded-[18px] border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-[13px] text-slate-500">
                      No listed tasks are marked at risk right now.
                    </div>
                  ) : (
                    atRiskTasks.slice(0, 5).map((task) => <TaskListItem key={`${role.code}-risk-${task.task}`} task={task} />)
                  )}
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Still human</div>
                <div className="mt-2 text-[13px] text-slate-500">{stillHumanTasks.length} tasks still look human-led for now.</div>
                <div className="mt-4 space-y-3">
                  {stillHumanTasks.length === 0 ? (
                    <div className="rounded-[18px] border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-[13px] text-slate-500">
                      No listed tasks stay clearly human-led in this role.
                    </div>
                  ) : (
                    stillHumanTasks.slice(0, 5).map((task) => <TaskListItem key={`${role.code}-human-${task.task}`} task={task} />)
                  )}
                </div>
              </div>

              {relatedRoles.length > 0 ? (
                <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Related roles</div>
                  <div className="mt-2 text-[13px] text-slate-500">Open nearby occupations in the same family without losing your place.</div>
                  <div className="mt-4 space-y-3">
                    {relatedRoles.map((relatedRole) => (
                      <button
                        key={relatedRole.code}
                        type="button"
                        onClick={() => onSelectRole(relatedRole)}
                        className="flex w-full items-start justify-between gap-3 rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:border-slate-300 hover:bg-white"
                      >
                        <span className="min-w-0">
                          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-400">OSCA {relatedRole.code}</span>
                          <span className="mt-1 block text-[14px] font-semibold text-slate-900">{relatedRole.title}</span>
                        </span>
                        <div className="flex shrink-0 flex-col items-end gap-2">
                          <RiskBadge score={relatedRole.score} className="hidden sm:inline-flex" />
                          <ScorePill score={relatedRole.score} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
