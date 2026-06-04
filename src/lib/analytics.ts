import { headers } from 'next/headers';

const VISITOR_COOKIE = 'jmc_vid';
const ATTR_COOKIE = 'jmc_attr';

export function getVisitorId(): string | null {
  const h = headers();
  const cookieHeader = h.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`${VISITOR_COOKIE}=([^;]+)`));
  return match ? match[1] : null;
}

export function getAttribution(): { site?: string; ref?: string } {
  const h = headers();
  const cookieHeader = h.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`${ATTR_COOKIE}=([^;]+)`));
  if (!match) return {};
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return {};
  }
}

export type AnalyticsEvent = {
  type:
    | 'pageview'
    | 'click_cta'
    | 'outbound_link'
    | 'conversion'
    | 'form_submit'
    | 'promo_impression'
    | 'promo_click'
    | 'chat_message'
    | 'tool_usage'
    | 'search';
  path?: string;
  props?: Record<string, unknown>;
};

export async function trackServerEvent(
  siteSlug: string,
  event: AnalyticsEvent,
): Promise<void> {
  // Llamar a /api/track internamente para centralizar la insercion
  // En el servidor usamos Prisma directamente para evitar HTTP loop
  const { prisma } = await import('./db');
  const h = headers();

  try {
    await prisma.event.create({
      data: {
        siteId: siteSlug,
        type: event.type,
        path: event.path,
        locale: h.get('x-locale') ?? undefined,
        referrer: h.get('referer') ?? undefined,
        utmSource: h.get('x-utm-source') ?? undefined,
        utmMedium: h.get('x-utm-medium') ?? undefined,
        utmCampaign: h.get('x-utm-campaign') ?? undefined,
        props: event.props as any,
        visitorId: getVisitorId() ?? undefined,
      },
    });
  } catch (err) {
    console.error('[analytics] trackServerEvent failed:', err);
  }
}
