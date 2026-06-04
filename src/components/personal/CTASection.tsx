'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Youtube, Send, Briefcase, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const YOUTUBE_URL =
  'https://www.youtube.com/channel/UCElCoULDa68Yzqi1slcWvKA?sub_confirmation=1';
const TELEGRAM_URL = 'https://t.me/JuanMaCryptoYoutube';

export function CTASection() {
  const t = useTranslations('hero');

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-strong rounded-3xl p-8 md:p-14 text-center max-w-4xl mx-auto border-2 border-primary/20"
        >
          <Sparkles className="h-10 w-10 mx-auto mb-4 text-primary" />
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 text-balance">
            Únete a la aventura
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Empieza por donde tú quieras. YouTube para los videos, Telegram para la comunidad en directo.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="xl"
              variant="gradient"
              data-cta="cta-section-youtube"
              data-cta-id="cta-bottom-youtube"
            >
              <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" data-outbound="youtube">
                <Youtube className="mr-2 h-5 w-5" />
                {t('ctaPrimary')}
              </a>
            </Button>
            <Button
              asChild
              size="xl"
              variant="secondary"
              data-cta="cta-section-telegram"
              data-cta-id="cta-bottom-telegram"
            >
              <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" data-outbound="telegram-group">
                <Send className="mr-2 h-5 w-5" />
                {t('ctaSecondary')}
              </a>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              data-cta="cta-section-contact"
              data-cta-id="cta-bottom-contact"
            >
              <a href="#contact">
                <Briefcase className="mr-2 h-5 w-5" />
                {t('ctaTertiary')}
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
