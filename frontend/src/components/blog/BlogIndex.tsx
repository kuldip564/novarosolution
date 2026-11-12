import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { BlogAuthorMeta } from "@/components/blog/BlogAuthorMeta";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { formatBlogDate, type BlogPost } from "@/lib/blog";
import { parseCloudinaryAsset } from "@/lib/media";

/** Listing URL for a topic and page, landing on the article list rather than the hero. */
export function blogHref({ category, page }: { category?: string; page?: number }) {
  const params = new URLSearchParams();
  if (page && page > 1) params.set("page", String(page));
  if (category) params.set("category", category);
  const query = params.toString();
  return `/blog${query ? `?${query}` : ""}#articles`;
}

/* ───────────────────────── 01 · Hero with the latest article ───────────────────────── */

function FeaturedPost({ post }: { post: BlogPost }) {
  const cover = parseCloudinaryAsset(post.coverImage);
  return (
    <article className="bl-feature" aria-labelledby="bl-feature-title">
      <Link href={`/blog/${post.slug}`} className="bl-feature__link">
        {cover ? (
          <span className="bl-feature__media">
            <CloudinaryImage
              asset={cover}
              alt=""
              width={1200}
              height={675}
              transformWidth={1200}
              className="bl-feature__img"
              sizes="(max-width: 1023px) 100vw, 560px"
              priority
            />
          </span>
        ) : null}
        <span className="bl-feature__body">
          <span className="bl-feature__label">
            <span>Latest</span> {post.category}
          </span>
          <h2 id="bl-feature-title" className="bl-feature__title">
            {post.title}
          </h2>
          <span className="bl-feature__excerpt">{post.excerpt}</span>
          <span className="bl-feature__meta">
            <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime} min read</span>
            <span className="bl-feature__go" aria-hidden="true">
              <ArrowUpRight size={18} />
            </span>
          </span>
        </span>
      </Link>
    </article>
  );
}

export function BlogHero({
  lede,
  featured,
  total,
  topics,
}: {
  lede: string;
  featured: BlogPost | null;
  total: number;
  topics: number;
}) {
  const lines = ["Field notes", "from the studio."];
  return (
    <section className={`st-hero bl-hero${featured ? "" : " bl-hero--plain"}`} aria-labelledby="bl-hero-title">
      <div className="wrap st-hero__inner bl-hero__inner">
        <div className="bl-hero__copy">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} className="st-hero__crumbs" />
          <p className="st-eyebrow st-hero__eyebrow">Blog · Software, AI &amp; SEO</p>
          <h1 id="bl-hero-title" className="st-hero__title bl-hero__title">
            {lines.map((line, index) => (
              <span key={line} className={`st-mask${index === lines.length - 1 ? " st-mask--accent" : ""}`}>
                <span style={{ ["--line" as string]: index }}>{line}</span>
                {index < lines.length - 1 ? " " : null}
              </span>
            ))}
          </h1>
          <p className="st-hero__lede">{lede}</p>
          <dl className="st-stats bl-hero__stats">
            <div>
              <dt>Articles</dt>
              <dd>{String(total).padStart(2, "0")}</dd>
            </div>
            <div>
              <dt>Topics</dt>
              <dd>{String(topics).padStart(2, "0")}</dd>
            </div>
            <div>
              <dt>Written by</dt>
              <dd className="bl-hero__byline">The Novaro team</dd>
            </div>
          </dl>
        </div>
        {featured ? <FeaturedPost post={featured} /> : null}
      </div>
    </section>
  );
}

/* ───────────────────────── 02 · Topics and the article list ───────────────────────── */

export function BlogTopics({ categories, active }: { categories: string[]; active?: string }) {
  if (!categories.length) return null;
  return (
    <nav className="bl-topics" aria-label="Filter articles by topic">
      <Link href={blogHref({})} className="bl-topic" aria-current={!active ? "page" : undefined}>
        All topics
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={blogHref({ category })}
          className="bl-topic"
          aria-current={active === category ? "page" : undefined}
        >
          {category}
        </Link>
      ))}
    </nav>
  );
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <li className="bl-card" data-st-reveal style={{ ["--i" as string]: index % 3 }}>
      <Link href={`/blog/${post.slug}`} className="bl-card__link">
        <span className="bl-card__top">
          <span className="bl-card__cat">{post.category}</span>
          <span className="bl-card__time">{post.readingTime} min read</span>
        </span>
        <h3 className="bl-card__title">{post.title}</h3>
        <span className="bl-card__excerpt">{post.excerpt}</span>
        <span className="bl-card__foot">
          <BlogAuthorMeta author={post.author} className="bl-card__author" />
          <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
          <ArrowUpRight className="bl-card__go" size={18} aria-hidden="true" />
        </span>
      </Link>
    </li>
  );
}

export function BlogList({ posts }: { posts: BlogPost[] }) {
  return (
    <ul className="bl-grid">
      {posts.map((post, index) => (
        <BlogCard key={post.id} post={post} index={index} />
      ))}
    </ul>
  );
}

export function BlogPager({ page, totalPages, category }: { page: number; totalPages: number; category?: string }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  return (
    <nav className="bl-pager" aria-label="Article pages">
      {page > 1 ? (
        <Link href={blogHref({ category, page: page - 1 })} className="bl-pager__step" rel="prev">
          <ArrowLeft size={16} aria-hidden="true" /> Newer
        </Link>
      ) : (
        <span className="bl-pager__step is-off" aria-hidden="true">
          <ArrowLeft size={16} /> Newer
        </span>
      )}
      <ol className="bl-pager__pages">
        {pages.map((n) => (
          <li key={n}>
            <Link
              href={blogHref({ category, page: n })}
              className="bl-pager__page"
              aria-current={n === page ? "page" : undefined}
              aria-label={`Page ${n}`}
            >
              {n}
            </Link>
          </li>
        ))}
      </ol>
      {page < totalPages ? (
        <Link href={blogHref({ category, page: page + 1 })} className="bl-pager__step" rel="next">
          Older <ArrowRight size={16} aria-hidden="true" />
        </Link>
      ) : (
        <span className="bl-pager__step is-off" aria-hidden="true">
          Older <ArrowRight size={16} />
        </span>
      )}
    </nav>
  );
}
