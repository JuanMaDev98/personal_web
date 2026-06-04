import { setRequestLocale, getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db';
import { TestimonialsCarousel } from '@/components/personal/TestimonialsCarousel';
import { buildMetadata } from '@/lib/seo';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props) {
  const t = await getTranslations({ locale: params.locale, namespace: 'testimonials' });
  return buildMetadata({
    title: t('title'),
    description: t('subtitle'),
    locale: params.locale as any,
    path: '/testimonials',
  });
}

export default async function TestimonialsPage({ params }: Props) {
  setRequestLocale(params.locale);
  const testimonials = await prisma.testimonial.findMany({
    where: { status: 'APPROVED', visibleOn: { has: 'personal' } },
    orderBy: { createdAt: 'desc' },
  });
  return (
    <div className="pt-24">
      <TestimonialsCarousel testimonials={testimonials} />
    </div>
  );
}
