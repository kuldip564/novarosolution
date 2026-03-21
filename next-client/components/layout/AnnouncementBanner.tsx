'use client';

import { useEffect, useState } from 'react';
import { fetchSiteContentClient } from '@/lib/clientApi';

type BannerState = {
  enabled: boolean;
  text: string;
};

export default function AnnouncementBanner() {
  const [banner, setBanner] = useState<BannerState>({ enabled: false, text: '' });

  useEffect(() => {
    let mounted = true;
    async function loadBanner() {
      try {
        const content = await fetchSiteContentClient();
        if (!mounted) return;
        const enabled = Boolean(content?.uiSettings?.announcementEnabled);
        const text = String(content?.uiSettings?.announcementText || '').trim();
        setBanner({ enabled, text });
      } catch {
        if (!mounted) return;
        setBanner({ enabled: false, text: '' });
      }
    }
    loadBanner();
    return () => {
      mounted = false;
    };
  }, []);

  if (!banner.enabled || !banner.text) {
    return null;
  }

  return (
    <div className="border-b border-pink-400/25 bg-linear-to-r from-pink-500/15 via-violet-500/10 to-pink-500/15">
      <div className="container py-2 text-center text-xs font-semibold tracking-[0.08em] text-pink-100 md:text-sm">
        {banner.text}
      </div>
    </div>
  );
}
