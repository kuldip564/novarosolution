import type { Metadata } from 'next';
import HomePageClient from '@/components/home/HomePageClient';
import SEO from '@/components/SEO';
import { fetchSiteContent } from '@/lib/api';
import { buildCanonical, buildMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const content = await fetchSiteContent({ revalidate: 180 });
  const heroTitle = content?.hero?.titleMain || 'NovaRo Solution';
  const heroDescription =
    content?.hero?.description ||
    'Premium digital product development with modern web architecture.';

  return buildMetadata({
    title: `${heroTitle} | Home`,
    description: heroDescription,
    keywords: [
      'ui ux design',
      'web development',
      'mobile app development',
      'digital product engineering',
      'seo optimization'
    ],
    path: '/'
  });
}

export default async function HomePage() {
  const content = await fetchSiteContent({ revalidate: 180 });
  const canonical = buildCanonical('/');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: content?.hero?.titleMain || 'NovaRo Solution',
    description: content?.hero?.description || 'Premium digital product development.',
    url: canonical
  };

  return (
    <>
      <SEO
        title={`${content?.hero?.titleMain || 'NovaRo Solution'} | Home`}
        description={content?.hero?.description || 'Premium digital product development.'}
        canonical={canonical}
        keywords={['ui ux design', 'web development', 'mobile app development', 'seo']}
        schema={schema}
      />
      <HomePageClient data={content} />
    </>
  );
}
