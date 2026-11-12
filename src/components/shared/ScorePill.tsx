import { getRiskTone, getSimpleRiskScore } from '@/lib/oscaIndex';

export default function ScorePill({ score, className = '' }: { score: number; className?: string }) {
  const tone = getRiskTone(score);
  const simpleRisk = getSimpleRiskScore(score);

  return (
    <span
      className={`inline-flex min-w-[56px] items-center justify-center rounded-full px-3 py-1.5 font-mono text-[12px] font-bold shadow-sm ${className}`.trim()}
      style={{ backgroundColor: tone.fill, color: tone.text }}
    >
      {simpleRisk}
    </span>
  );
}
