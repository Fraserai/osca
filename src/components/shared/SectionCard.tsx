import type { CSSProperties, ReactNode } from 'react';
import { designTokens } from '@/lib/design/tokens';

type SectionCardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export default function SectionCard({ children, className, style }: SectionCardProps) {
  return (
    <section
      className={`border border-slate-200 bg-white p-6 ${className ?? ''}`.trim()}
      style={{
        borderRadius: designTokens.radii.section,
        boxShadow: designTokens.shadows.card,
        ...style
      }}
    >
      {children}
    </section>
  );
}
