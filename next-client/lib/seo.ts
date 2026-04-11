import type { Metadata } from 'next';

type BuildMetadataInput = {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  image?: string;
  other?: Record<string, string>;
};

const DEFAULT_SITE_NAME = 'NovaRo Solution';
const DEFAULT_DESCRIPTION =
  'NovaRo Solution is a product engineering and design studio. We ship UI/UX, web, and mobile apps with modern stacks—Next.js, performance, and SEO in mind.';
const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&fm=webp';

export function getSiteUrl() {
  const explicitSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';
  const fallback = 'https://novarosolution.com';
  return String(explicitSiteUrl || vercelUrl || fallback).replace(/\/+$/, '');
}

export function buildCanonical(path = '/') {
  const base = getSiteUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

export function buildMetadata({
  title,
  description,
  keywords = [],
  path = '/',
  image = DEFAULT_IMAGE,
  other
}: BuildMetadataInput): Metadata {
  const canonical = buildCanonical(path);
  const openGraphImage = image.startsWith('http') ? image : `${getSiteUrl()}${image}`;

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(getSiteUrl()),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    authors: [{ name: DEFAULT_SITE_NAME, url: getSiteUrl() }],
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: DEFAULT_SITE_NAME,
      type: 'website',
      images: [
        {
          url: openGraphImage,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [openGraphImage]
    },
    other
  };
}

/** Legacy single-object JSON-LD (Organization only). Prefer `generateRootJsonLd` for homepage. */
export function generateOrganizationSchema() {
  const base = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${base}/#organization`,
    name: DEFAULT_SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: base,
    logo: {
      '@type': 'ImageObject',
      url: DEFAULT_IMAGE
    },
    sameAs: ['https://www.linkedin.com', 'https://github.com', 'https://www.youtube.com']
  };
}

/** WebSite + SearchAction + Organization graph for richer results. */
export function generateRootJsonLd() {
  const base = getSiteUrl();
  const organization = {
    '@type': 'Organization' as const,
    '@id': `${base}/#organization`,
    name: DEFAULT_SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: base,
    logo: {
      '@type': 'ImageObject' as const,
      url: DEFAULT_IMAGE
    },
    sameAs: ['https://www.linkedin.com', 'https://github.com', 'https://www.youtube.com']
  };

  const website = {
    '@type': 'WebSite' as const,
    '@id': `${base}/#website`,
    url: base,
    name: DEFAULT_SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    publisher: { '@id': `${base}/#organization` },
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction' as const,
      target: {
        '@type': 'EntryPoint' as const,
        urlTemplate: `${base}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [organization, website]
  };
}
