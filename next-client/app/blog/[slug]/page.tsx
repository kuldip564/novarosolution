import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SEO from '@/components/SEO';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/api';
import { buildCanonical, buildMetadata } from '@/lib/seo';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 120;

export async function generateStaticParams() {
  const posts = await getBlogPosts({ revalidate });
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
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
    title: post.seoTitle || `${post.title} | Blog`,
    description: post.seoDescription || post.excerpt,
    keywords: post.seoKeywords || ['blog', 'novaro solution'],
    path: `/blog/${slug}`,
    image: post.imageUrl || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200'
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug, { revalidate });
  if (!post) notFound();

  const canonical = buildCanonical(`/blog/${slug}`);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: post.imageUrl || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200',
    datePublished: post.publishedAt || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: post.authorName || 'Novaro Team'
    },
    url: canonical
  };

  return (
    <>
      <SEO
        title={post.seoTitle || `${post.title} | Blog`}
        description={post.seoDescription || post.excerpt}
        canonical={canonical}
        schema={schema}
      />
      <div className="app-page-shell space-y-6">
        <header className="premium-page-hero space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-400/90">Article</p>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
          </p>
          <h1 className="section-title text-3xl font-extrabold md:text-5xl">{post.title}</h1>
          <p className="text-sm text-slate-300">
            {post.authorName ? `By ${post.authorName}` : 'By Novaro Team'}
          </p>
        </header>
        <article className="page-content-card">
          <div className="prose prose-invert max-w-none whitespace-pre-wrap text-slate-200">
            {post.content}
          </div>
        </article>
      </div>
    </>
  );
}
