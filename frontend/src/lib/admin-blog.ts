import type { CloudinaryAsset } from "./media";

export type PostStatus = "DRAFT" | "PUBLISHED" | "SCHEDULED";

export type AdminBlogAuthor = {
  name: string;
  avatar: CloudinaryAsset | null;
};

export type AdminBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: CloudinaryAsset | null;
  content: string;
  category: string;
  tags: string[];
  author: AdminBlogAuthor;
  status: PostStatus;
  publishedAt: string | null;
  readingTime: number;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: CloudinaryAsset | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminBlogPostInput = {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: CloudinaryAsset | null;
  content: string;
  category: string;
  tags: string[];
  author: AdminBlogAuthor;
  status: PostStatus;
  publishedAt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: CloudinaryAsset | null;
};

export const defaultBlogPostInput = (): AdminBlogPostInput => ({
  title: "",
  slug: "",
  excerpt: "",
  coverImage: null,
  content: "<p></p>",
  category: "Product",
  tags: [],
  author: { name: "Novaro Team", avatar: null },
  status: "DRAFT",
  publishedAt: null,
  metaTitle: null,
  metaDescription: null,
  ogImage: null,
});

import { slugifyText } from "./slug";

export function slugifyBlogTitle(title: string): string {
  return slugifyText(title);
}

export function toDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDatetimeLocalValue(value: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export function adminPostToBlogPost(
  input: AdminBlogPostInput,
  readingTime: number,
): import("./blog").BlogPost {
  return {
    id: "preview",
    title: input.title || "Untitled post",
    slug: input.slug || "preview",
    excerpt: input.excerpt,
    coverImage: input.coverImage,
    content: input.content,
    category: input.category,
    tags: input.tags,
    author: input.author,
    publishedAt: input.publishedAt ?? new Date().toISOString(),
    readingTime,
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
    ogImage: input.ogImage ?? input.coverImage,
  };
}
