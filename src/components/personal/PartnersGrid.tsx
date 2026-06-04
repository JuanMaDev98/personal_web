'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Partner = {
  id: string;
  name: string;
  logo: string | null;
  website: string | null;
  isFeatured: boolean;
};

type Props = {
  partners: Partner[];
};

export function PartnersGrid({ partners }: Props) {
  const t = useTranslations('partners');

  if (partners.length === 0) {
    return (
      <section className="py-20 md:py-28">
        <div className="container text-center text-muted-foreground">
          Próximamente partners destacados.
        </div>
      </section>
    );
  }

  return (
    <section id="partners" className="py-20 md:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">{t('title')}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t('subtitle')}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {partners.map((p, i) => (
            <motion.a
              key={p.id}
              href={p.website ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              data-cta="partner-card"
              data-cta-id={`partner-${p.id}`}
              data-cta-dest={p.website ?? ''}
              data-outbound="partner"
              className="group block"
            >
              <Card className="p-6 glass hover:border-primary/50 transition-all h-full">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {p.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.logo}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-display font-bold text-xl">{p.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display font-semibold text-lg truncate">{p.name}</h3>
                      {p.isFeatured && <Badge variant="accent">Featured</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1 group-hover:text-primary transition-colors">
                      {t('visitWebsite')}
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.a>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-10">{t('noMore')}</p>
      </div>
    </section>
  );
}
