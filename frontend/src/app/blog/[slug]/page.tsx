import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleReadingProgress } from "@/components/blog/ArticleReadingProgress";
import { ArticleShareBar } from "@/components/blog/ArticleShareBar";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { Reveal } from "@/components/anim/Reveal";
import { Button } from "@/components/Button";
import {
  formatBlogDate,
  getAllBlogPosts,
  getBlogPost,
  type BlogPost,
} from "@/lib/blog";
import { enhanceArticle, type ArticleSource } from "@/lib/article-enhance";
import { clusterForPost, resolveArticleAuthor } from "@/lib/content-clusters";
import { jsonLdString } from "@/lib/json-ld";
import { cloudinaryTransformUrl } from "@/lib/media";
import { site } from "@/lib/site-data";
import { ogImagePath, ogLocales, siteBaseUrl, siteIcons } from "@/lib/site-metadata";
import { breadcrumbJsonLd, ORGANIZATION_ID } from "@/lib/structured-data";

/** The service (or page) each article leads to — a contextual next step for readers. */
function articleService(post: BlogPost): { href: string; label: string; pitch: string } {
  const bySlug: Record<string, { href: string; label: string; pitch: string }> = {
    "working-with-us-teams": { href: "/software-development-usa", label: "How US teams work with us", pitch: "Calls in your morning, weekly demos, one team." },
    "hire-it-services-company": { href: "/it-services", label: "IT services for companies anywhere", pitch: "Web apps, AI, and marketing from one accountable team." },
  };
  if (bySlug[post.slug]) return bySlug[post.slug];
  if (/ai|ml/i.test(post.category)) return { href: "/services/ai-machine-ml", label: "AI & machine learning services", pitch: "AI features with a job, a measure, and a fallback." };
  if (/growth|seo|marketing/i.test(post.category)) return { href: "/services/digital-marketing", label: "Digital marketing & SEO services", pitch: "Technical SEO and campaigns aimed at a product that loads." };
  return { href: "/services/web-app-eng", label: "Web & app development services", pitch: "SaaS products, mobile apps, and the APIs behind them." };
}

/** The last-edit date, only when it falls on a later day than publication. */
function updatedDate(post: BlogPost): string | null {
  if (!post.updatedAt) return null;
  return post.updatedAt.slice(0, 10) > post.publishedAt.slice(0, 10) ? post.updatedAt : null;
}

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

function absoluteUrl(url: string): string {
  return url.startsWith("http") ? url : `${siteBaseUrl()}${url.startsWith("/") ? "" : "/"}${url}`;
}

/** Branded card with the post title — unique per post. */
function articleCardImage(post: BlogPost): string {
  return absoluteUrl(ogImagePath(post.title, post.category || "Blog"));
}

/**
 * Share image: the post's own OG image or Cloudinary cover when it has one; otherwise the branded
 * title card (the built-in posts share a few stock covers, which would make every preview identical).
 */
function articleImage(post: BlogPost): string {
  const own = cloudinaryTransformUrl(post.ogImage ?? post.coverImage, { width: 1200 });
  if (own && own.includes("cloudinary.com")) return own;
  return articleCardImage(post);
}

/** Every image Google may use for the article, as absolute URLs. */
function articleImages(post: BlogPost): string[] {
  const images = [articleImage(post)];
  const cover = post.coverImage?.secureUrl;
  if (cover) images.push(absoluteUrl(cover));
  return [...new Set(images)];
}

function articleJsonLd(post: BlogPost, sources: ArticleSource[] = []) {
  const url = `${siteBaseUrl()}/blog/${post.slug}`;
  const author = resolveArticleAuthor(post.author.name);
  const cluster = clusterForPost(post);

  return [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: post.metaTitle ?? post.title,
      description: post.metaDescription ?? post.excerpt,
      image: articleImages(post),
      datePublished: post.publishedAt,
      dateModified: updatedDate(post) ?? post.publishedAt,
      inLanguage: "en",
      articleSection: cluster?.name ?? (post.category || undefined),
      keywords: post.tags.length ? post.tags.join(", ") : undefined,
      timeRequired: post.readingTime ? `PT${post.readingTime}M` : undefined,
      // A named person only when the byline matches someone on the team page.
      author:
        author.kind === "person"
          ? {
              "@type": "Person",
              name: author.name,
              jobTitle: author.role,
              worksFor: { "@id": ORGANIZATION_ID },
              url: `${siteBaseUrl()}/about`,
            }
          : { "@type": "Organization", "@id": ORGANIZATION_ID, name: site.name, url: siteBaseUrl() },
      publisher: {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: site.name,
        url: siteBaseUrl(),
        logo: { "@type": "ImageObject", url: `${siteBaseUrl()}/brand/novaro-icon.png` },
      },
      citation: sources.length ? sources.map((source) => source.href) : undefined,
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
      modifiedTime: updatedDate(post) ?? post.publishedAt,
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
  const article = enhanceArticle(post.content);
  const author = resolveArticleAuthor(post.author.name);
  const cluster = clusterForPost(post);
  const updated = updatedDate(post);
  const next = articleService(post);

  // Other articles in the same cluster, pillar first (contextual internal links).
  const clusterPosts = cluster
    ? (await getAllBlogPosts().catch(() => []))
        .filter((item) => item.slug !== post.slug && clusterForPost(item)?.id === cluster.id)
        .sort((a, b) => Number(b.slug === cluster.pillarSlug) - Number(a.slug === cluster.pillarSlug))
        .slice(0, 4)
    : [];

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
              <span>
                {author.kind === "person" ? (
                  <>
                    By <Link href="/about">{author.name}</Link>, {author.role}
                  </>
                ) : (
                  <>By the {site.name} team</>
                )}
              </span>
              <span>
                Published <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
              </span>
              {updated ? (
                <span>
                  Updated <time dateTime={updated}>{formatBlogDate(updated)}</time>
                </span>
              ) : null}
              <span>{post.readingTime} min read</span>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="wrap article-layout">
        <ArticleShareBar title={post.title} slug={post.slug} />
        {article.toc.length >= 3 ? (
          <nav className="article-toc" aria-label="In this article">
            <span className="article-toc__label">In this article</span>
            <ol>
              {article.toc.map((heading) => (
                <li key={heading.id}>
                  <a href={`#${heading.id}`}>{heading.text}</a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <article className="article-body" dangerouslySetInnerHTML={{ __html: article.html }} />
        {article.sources.length > 0 ? (
          <section className="article-sources" aria-labelledby="article-sources-title">
            <h2 id="article-sources-title">Sources</h2>
            <ol>
              {article.sources.map((source) => (
                <li key={source.href}>
                  <a href={source.href} target="_blank" rel="noopener noreferrer">
                    {source.label}
                  </a>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
        {post.tags.length > 0 && (
          <div className="article-tags">
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        )}
      </div>

      {cluster && clusterPosts.length > 0 ? (
        <aside className="wrap article-cluster" aria-labelledby="article-cluster-title">
          <div className="article-cluster__card">
            <span className="eyebrow">Part of our {cluster.name.toLowerCase()} series</span>
            <h2 id="article-cluster-title">More on this topic</h2>
            <ul>
              {clusterPosts.map((item) => (
                <li key={item.id}>
                  <Link href={`/blog/${item.slug}`}>{item.title}</Link>
                  {item.slug === cluster.pillarSlug ? <span className="article-cluster__pillar">Start here</span> : null}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      ) : null}

      <aside className="wrap article-next" aria-label="Next step">
        <div className="article-next__card">
          <span className="eyebrow">Next step</span>
          <p>
            {cluster?.cta.text ?? `${next.pitch} Send us a short brief and we reply within one business day.`}
          </p>
          <div className="article-next__actions">
            <Button href={cluster?.cta.href ?? "/contact"}>{cluster?.cta.buttonLabel ?? "Start Your Project"}</Button>
            <Link href={cluster?.service.href ?? next.href}>{cluster?.service.label ?? next.label}</Link>
          </div>
        </div>
      </aside>

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
        dangerouslySetInnerHTML={{ __html: jsonLdString(articleJsonLd(post, article.sources)) }}
      />
    </main>
  );
}
