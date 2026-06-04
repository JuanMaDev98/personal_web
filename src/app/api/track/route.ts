import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, path, props } = body;

    if (!type) {
      return NextResponse.json({ error: 'type required' }, { status: 400 });
    }

    const h = headers();
    const cookieHeader = req.headers.get('cookie') || '';
    const visitorMatch = cookieHeader.match(/jmc_vid=([^;]+)/);
    const visitorId = visitorMatch?.[1];

    const referer = h.get('referer') || req.headers.get('referer') || undefined;

    // Site: detectar del referer o path
    const url = req.headers.get('x-site-slug') || detectSite(path, referer);

    await prisma.event.create({
      data: {
        siteId: url,
        type,
        path: path ?? undefined,
        referrer: referer ?? undefined,
        locale: h.get('x-locale') ?? undefined,
        props: props ?? undefined,
        visitorId: visitorId ?? undefined,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[api/track]', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}

function detectSite(path?: string, referer?: string): string {
  if (path?.includes('/hub')) return 'hub';
  if (path?.includes('/blog')) return 'blog';
  if (path?.includes('/sfl')) return 'sfl';
  if (path?.includes('/tracker')) return 'tracker';
  if (path?.includes('/eldoria')) return 'eldoria';
  if (path?.includes('/tools')) return 'tools';
  if (referer?.includes('hub.')) return 'hub';
  if (referer?.includes('blog.')) return 'blog';
  return 'personal';
}
