'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { formatDate } from '@/lib/utils';

type Achievement = {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  category: string | null;
};

type Props = {
  achievements: Achievement[];
};

export function AchievementsTimeline({ achievements }: Props) {
  const t = useTranslations('achievements');

  if (achievements.length === 0) {
    return (
      <section className="py-20 md:py-28">
        <div className="container text-center text-muted-foreground">
          {t('noItems')}
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-28">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">{t('title')}</h2>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </motion.div>

        <div className="relative">
          {/* Línea vertical */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-secondary/30 to-transparent" />

          <div className="space-y-8">
            {achievements.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex items-center gap-6 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Dot */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary ring-4 ring-background z-10" />

                <div className="ml-16 md:ml-0 md:w-1/2">
                  <div
                    className={`glass rounded-xl p-5 border border-border/50 hover:border-primary/30 transition-colors ${
                      i % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Trophy className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                          {formatDate(a.date)}
                          {a.category && ` · ${a.category}`}
                        </div>
                        <h3 className="font-display font-semibold text-lg mb-1">{a.title}</h3>
                        {a.description && (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {a.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
