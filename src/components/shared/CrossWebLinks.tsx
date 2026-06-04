'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

type Site = {
  slug: string;
  name: string;
  subdomain: string;
  description: string | null;
};

const ICONS: Record<string, string> = {
  sfl: '📊',
  tracker: '⭐',
  eldoria: '⚔️',
  tools: '🛠️',
  blog: '📰',
  hub: '⚙️',
};

const COLORS: Record<string, string> = {
  sfl: 'from-yellow-500/20 to-orange-500/20',
  tracker: 'from-purple-500/20 to-pink-500/20',
  eldoria: 'from-blue-500/20 to-cyan-500/20',
  tools: 'from-green-500/20 to-emerald-500/20',
  blog: 'from-rose-500/20 to-red-500/20',
  hub: 'from-slate-500/20 to-slate-700/20',
};

export function CrossWebLinks({ sites }: { sites: Site[] }) {
  if (sites.length === 0) return null;

  return (
    <section className="py-16 border-t border-border/50">
      <div className="container">
        <div className="text-center mb-8">
          <h3 className="font-display text-2xl font-bold">Explora la red JuanMa Crypto</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Todas las webs interconectadas de la red
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {sites.map((site, i) => {
            const icon = ICONS[site.slug] ?? '🌐';
            const color = COLORS[site.slug] ?? 'from-primary/20 to-secondary/20';
            return (
              <motion.a
                key={site.slug}
                href={`https://${site.subdomain}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -3 }}
                data-cta="cross-web-link"
                data-cta-id={`crossweb-${site.slug}`}
                data-outbound="internal-network"
                className={`block p-4 rounded-xl glass border border-border/50 hover:border-primary/30 transition-all bg-gradient-to-br ${color}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="text-2xl flex-shrink-0">{icon}</div>
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{site.name}</div>
                      {site.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {site.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
