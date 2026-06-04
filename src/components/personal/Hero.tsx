'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Youtube, Send, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetricCounter } from '@/components/shared/MetricCounter';
import { MetricSource } from '@prisma/client';

type MetricData = {
  source: MetricSource;
  value: bigint;
  displayValue: string | null;
};

const YOUTUBE_URL =
  'https://www.youtube.com/channel/UCElCoULDa68Yzqi1slcWvKA?sub_confirmation=1';
const TELEGRAM_URL = 'https://t.me/JuanMaCryptoYoutube';

type Props = {
  metrics: MetricData[];
};

export function Hero({ metrics }: Props) {
  const t = useTranslations('hero');
  const tBrand = useTranslations('brand');

  const youtube = metrics.find((m) => m.source === MetricSource.YOUTUBE_SUBSCRIBERS);
  const tgChannel = metrics.find((m) => m.source === MetricSource.TELEGRAM_CHANNEL_MEMBERS);
  const tgGroup = metrics.find((m) => m.source === MetricSource.TELEGRAM_GROUP_MEMBERS);
  const wa = metrics.find((m) => m.source === MetricSource.WHATSAPP_MEMBERS);

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Background decorations */}
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-widest text-muted-foreground mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {t('badge')}
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-[1.05]">
            <span className="gradient-text">{tBrand('tagline')}</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            {t('subtitle')}
          </p>

          {/* CTAs — orden: YouTube primario, Telegram secundario, Contacto terciario */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="xl"
              variant="gradient"
              data-cta="hero-primary"
              data-cta-id="hero-cta-youtube"
              data-cta-dest={YOUTUBE_URL}
            >
              <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" data-outbound="youtube">
                <Youtube className="mr-2 h-5 w-5" />
                {t('ctaPrimary')}
              </a>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              data-cta="hero-secondary"
              data-cta-id="hero-cta-telegram"
              data-cta-dest={TELEGRAM_URL}
            >
              <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" data-outbound="telegram-group">
                <Send className="mr-2 h-5 w-5" />
                {t('ctaSecondary')}
              </a>
            </Button>
            <Button
              asChild
              size="xl"
              variant="ghost"
              data-cta="hero-tertiary"
              data-cta-id="hero-cta-contact"
            >
              <a href="#contact" data-cta-dest="/contact">
                <Briefcase className="mr-2 h-5 w-5" />
                {t('ctaTertiary')}
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Métricas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 md:mt-20"
        >
          <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-4">
            {t('statsSubtitle')}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            <StatBox
              value={youtube?.value ?? BigInt(0)}
              display={youtube?.displayValue}
              label={tBrand('name').split(' ')[0]}
              icon="youtube"
            />
            <StatBox
              value={tgChannel?.value ?? BigInt(0)}
              display={tgChannel?.displayValue}
              label="Telegram"
              icon="telegram"
            />
            <StatBox
              value={tgGroup?.value ?? BigInt(0)}
              display={tgGroup?.displayValue}
              label="Comunidad"
              icon="telegram"
            />
            <StatBox
              value={wa?.value ?? BigInt(0)}
              display={wa?.displayValue}
              label="WhatsApp"
              icon="whatsapp"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatBox({
  value,
  display,
  label,
  icon,
}: {
  value: bigint;
  display?: string | null;
  label: string;
  icon: 'youtube' | 'telegram' | 'whatsapp';
}) {
  const iconColors = {
    youtube: 'text-red-500',
    telegram: 'text-sky-400',
    whatsapp: 'text-emerald-400',
  };

  return (
    <div className="glass rounded-xl p-4 text-center hover:border-primary/30 transition-colors">
      <div className={`text-xs uppercase tracking-wider ${iconColors[icon]} mb-1`}>{label}</div>
      <div className="font-display text-2xl md:text-3xl font-bold">
        {value > BigInt(0) ? (
          <MetricCounter value={value} />
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </div>
      {value === BigInt(0) && (
        <div className="text-[10px] text-muted-foreground mt-1">Actualizando…</div>
      )}
    </div>
  );
}
