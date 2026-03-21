'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import ProtectedPage from '@/components/auth/ProtectedPage';
import { fetchSiteContentClient, updateSiteContent } from '@/lib/clientApi';
import { useAuth } from '@/context/AuthContext';

export default function AdminServiceManagerPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [siteContent, setSiteContent] = useState<Record<string, any> | null>(null);
  const [servicesTitle, setServicesTitle] = useState('');
  const [servicesDescription, setServicesDescription] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);

  useEffect(() => {
    async function load() {
      try {
        const content = await fetchSiteContentClient();
        const serviceBlock = content?.services || {};
        const serviceItems = Array.isArray(serviceBlock?.items) ? serviceBlock.items : [];
        setSiteContent(content);
        setServicesTitle(serviceBlock.title || '');
        setServicesDescription(serviceBlock.description || '');
        setItems(serviceItems);
      } catch (err: any) {
        setError(err?.message || 'Unable to load services.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function persist(nextItems: any[], nextTitle = servicesTitle, nextDescription = servicesDescription, message = 'Saved') {
    if (!token || !siteContent) return;
    setSaving(true);
    setError('');
    setStatus('');
    try {
      const payload = {
        ...siteContent,
        services: {
          ...(siteContent.services || {}),
          title: nextTitle,
          description: nextDescription,
          items: nextItems
        }
      };
      const updated = await updateSiteContent(payload, token);
      const updatedItems = Array.isArray(updated?.services?.items) ? updated.services.items : [];
      setSiteContent(updated);
      setServicesTitle(updated?.services?.title || nextTitle);
      setServicesDescription(updated?.services?.description || nextDescription);
      setItems(updatedItems);
      setStatus(message);
    } catch (err: any) {
      setError(err?.message || 'Unable to save services.');
    } finally {
      setSaving(false);
    }
  }

  async function onSaveSection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await persist(items, servicesTitle, servicesDescription, 'Service section saved.');
  }

  async function onSubmitService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }
    const next = [...items];
    const payload = {
      ...next[editingIndex],
      title: title.trim(),
      description: description.trim()
    };
    if (editingIndex >= 0) next[editingIndex] = payload;
    else next.push(payload);
    await persist(next, servicesTitle, servicesDescription, editingIndex >= 0 ? 'Service updated.' : 'Service added.');
    setEditingIndex(-1);
    setTitle('');
    setDescription('');
  }

  async function onDelete(index: number) {
    const next = items.filter((_, i) => i !== index);
    await persist(next, servicesTitle, servicesDescription, 'Service deleted.');
  }

  function onEdit(index: number) {
    const item = items[index] || {};
    setEditingIndex(index);
    setTitle(item.title || '');
    setDescription(item.description || '');
  }

  return (
    <ProtectedPage requireAdmin>
      <main className="app-page-shell">
      <section className="admin-shell">
        <article className="page-hero-shell space-y-3">
        <h1 className="section-title text-3xl font-extrabold md:text-5xl">Admin Service Manager</h1>
        {loading ? <p className="text-slate-300">Loading services...</p> : null}
        </article>
        <form className="page-content-card space-y-3" onSubmit={onSaveSection}>
          <input value={servicesTitle} onChange={(e) => setServicesTitle(e.target.value)} placeholder="Services section title" />
          <textarea rows={3} value={servicesDescription} onChange={(e) => setServicesDescription(e.target.value)} placeholder="Services section description" />
          <button className="admin-btn" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Section'}</button>
        </form>
        <form className="page-content-card space-y-3" onSubmit={onSubmitService}>
          <h2 className="text-xl font-semibold">{editingIndex >= 0 ? 'Update Service' : 'Add Service'}</h2>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Service title" />
          <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Service description" />
          <button className="admin-btn" type="submit" disabled={saving}>
            {saving ? 'Saving...' : editingIndex >= 0 ? 'Update Service' : 'Add Service'}
          </button>
        </form>
        <div className="space-y-2">
          {items.map((item, index) => (
            <article key={`${item.title || 'service'}-${index}`} className="admin-list-card">
              <p className="font-semibold">{item.title}</p>
              <p className="text-slate-300">{item.description}</p>
              <div className="mt-2 admin-toolbar">
                <button className="admin-btn" type="button" onClick={() => onEdit(index)}>Edit</button>
                <button className="admin-btn admin-btn-danger" type="button" onClick={() => onDelete(index)}>Delete</button>
              </div>
            </article>
          ))}
          {items.length === 0 ? <p className="text-slate-400">No services yet.</p> : null}
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
