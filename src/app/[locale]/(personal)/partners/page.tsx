import { setRequestLocale, getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db';
import { PartnersGrid } from '@/components/personal/PartnersGrid';
import { buildMetadata } from '@/lib/seo';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props) {
  const t = await getTranslations({ locale: params.locale, namespace: 'partners' });
  return buildMetadata({
    title: t('title'),
    description: t('subtitle'),
    locale: params.locale as any,
    path: '/partners',
  });
}

export default async function PartnersPage({ params }: Props) {
  setRequestLocale(params.locale);
  const partners = await prisma.partner.findMany({
    where: { status: 'ACTIVE' },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'asc' }],
  });
  return (
    <div className="pt-24">
      <PartnersGrid partners={partners} />
    </div>
  );
}
