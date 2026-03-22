import Link from 'next/link';
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
import HeaderNav from '@/components/layout/HeaderNav';
import AnnouncementBanner from '@/components/layout/AnnouncementBanner';
import FooterNavLinks from '@/components/layout/FooterNavLinks';
import CookieConsentBanner from '@/components/compliance/CookieConsentBanner';

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
    'NovaRo Solution is a company that helps build good websites and digital products. They are good at making things with Next.js. Can also make special apps for phones. NovaRo Solution also does a thing called UI/UX design for companies. This means they make sure things look good and work well. If you have an idea you want to make real you can work with the people, at NovaRo Solution. They will help you make it happen and make sure it is safe and works well. NovaRo Solution can help you with your project.',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
          <header className="header">
            <div className="container header-content">
              <Link href="/" className="brand-title">Novaro Solution</Link>
              <HeaderNav />
            </div>
          </header>
          <main className="main container">
            <RouteTransition>{children}</RouteTransition>
          </main>
          <SiteEnhancements />
          <footer className="footer">
            <div className="container footer-content footer-grid">
              <div className="footer-brand">
                <p className="footer-title">Novaro Solution</p>
                <small>Design-forward web, mobile, and product engineering.</small>
              </div>
              <FooterNavLinks />
              <div className="footer-meta">
                <small>{new Date().getFullYear()} Novaro Solution</small>
                <small>Built for performance and SEO.</small>
              </div>
            </div>
          </footer>
          <CookieConsentBanner adsenseClientId={ADSENSE_CLIENT_ID} />
        </Providers>
      </body>
    </html>
  );
}
