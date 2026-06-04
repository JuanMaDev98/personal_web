'use client';

import Link from 'next/link';
import { usePathname } from '@/lib/navigation';
import { useTranslations } from 'next-intl';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Globe,
  BarChart3,
  Megaphone,
  Handshake,
  MessageSquareQuote,
  Inbox,
  FileText,
  Settings,
  LogOut,
  ArrowLeft,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEMS: { key: any; href: string; icon: LucideIcon }[] = [
  { key: 'dashboard', href: '/hub', icon: LayoutDashboard },
  { key: 'sites', href: '/hub/sites', icon: Globe },
  { key: 'analytics', href: '/hub/analytics', icon: BarChart3 },
  { key: 'promos', href: '/hub/promos', icon: Megaphone },
  { key: 'partners', href: '/hub/partners', icon: Handshake },
  { key: 'testimonials', href: '/hub/testimonials', icon: MessageSquareQuote },
  { key: 'feedback', href: '/hub/feedback', icon: Inbox },
  { key: 'content', href: '/hub/content', icon: FileText },
  { key: 'settings', href: '/hub/settings', icon: Settings },
];

type Props = {
  user: { name?: string | null; email?: string | null; image?: string | null };
};

export function HubSidebar({ user }: Props) {
  const pathname = usePathname();
  const t = useTranslations('hub.sidebar');

  return (
    <aside className="w-64 border-r border-border bg-card/30 backdrop-blur-xl flex flex-col">
      <div className="p-4 border-b border-border/50">
        <Link
          href="/"
          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1.5"
          data-cta="hub-back-to-site"
        >
          <ArrowLeft className="h-3 w-3" />
          Volver al sitio
        </Link>
        <div className="font-display text-lg font-bold gradient-text mt-3">HUB Admin</div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== '/hub' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.key}
              href={item.href}
              data-cta="hub-nav"
              data-cta-id={`hub-nav-${item.key}`}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                active
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {t(item.key)}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border/50">
        <div className="flex items-center gap-3 mb-3 px-2">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt={user.name ?? ''} className="h-8 w-8 rounded-full" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gradient-brand flex items-center justify-center text-xs font-semibold text-primary-foreground">
              {(user.name ?? user.email ?? '?').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate">{user.name ?? 'Admin'}</div>
            <div className="text-[10px] text-muted-foreground truncate">{user.email}</div>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/es' })}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-destructive/10"
          data-cta="hub-logout"
        >
          <LogOut className="h-3 w-3" />
          {t('logout')}
        </button>
      </div>
    </aside>
  );
}
