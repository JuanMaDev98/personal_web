'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { formatNumber } from '@/lib/utils';

type Props = {
  value: number | bigint;
  duration?: number;
  suffix?: string;
  className?: string;
};

export function MetricCounter({ value, duration = 1.5, suffix, className }: Props) {
  const [display, setDisplay] = useState(0);
  const target = typeof value === 'bigint' ? Number(value) : value;

  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const animate = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      {formatNumber(display)}
      {suffix}
    </motion.span>
  );
}
