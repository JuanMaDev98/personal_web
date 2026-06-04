import type { Metadata } from 'next';
import { Locale, defaultLocale } from './i18n';

type SeoProps = {
  title: string;
  description: string;
  locale?: Locale;
  path?: string;
  image?: string;
  noindex?: boolean;
};

export function buildMetadata({
  title,
  description,
  locale = defaultLocale,
  path = '',
  image = '/og-image.png',
  noindex = false,
}: SeoProps): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const fullUrl = `${siteUrl}/${locale}${path}`;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;
  const brandName = 'JuanMa Crypto';

  return {
    title: `${title} · ${brandName}`,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: fullUrl,
      languages: {
        es: `${siteUrl}/es${path}`,
        en: `${siteUrl}/en${path}`,
      },
    },
    openGraph: {
      title: `${title} · ${brandName}`,
      description,
      url: fullUrl,
      siteName: brandName,
      images: [{ url: fullImage, width: 1200, height: 630 }],
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} · ${brandName}`,
      description,
      images: [fullImage],
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
