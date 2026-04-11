'use client';

import { useEffect, useState } from 'react';
import ProtectedPage from '@/components/auth/ProtectedPage';
import { ContactSubmission, fetchContactSubmissions } from '@/lib/clientApi';
import { useAuth } from '@/context/AuthContext';

export default function AdminContactSubmissionsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const orderedItems = [...items].reverse();

  useEffect(() => {
    if (!token) return;
    fetchContactSubmissions(token)
      .then((rows) => setItems(rows))
      .catch((err: any) => setError(err?.message || 'Unable to load contact submissions.'))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <ProtectedPage requireAdmin>
      <main className="app-page-shell">
        <section className="admin-shell">
          <header className="premium-page-hero space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-400/90">Inbox</p>
            <h1 className="section-title text-3xl font-extrabold md:text-5xl">Contact submissions</h1>
            <p className="text-sm text-slate-400">Messages sent from the public contact form.</p>
          </header>
          {loading ? <p className="text-slate-400">Loading…</p> : null}
          {error ? <p className="premium-alert premium-alert--error">{error}</p> : null}
          <div className="space-y-4">
            {orderedItems.map((item) => (
              <article key={item.id} className="page-content-card space-y-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h2 className="text-lg font-semibold text-slate-100">{item.subject}</h2>
                  <p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
                <p className="text-slate-300">{item.message}</p>
                <p className="text-xs text-slate-500">
                  {item.name} · {item.email}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </ProtectedPage>
  );
}
