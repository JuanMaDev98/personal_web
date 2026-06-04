import { setRequestLocale, getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatNumber } from '@/lib/utils';
import { Eye, TrendingUp, Users, MousePointerClick } from 'lucide-react';

type Props = { params: { locale: string } };

export const dynamic = 'force-dynamic';

export default async function HubAnalytics({ params }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: 'hub.analytics' });

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [byType, bySite, byDay, topPaths] = await Promise.all([
    prisma.event.groupBy({
      by: ['type'],
      where: { createdAt: { gte: sevenDaysAgo } },
      _count: { _all: true },
    }),
    prisma.event.groupBy({
      by: ['siteId'],
      where: { type: 'pageview', createdAt: { gte: sevenDaysAgo } },
      _count: { _all: true },
      orderBy: { _count: { siteId: 'desc' } },
    }),
    prisma.$queryRaw<{ day: Date; count: bigint }[]>`
      SELECT DATE("createdAt") as day, COUNT(*) as count
      FROM "Event"
      WHERE "createdAt" >= ${sevenDaysAgo} AND type = 'pageview'
      GROUP BY DATE("createdAt")
      ORDER BY day ASC
    `,
    prisma.event.groupBy({
      by: ['path'],
      where: { type: 'pageview', createdAt: { gte: sevenDaysAgo }, path: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { path: 'desc' } },
      take: 10,
    }),
  ]);

  const totalPageviews = byType.find((b) => b.type === 'pageview')?._count._all ?? 0;
  const totalConversions = byType.find((b) => b.type === 'conversion')?._count._all ?? 0;
  const totalClicks = byType.find((b) => b.type === 'click_cta')?._count._all ?? 0;
  const uniqueVisitors = await prisma.event.findMany({
    where: { createdAt: { gte: sevenDaysAgo } },
    distinct: ['visitorId'],
    select: { visitorId: true },
  });

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Eye} label={t('visits')} value={formatNumber(totalPageviews)} />
        <StatCard icon={Users} label={t('uniqueVisitors')} value={formatNumber(uniqueVisitors.filter((v) => v.visitorId).length)} />
        <StatCard icon={MousePointerClick} label="CTA clicks" value={formatNumber(totalClicks)} />
        <StatCard icon={TrendingUp} label={t('conversions')} value={formatNumber(totalConversions)} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tráfico por sitio</CardTitle>
            <CardDescription>{t('last7Days')}</CardDescription>
          </CardHeader>
          <CardContent>
            {bySite.length === 0 ? (
              <div className="text-sm text-muted-foreground py-8 text-center">Sin datos</div>
            ) : (
              <div className="space-y-3">
                {bySite.map((s) => {
                  const max = bySite[0]?._count._all ?? 1;
                  const pct = (s._count._all / max) * 100;
                  return (
                    <div key={s.siteId}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium">{s.siteId}</span>
                        <span className="text-muted-foreground">{formatNumber(s._count._all)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-gradient-brand"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('topPages')}</CardTitle>
            <CardDescription>{t('last7Days')}</CardDescription>
          </CardHeader>
          <CardContent>
            {topPaths.length === 0 ? (
              <div className="text-sm text-muted-foreground py-8 text-center">Sin datos</div>
            ) : (
              <div className="space-y-2">
                {topPaths.map((p) => (
                  <div
                    key={p.path ?? '/'}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-accent/5 text-sm"
                  >
                    <code className="text-xs">{p.path}</code>
                    <span className="text-muted-foreground">{p._count._all}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div className="font-display text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
      </CardContent>
    </Card>
  );
}
