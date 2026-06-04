'use client';

import { useTranslations } from 'next-intl';
import { Youtube, Send, MessageCircle, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

const SOCIALS = [
  {
    key: 'youtube' as const,
    href: 'https://www.youtube.com/channel/UCElCoULDa68Yzqi1slcWvKA?sub_confirmation=1',
    icon: Youtube,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
  {
    key: 'telegramChannel' as const,
    href: 'https://t.me/JuanMaYoutube',
    icon: Send,
    color: 'text-sky-400',
    bg: 'bg-sky-400/10',
  },
  {
    key: 'telegramGroup' as const,
    href: 'https://t.me/JuanMaCryptoYoutube',
    icon: MessageCircle,
    color: 'text-sky-300',
    bg: 'bg-sky-300/10',
  },
  {
    key: 'whatsapp' as const,
    href: 'https://chat.whatsapp.com/IIK0cfzMj8qDAv8Zhcko9q',
    icon: Phone,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
];

type Props = {
  variant?: 'grid' | 'inline';
};

export function SocialLinks({ variant = 'grid' }: Props) {
  const t = useTranslations('social');

  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap gap-2">
        {SOCIALS.map((s) => {
          const Icon = s.icon;
          return (
            <a
              key={s.key}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="social-inline"
              data-cta-id={`social-${s.key}`}
              data-outbound={s.key}
              className={`inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1.5 text-sm hover:${s.bg} transition-colors`}
            >
              <Icon className={`h-4 w-4 ${s.color}`} />
              <span>{t(s.key)}</span>
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {SOCIALS.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.a
            key={s.key}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="social-card"
            data-cta-id={`social-card-${s.key}`}
            data-outbound={s.key}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="group"
          >
            <Card className="p-5 glass hover:border-primary/50 transition-all duration-300 h-full">
              <div
                className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
              >
                <Icon className={`h-6 w-6 ${s.color}`} />
              </div>
              <div className="text-sm font-medium">{t(s.key)}</div>
              <div className="text-xs text-muted-foreground mt-1">→</div>
            </Card>
          </motion.a>
        );
      })}
    </div>
  );
}
