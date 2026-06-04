'use client';

import Link from 'next/link';
import { usePathname } from '@/lib/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LangSwitcher } from './LangSwitcher';
import { cn } from '@/lib/utils';

const YOUTUBE_URL =
  'https://www.youtube.com/channel/UCElCoULDa68Yzqi1slcWvKA?sub_confirmation=1';
const TELEGRAM_URL = 'https://t.me/JuanMaCryptoYoutube';

export function Header() {
  const t = useTranslations('nav');
  const tBrand = useTranslations('brand');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const links = [
    { href: '/', label: t('home') },
    { href: '/partners', label: t('partners') },
    { href: '/testimonials', label: t('testimonials') },
    { href: '/achievements', label: t('achievements') },
    { href: '/contact', label: t('contact') },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'glass-strong border-b border-border/50' : 'bg-transparent',
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Wordmark logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-bold tracking-tight"
        >
          <span className="gradient-text">{tBrand('name')}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                data-cta="nav-link"
                data-cta-id={`nav-${l.href}`}
                className={cn(
                  'px-3 py-2 text-sm rounded-md transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitcher />
          <Button
            asChild
            size="sm"
            variant="gradient"
            className="hidden md:inline-flex"
            data-cta="header-cta"
            data-cta-id="header-cta-youtube"
            data-cta-dest={YOUTUBE_URL}
          >
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-outbound="youtube"
            >
              {t('home') === 'Home' ? 'Subscribe' : 'Suscríbete'}
            </a>
          </Button>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2"
            aria-label="Menu"
            data-cta="mobile-menu-toggle"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-border/50 overflow-hidden"
          >
            <div className="container py-4 flex flex-col gap-2">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-3 py-2 text-sm rounded-md hover:bg-accent/10"
                >
                  {l.label}
                </Link>
              ))}
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2"
                data-cta="mobile-cta-youtube"
                data-outbound="youtube"
              >
                <Button variant="gradient" className="w-full">
                  {t('home') === 'Home' ? 'Subscribe' : 'Suscríbete'}
                </Button>
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
