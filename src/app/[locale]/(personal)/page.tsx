import { setRequestLocale, getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db';
import { Hero } from '@/components/personal/Hero';
import { SloganTriad } from '@/components/personal/SloganTriad';
import { AboutMe } from '@/components/personal/AboutMe';
import { MetricsShowcase } from '@/components/personal/MetricsShowcase';
import { PartnersGrid } from '@/components/personal/PartnersGrid';
import { TestimonialsCarousel } from '@/components/personal/TestimonialsCarousel';
import { AchievementsTimeline } from '@/components/personal/AchievementsTimeline';
import { ContactForm } from '@/components/personal/ContactForm';
import { CTASection } from '@/components/personal/CTASection';
import { buildMetadata } from '@/lib/seo';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props) {
  const t = await getTranslations({ locale: params.locale, namespace: 'hero' });
  return buildMetadata({
    title: t('title'),
    description: t('subtitle'),
    locale: params.locale as any,
    path: '',
  });
}

export default async function HomePage({ params }: Props) {
  setRequestLocale(params.locale);
  const locale = params.locale;

  // Fetch todo en paralelo
  const [metrics, partners, testimonials, achievements, bioContent, emailContent] = await Promise.all([
    prisma.metric.findMany({ orderBy: { source: 'asc' } }),
    prisma.partner.findMany({
      where: { status: 'ACTIVE' },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'asc' }],
    }),
    prisma.testimonial.findMany({
      where: { status: 'APPROVED', visibleOn: { has: 'personal' } },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
    prisma.achievement.findMany({
      orderBy: [{ order: 'asc' }, { date: 'desc' }],
      take: 10,
    }),
    prisma.siteContent.findUnique({ where: { key: 'personal.about.bio' } }),
    prisma.siteContent.findUnique({ where: { key: 'personal.contact.email' } }),
  ]);

  const bio =
    (bioContent?.value as any)?.[locale] ??
    (bioContent?.value as any)?.es ??
    'Bio placeholder.';
  const contactEmail =
    (emailContent?.value as any)?.[locale] ??
    (emailContent?.value as any)?.es ??
    'hola@manko.blog';

  return (
    <>
      <Hero metrics={metrics} />
      <SloganTriad />
      <AboutMe bio={bio} />
      <MetricsShowcase metrics={metrics} />
      <PartnersGrid partners={partners} />
      <TestimonialsCarousel testimonials={testimonials} />
      <AchievementsTimeline achievements={achievements} />
      <ContactForm contactEmail={contactEmail} />
      <CTASection />
    </>
  );
}
