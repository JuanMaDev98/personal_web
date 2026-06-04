import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';
import { auth } from '@/lib/auth';
import { redirect } from '@/lib/navigation';

type Props = { params: { locale: string } };

export const dynamic = 'force-dynamic';

export default async function HubSettings({ params }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: 'hub.settings' });
  const session = await auth();
  if (!session?.user) redirect('/hub/login', { locale: params.locale as any });

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <SettingsIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{t('profile')}</CardTitle>
                <CardDescription>Información de tu cuenta</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Nombre: </span>
              <span className="font-medium">{session.user.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Email: </span>
              <span className="font-medium">{session.user.email}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Rol: </span>
              <span className="font-medium text-primary">{(session.user as any).role}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('brand')}</CardTitle>
            <CardDescription>Datos básicos de marca</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Nombre: </span>
              <span className="font-medium">JuanMa Crypto</span>
            </div>
            <div>
              <span className="text-muted-foreground">Dominio raíz: </span>
              <code className="text-secondary text-xs">manko.blog</code>
            </div>
            <div>
              <span className="text-muted-foreground">Eslogan: </span>
              <span className="font-medium">Jugamos, nos Divertimos y Facturamos</span>
            </div>
            <div className="text-xs text-muted-foreground mt-3">
              Para cambiar estos valores, edita <code className="text-secondary">tailwind.config.ts</code>,{' '}
              <code className="text-secondary">messages/*.json</code> y los archivos del HUB.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('apiKeys')}</CardTitle>
          <CardDescription>
            Configura las API keys en <code className="text-secondary">.env.local</code> para activar
            el auto-refresh de métricas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>
              <code className="text-secondary">YOUTUBE_API_KEY</code> — YouTube Data API v3
            </li>
            <li>
              <code className="text-secondary">TELEGRAM_BOT_TOKEN</code> — Bot de Telegram (añadir a
              canales/grupos como admin)
            </li>
            <li>
              <code className="text-secondary">DISCORD_BOT_TOKEN</code> — Bot de Discord
            </li>
            <li>
              <code className="text-secondary">RESEND_API_KEY</code> — Emails transaccionales
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
