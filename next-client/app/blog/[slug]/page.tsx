import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import SEO from '@/components/SEO';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/api';
import { buildCanonical, buildMetadata } from '@/lib/seo';

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 120;

export async function generateStaticParams() {
  const posts = await getBlogPosts({ revalidate });
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug, { revalidate });

  if (!post) {
    return buildMetadata({
      title: 'Blog Not Found | Novaro Solution',
      description: 'Requested blog post is not available.',
      path: `/blog/${slug}`
    });
  }

  return buildMetadata({
    title: `${post.title} | Blog`,
    description: post.excerpt || post.content.slice(0, 140),
    keywords: ['blog', 'seo', 'next.js', post.slug],
    path: `/blog/${slug}`,
    image:
      post.imageUrl ||
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200'
  });
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug, { revalidate });
  if (!post) notFound();

  const canonical = buildCanonical(`/blog/${slug}`);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.content.slice(0, 140),
    mainEntityOfPage: canonical,
    author: {
      '@type': 'Person',
      name: post.creatorName || 'Novaro Solution'
    },
    datePublished: post.publishedAt || undefined
  };

  return (
    <article className="card space-y-4">
      <SEO
        title={`${post.title} | Blog`}
        description={post.excerpt || post.content.slice(0, 140)}
        canonical={canonical}
        schema={schema}
      />
      <h1 className="text-3xl font-extrabold md:text-5xl">{post.title}</h1>
      {post.imageUrl ? (
        <div className="overflow-hidden rounded-xl">
          <Image
            src={post.imageUrl}
            alt={`${post.title} cover image`}
            width={1000}
            height={560}
            className="mb-4 rounded-xl object-cover transition-transform duration-500 hover:scale-105"
            priority
          />
        </div>
      ) : null}
      <p className="leading-8 text-slate-200">{post.content}</p>
    </article>
  );
}
