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

  useEffect(() => {
    if (!token) return;
    fetchContactSubmissions(token)
      .then((rows) => setItems(rows))
      .catch((err: any) => setError(err?.message || 'Unable to load contact submissions.'))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <ProtectedPage requireAdmin>
      <section className="card space-y-4">
        <h1 className="text-3xl font-extrabold md:text-5xl">Contact Submissions</h1>
        {loading ? <p className="text-slate-300">Loading submissions...</p> : null}
        {error ? <p className="text-red-400">{error}</p> : null}
        <div className="space-y-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-semibold">{item.subject}</h2>
                <p className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
              <p className="mt-2 text-slate-300">{item.message}</p>
              <p className="mt-2 text-xs text-slate-400">
                {item.name} - {item.email}
              </p>
            </article>
          ))}
        </div>
      </section>
    </ProtectedPage>
  );
}
