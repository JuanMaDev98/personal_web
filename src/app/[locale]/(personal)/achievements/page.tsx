import { setRequestLocale, getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db';
import { AchievementsTimeline } from '@/components/personal/AchievementsTimeline';
import { buildMetadata } from '@/lib/seo';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props) {
  const t = await getTranslations({ locale: params.locale, namespace: 'achievements' });
  return buildMetadata({
    title: t('title'),
    description: t('subtitle'),
    locale: params.locale as any,
    path: '/achievements',
  });
}

export default async function AchievementsPage({ params }: Props) {
  setRequestLocale(params.locale);
  const achievements = await prisma.achievement.findMany({
    orderBy: [{ order: 'asc' }, { date: 'desc' }],
  });
  return (
    <div className="pt-24">
      <AchievementsTimeline achievements={achievements} />
    </div>
  );
}
