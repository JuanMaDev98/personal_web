'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Gamepad2, Sparkles, Coins } from 'lucide-react';
import { Card } from '@/components/ui/card';

const PILLARS = [
  { key: 'play' as const, icon: Gamepad2, color: 'from-primary to-emerald-400' },
  { key: 'fun' as const, icon: Sparkles, color: 'from-accent to-pink-400' },
  { key: 'invoice' as const, icon: Coins, color: 'from-secondary to-cyan-400' },
];

export function SloganTriad() {
  const t = useTranslations('slogan');

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            <span className="gradient-text">{t('title')}</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -6 }}
              >
                <Card className="relative p-8 glass overflow-hidden h-full">
                  {/* Number badge */}
                  <div className="absolute top-4 right-4 font-display text-6xl font-bold text-primary/10 select-none">
                    0{i + 1}
                  </div>
                  {/* Gradient accent */}
                  <div
                    className={`absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br ${p.color} opacity-20 blur-2xl`}
                  />
                  <div className="relative">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-5 shadow-lg`}
                    >
                      <Icon className="h-7 w-7 text-background" />
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl font-bold mb-3">
                      {t(`${p.key}.title`)}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{t(`${p.key}.desc`)}</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
