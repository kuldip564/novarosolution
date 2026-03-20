import type { Metadata } from 'next';

type BuildMetadataInput = {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  image?: string;
};

const DEFAULT_SITE_NAME = 'Novaro Solution';
const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200';

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

export function buildCanonical(path = '/') {
  const base = getSiteUrl().replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

export function buildMetadata({
  title,
  description,
  keywords = [],
  path = '/',
  image = DEFAULT_IMAGE
}: BuildMetadataInput): Metadata {
  const canonical = buildCanonical(path);
  const openGraphImage = image.startsWith('http') ? image : `${getSiteUrl()}${image}`;

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(getSiteUrl()),
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
    }
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: DEFAULT_SITE_NAME,
    url: getSiteUrl(),
    logo: DEFAULT_IMAGE,
    sameAs: []
  };
}
