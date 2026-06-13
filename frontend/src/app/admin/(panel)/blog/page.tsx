"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useAdminToast } from "@/components/admin/AdminToast";
import { BlogCoverThumb } from "@/components/blog/BlogAuthorMeta";
import { adminFetch } from "@/lib/admin-api";
import type { AdminBlogPost, PostStatus } from "@/lib/admin-blog";

const STATUS_FILTERS: Array<{ value: "" | PostStatus; label: string }> = [
  { value: "", label: "All" },
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "SCHEDULED", label: "Scheduled" },
];

export default function AdminBlogListPage() {
  const { push } = useAdminToast();
  const [rows, setRows] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"" | PostStatus>("");
  const [deleteTarget, setDeleteTarget] = useState<AdminBlogPost | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (query.trim()) params.set("q", query.trim());
      const path = `/api/admin/posts${params.toString() ? `?${params}` : ""}`;
      const data = await adminFetch<AdminBlogPost[]>(path);
      setRows(data);
    } catch {
      push("Failed to load posts", "error");
    } finally {
      setLoading(false);
    }
  }, [push, query, status]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => rows, [rows]);

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await adminFetch(`/api/admin/posts/${deleteTarget.id}`, { method: "DELETE" });
      push("Deleted");
      setDeleteTarget(null);
      await load();
    } catch {
      push("Delete failed", "error");
    }
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Blog</h1>
          <p>Create, schedule, and publish articles to the public blog.</p>
        </div>
        <Link href="/admin/blog/new" className="admin-btn">
          New post
        </Link>
      </div>

      <div className="admin-toolbar">
        <input
          type="search"
          placeholder="Search posts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="admin-filter-pills">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.label}
              type="button"
              className={status === filter.value ? "active" : undefined}
              onClick={() => setStatus(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <span className="admin-toolbar-count">
          {loading ? "…" : `${filtered.length} post${filtered.length === 1 ? "" : "s"}`}
        </span>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-skeleton-table">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="admin-skeleton-row" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">No posts yet — write your first article.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Updated</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr key={post.id}>
                  <td className="admin-thumb-cell">
                    <BlogCoverThumb
                      coverImage={post.coverImage}
                      title={post.title}
                      category={post.category}
                    />
                  </td>
                  <td>
                    <strong>{post.title}</strong>
                    <div className="admin-muted-inline">/{post.slug}</div>
                  </td>
                  <td>{post.category}</td>
                  <td>
                    <span className={`admin-status-pill ${post.status.toLowerCase()}`}>
                      {post.status}
                    </span>
                  </td>
                  <td>{new Date(post.updatedAt).toLocaleString()}</td>
                  <td className="admin-row-actions">
                    <Link href={`/admin/blog/${post.id}`} className="admin-btn ghost">
                      Edit
                    </Link>
                    {post.status === "PUBLISHED" && (
                      <Link href={`/blog/${post.slug}`} className="admin-btn ghost" target="_blank">
                        View live
                      </Link>
                    )}
                    <button
                      type="button"
                      className="admin-btn danger"
                      onClick={() => setDeleteTarget(post)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete post?"
        message="This cannot be undone."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
