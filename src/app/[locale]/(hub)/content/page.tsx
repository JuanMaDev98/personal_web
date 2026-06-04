import { setRequestLocale, getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText } from 'lucide-react';

type Props = { params: { locale: string } };

export const dynamic = 'force-dynamic';

export default async function HubContent({ params }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: 'hub.content' });
  const content = await prisma.siteContent.findMany({ orderBy: { key: 'asc' } });

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
      </div>

      <div className="space-y-4">
        {content.map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle className="text-base font-mono">{c.key}</CardTitle>
              <CardDescription>
                Editable. Última actualización:{' '}
                {new Date(c.updatedAt).toLocaleString(params.locale === 'es' ? 'es-ES' : 'en-US')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted/30 p-3 rounded-md overflow-x-auto scrollbar-thin">
                {JSON.stringify(c.value, null, 2)}
              </pre>
            </CardContent>
          </Card>
        ))}
        {content.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <div className="text-muted-foreground text-sm">No hay contenido dinámico todavía</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
