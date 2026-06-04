import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Github, Heart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  const t = useTranslations('footer');
  const tSocial = useTranslations('social');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 mt-24 bg-card/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="font-display text-xl font-bold gradient-text mb-2">JuanMa Crypto</div>
            <p className="text-sm text-muted-foreground">{t('tagline')}</p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 uppercase tracking-wider text-muted-foreground">
              {tSocial('title')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.youtube.com/channel/UCElCoULDa68Yzqi1slcWvKA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                  data-outbound="youtube"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/JuanMaYoutube"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                  data-outbound="telegram-channel"
                >
                  {tSocial('telegramChannel')}
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/JuanMaCryptoYoutube"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                  data-outbound="telegram-group"
                >
                  {tSocial('telegramGroup')}
                </a>
              </li>
              <li>
                <a
                  href="https://chat.whatsapp.com/IIK0cfzMj8qDAv8Zhcko9q"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                  data-outbound="whatsapp"
                >
                  {tSocial('whatsapp')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 uppercase tracking-wider text-muted-foreground">
              Admin
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/hub" className="hover:text-primary transition-colors">
                  {t('hub')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>
            © {year} JuanMa Crypto. {t('rights')}.
          </div>
          <div className="flex items-center gap-1.5">
            {t('madeWith')} <Heart className="h-3 w-3 text-accent fill-accent" /> {t('by')}
          </div>
        </div>
      </div>
    </footer>
  );
}
