import Link from 'next/link';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { buildMetadata, generateOrganizationSchema, getSiteUrl } from '@/lib/seo';
import SEO from '@/components/SEO';
import Providers from './providers';
import RouteTransition from '@/components/animations/RouteTransition';
import HeaderNav from '@/components/layout/HeaderNav';
import AnnouncementBanner from '@/components/layout/AnnouncementBanner';
import SiteEnhancements from '@/components/layout/SiteEnhancements';

const GA_MEASUREMENT_ID = 'G-3Z1Z971K06';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true
});

export const metadata: Metadata = buildMetadata({
  title: 'Novaro Solution | UI/UX Design, Web and Mobile App Development',
  description:
    'Novaro Solution is a full-service digital product engineering partner for UI/UX design, web development, mobile app development, and SEO.',
  keywords: [
    'ui ux design',
    'web development company',
    'mobile app development',
    'digital product engineering',
    'seo services'
  ],
  path: '/'
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
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
              <nav className="footer-links" aria-label="Footer links">
                <Link href="/">Home</Link>
                <Link href="/about">About</Link>
                <Link href="/services">Services</Link>
                <Link href="/projects">Projects</Link>
                <Link href="/contact">Contact</Link>
              </nav>
              <div className="footer-meta">
                <small>{new Date().getFullYear()} Novaro Solution</small>
                <small>Built for performance and SEO.</small>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
