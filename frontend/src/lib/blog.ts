import type { CloudinaryAsset } from "./media";

const API_ORIGIN =
  process.env.API_PROXY_TARGET ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:5001";

const FETCH_TIMEOUT_MS = 2500;

export type BlogAuthor = {
  name: string;
  avatar: CloudinaryAsset | null;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: CloudinaryAsset | null;
  content: string;
  category: string;
  tags: string[];
  author: BlogAuthor;
  publishedAt: string;
  readingTime: number;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: CloudinaryAsset | null;
};

export type BlogListResponse = {
  posts: BlogPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  categories: string[];
};

export type BlogPostResponse = {
  post: BlogPost;
  related: BlogPost[];
};

async function fetchBlog<T>(path: string, fallback: T): Promise<T> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(`${API_ORIGIN}${path}`, {
      next: { revalidate: 30 },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return fallback;
    const json = (await res.json()) as { ok?: boolean; data?: T };
    return json.ok && json.data !== undefined ? json.data : fallback;
  } catch {
    return fallback;
  }
}

export async function getBlogPosts(options: {
  page?: number;
  limit?: number;
  category?: string;
} = {}): Promise<BlogListResponse> {
  const params = new URLSearchParams();
  params.set("page", String(options.page ?? 1));
  params.set("limit", String(options.limit ?? 9));
  if (options.category) params.set("category", options.category);

  return fetchBlog<BlogListResponse>(`/api/content/blog?${params}`, {
    posts: [],
    pagination: { page: 1, limit: 9, total: 0, totalPages: 1 },
    categories: [],
  });
}

export async function getBlogPost(slug: string): Promise<BlogPostResponse | null> {
  const data = await fetchBlog<BlogPostResponse | null>(
    `/api/content/blog/${encodeURIComponent(slug)}`,
    null,
  );
  return data;
}

export function formatBlogDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function siteBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}
