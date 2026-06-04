'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

type Testimonial = {
  id: string;
  authorName: string;
  authorRole: string | null;
  authorPhoto: string | null;
  content: string;
  category: 'PARTNER' | 'CREATOR' | 'COMMUNITY';
};

type Props = {
  testimonials: Testimonial[];
};

export function TestimonialsCarousel({ testimonials }: Props) {
  const t = useTranslations('testimonials');

  if (testimonials.length === 0) {
    return null;
  }

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
          <p className="text-muted-foreground max-w-xl mx-auto">{t('subtitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((tm, i) => (
            <motion.div
              key={tm.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-6 glass h-full flex flex-col">
                <Quote className="h-8 w-8 text-primary/30 mb-3" />
                <p className="text-sm leading-relaxed text-foreground/90 flex-1 mb-6">
                  {tm.content}
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  <Avatar>
                    <AvatarImage src={tm.authorPhoto ?? ''} alt={tm.authorName} />
                    <AvatarFallback>
                      {tm.authorName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{tm.authorName}</div>
                    {tm.authorRole && (
                      <div className="text-xs text-muted-foreground truncate">{tm.authorRole}</div>
                    )}
                  </div>
                  <Badge
                    variant={
                      tm.category === 'PARTNER'
                        ? 'accent'
                        : tm.category === 'CREATOR'
                          ? 'secondary'
                          : 'default'
                    }
                  >
                    {t(`from${tm.category.charAt(0)}${tm.category.slice(1).toLowerCase()}` as any)}
                  </Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
