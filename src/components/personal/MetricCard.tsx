'use client';

import { motion } from 'framer-motion';
import { MetricCounter } from '@/components/shared/MetricCounter';
import { Card } from '@/components/ui/card';
import { Youtube, Send, MessageCircle, Phone, Hash, type LucideIcon } from 'lucide-react';
import { MetricSource } from '@prisma/client';

type Metric = {
  source: MetricSource;
  label: string;
  value: bigint;
  displayValue: string | null;
  url: string | null;
};

const ICONS: Record<string, LucideIcon> = {
  [MetricSource.YOUTUBE_SUBSCRIBERS]: Youtube,
  [MetricSource.TELEGRAM_CHANNEL_MEMBERS]: Send,
  [MetricSource.TELEGRAM_GROUP_MEMBERS]: MessageCircle,
  [MetricSource.WHATSAPP_MEMBERS]: Phone,
  [MetricSource.DISCORD_MEMBERS]: Hash,
};

const COLORS: Record<string, string> = {
  [MetricSource.YOUTUBE_SUBSCRIBERS]: 'text-red-500',
  [MetricSource.TELEGRAM_CHANNEL_MEMBERS]: 'text-sky-400',
  [MetricSource.TELEGRAM_GROUP_MEMBERS]: 'text-sky-300',
  [MetricSource.WHATSAPP_MEMBERS]: 'text-emerald-400',
  [MetricSource.DISCORD_MEMBERS]: 'text-indigo-400',
};

type Props = {
  metric: Metric;
  index: number;
};

export function MetricCard({ metric, index }: Props) {
  const Icon = ICONS[metric.source] ?? Hash;
  const color = COLORS[metric.source] ?? 'text-primary';
  const hasValue = metric.value > BigInt(0);

  const content = (
    <Card className="p-5 glass h-full hover:border-primary/30 transition-colors group">
      <div className="flex items-center justify-between mb-3">
        <Icon className={`h-5 w-5 ${color} group-hover:scale-110 transition-transform`} />
        {hasValue && (
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" title="Auto-refresh" />
        )}
      </div>
      <div className="font-display text-2xl md:text-3xl font-bold mb-1">
        {hasValue ? <MetricCounter value={metric.value} /> : <span className="text-muted-foreground">—</span>}
      </div>
      <div className="text-xs text-muted-foreground">{metric.label}</div>
    </Card>
  );

  if (metric.url) {
    return (
      <motion.a
        href={metric.url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ y: -3 }}
        data-cta="metric-card"
        data-cta-id={`metric-${metric.source}`}
        data-outbound={metric.source.toLowerCase()}
        className="block"
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      {content}
    </motion.div>
  );
}
