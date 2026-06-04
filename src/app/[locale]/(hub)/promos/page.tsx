import { setRequestLocale, getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone } from 'lucide-react';

type Props = { params: { locale: string } };

export const dynamic = 'force-dynamic';

export default async function HubPromos({ params }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: 'hub.promos' });
  const promos = await prisma.promo.findMany({
    include: { partner: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
      </div>

      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Megaphone className="h-7 w-7 text-muted-foreground" />
          </div>
          <CardTitle className="mb-2 text-xl">Gestor de promociones</CardTitle>
          <CardDescription className="max-w-md mx-auto">
            {promos.length === 0
              ? 'No hay promociones todavía. CRUD completo se implementará en la siguiente fase.'
              : `${promos.length} promo(s) encontrada(s). El editor completo se implementará en la siguiente fase.`}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
