'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import ProtectedPage from '@/components/auth/ProtectedPage';
import {
  createAdminBlogPost,
  deleteAdminBlogPost,
  fetchAdminBlogPosts,
  fetchSanityAdminBlogPosts,
  type AdminBlogPost,
  type SanityAdminBlogPost,
  updateAdminBlogPost
} from '@/lib/clientApi';
import { useAuth } from '@/context/AuthContext';

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  authorName: string;
  status: 'draft' | 'published';
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
};

const SANITY_STUDIO_URL = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'https://novarosolution.sanity.studio/';
const SANITY_STUDIO_BASE_URL = SANITY_STUDIO_URL.replace(/\/+$/, '');

const EMPTY_FORM: FormState = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImageUrl: '',
  authorName: '',
  status: 'draft',
  publishedAt: '',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: ''
};

function isoToInputValue(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 16);
}

export default function AdminBlogManagerPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [busyDeleteId, setBusyDeleteId] = useState('');
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState('');
  const [rows, setRows] = useState<AdminBlogPost[]>([]);
  const [sanityRows, setSanityRows] = useState<SanityAdminBlogPost[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  async function loadBlogs() {
    if (!token) return;
    setLoading(true);
    setErrorMessage('');
    try {
      const [items, sanityItems] = await Promise.all([
        fetchAdminBlogPosts(token),
        fetchSanityAdminBlogPosts()
      ]);
      setRows(items);
      setSanityRows(sanityItems);
    } catch (error: any) {
      setErrorMessage(error?.message || 'Unable to load blog posts.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const visibleRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((item) => {
      const text = `${item.title} ${item.slug} ${item.excerpt || ''} ${item.status}`.toLowerCase();
      return text.includes(q);
    });
  }, [query, rows]);

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId('');
  }

  function startEdit(row: AdminBlogPost) {
    setEditingId(row.id);
    setForm({
      title: row.title || '',
      slug: row.slug || '',
      excerpt: row.excerpt || '',
      content: row.content || '',
      coverImageUrl: row.coverImageUrl || '',
      authorName: row.authorName || '',
      status: row.status || 'draft',
      publishedAt: isoToInputValue(row.publishedAt),
      seoTitle: row.seoTitle || '',
      seoDescription: row.seoDescription || '',
      seoKeywords: Array.isArray(row.seoKeywords) ? row.seoKeywords.join(', ') : ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    if (!form.title.trim()) return setErrorMessage('Title is required.');
    if (!form.content.trim()) return setErrorMessage('Content is required.');

    setSaving(true);
    setStatusMessage('');
    setErrorMessage('');

    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        coverImageUrl: form.coverImageUrl.trim(),
        authorName: form.authorName.trim(),
        status: form.status,
        publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : undefined,
        seoTitle: form.seoTitle.trim(),
        seoDescription: form.seoDescription.trim(),
        seoKeywords: form.seoKeywords
      };

      if (editingId) {
        await updateAdminBlogPost(editingId, payload, token);
        setStatusMessage('Blog post updated.');
      } else {
        await createAdminBlogPost(payload, token);
        setStatusMessage('Blog post created.');
      }

      resetForm();
      await loadBlogs();
    } catch (error: any) {
      setErrorMessage(error?.message || 'Unable to save blog post.');
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(row: AdminBlogPost) {
    if (!token) return;
    if (!window.confirm(`Delete "${row.title}"?`)) return;
    setBusyDeleteId(row.id);
    setStatusMessage('');
    setErrorMessage('');
    try {
      await deleteAdminBlogPost(row.id, token);
      setStatusMessage('Blog post deleted.');
      if (editingId === row.id) resetForm();
      await loadBlogs();
    } catch (error: any) {
      setErrorMessage(error?.message || 'Unable to delete blog post.');
    } finally {
      setBusyDeleteId('');
    }
  }

  function getSanityEditUrl(documentId: string) {
    return `${SANITY_STUDIO_BASE_URL}/intent/edit/id=${encodeURIComponent(documentId)};type=blogPost`;
  }

  const openSanityCreateUrl = `${SANITY_STUDIO_BASE_URL}/intent/create/template=blogPost;type=blogPost`;

  return (
    <ProtectedPage requireAdmin>
      <main className="app-page-shell admin-blog-manager-page">
        <section className="admin-shell space-y-4">
          <article className="page-hero-shell space-y-3">
            <h1 className="section-title text-3xl font-extrabold md:text-5xl">Admin Blog Manager</h1>
            <p className="text-slate-300">
              Create and manage blog posts with SEO fields, publish status, and slug control.
            </p>
            <p className="text-xs text-slate-400">
              For rich blog design, images, and republish flow, manage posts directly in Sanity Studio.
            </p>
            <div className="admin-toolbar">
              <button className="admin-btn" type="button" onClick={loadBlogs}>Refresh</button>
              <Link className="admin-btn" href="/blog">View Blog</Link>
              <a className="admin-btn" href={SANITY_STUDIO_URL} target="_blank" rel="noreferrer">
                Open Sanity Studio
              </a>
              <a className="admin-btn" href={openSanityCreateUrl} target="_blank" rel="noreferrer">
                Add Blog In Studio
              </a>
              <Link className="admin-btn" href="/admin/dashboard">Dashboard</Link>
            </div>
          </article>

          <form className="page-content-card space-y-3" onSubmit={onSubmit}>
            <h2 className="text-xl font-semibold">{editingId ? 'Edit Blog Post' : 'Create Blog Post'}</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Title"
              />
              <input
                value={form.slug}
                onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
                placeholder="Slug (optional)"
              />
              <input
                value={form.authorName}
                onChange={(event) => setForm((prev) => ({ ...prev, authorName: event.target.value }))}
                placeholder="Author name"
              />
              <input
                value={form.coverImageUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, coverImageUrl: event.target.value }))}
                placeholder="Cover image URL"
              />
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, status: event.target.value as FormState['status'] }))
                }
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <input
                type="datetime-local"
                value={form.publishedAt}
                onChange={(event) => setForm((prev) => ({ ...prev, publishedAt: event.target.value }))}
              />
            </div>

            <textarea
              rows={3}
              value={form.excerpt}
              onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))}
              placeholder="Excerpt"
            />
            <textarea
              rows={10}
              value={form.content}
              onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
              placeholder="Main content"
            />

            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={form.seoTitle}
                onChange={(event) => setForm((prev) => ({ ...prev, seoTitle: event.target.value }))}
                placeholder="SEO title"
              />
              <input
                value={form.seoKeywords}
                onChange={(event) => setForm((prev) => ({ ...prev, seoKeywords: event.target.value }))}
                placeholder="SEO keywords (comma separated)"
              />
            </div>
            <textarea
              rows={2}
              value={form.seoDescription}
              onChange={(event) => setForm((prev) => ({ ...prev, seoDescription: event.target.value }))}
              placeholder="SEO description"
            />

            <div className="admin-toolbar">
              <button className="admin-btn" type="submit" disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Update Blog Post' : 'Create Blog Post'}
              </button>
              {editingId ? (
                <button className="admin-btn" type="button" onClick={resetForm}>
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </form>

          {statusMessage ? <p className="text-emerald-400">{statusMessage}</p> : null}
          {errorMessage ? <p className="text-red-400">{errorMessage}</p> : null}

          <article className="page-content-card space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-semibold">Blog Posts</h2>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search posts..."
                className="max-w-xs"
              />
            </div>

            {loading ? <p className="text-slate-300">Loading posts...</p> : null}
            {!loading && !visibleRows.length ? <p className="text-slate-400">No blog posts found.</p> : null}

            <div className="space-y-2">
              {visibleRows.map((row) => (
                <article key={row.id} className="admin-list-card">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold">{row.title}</p>
                      <p className="text-xs text-slate-400">
                        /blog/{row.slug} | {row.status} |{' '}
                        {row.publishedAt ? new Date(row.publishedAt).toLocaleString() : 'Not published'}
                      </p>
                    </div>
                    <div className="admin-toolbar">
                      <Link className="admin-btn" href={`/blog/${row.slug}`}>Open</Link>
                      <button className="admin-btn" type="button" onClick={() => startEdit(row)}>Edit</button>
                      <button
                        className="admin-btn admin-btn-danger"
                        type="button"
                        disabled={busyDeleteId === row.id}
                        onClick={() => onDelete(row)}
                      >
                        {busyDeleteId === row.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="page-content-card space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-semibold">Sanity Studio Blog Posts</h2>
              <a className="admin-btn" href={openSanityCreateUrl} target="_blank" rel="noreferrer">
                Add New
              </a>
            </div>
            <p className="text-sm text-slate-400">
              Use these actions to edit post design, add photos/media blocks, publish, and republish updates.
            </p>

            {!loading && !sanityRows.length ? <p className="text-slate-400">No Sanity blog posts found.</p> : null}

            <div className="space-y-2">
              {sanityRows.map((row) => (
                <article key={row.id} className="admin-list-card">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold">{row.title}</p>
                      <p className="text-xs text-slate-400">
                        /blog/{row.slug || 'no-slug'} | {row.status} |{' '}
                        {row.publishedAt ? new Date(row.publishedAt).toLocaleString() : 'No publish date'}
                      </p>
                    </div>
                    <div className="admin-toolbar">
                      {row.slug ? <Link className="admin-btn" href={`/blog/${row.slug}`}>Open</Link> : null}
                      <a className="admin-btn" href={getSanityEditUrl(row.id)} target="_blank" rel="noreferrer">
                        Edit In Studio
                      </a>
                      <a className="admin-btn" href={getSanityEditUrl(row.id)} target="_blank" rel="noreferrer">
                        Republish
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </article>
        </section>
      </main>
    </ProtectedPage>
  );
}
