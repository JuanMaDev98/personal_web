import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { CrossWebLinks } from '@/components/shared/CrossWebLinks';
import { setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/db';

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function PersonalLayout({ children, params }: Props) {
  setRequestLocale(params.locale);

  // Traer sitios futuros (cuando existan) para cross-linking
  const sites = await prisma.site.findMany({
    where: { status: 'ACTIVE', slug: { not: 'personal' } },
    select: { slug: true, name: true, subdomain: true, description: true },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <CrossWebLinks sites={sites} />
      <Footer />
    </div>
  );
}
