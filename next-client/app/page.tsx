import type { Metadata } from 'next';
import HomePageClient from '@/components/home/HomePageClient';
import SEO from '@/components/SEO';
import { fetchSiteContent } from '@/lib/api';
import { buildCanonical, buildMetadata } from '@/lib/seo';

const HOME_SEO_TITLE = 'NovaRo Solution | Scalable Tech Solutions for Modern Businesses';
const HOME_SEO_DESCRIPTION =
  'NovaRo Solution is a company that helps build good websites and digital products. They are good at making things with Next.js. Can also make special apps for phones. NovaRo Solution also does a thing called UI/UX design for companies. This means they make sure things look good and work well. If you have an idea you want to make real you can work with the people, at NovaRo Solution. They will help you make it happen and make sure it is safe and works well. NovaRo Solution can help you with your project.';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: HOME_SEO_TITLE,
    description: HOME_SEO_DESCRIPTION,
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
  let content: Awaited<ReturnType<typeof fetchSiteContent>> | null = null;
  try {
    content = await fetchSiteContent({ revalidate: 180 });
  } catch {
    content = null;
  }
  const canonical = buildCanonical('/');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: HOME_SEO_TITLE,
    description: HOME_SEO_DESCRIPTION,
    url: canonical
  };

  return (
    <>
      <SEO
        title={HOME_SEO_TITLE}
        description={HOME_SEO_DESCRIPTION}
        canonical={canonical}
        keywords={['ui ux design', 'web development', 'mobile app development', 'seo']}
        schema={schema}
      />
      <HomePageClient data={content ?? {}} />
    </>
  );
}
