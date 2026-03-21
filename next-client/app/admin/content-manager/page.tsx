'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import ProtectedPage from '@/components/auth/ProtectedPage';
import { fetchSiteContentClient, updateSiteContent } from '@/lib/clientApi';
import { useAuth } from '@/context/AuthContext';

export default function AdminContentManagerPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [jsonText, setJsonText] = useState('{}');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const content = await fetchSiteContentClient();
        setJsonText(JSON.stringify(content, null, 2));
      } catch (err: any) {
        setError(err?.message || 'Unable to load content.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function onSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setSaving(true);
    setStatus('');
    setError('');
    try {
      const payload = JSON.parse(jsonText);
      const updated = await updateSiteContent(payload, token);
      setJsonText(JSON.stringify(updated, null, 2));
      setStatus('Content updated successfully.');
    } catch (err: any) {
      setError(err?.message || 'Invalid JSON or save failed.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedPage requireAdmin>
      <main className="app-page-shell">
      <section className="admin-shell">
        <article className="page-hero-shell space-y-3">
        <h1 className="section-title text-3xl font-extrabold md:text-5xl">Admin Content Manager</h1>
        <p className="text-slate-300">Edit full site content JSON and save directly.</p>
        {loading ? <p className="text-slate-300">Loading content...</p> : null}
        </article>
        <form className="page-content-card space-y-3" onSubmit={onSave}>
          <textarea
            rows={26}
            value={jsonText}
            onChange={(event) => setJsonText(event.target.value)}
            className="font-mono text-xs"
          />
          <button className="admin-btn" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Website Content'}
          </button>
        </form>
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
