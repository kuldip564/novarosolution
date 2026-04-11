import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import './globals.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { buildMetadata, generateOrganizationSchema, getSiteUrl } from '@/lib/seo';
import SEO from '@/components/SEO';
import Providers from './providers';
import RouteTransition from '@/components/animations/RouteTransition';
import AnnouncementBanner from '@/components/layout/AnnouncementBanner';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import CookieConsentBanner from '@/components/compliance/CookieConsentBanner';
import { fetchSiteContent } from '@/lib/api';
import { normalizeSiteChrome } from '@/lib/siteChrome';

const SiteEnhancements = dynamic(() => import('@/components/layout/SiteEnhancements'));

const GA_MEASUREMENT_ID = 'G-3Z1Z971K06';
const ADSENSE_CLIENT_ID = 'ca-pub-1997736983474353';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true
});

export const metadata: Metadata = buildMetadata({
  title: 'NovaRo Solution | Scalable Tech Solutions for Modern Businesses',
  description:
    'NovaRo Solution is a product engineering and design studio. We ship UI/UX, web, and mobile apps with modern stacks—Next.js, performance, and SEO in mind.',
  keywords: [
    'ui ux design',
    'web development company',
    'mobile app development',
    'digital product engineering',
    'seo services'
  ],
  path: '/',
  other: {
    'google-adsense-account': ADSENSE_CLIENT_ID
  }
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let siteChrome = normalizeSiteChrome(undefined);
  try {
    const content = await fetchSiteContent({ revalidate: 120 });
    siteChrome = normalizeSiteChrome((content as Record<string, unknown>)?.siteChrome);
  } catch {
    /* API unavailable at build or offline — defaults from normalizeSiteChrome */
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="beforeInteractive"
        />
        <Script id="google-analytics" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied'
            });
            gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
          `}
        </Script>
        <Providers>
          <SEO
            canonical={getSiteUrl()}
            schema={generateOrganizationSchema()}
          />
          <AnnouncementBanner />
          <SiteHeader chrome={siteChrome} />
          <main className="main container">
            <RouteTransition>{children}</RouteTransition>
          </main>
          <SiteEnhancements />
          <SiteFooter chrome={siteChrome} />
          <CookieConsentBanner adsenseClientId={ADSENSE_CLIENT_ID} />
        </Providers>
      </body>
    </html>
  );
}
