import { setRequestLocale, getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Eye, Users, Globe, Megaphone, TrendingUp, RefreshCw } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { MetricCard } from '@/components/personal/MetricCard';
import { auth } from '@/lib/auth';
import { redirect } from '@/lib/navigation';
import { refreshAllMetrics } from '@/lib/metrics';

type Props = { params: { locale: string } };

export const dynamic = 'force-dynamic';

async function refreshMetricsAction() {
  'use server';
  return await refreshAllMetrics();
}

export default async function HubDashboard({ params }: Props) {
  setRequestLocale(params.locale);
  const session = await auth();
  if (!session?.user) redirect('/hub/login', { locale: params.locale as any });

  const t = await getTranslations({ locale: params.locale, namespace: 'hub.dashboard' });

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalVisits7,
    totalVisits30,
    conversions7,
    activeSitesCount,
    activePromosCount,
    topSites,
    recentFeedback,
    metrics,
    partnersCount,
    testimonialsCount,
  ] = await Promise.all([
    prisma.event.count({
      where: { type: 'pageview', createdAt: { gte: sevenDaysAgo } },
    }),
    prisma.event.count({
      where: { type: 'pageview', createdAt: { gte: thirtyDaysAgo } },
    }),
    prisma.event.count({
      where: { type: 'conversion', createdAt: { gte: sevenDaysAgo } },
    }),
    prisma.site.count({ where: { status: 'ACTIVE' } }),
    prisma.promo.count({ where: { status: 'ACTIVE' } }),
    prisma.event.groupBy({
      by: ['siteId'],
      where: { type: 'pageview', createdAt: { gte: sevenDaysAgo } },
      _count: { _all: true },
      orderBy: { _count: { siteId: 'desc' } },
      take: 5,
    }),
    prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.metric.findMany({ orderBy: { source: 'asc' } }),
    prisma.partner.count({ where: { status: 'ACTIVE' } }),
    prisma.testimonial.count(),
  ]);

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">{t('welcome')}, {session.user.name ?? 'Admin'}</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={Eye} label={t('totalVisits')} value={formatNumber(totalVisits7)} sublabel={t('last7Days')} color="primary" />
        <KPICard icon={TrendingUp} label={t('totalConversions')} value={formatNumber(conversions7)} sublabel={t('last7Days')} color="secondary" />
        <KPICard icon={Globe} label={t('activeSites')} value={activeSitesCount.toString()} sublabel={`${partnersCount} partners`} color="accent" />
        <KPICard icon={Megaphone} label={t('activePromos')} value={activePromosCount.toString()} sublabel={`${testimonialsCount} testimonials`} color="yellow" />
      </div>

      {/* Métricas de redes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold">{t('metricsTitle')}</h2>
          <form action={refreshMetricsAction}>
            <button
              type="submit"
              className="text-xs flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
              data-cta="hub-refresh-metrics"
            >
              <RefreshCw className="h-3 w-3" />
              Refrescar ahora
            </button>
          </form>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {metrics.map((m, i) => (
            <MetricCard key={m.source} metric={m} index={i} />
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top sites */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('topSites')}</CardTitle>
            <CardDescription>{t('last7Days')}</CardDescription>
          </CardHeader>
          <CardContent>
            {topSites.length === 0 ? (
              <div className="text-sm text-muted-foreground py-8 text-center">Sin datos todavía</div>
            ) : (
              <div className="space-y-2">
                {topSites.map((s, i) => (
                  <div key={s.siteId} className="flex items-center justify-between p-2 rounded-md hover:bg-accent/5">
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-muted-foreground w-5">#{i + 1}</div>
                      <div className="text-sm font-medium">{s.siteId}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{formatNumber(s._count._all)} visits</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('recentFeedback')}</CardTitle>
            <CardDescription>Últimos mensajes recibidos</CardDescription>
          </CardHeader>
          <CardContent>
            {recentFeedback.length === 0 ? (
              <div className="text-sm text-muted-foreground py-8 text-center">No hay feedback todavía</div>
            ) : (
              <div className="space-y-3">
                {recentFeedback.map((f) => (
                  <div key={f.id} className="p-3 rounded-md bg-accent/5 text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-primary">{f.type}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(f.createdAt).toLocaleDateString(params.locale === 'es' ? 'es-ES' : 'en-US')}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {JSON.stringify(f.payload).slice(0, 120)}
                    </div>
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

function KPICard({
  icon: Icon,
  label,
  value,
  sublabel,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  sublabel: string;
  color: 'primary' | 'secondary' | 'accent' | 'yellow';
}) {
  const colorMap = {
    primary: 'text-primary bg-primary/10',
    secondary: 'text-secondary bg-secondary/10',
    accent: 'text-accent bg-accent/10',
    yellow: 'text-yellow-400 bg-yellow-400/10',
  };

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-2">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="font-display text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
        <div className="text-[10px] text-muted-foreground/60 mt-1">{sublabel}</div>
      </CardContent>
    </Card>
  );
}
