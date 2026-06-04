'use client';

import { useTransition, useState, useEffect } from 'react';
import { usePathname, useRouter } from '@/lib/navigation';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { locales, type Locale } from '@/lib/i18n';

const labels: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
};

const flags: Record<Locale, string> = {
  es: '🇪🇸',
  en: '🇬🇧',
};

export function LangSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [current, setCurrent] = useState<Locale>('es');

  useEffect(() => {
    const segment = pathname.split('/')[1] as Locale;
    if (locales.includes(segment)) setCurrent(segment);
  }, [pathname]);

  const handleChange = (next: Locale) => {
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={isPending}
          data-cta="lang-switcher"
          data-cta-id={`lang-${current}`}
          className="gap-2"
        >
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">{flags[current]} {labels[current]}</span>
          <span className="sm:hidden">{flags[current]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleChange(loc)}
            className={current === loc ? 'bg-accent/10' : ''}
          >
            <span className="mr-2">{flags[loc]}</span>
            {labels[loc]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
