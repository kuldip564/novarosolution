"use client";

import Link from "next/link";
import { ArticleShareBar } from "@/components/blog/ArticleShareBar";
import { BlogAuthorMeta } from "@/components/blog/BlogAuthorMeta";
import { CloudinaryImage } from "@/components/admin/CloudinaryImage";
import { formatBlogDate, type BlogPost } from "@/lib/blog";

type ArticleViewProps = {
  post: BlogPost;
  preview?: boolean;
  showShare?: boolean;
};

export function ArticleView({ post, preview = false, showShare = true }: ArticleViewProps) {
  return (
    <div className={`article-page ${preview ? "article-preview" : ""}`}>
      {preview && (
        <div className="article-preview-banner">Preview — not yet published</div>
      )}

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
          <div className="article-hero-fallback">
            <span className="blog-pill">{post.category}</span>
          </div>
        )}

        <div className="wrap article-hero-inner">
          {!preview && (
            <Link href="/blog" className="article-back">
              ← Back to blog
            </Link>
          )}
          <span className="blog-pill">{post.category}</span>
          <h1>{post.title}</h1>
          <div className="article-meta">
            <BlogAuthorMeta author={post.author} />
            <span>{formatBlogDate(post.publishedAt)}</span>
            <span>{post.readingTime} min read</span>
          </div>
        </div>
      </section>

      <div className="wrap article-layout">
        {showShare && !preview && <ArticleShareBar title={post.title} slug={post.slug} />}
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
    </div>
  );
}
