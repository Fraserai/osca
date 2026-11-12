import { getTimelineTone } from '@/lib/oscaIndex';
import type { Role } from '@/types/role';

export default function TimelineBadge({ timeline, className = '' }: { timeline: Role['timeline']; className?: string }) {
  const tone = getTimelineTone(timeline);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] transition duration-200 hover:-translate-y-0.5 ${className}`.trim()}
      style={{ backgroundColor: tone.tint, color: tone.fill, borderColor: tone.border }}
    >
      {timeline === 'Now' ? 'Now' : timeline}
    </span>
  );
}

