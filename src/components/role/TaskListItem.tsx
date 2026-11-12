import { getSimpleTaskLabel, getSimpleTaskTone } from '@/lib/oscaIndex';
import { getTaskToolList } from '@/lib/roles/tooling';
import type { TaskAssessment } from '@/types/role';

type TaskListItemProps = {
  task: TaskAssessment;
};

export default function TaskListItem({ task }: TaskListItemProps) {
  const tone = getSimpleTaskTone(task);
  const tools = getTaskToolList(task, 4);
  const hiddenToolCount = Math.max(new Set(task.tools).size - tools.length, 0);

  return (
    <div className="rounded-[20px] border border-slate-200 bg-slate-50/80 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 text-[14px] leading-7 text-slate-900">{task.task}</div>
        <span
          className="inline-flex rounded-full border px-3 py-1 text-[11px] font-medium"
          style={{ backgroundColor: tone.tint, color: tone.fill, borderColor: tone.border }}
        >
          {getSimpleTaskLabel(task)}
        </span>
      </div>
      {tools.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {tools.map((tool) => (
            <span key={`${task.task}-${tool}`} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-600 shadow-sm">
              {tool}
            </span>
          ))}
          {hiddenToolCount > 0 ? (
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-500 shadow-sm">+{hiddenToolCount} more</span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
