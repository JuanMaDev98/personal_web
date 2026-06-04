import { setRequestLocale, getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Inbox } from 'lucide-react';

type Props = { params: { locale: string } };

export const dynamic = 'force-dynamic';

export default async function HubFeedback({ params }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: 'hub.feedback' });
  const feedback = await prisma.feedback.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
      </div>

      {feedback.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <div className="text-muted-foreground text-sm">{t('empty')}</div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {feedback.map((f) => (
            <Card key={f.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{f.type}</Badge>
                    <Badge
                      variant={
                        f.status === 'NEW'
                          ? 'warning'
                          : f.status === 'REPLIED'
                            ? 'success'
                            : 'outline'
                      }
                    >
                      {f.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(f.createdAt).toLocaleString(params.locale === 'es' ? 'es-ES' : 'en-US')}
                  </span>
                </div>
                <pre className="text-xs bg-muted/30 p-3 rounded-md overflow-x-auto scrollbar-thin">
                  {JSON.stringify(f.payload, null, 2)}
                </pre>
                {f.email && (
                  <div className="text-xs text-muted-foreground mt-2">De: {f.email}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
