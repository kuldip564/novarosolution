import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleReadingProgress } from "@/components/blog/ArticleReadingProgress";
import { ArticleShareBar } from "@/components/blog/ArticleShareBar";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { Reveal } from "@/components/anim/Reveal";
import {
  formatBlogDate,
  getAllBlogPosts,
  getBlogPost,
  type BlogPost,
} from "@/lib/blog";
import { cloudinaryTransformUrl } from "@/lib/media";
import { site } from "@/lib/site-data";
import { brandIconAbsoluteUrl, ogImagePath, ogLocales, siteBaseUrl, siteIcons } from "@/lib/site-metadata";
import { breadcrumbJsonLd, ORGANIZATION_ID } from "@/lib/structured-data";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

function articleImage(post: BlogPost): string {
  return (
    cloudinaryTransformUrl(post.ogImage ?? post.coverImage, { width: 1200 }) ??
    post.coverImage?.secureUrl ??
    `${siteBaseUrl()}${ogImagePath(post.title, post.category || "Blog")}`
  );
}

function articleJsonLd(post: BlogPost) {
  const url = `${siteBaseUrl()}/blog/${post.slug}`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: post.metaTitle ?? post.title,
      description: post.metaDescription ?? post.excerpt,
      image: [articleImage(post)],
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
      inLanguage: "en",
      articleSection: post.category || undefined,
      keywords: post.tags.length ? post.tags.join(", ") : undefined,
      timeRequired: post.readingTime ? `PT${post.readingTime}M` : undefined,
      author: {
        "@type": "Person",
        name: post.author.name,
        worksFor: { "@id": ORGANIZATION_ID },
        url: `${siteBaseUrl()}/about`,
      },
      publisher: {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: site.name,
        logo: { "@type": "ImageObject", url: brandIconAbsoluteUrl() },
      },
      isPartOf: { "@type": "Blog", "@id": `${siteBaseUrl()}/blog#blog`, name: `${site.name} blog` },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
  ];
}

export const revalidate = 30;

export async function generateStaticParams() {
  try {
    const posts = await getAllBlogPosts();
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getBlogPost(slug);
  if (!data) return { title: "Post not found" };

  const { post } = data;
  const title = post.metaTitle ?? post.title;
  const description = post.metaDescription ?? post.excerpt;
  const ogImage = articleImage(post);

  return {
    title: { absolute: title.length > 42 ? title : `${title} — ${site.name}` },
    description,
    keywords: post.tags.length ? post.tags : undefined,
    authors: [{ name: post.author.name, url: `${siteBaseUrl()}/about` }],
    icons: siteIcons,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      ...ogLocales,
      siteName: site.name,
      url: `${siteBaseUrl()}/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.publishedAt,
      section: post.category || undefined,
      tags: post.tags,
      authors: [post.author.name],
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const data = await getBlogPost(slug);
  if (!data) notFound();

  const { post, related } = data;

  return (
    <main className="article-page page-cinema blog-cinema">
      <ArticleReadingProgress />

      <section className="article-hero">
        {post.coverImage ? (
          <div className="article-hero-bg">
            <CloudinaryImage
              asset={post.coverImage}
              alt={post.title}
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
            <Breadcrumbs
              className="article-crumbs"
              items={[
                { label: "Home", href: "/" },
                { label: "Blog", href: "/blog" },
                { label: post.title },
              ]}
            />
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
