import { NextRequest, NextResponse } from 'next/server';
import { refreshAllMetrics } from '@/lib/metrics';

export async function GET(req: NextRequest) {
  // Verificar secret
  const secret = req.nextUrl.searchParams.get('secret');
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const result = await refreshAllMetrics();
    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      ...result,
    });
  } catch (err) {
    console.error('[api/cron/refresh-metrics]', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
