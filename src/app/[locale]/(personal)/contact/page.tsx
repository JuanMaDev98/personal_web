import { setRequestLocale, getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db';
import { ContactForm } from '@/components/personal/ContactForm';
import { buildMetadata } from '@/lib/seo';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props) {
  const t = await getTranslations({ locale: params.locale, namespace: 'contact' });
  return buildMetadata({
    title: t('title'),
    description: t('subtitle'),
    locale: params.locale as any,
    path: '/contact',
  });
}

export default async function ContactPage({ params }: Props) {
  setRequestLocale(params.locale);
  const locale = params.locale;
  const emailContent = await prisma.siteContent.findUnique({
    where: { key: 'personal.contact.email' },
  });
  const contactEmail =
    (emailContent?.value as any)?.[locale] ??
    (emailContent?.value as any)?.es ??
    'hola@manko.blog';
  return (
    <div className="pt-24">
      <ContactForm contactEmail={contactEmail} />
    </div>
  );
}
