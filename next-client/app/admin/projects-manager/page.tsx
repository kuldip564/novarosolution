'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import ProtectedPage from '@/components/auth/ProtectedPage';
import { fetchSiteContentClient, updateSiteContent } from '@/lib/clientApi';
import { useAuth } from '@/context/AuthContext';

export default function AdminProjectsManagerPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [siteContent, setSiteContent] = useState<Record<string, any> | null>(null);
  const [pageTitle, setPageTitle] = useState('');
  const [pageDescription, setPageDescription] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [summary, setSummary] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);

  useEffect(() => {
    async function load() {
      try {
        const content = await fetchSiteContentClient();
        const page = content?.projectsPage || {};
        setSiteContent(content);
        setPageTitle(page.title || '');
        setPageDescription(page.description || '');
        setItems(Array.isArray(page.items) ? page.items : []);
      } catch (err: any) {
        setError(err?.message || 'Unable to load projects.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function persist(nextItems: any[], nextTitle = pageTitle, nextDescription = pageDescription, message = 'Saved') {
    if (!token || !siteContent) return;
    setSaving(true);
    setError('');
    setStatus('');
    try {
      const payload = {
        ...siteContent,
        projectsPage: {
          ...(siteContent.projectsPage || {}),
          title: nextTitle,
          description: nextDescription,
          items: nextItems
        }
      };
      const updated = await updateSiteContent(payload, token);
      setSiteContent(updated);
      setPageTitle(updated?.projectsPage?.title || nextTitle);
      setPageDescription(updated?.projectsPage?.description || nextDescription);
      setItems(Array.isArray(updated?.projectsPage?.items) ? updated.projectsPage.items : []);
      setStatus(message);
    } catch (err: any) {
      setError(err?.message || 'Unable to save projects.');
    } finally {
      setSaving(false);
    }
  }

  async function onSaveHeader(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await persist(items, pageTitle, pageDescription, 'Projects page header saved.');
  }

  async function onSubmitProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !summary.trim()) {
      setError('Project name and summary are required.');
      return;
    }
    const next = [...items];
    const payload = { ...next[editingIndex], name: name.trim(), summary: summary.trim() };
    if (editingIndex >= 0) next[editingIndex] = payload;
    else next.push(payload);
    await persist(next, pageTitle, pageDescription, editingIndex >= 0 ? 'Project updated.' : 'Project added.');
    setEditingIndex(-1);
    setName('');
    setSummary('');
  }

  async function onDelete(index: number) {
    const next = items.filter((_, i) => i !== index);
    await persist(next, pageTitle, pageDescription, 'Project deleted.');
  }

  function onEdit(index: number) {
    const item = items[index] || {};
    setEditingIndex(index);
    setName(item.name || '');
    setSummary(item.summary || '');
  }

  return (
    <ProtectedPage requireAdmin>
      <main className="app-page-shell">
      <section className="admin-shell">
        <article className="page-hero-shell space-y-3">
        <h1 className="section-title text-3xl font-extrabold md:text-5xl">Admin Projects Manager</h1>
        {loading ? <p className="text-slate-300">Loading projects...</p> : null}
        </article>
        <form className="page-content-card space-y-3" onSubmit={onSaveHeader}>
          <input value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} placeholder="Projects page title" />
          <textarea rows={3} value={pageDescription} onChange={(e) => setPageDescription(e.target.value)} placeholder="Projects page description" />
          <button className="admin-btn" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Header'}</button>
        </form>
        <form className="page-content-card space-y-3" onSubmit={onSubmitProject}>
          <h2 className="text-xl font-semibold">{editingIndex >= 0 ? 'Update Project' : 'Add Project'}</h2>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" />
          <textarea rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Project summary" />
          <button className="admin-btn" type="submit" disabled={saving}>
            {saving ? 'Saving...' : editingIndex >= 0 ? 'Update Project' : 'Add Project'}
          </button>
        </form>
        <div className="space-y-2">
          {items.map((item, index) => (
            <article key={`${item.name || 'project'}-${index}`} className="admin-list-card">
              <p className="font-semibold">{item.name}</p>
              <p className="text-slate-300">{item.summary}</p>
              <div className="mt-2 admin-toolbar">
                <button className="admin-btn" type="button" onClick={() => onEdit(index)}>Edit</button>
                <button className="admin-btn admin-btn-danger" type="button" onClick={() => onDelete(index)}>Delete</button>
              </div>
            </article>
          ))}
          {items.length === 0 ? <p className="text-slate-400">No projects yet.</p> : null}
        </div>
        {status ? <p className="text-emerald-400">{status}</p> : null}
        {error ? <p className="text-red-400">{error}</p> : null}
        <Link className="admin-btn inline-block" href="/admin/dashboard">
          Back to dashboard
        </Link>
      </section>
      </main>
    </ProtectedPage>
  );
}
