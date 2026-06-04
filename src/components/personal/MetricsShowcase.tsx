'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { MetricSource } from '@prisma/client';
import { MetricCard } from './MetricCard';

type Metric = {
  source: MetricSource;
  label: string;
  value: bigint;
  displayValue: string | null;
  url: string | null;
  iconUrl: string | null;
};

type Props = {
  metrics: Metric[];
};

export function MetricsShowcase({ metrics }: Props) {
  const t = useTranslations('metrics');

  if (metrics.length === 0) return null;

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">{t('title')}</h2>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {metrics.map((m, i) => (
            <MetricCard key={m.source} metric={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
