import { setRequestLocale, getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Quote } from 'lucide-react';

type Props = { params: { locale: string } };

export const dynamic = 'force-dynamic';

export default async function HubTestimonials({ params }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: 'hub.testimonials' });
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {testimonials.map((tm) => (
          <Card key={tm.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <Quote className="h-6 w-6 text-primary/30" />
                <Badge
                  variant={tm.status === 'APPROVED' ? 'success' : tm.status === 'PENDING' ? 'warning' : 'danger'}
                >
                  {tm.status}
                </Badge>
              </div>
              <p className="text-sm leading-relaxed mb-4 line-clamp-4">{tm.content}</p>
              <div className="text-xs">
                <div className="font-semibold">{tm.authorName}</div>
                {tm.authorRole && <div className="text-muted-foreground">{tm.authorRole}</div>}
              </div>
            </CardContent>
          </Card>
        ))}
        {testimonials.length === 0 && (
          <div className="col-span-full p-8 text-center text-muted-foreground text-sm">
            No hay testimonios todavía
          </div>
        )}
      </div>
    </div>
  );
}
