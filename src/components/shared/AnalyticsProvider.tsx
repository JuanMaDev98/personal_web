'use client';

import { createContext, useContext, useEffect, useRef, useCallback } from 'react';

type AnalyticsContextValue = {
  track: (event: { type: string; props?: Record<string, unknown> }) => void;
};

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

export function useAnalytics() {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) {
    return { track: () => {} };
  }
  return ctx;
}

const VISITOR_KEY = 'jmc_vid';
const ATTR_KEY = 'jmc_attr';

function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
    document.cookie = `${VISITOR_KEY}=${id}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  }
  return id;
}

function setAttribution() {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  const utmSource = url.searchParams.get('utm_source');
  if (!utmSource) return;
  const attr = { ref: utmSource, ts: Date.now() };
  localStorage.setItem(ATTR_KEY, JSON.stringify(attr));
  document.cookie = `${ATTR_KEY}=${encodeURIComponent(JSON.stringify(attr))}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const lastPathRef = useRef<string>('');

  const track = useCallback((event: { type: string; props?: Record<string, unknown> }) => {
    if (typeof window === 'undefined') return;
    const payload = {
      type: event.type,
      path: window.location.pathname,
      props: event.props,
    };
    // Beacon para no bloquear la UI
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/track', blob);
    } else {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    getOrCreateVisitorId();
    setAttribution();

    // Auto pageview tracking
    if (lastPathRef.current !== window.location.pathname) {
      lastPathRef.current = window.location.pathname;
      track({ type: 'pageview' });
    }

    // Click tracking en CTAs con data-cta
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const ctaEl = target.closest('[data-cta]') as HTMLElement | null;
      if (ctaEl) {
        const ctaId = ctaEl.getAttribute('data-cta-id') ?? ctaEl.getAttribute('data-cta');
        const dest = (ctaEl as HTMLAnchorElement).href ?? ctaEl.getAttribute('data-cta-dest');
        track({
          type: 'click_cta',
          props: { ctaId, destination: dest },
        });
      }
      const outboundEl = target.closest('[data-outbound]') as HTMLAnchorElement | null;
      if (outboundEl && outboundEl.hostname !== window.location.hostname) {
        track({
          type: 'outbound_link',
          props: { url: outboundEl.href, category: outboundEl.getAttribute('data-outbound') },
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [track]);

  return (
    <AnalyticsContext.Provider value={{ track }}>{children}</AnalyticsContext.Provider>
  );
}
