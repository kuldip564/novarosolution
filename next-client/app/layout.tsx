import Link from 'next/link';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { buildMetadata, generateOrganizationSchema, getSiteUrl } from '@/lib/seo';
import SEO from '@/components/SEO';
import Providers from './providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true
});

export const metadata: Metadata = buildMetadata({
  title: 'Novaro Solution | Modern Web Platform',
  description:
    'SEO-focused MERN and Next.js architecture with fast loading and indexable pages.',
  keywords: ['novaro', 'next.js', 'mern', 'seo', 'web development'],
  path: '/'
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SEO
          title="Novaro Solution"
          description="SEO-focused MERN and Next.js architecture."
          canonical={getSiteUrl()}
          schema={generateOrganizationSchema()}
        />
        <header className="header">
          <div className="container header-content">
            <strong>Novaro Solution</strong>
            <nav className="nav" aria-label="Main navigation">
              <Link href="/">Home</Link>
              <Link href="/projects">Projects</Link>
              <Link href="/blog">Blog</Link>
            </nav>
          </div>
        </header>
        <Providers>
          <main className="main container">{children}</main>
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
