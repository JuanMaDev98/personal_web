import { setRequestLocale, getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Handshake, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = { params: { locale: string } };

export const dynamic = 'force-dynamic';

export default async function HubPartners({ params }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: 'hub.partners' });
  const partners = await prisma.partner.findMany({
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'asc' }],
  });

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                  {p.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.logo} alt={p.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <Handshake className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{p.name}</div>
                  <Badge variant={p.status === 'ACTIVE' ? 'success' : 'outline'} className="mt-1">
                    {p.status}
                  </Badge>
                </div>
              </div>
              {p.website && (
                <a
                  href={p.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                >
                  {p.website} <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {p.notes && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{p.notes}</p>
              )}
            </CardContent>
          </Card>
        ))}
        {partners.length === 0 && (
          <div className="col-span-full p-8 text-center text-muted-foreground text-sm">
            No hay partners todavía
          </div>
        )}
      </div>
    </div>
  );
}
