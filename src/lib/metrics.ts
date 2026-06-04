/**
 * Metrics fetchers — auto-refresh de subs/members desde APIs externas.
 * Cada fetcher es independiente: si una API key no esta configurada,
 * el fetcher se salta sin romper el resto del cron.
 *
 * Cron: cron-job.org llama a /api/cron/refresh-metrics?secret=XXX
 */

import { google } from 'googleapis';
import { prisma } from './db';
import { MetricSource } from '@prisma/client';

type FetcherResult = { value: number; displayValue: string; error?: string };

async function fetchYouTube(): Promise<FetcherResult | null> {
  if (!process.env.YOUTUBE_API_KEY || !process.env.YOUTUBE_CHANNEL_ID) return null;
  try {
    const youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY,
    });
    const res = await youtube.channels.list({
      id: [process.env.YOUTUBE_CHANNEL_ID],
      part: ['statistics'],
    });
    const stats = res.data.items?.[0]?.statistics;
    const subs = Number(stats?.subscriberCount ?? 0);
    return { value: subs, displayValue: subs.toLocaleString('en-US') };
  } catch (err: any) {
    return { value: 0, displayValue: '—', error: err?.message ?? 'youtube error' };
  }
}

async function fetchTelegramChannel(): Promise<FetcherResult | null> {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHANNEL_USERNAME)
    return null;
  try {
    const username = process.env.TELEGRAM_CHANNEL_USERNAME.replace('@', '');
    const res = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getChatMembersCount?chat_id=@${username}`,
    );
    const data = await res.json();
    if (!data.ok) throw new Error(data.description ?? 'tg channel error');
    return { value: data.result, displayValue: data.result.toLocaleString('en-US') };
  } catch (err: any) {
    return { value: 0, displayValue: '—', error: err?.message ?? 'tg channel error' };
  }
}

async function fetchTelegramGroup(): Promise<FetcherResult | null> {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_GROUP_USERNAME)
    return null;
  try {
    const username = process.env.TELEGRAM_GROUP_USERNAME.replace('@', '');
    const res = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getChatMembersCount?chat_id=@${username}`,
    );
    const data = await res.json();
    if (!data.ok) throw new Error(data.description ?? 'tg group error');
    return { value: data.result, displayValue: data.result.toLocaleString('en-US') };
  } catch (err: any) {
    return { value: 0, displayValue: '—', error: err?.message ?? 'tg group error' };
  }
}

async function fetchDiscord(): Promise<FetcherResult | null> {
  if (!process.env.DISCORD_BOT_TOKEN) return null;
  // Discord no expone members count sin mantener conexion con gateway.
  // Usamos invite code metadata como aproximacion: campo 'approximate_member_count'
  try {
    const code = process.env.DISCORD_INVITE_CODE;
    if (!code) return null;
    const res = await fetch(`https://discord.com/api/v10/invites/${code}?with_counts=true`);
    if (!res.ok) throw new Error(`discord ${res.status}`);
    const data = await res.json();
    const count = data.approximate_member_count ?? 0;
    return { value: count, displayValue: count.toLocaleString('en-US') };
  } catch (err: any) {
    return { value: 0, displayValue: '—', error: err?.message ?? 'discord error' };
  }
}

const FETCHERS: Record<string, () => Promise<FetcherResult | null>> = {
  [MetricSource.YOUTUBE_SUBSCRIBERS]: fetchYouTube,
  [MetricSource.TELEGRAM_CHANNEL_MEMBERS]: fetchTelegramChannel,
  [MetricSource.TELEGRAM_GROUP_MEMBERS]: fetchTelegramGroup,
  [MetricSource.DISCORD_MEMBERS]: fetchDiscord,
};

export async function refreshAllMetrics(): Promise<{
  updated: number;
  errors: number;
  skipped: number;
}> {
  const metrics = await prisma.metric.findMany({ where: { autoRefresh: true } });
  let updated = 0;
  let errors = 0;
  let skipped = 0;

  for (const metric of metrics) {
    const fetcher = FETCHERS[metric.source];
    if (!fetcher) {
      skipped++;
      continue;
    }
    const result = await fetcher();
    if (result === null) {
      // No API key configurada para esta fuente: skip
      skipped++;
      continue;
    }
    try {
      await prisma.metric.update({
        where: { id: metric.id },
        data: {
          value: BigInt(result.value),
          displayValue: result.displayValue,
          lastUpdated: new Date(),
          errorMessage: result.error ?? null,
        },
      });
      if (result.error) errors++;
      else updated++;
    } catch (err) {
      console.error(`[metrics] failed to update ${metric.source}:`, err);
      errors++;
    }
  }

  return { updated, errors, skipped };
}
