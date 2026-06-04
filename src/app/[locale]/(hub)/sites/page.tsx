import { setRequestLocale, getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';

type Props = { params: { locale: string } };

export const dynamic = 'force-dynamic';

export default async function HubSites({ params }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: 'hub.sites' });
  const sites = await prisma.site.findMany({ orderBy: { createdAt: 'asc' } });

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    {t('name')}
                  </th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    {t('subdomain')}
                  </th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    {t('status')}
                  </th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    {t('lastUpdate')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sites.map((s) => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-accent/5">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Globe className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{s.name}</div>
                          {s.description && (
                            <div className="text-xs text-muted-foreground">{s.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <code className="text-xs text-secondary">{s.subdomain}</code>
                    </td>
                    <td className="p-4">
                      <Badge variant={s.status === 'ACTIVE' ? 'success' : 'outline'}>
                        {s.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {new Date(s.updatedAt).toLocaleDateString(params.locale === 'es' ? 'es-ES' : 'en-US')}
                    </td>
                  </tr>
                ))}
                {sites.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground text-sm">
                      No hay sitios todavía
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
