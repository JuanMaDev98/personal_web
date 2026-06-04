import { redirect } from '@/lib/navigation';
import { setRequestLocale } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { HubSidebar } from '@/components/hub/HubSidebar';

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function HubLayout({ children, params }: Props) {
  setRequestLocale(params.locale);

  const session = await auth();
  // Doble check: el middleware ya valida, pero por si acaso
  if (!session?.user || (session.user.role !== 'OWNER' && session.user.role !== 'EDITOR')) {
    redirect('/hub/login', { locale: params.locale as any });
  }

  return (
    <div className="min-h-screen flex bg-background">
      <HubSidebar user={session.user} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
