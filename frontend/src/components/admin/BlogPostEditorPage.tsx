"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArticleView } from "@/components/blog/ArticleView";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { estimateReadingTime, RichTextEditor } from "@/components/admin/RichTextEditor";
import { StringListEditor } from "@/components/admin/StringListEditor";
import { useAdminToast } from "@/components/admin/AdminToast";
import {
  adminPostToBlogPost,
  defaultBlogPostInput,
  fromDatetimeLocalValue,
  slugifyBlogTitle,
  toDatetimeLocalValue,
  type AdminBlogPost,
  type AdminBlogPostInput,
  type PostStatus,
} from "@/lib/admin-blog";
import { adminFetch } from "@/lib/admin-api";
import { SEO_MAX_SLUG_LENGTH } from "@/lib/slug";

const STATUS_OPTIONS: Array<{ value: PostStatus; label: string }> = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "SCHEDULED", label: "Scheduled" },
];

const CATEGORY_SUGGESTIONS = ["Product", "AI / ML", "Growth", "Engineering", "Design"];

type BlogPostEditorPageProps = {
  postId?: string;
};

export function BlogPostEditorPage({ postId }: BlogPostEditorPageProps) {
  const router = useRouter();
  const { push } = useAdminToast();
  const [form, setForm] = useState<AdminBlogPostInput>(defaultBlogPostInput);
  const [loading, setLoading] = useState(Boolean(postId));
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const readingTime = useMemo(() => estimateReadingTime(form.content), [form.content]);

  const load = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const post = await adminFetch<AdminBlogPost>(`/api/admin/posts/${postId}`);
      setForm({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        content: post.content,
        category: post.category,
        tags: post.tags ?? [],
        author: post.author ?? { name: "Novaro Team", avatar: null },
        status: post.status,
        publishedAt: post.publishedAt,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        ogImage: post.ogImage,
      });
    } catch {
      push("Could not load post", "error");
    } finally {
      setLoading(false);
    }
  }, [postId, push]);

  useEffect(() => {
    void load();
  }, [load]);

  function patch<K extends keyof AdminBlogPostInput>(key: K, value: AdminBlogPostInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      push("Title, excerpt, and content are required", "error");
      return;
    }
    if (form.status === "SCHEDULED" && !form.publishedAt) {
      push("Scheduled posts need a publish date", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        slug: form.slug.trim() || slugifyBlogTitle(form.title),
        tags: form.tags.filter(Boolean),
      };

      if (postId) {
        await adminFetch(`/api/admin/posts/${postId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        push("Post updated");
      } else {
        const created = await adminFetch<{ id: string }>(`/api/admin/posts`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        push("Post created");
        router.replace(`/admin/blog/${created.id}`);
      }
    } catch (err) {
      push(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  }

  async function removePost() {
    if (!postId) return;
    try {
      await adminFetch(`/api/admin/posts/${postId}`, { method: "DELETE" });
      push("Post deleted");
      router.push("/admin/blog");
    } catch {
      push("Delete failed", "error");
    }
  }

  const previewPost = adminPostToBlogPost(form, readingTime);

  if (loading) {
    return <div className="admin-empty">Loading post…</div>;
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <Link href="/admin/blog" className="admin-back-link">
            ← All posts
          </Link>
          <h1>{postId ? "Edit post" : "New post"}</h1>
          <p>{readingTime} min read · {form.status.toLowerCase()}</p>
        </div>
        <div className="admin-editor-actions">
          <button type="button" className="admin-btn ghost" onClick={() => setPreviewOpen(true)}>
            Preview
          </button>
          {postId && (
            <button type="button" className="admin-btn danger" onClick={() => setDeleteOpen(true)}>
              Delete
            </button>
          )}
          <button type="button" className="admin-btn" disabled={saving} onClick={() => void save()}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="admin-editor-grid">
        <div className="admin-editor-main">
          <fieldset className="admin-form-section">
            <legend>Content</legend>
            <label className="admin-field">
              <span>Title</span>
              <input
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  patch("title", title);
                  if (!form.slug.trim()) patch("slug", slugifyBlogTitle(title));
                }}
              />
            </label>
            <label className="admin-field">
              <span>Slug</span>
              <input
                value={form.slug}
                maxLength={SEO_MAX_SLUG_LENGTH}
                onChange={(e) => patch("slug", slugifyBlogTitle(e.target.value))}
              />
            </label>
            <label className="admin-field">
              <span>Excerpt</span>
              <textarea
                value={form.excerpt}
                rows={3}
                onChange={(e) => patch("excerpt", e.target.value)}
              />
            </label>
            <div className="admin-field">
              <span>Body</span>
              <RichTextEditor
                value={form.content}
                onChange={(html) => patch("content", html)}
              />
            </div>
          </fieldset>
        </div>

        <aside className="admin-editor-side">
          <fieldset className="admin-form-section">
            <legend>Publish</legend>
            <label className="admin-field">
              <span>Status</span>
              <select
                value={form.status}
                onChange={(e) => patch("status", e.target.value as PostStatus)}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            {(form.status === "SCHEDULED" || form.status === "PUBLISHED") && (
              <label className="admin-field">
                <span>{form.status === "SCHEDULED" ? "Publish at" : "Published at (optional)"}</span>
                <input
                  type="datetime-local"
                  value={toDatetimeLocalValue(form.publishedAt)}
                  onChange={(e) => patch("publishedAt", fromDatetimeLocalValue(e.target.value))}
                />
              </label>
            )}
            <label className="admin-field">
              <span>Category</span>
              <input
                value={form.category}
                list="blog-categories"
                onChange={(e) => patch("category", e.target.value)}
              />
              <datalist id="blog-categories">
                {CATEGORY_SUGGESTIONS.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </label>
            <StringListEditor
              label="Tags"
              value={form.tags}
              onChange={(tags) => patch("tags", tags)}
              addLabel="+ Tag"
              placeholder="Next.js"
            />
          </fieldset>

          <fieldset className="admin-form-section">
            <legend>Media</legend>
            <ImageUpload
              label="Cover image"
              value={form.coverImage}
              onChange={(asset) => patch("coverImage", asset)}
            />
            <ImageUpload
              label="OG image (optional)"
              value={form.ogImage}
              onChange={(asset) => patch("ogImage", asset)}
            />
          </fieldset>

          <fieldset className="admin-form-section">
            <legend>Author</legend>
            <label className="admin-field">
              <span>Name</span>
              <input
                value={form.author.name}
                onChange={(e) =>
                  patch("author", { ...form.author, name: e.target.value })
                }
              />
            </label>
            <ImageUpload
              label="Avatar"
              value={form.author.avatar}
              onChange={(asset) =>
                patch("author", { ...form.author, avatar: asset })
              }
            />
          </fieldset>

          <fieldset className="admin-form-section">
            <legend>SEO</legend>
            <label className="admin-field">
              <span>Meta title</span>
              <input
                value={form.metaTitle ?? ""}
                onChange={(e) => patch("metaTitle", e.target.value || null)}
              />
            </label>
            <label className="admin-field">
              <span>Meta description</span>
              <textarea
                value={form.metaDescription ?? ""}
                rows={3}
                onChange={(e) => patch("metaDescription", e.target.value || null)}
              />
            </label>
          </fieldset>
        </aside>
      </div>

      {previewOpen && (
        <div className="admin-preview-backdrop" onClick={() => setPreviewOpen(false)}>
          <div className="admin-preview-panel" onClick={(e) => e.stopPropagation()}>
            <div className="admin-preview-head">
              <h2>Preview</h2>
              <button type="button" className="admin-btn ghost" onClick={() => setPreviewOpen(false)}>
                Close
              </button>
            </div>
            <div className="admin-preview-scroll">
              <ArticleView post={previewPost} preview showShare={false} />
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteOpen}
        title="Delete post?"
        message="This cannot be undone."
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => {
          setDeleteOpen(false);
          void removePost();
        }}
      />
    </>
  );
}
