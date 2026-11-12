import { getRiskLabel, getRiskTone } from '@/lib/oscaIndex';

export default function RiskBadge({ score, className = '' }: { score: number; className?: string }) {
  const tone = getRiskTone(score);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] ${className}`.trim()}
      style={{ backgroundColor: tone.badge, color: tone.fill, borderColor: tone.border }}
    >
      {getRiskLabel(score)}
    </span>
  );
}
