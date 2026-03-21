'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
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
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'image' | 'video'>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'discussed'>('latest');
  const [comments, setComments] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [busyId, setBusyId] = useState('');

  async function loadFeed(silent = false) {
    if (!silent) {
      setLoading(true);
    }
    try {
      const rows = await fetchCreatorFeed();
      setItems(rows);
    } catch (err: any) {
      setError(err?.message || 'Unable to load creator feed.');
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    loadFeed();
    const interval = window.setInterval(() => {
      loadFeed(true);
    }, 12000);
    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const totalLikes = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.likesCount || 0), 0),
    [items]
  );
  const totalComments = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.comments?.length || 0), 0),
    [items]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filteredBySearch = items.filter((item) => {
      const passType = mediaFilter === 'all' || item.mediaType === mediaFilter;
      const passQuery =
        !q ||
        String(item.title || '').toLowerCase().includes(q) ||
        String(item.caption || '').toLowerCase().includes(q) ||
        String(item.creatorName || '').toLowerCase().includes(q);
      return passType && passQuery;
    });
    const sorted = [...filteredBySearch].sort((a, b) => {
      if (sortBy === 'popular') {
        return Number(b.likesCount || 0) - Number(a.likesCount || 0);
      }
      if (sortBy === 'discussed') {
        return Number(b.comments?.length || 0) - Number(a.comments?.length || 0);
      }
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
    return sorted;
  }, [items, mediaFilter, query, sortBy]);

  async function onLike(item: CreatorItem) {
    if (!token) return;
    setError('');
    setStatus('');
    setBusyId(`like-${item.id}`);
    try {
      const updated = await likeCreatorFeedContent(item.id, token);
      setItems((prev) => prev.map((row) => (row.id === item.id ? { ...row, ...updated } : row)));
      setStatus('Reaction updated.');
    } catch (err: any) {
      setError(err?.message || 'Unable to update like.');
    } finally {
      setBusyId('');
    }
  }

  async function onComment(event: FormEvent<HTMLFormElement>, item: CreatorItem) {
    event.preventDefault();
    if (!token) return;
    const text = String(comments[item.id] || '').trim();
    if (!text) return;
    setError('');
    setStatus('');
    setBusyId(`comment-${item.id}`);
    try {
      const updated = await commentCreatorFeedContent(item.id, text, token);
      setItems((prev) => prev.map((row) => (row.id === item.id ? { ...row, ...updated } : row)));
      setComments((prev) => ({ ...prev, [item.id]: '' }));
      setExpandedComments((prev) => ({ ...prev, [item.id]: true }));
      setStatus('Comment added.');
    } catch (err: any) {
      setError(err?.message || 'Unable to add comment.');
    } finally {
      setBusyId('');
    }
  }

  return (
    <ProtectedPage>
      <main className="app-page-shell">
        <section className="creator-shell">
          <article className="page-hero-shell space-y-3">
            <h1 className="section-title text-3xl font-extrabold md:text-5xl">Creator Feed</h1>
            <p className="text-sm text-slate-300">Discover fresh creator uploads, react fast, and engage with comments.</p>
            <div className="creator-stat-grid">
              <article className="creator-stat-card">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Posts</p>
                <p className="text-2xl font-bold">{items.length}</p>
              </article>
              <article className="creator-stat-card">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Likes</p>
                <p className="text-2xl font-bold">{totalLikes}</p>
              </article>
              <article className="creator-stat-card">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Comments</p>
                <p className="text-2xl font-bold">{totalComments}</p>
              </article>
            </div>
          </article>

          <article className="page-content-card space-y-3">
            <div className="creator-toolbar">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search feed by title, caption, creator..."
              />
              <select value={mediaFilter} onChange={(event) => setMediaFilter(event.target.value as 'all' | 'image' | 'video')}>
                <option value="all">All media</option>
                <option value="image">Image only</option>
                <option value="video">Video only</option>
              </select>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value as 'latest' | 'popular' | 'discussed')}>
                <option value="latest">Latest first</option>
                <option value="popular">Most liked</option>
                <option value="discussed">Most discussed</option>
              </select>
              <button className="btn btn-sm" type="button" onClick={() => loadFeed()} disabled={loading}>
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
            {status ? <p className="text-emerald-400">{status}</p> : null}
            {error ? <p className="text-red-400">{error}</p> : null}
            {loading ? <p className="text-slate-300">Loading feed...</p> : null}
          </article>

          <div className="creator-feed-grid">
          {visible.map((item) => (
            <article key={item.id} className="creator-feed-card">
              <div className="creator-feed-media-wrap">
              {item.mediaType === 'video' ? (
                <video className="creator-feed-media" controls src={item.mediaUrl} />
              ) : (
                <img className="creator-feed-media" src={item.mediaUrl} alt={item.title} />
              )}
                <span className="creator-media-chip">{item.mediaType === 'video' ? 'Video' : 'Photo'}</span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <h2 className="font-semibold">{item.title}</h2>
                <p className="text-xs text-slate-400">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</p>
              </div>
              <p className="text-xs text-slate-400">By {item.creatorName || 'Creator'}</p>
              {item.caption ? <p className="text-sm text-slate-300">{item.caption}</p> : null}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button className="btn btn-sm" disabled={busyId === `like-${item.id}`} onClick={() => onLike(item)}>
                  {Array.isArray(item.likedBy) && user?.id && item.likedBy.includes(user.id) ? 'Unlike' : 'Like'} (
                  {item.likesCount || 0})
                </button>
                <button
                  className="btn btn-sm"
                  type="button"
                  onClick={() => setExpandedComments((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                >
                  {expandedComments[item.id] ? 'Hide Comments' : `Comments (${item.comments?.length || 0})`}
                </button>
              </div>
              {expandedComments[item.id] ? (
                <div className="creator-comment-list">
                  {(item.comments || []).length === 0 ? (
                    <p className="text-xs text-slate-400">No comments yet.</p>
                  ) : (
                    (item.comments || []).map((comment) => (
                      <article key={comment.id} className="creator-comment-item">
                        <p className="text-xs text-slate-400">{comment.userName || 'User'}</p>
                        <p className="text-sm">{comment.text}</p>
                      </article>
                    ))
                  )}
                </div>
              ) : null}
              <form className="creator-comment-form" onSubmit={(event) => onComment(event, item)}>
                <input
                  value={comments[item.id] || ''}
                  onChange={(event) => setComments((prev) => ({ ...prev, [item.id]: event.target.value }))}
                  placeholder="Write comment"
                />
                <button className="btn btn-sm" type="submit" disabled={busyId === `comment-${item.id}`}>
                  Comment
                </button>
              </form>
            </article>
          ))}
            {!loading && visible.length === 0 ? (
              <article className="page-content-card">
                <p className="text-slate-400">No creator posts match your search/filter right now.</p>
              </article>
            ) : null}
          </div>
        </section>
      </main>
    </ProtectedPage>
  );
}
