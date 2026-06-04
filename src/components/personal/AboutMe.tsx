'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Award, Users, BarChart3, Wrench } from 'lucide-react';
import { Card } from '@/components/ui/card';

const HIGHLIGHTS = [
  { key: 'specialist' as const, icon: Award, color: 'text-primary' },
  { key: 'audience' as const, icon: Users, color: 'text-secondary' },
  { key: 'approach' as const, icon: BarChart3, color: 'text-accent' },
  { key: 'tools' as const, icon: Wrench, color: 'text-yellow-400' },
];

type Props = {
  bio: string;
};

export function AboutMe({ bio }: Props) {
  const t = useTranslations('about');

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-center">
          {/* Avatar placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square max-w-sm mx-auto w-full"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-brand opacity-30 blur-2xl" />
            <div className="relative w-full h-full rounded-3xl glass-strong border-2 border-primary/30 flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-brand flex items-center justify-center text-4xl font-display font-bold text-primary-foreground mb-3">
                  JM
                </div>
                <div className="text-sm text-muted-foreground">Avatar placeholder</div>
                <div className="text-xs text-muted-foreground/60 mt-1">Sustituir en /public/images/avatar.jpg</div>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary animate-glow-pulse" />
            <div className="absolute -bottom-2 -left-2 h-6 w-6 rounded-full bg-secondary animate-glow-pulse" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">{t('title')}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">{bio}</p>

            <div className="grid sm:grid-cols-2 gap-3">
              {HIGHLIGHTS.map((h, i) => {
                const Icon = h.icon;
                return (
                  <motion.div
                    key={h.key}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="p-4 glass flex items-center gap-3 hover:border-primary/30 transition-colors">
                      <Icon className={`h-5 w-5 ${h.color} flex-shrink-0`} />
                      <span className="text-sm font-medium">{t(`highlights.${h.key}`)}</span>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
