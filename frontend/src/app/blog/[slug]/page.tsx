import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { RevealScope } from "@/components/anim/RevealScope";
import { ArticleReadingProgress } from "@/components/blog/ArticleReadingProgress";
import { ArticleShareBar } from "@/components/blog/ArticleShareBar";
import { ArticleToc } from "@/components/blog/ArticleToc";
import { BlogList, blogHref } from "@/components/blog/BlogIndex";
import { StudioSectionHead } from "@/components/studio/StudioSectionHead";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
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
import "@/styles/studio.css";
import "@/styles/blog.css";
import "@/styles/article.css";

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

  const cover = post.coverImage;
  const initial = (author.kind === "person" ? author.name : site.name).charAt(0);

  return (
    <main className="st ar">
      <ArticleReadingProgress />
      <RevealScope attribute="data-st-reveal">
        <header className="ar-hero">
          <div className="wrap ar-hero__inner">
            <Breadcrumbs
              className="st-hero__crumbs ar-hero__crumbs"
              items={[
                { label: "Home", href: "/" },
                { label: "Blog", href: "/blog" },
                { label: post.title },
              ]}
            />
            <Link href={blogHref({ category: post.category })} className="ar-hero__cat">
              {cluster?.name ?? post.category}
            </Link>
            <h1 className="ar-hero__title">{post.title}</h1>
            <p className="ar-hero__dek">{post.excerpt}</p>
            <div className="ar-byline">
              <span className="ar-byline__avatar" aria-hidden="true">
                {initial}
              </span>
              <span className="ar-byline__who">
                {author.kind === "person" ? (
                  <>
                    <Link href="/about">{author.name}</Link>
                    <span>{author.role}</span>
                  </>
                ) : (
                  <>
                    <strong>{site.name} team</strong>
                    <span>Software studio in Gandhinagar, India</span>
                  </>
                )}
              </span>
              <dl className="ar-byline__facts">
                <div>
                  <dt>Published</dt>
                  <dd>
                    <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
                  </dd>
                </div>
                {updated ? (
                  <div>
                    <dt>Updated</dt>
                    <dd>
                      <time dateTime={updated}>{formatBlogDate(updated)}</time>
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt>Reading time</dt>
                  <dd>{post.readingTime} min</dd>
                </div>
              </dl>
            </div>
          </div>
          {cover ? (
            <figure className="wrap ar-cover">
              <CloudinaryImage
                asset={cover}
                alt=""
                width={1600}
                height={800}
                transformWidth={1600}
                className="ar-cover__img"
                priority
                sizes="(max-width: 1280px) 100vw, 1200px"
              />
            </figure>
          ) : null}
        </header>

        <div className="wrap ar-layout">
          {article.toc.length >= 3 ? (
            <div className="ar-layout__toc">
              <ArticleToc items={article.toc} />
            </div>
          ) : null}
          <div className="ar-layout__body">
            <article className="ar-prose" data-article-body dangerouslySetInnerHTML={{ __html: article.html }} />
            {article.sources.length > 0 ? (
              <section className="ar-sources" aria-labelledby="article-sources-title">
                <h2 id="article-sources-title">Sources</h2>
                <ol>
                  {article.sources.map((source) => (
                    <li key={source.href}>
                      <a href={source.href} target="_blank" rel="noopener noreferrer">
                        {source.label}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}
            {post.tags.length > 0 ? (
              <ul className="ar-tags" aria-label="Tags">
                {post.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            ) : null}
            <section className="ar-author" aria-labelledby="ar-author-title">
              <span className="ar-author__avatar" aria-hidden="true">
                {initial}
              </span>
              <div>
                <p className="ar-author__eyebrow">Written by</p>
                <h2 id="ar-author-title" className="ar-author__name">
                  {author.kind === "person" ? author.name : `The ${site.name} team`}
                </h2>
                <p className="ar-author__bio">
                  {author.kind === "person"
                    ? `${author.role} at ${site.name}, a software studio in Gandhinagar, India.`
                    : `${site.name} is a software studio in Gandhinagar, India. We build websites, web and mobile apps, AI features and marketing for companies in India and abroad, and write about what we learn doing it.`}
                </p>
                <Link href="/about" className="st-text-link">
                  About the studio
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </section>
          </div>
          <div className="ar-layout__share">
            <ArticleShareBar title={post.title} slug={post.slug} />
          </div>
        </div>

        <section className="st-section st-section--alt ar-more" aria-label="Keep going">
          <div className="wrap ar-more__grid">
            {cluster && clusterPosts.length > 0 ? (
              <div className="ar-series" data-st-reveal>
                <p className="st-eyebrow">Part of our {cluster.name.toLowerCase()} series</p>
                <h2 className="ar-series__title">More on this topic</h2>
                <ul className="ar-series__list">
                  {clusterPosts.map((item) => (
                    <li key={item.id}>
                      <Link href={`/blog/${item.slug}`}>
                        <span>{item.title}</span>
                        {item.slug === cluster.pillarSlug ? <em className="ar-series__pillar">Start here</em> : null}
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="ar-next" data-st-reveal style={{ ["--i" as string]: 1 }} data-cta-location="article-next">
              <p className="st-eyebrow st-eyebrow--light">Next step</p>
              <p className="ar-next__text">
                {cluster?.cta.text ?? `${next.pitch} Send us a short brief and we reply within one business day.`}
              </p>
              <div className="ar-next__actions">
                <Button href={cluster?.cta.href ?? "/contact"}>{cluster?.cta.buttonLabel ?? "Start Your Project"}</Button>
                <Link href={cluster?.service.href ?? next.href} className="ar-next__link">
                  {cluster?.service.label ?? next.label}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {related.length > 0 ? (
          <section className="st-section ar-related" aria-labelledby="ar-related-title">
            <div className="wrap">
              <StudioSectionHead
                eyebrow="Keep reading"
                id="ar-related-title"
                title="Related articles"
                align="split"
                action={
                  <Link href="/blog" className="st-text-link">
                    All articles
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                }
              />
              <BlogList posts={related} />
            </div>
          </section>
        ) : null}
      </RevealScope>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(articleJsonLd(post, article.sources)) }}
      />
    </main>
  );
}
