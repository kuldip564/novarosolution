import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleReadingProgress } from "@/components/blog/ArticleReadingProgress";
import { ArticleShareBar } from "@/components/blog/ArticleShareBar";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { CloudinaryImage } from "@/components/admin/CloudinaryImage";
import { Reveal } from "@/components/anim/Reveal";
import {
  formatBlogDate,
  getBlogPost,
  type BlogPost,
} from "@/lib/blog";
import { cloudinaryTransformUrl } from "@/lib/media";
import { site } from "@/lib/site-data";
import { brandIconAbsoluteUrl, siteBaseUrl, siteIcons } from "@/lib/site-metadata";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

function articleJsonLd(post: BlogPost) {
  const url = `${siteBaseUrl()}/blog/${post.slug}`;
  const image =
    cloudinaryTransformUrl(post.ogImage ?? post.coverImage, { width: 1200 }) ??
    post.coverImage?.secureUrl;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt,
    image: image ? [image] : undefined,
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: {
        "@type": "ImageObject",
        url: brandIconAbsoluteUrl(),
      },
    },
    mainEntityOfPage: url,
  };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getBlogPost(slug);
  if (!data) return { title: "Post not found" };

  const { post } = data;
  const title = post.metaTitle ?? post.title;
  const description = post.metaDescription ?? post.excerpt;
  const ogImage =
    cloudinaryTransformUrl(post.ogImage ?? post.coverImage, { width: 1200 }) ??
    post.coverImage?.secureUrl;

  return {
    title,
    description,
    icons: siteIcons,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : [site.brandIcon],
    },
  };
}

export default async function BlogArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const data = await getBlogPost(slug);
  if (!data) notFound();

  const { post, related } = data;

  return (
    <main className="article-page">
      <ArticleReadingProgress />

      <section className="article-hero">
        {post.coverImage ? (
          <div className="article-hero-bg">
            <CloudinaryImage
              asset={post.coverImage}
              alt=""
              width={1920}
              height={900}
              transformWidth={1600}
              className="article-hero-img"
              priority
              sizes="100vw"
            />
            <div className="article-hero-overlay" />
          </div>
        ) : (
          <div className="article-hero-fallback" />
        )}

        <div className="wrap article-hero-inner">
          <Reveal>
            <Link href="/blog" className="article-back">
              ← Back to blog
            </Link>
            <span className="blog-pill">{post.category}</span>
            <h1>{post.title}</h1>
            <div className="article-meta">
              <span>{post.author.name}</span>
              <span>{formatBlogDate(post.publishedAt)}</span>
              <span>{post.readingTime} min read</span>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="wrap article-layout">
        <ArticleShareBar title={post.title} slug={post.slug} />
        <article
          className="article-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        {post.tags.length > 0 && (
          <div className="article-tags">
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        )}
      </div>

      {related.length > 0 && (
        <section className="sec article-related">
          <div className="wrap">
            <Reveal>
              <span className="eyebrow">Keep reading</span>
              <h2>Related posts</h2>
            </Reveal>
            <div className="blog-grid compact">
              {related.map((item, index) => (
                <BlogPostCard key={item.id} post={item} delay={index * 0.08} />
              ))}
            </div>
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(post)) }}
      />
    </main>
  );
}
