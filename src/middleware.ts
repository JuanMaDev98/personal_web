import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { locales, defaultLocale } from '@/lib/i18n';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

const HUB_HOSTS = new Set(['hub', 'hub.localhost']);

function getHost(req: NextRequest): string {
  const host = req.headers.get('host') ?? '';
  return host.split(':')[0].toLowerCase();
}

function getSubdomain(host: string): string {
  const parts = host.split('.');
  if (parts.length < 2) return '';
  if (parts[parts.length - 1] === 'localhost') {
    return parts.length > 1 ? parts[0] : '';
  }
  if (host.endsWith('.manko.blog')) {
    return host.replace('.manko.blog', '');
  }
  return '';
}

function isHubHost(host: string): boolean {
  const sub = getSubdomain(host);
  return HUB_HOSTS.has(sub);
}

function isHubPath(pathname: string): boolean {
  const stripped = pathname.replace(/^\/(es|en)/, '') || '/';
  return stripped.startsWith('/hub');
}

export default auth((req) => {
  const host = getHost(req);
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // 1) Hub subdominio: forzar /hub/* y proteger
  if (isHubHost(host)) {
    const stripped = pathname.replace(/^\/(es|en)/, '') || '/';
    if (!stripped.startsWith('/hub')) {
      const url = req.nextUrl.clone();
      url.pathname = `/${defaultLocale}/hub`;
      return NextResponse.redirect(url);
    }
    if (!stripped.startsWith('/hub/login') && !isLoggedIn) {
      const url = req.nextUrl.clone();
      url.pathname = `/${defaultLocale}/hub/login`;
      return NextResponse.redirect(url);
    }
    return intlMiddleware(req);
  }

  // 2) Si NO estamos en hub host y el path es /hub/*, redirigir al subdominio
  if (!isHubHost(host) && isHubPath(pathname)) {
    if (pathname.includes('/hub/login') && !isLoggedIn) {
      // Permitir login en path /hub/login antes de redirigir
      return intlMiddleware(req);
    }
    if (!isLoggedIn && pathname.includes('/hub/login')) {
      return intlMiddleware(req);
    }
    const url = req.nextUrl.clone();
    url.host = `hub.${host}`;
    return NextResponse.redirect(url);
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
