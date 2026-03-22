'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  CONSENT_UPDATED_EVENT,
  OPEN_CONSENT_EVENT,
  readCookieConsent,
  writeCookieConsent,
  type CookieConsentChoice
} from '@/lib/consent';

type CookieConsentBannerProps = {
  adsenseClientId: string;
};

function updateGoogleConsent(choice: CookieConsentChoice) {
  if (typeof window === 'undefined') return;
  const gtag = (window as any).gtag;
  if (typeof gtag !== 'function') return;

  gtag('consent', 'update', {
    ad_storage: choice === 'accepted' ? 'granted' : 'denied',
    ad_user_data: choice === 'accepted' ? 'granted' : 'denied',
    ad_personalization: choice === 'accepted' ? 'granted' : 'denied',
    analytics_storage: choice === 'accepted' ? 'granted' : 'denied'
  });
}

function ensureAdSenseScript(clientId: string) {
  if (typeof window === 'undefined') return;
  const existing = document.querySelector('script[data-adsense-loader="true"]');
  if (existing) return;

  const script = document.createElement('script');
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
  script.setAttribute('data-adsense-loader', 'true');
  document.head.appendChild(script);
}

export default function CookieConsentBanner({ adsenseClientId }: CookieConsentBannerProps) {
  const [choice, setChoice] = useState<CookieConsentChoice | null>(null);
  const isOpen = useMemo(() => choice === null, [choice]);

  useEffect(() => {
    const stored = readCookieConsent();
    setChoice(stored);
    if (stored) updateGoogleConsent(stored);
    if (stored === 'accepted') ensureAdSenseScript(adsenseClientId);

    const onOpenRequest = () => setChoice(null);
    const onConsentUpdated = (event: Event) => {
      const detail = (event as CustomEvent<{ choice: CookieConsentChoice | null }>).detail;
      const next = detail?.choice ?? readCookieConsent();
      setChoice(next || null);
    };

    window.addEventListener(OPEN_CONSENT_EVENT, onOpenRequest);
    window.addEventListener(CONSENT_UPDATED_EVENT, onConsentUpdated);
    return () => {
      window.removeEventListener(OPEN_CONSENT_EVENT, onOpenRequest);
      window.removeEventListener(CONSENT_UPDATED_EVENT, onConsentUpdated);
    };
  }, [adsenseClientId]);

  function onChoose(nextChoice: CookieConsentChoice) {
    writeCookieConsent(nextChoice);
    setChoice(nextChoice);
    updateGoogleConsent(nextChoice);
    if (nextChoice === 'accepted') ensureAdSenseScript(adsenseClientId);
  }

  if (!isOpen) return null;

  return (
    <aside className="cookie-banner" role="dialog" aria-live="polite" aria-label="Cookie preferences">
      <div className="cookie-banner__content">
        <p className="cookie-banner__title">Cookie Preferences</p>
        <p className="cookie-banner__text">
          We use essential cookies for site reliability and optional cookies for analytics and Google AdSense ad
          delivery. You can accept or reject optional cookies and update your choice anytime.
        </p>
        <p className="cookie-banner__links">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <span aria-hidden="true">|</span>
          <Link href="/terms-and-conditions">Terms & Conditions</Link>
        </p>
      </div>
      <div className="cookie-banner__actions">
        <button className="admin-btn" type="button" onClick={() => onChoose('rejected')}>
          Reject
        </button>
        <button className="admin-btn" type="button" onClick={() => onChoose('accepted')}>
          Accept
        </button>
      </div>
    </aside>
  );
}
