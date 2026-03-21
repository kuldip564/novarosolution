'use client';

import { useEffect, useMemo, useState } from 'react';
import ProtectedPage from '@/components/auth/ProtectedPage';
import { useAuth } from '@/context/AuthContext';
import {
  commentCreatorFeedContent,
  CreatorItem,
  fetchCreatorFeed,
  likeCreatorFeedContent
} from '@/lib/clientApi';

export default function CreatorFeedPage() {
  const { token, user } = useAuth();
  const [items, setItems] = useState<CreatorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [comments, setComments] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState('');

  useEffect(() => {
    let mounted = true;
    fetchCreatorFeed()
      .then((rows) => {
        if (mounted) setItems(rows);
      })
      .catch((err: any) => {
        if (mounted) setError(err?.message || 'Unable to load creator feed.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        String(item.title || '').toLowerCase().includes(q) ||
        String(item.caption || '').toLowerCase().includes(q) ||
        String(item.creatorName || '').toLowerCase().includes(q)
    );
  }, [items, query]);

  async function onLike(item: CreatorItem) {
    if (!token) return;
    setBusyId(`like-${item.id}`);
    try {
      const updated = await likeCreatorFeedContent(item.id, token);
      setItems((prev) => prev.map((row) => (row.id === item.id ? { ...row, ...updated } : row)));
    } catch (err: any) {
      setError(err?.message || 'Unable to update like.');
    } finally {
      setBusyId('');
    }
  }

  async function onComment(item: CreatorItem) {
    if (!token) return;
    const text = String(comments[item.id] || '').trim();
    if (!text) return;
    setBusyId(`comment-${item.id}`);
    try {
      const updated = await commentCreatorFeedContent(item.id, text, token);
      setItems((prev) => prev.map((row) => (row.id === item.id ? { ...row, ...updated } : row)));
      setComments((prev) => ({ ...prev, [item.id]: '' }));
    } catch (err: any) {
      setError(err?.message || 'Unable to add comment.');
    } finally {
      setBusyId('');
    }
  }

  return (
    <ProtectedPage>
      <section className="card space-y-4">
        <h1 className="text-3xl font-extrabold md:text-5xl">Creator Feed</h1>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search feed"
        />
        {loading ? <p className="text-slate-300">Loading feed...</p> : null}
        {error ? <p className="text-red-400">{error}</p> : null}
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map((item) => (
            <article key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
              {item.mediaType === 'video' ? (
                <video className="h-52 w-full rounded-lg object-cover" controls src={item.mediaUrl} />
              ) : (
                <img className="h-52 w-full rounded-lg object-cover" src={item.mediaUrl} alt={item.title} />
              )}
              <h2 className="mt-2 font-semibold">{item.title}</h2>
              {item.caption ? <p className="text-sm text-slate-300">{item.caption}</p> : null}
              <div className="mt-2 flex items-center gap-2">
                <button className="btn" disabled={busyId === `like-${item.id}`} onClick={() => onLike(item)}>
                  {Array.isArray(item.likedBy) && user?.id && item.likedBy.includes(user.id) ? 'Unlike' : 'Like'} (
                  {item.likesCount || 0})
                </button>
                <span className="text-xs text-slate-300">Comments: {item.comments?.length || 0}</span>
              </div>
              <div className="mt-2 flex gap-2">
                <input
                  value={comments[item.id] || ''}
                  onChange={(event) => setComments((prev) => ({ ...prev, [item.id]: event.target.value }))}
                  placeholder="Write comment"
                />
                <button className="btn" disabled={busyId === `comment-${item.id}`} onClick={() => onComment(item)}>
                  Comment
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </ProtectedPage>
  );
}
