import Link from 'next/link';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { buildMetadata, generateOrganizationSchema, getSiteUrl } from '@/lib/seo';
import SEO from '@/components/SEO';
import Providers from './providers';
import RouteTransition from '@/components/animations/RouteTransition';

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
        <SEO
          canonical={getSiteUrl()}
          schema={generateOrganizationSchema()}
        />
        <header className="header">
          <div className="container header-content">
            <strong>Novaro Solution</strong>
            <nav className="nav" aria-label="Main navigation">
              <Link href="/">Home</Link>
              <Link href="/services">Services</Link>
              <Link href="/projects">Projects</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>
        </header>
        <Providers>
          <main className="main container">
            <RouteTransition>{children}</RouteTransition>
          </main>
        </Providers>
        <footer className="footer">
          <div className="container footer-content">
            <small>{new Date().getFullYear()} Novaro Solution</small>
            <small>Built for performance and SEO.</small>
          </div>
        </footer>
      </body>
    </html>
  );
}
