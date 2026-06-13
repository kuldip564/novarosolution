import Link from "next/link";
import { CloudinaryImage } from "@/components/admin/CloudinaryImage";
import { Reveal } from "@/components/anim/Reveal";
import { BlogAuthorMeta } from "@/components/blog/BlogAuthorMeta";
import type { BlogPost } from "@/lib/blog";
import { formatBlogDate } from "@/lib/blog";

type BlogPostCardProps = {
  post: BlogPost;
  featured?: boolean;
  delay?: number;
};

export function BlogPostCard({ post, featured = false, delay = 0 }: BlogPostCardProps) {
  return (
    <Reveal delay={delay}>
      <Link href={`/blog/${post.slug}`} className={`blog-card ${featured ? "featured" : ""}`}>
        <div className="blog-card-media">
          {post.coverImage ? (
            <CloudinaryImage
              asset={post.coverImage}
              alt={post.title}
              width={featured ? 1400 : 800}
              height={featured ? 720 : 520}
              transformWidth={featured ? 1200 : 640}
              className="blog-card-img"
              sizes={featured ? "100vw" : "(max-width: 768px) 100vw, 33vw"}
            />
          ) : (
            <div className="blog-card-ph">
              <span>{post.category}</span>
            </div>
          )}
          <span className="blog-card-category">{post.category}</span>
        </div>
        <div className="blog-card-body">
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
          <div className="blog-meta">
            <BlogAuthorMeta author={post.author} />
            <span>{formatBlogDate(post.publishedAt)}</span>
            <span>{post.readingTime} min read</span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
