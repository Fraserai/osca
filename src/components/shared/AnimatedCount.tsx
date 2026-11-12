'use client';

import { animate, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type AnimatedCountProps = {
  value: number;
  formatValue?: (value: number) => string;
};

export default function AnimatedCount({
  value,
  formatValue = (next) => Math.round(next).toLocaleString()
}: AnimatedCountProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) {
      return;
    }

    const controls = animate(0, value, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplayValue(Math.round(latest))
    });

    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} suppressHydrationWarning>
      {formatValue(displayValue)}
    </span>
  );
}

