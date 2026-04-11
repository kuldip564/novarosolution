'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MessageCircle, RefreshCw, Search, ThumbsUp } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import SafeImage from '@/components/ui/SafeImage';
import ProtectedPage from '@/components/auth/ProtectedPage';
import { useAuth } from '@/context/AuthContext';
import {
  commentCreatorFeedContent,
  CreatorItem,
  fetchCreatorFeed,
  likeCreatorFeedContent
} from '@/lib/clientApi';

type ToastItem = {
  id: string;
  tone: 'success' | 'error';
  message: string;
};

const FEED_PAGE_SIZE = 8;

function normalizeFeedItem(item: CreatorItem, viewerId?: string): CreatorItem {
  const comments = Array.isArray(item.comments) ? item.comments : [];
  const commentsPreview = Array.isArray(item.commentsPreview)
    ? item.commentsPreview
    : comments.slice(0, 3);
  const likedBy = Array.isArray(item.likedBy) ? item.likedBy : [];
  const likesCount = Number(item.likesCount ?? likedBy.length ?? 0);
  const commentsCount = Number(item.commentsCount ?? comments.length ?? commentsPreview.length ?? 0);
  const likedByMe =
    typeof item.likedByMe === 'boolean'
      ? item.likedByMe
      : Boolean(viewerId && likedBy.includes(viewerId));

  return {
    ...item,
    likesCount,
    commentsCount,
    likedByMe,
    likedBy: likedBy.length ? likedBy : undefined,
    comments: comments.length ? comments : undefined,
    commentsPreview
  };
}

function FeedSkeleton() {
  return (
    <SkeletonTheme baseColor="#1e293b" highlightColor="#334155">
      <div className="creator-feed-grid" aria-hidden>
        {[1, 2, 3, 4].map((index) => (
          <article key={index} className="creator-feed-card creator-feed-card-skeleton">
            <Skeleton height={230} borderRadius={12} />
            <Skeleton height={16} width="72%" />
            <Skeleton height={12} width="42%" />
            <Skeleton height={12} count={2} />
            <div className="creator-comment-form">
              <Skeleton height={38} />
              <Skeleton height={38} width={90} />
            </div>
          </article>
        ))}
      </div>
    </SkeletonTheme>
  );
}

export default function CreatorFeedPage() {
  const { token, user } = useAuth();
  const reduceMotion = useReducedMotion();
  const [items, setItems] = useState<CreatorItem[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [queryInput, setQueryInput] = useState('');
  const [query, setQuery] = useState('');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'image' | 'video'>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'discussed'>('latest');
  const [comments, setComments] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [busyLikeId, setBusyLikeId] = useState('');
  const [busyCommentId, setBusyCommentId] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  function showToast(tone: ToastItem['tone'], message: string) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, tone, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 2600);
  }

  async function loadFeed({ silent = false, append = false, targetPage = 1 } = {}) {
    if (!silent && !append) setLoadingInitial(true);
    if (silent) setRefreshing(true);
    if (append) setLoadingMore(true);
    if (!silent) setError('');

    try {
      const response = await fetchCreatorFeed(
        {
          page: targetPage,
          limit: FEED_PAGE_SIZE,
          sort: sortBy,
          view: 'summary',
          commentsPreviewLimit: 3
        },
        token || undefined
      );
      const normalizedRows = response.items.map((row) => normalizeFeedItem(row, user?.id));
      const nextHasMore = Boolean(response.pagination?.hasMore);
      setHasMore(nextHasMore);
      setPage(targetPage);
      setItems((prev) => (append ? [...prev, ...normalizedRows] : normalizedRows));
    } catch (err: any) {
      const message = err?.message || 'Unable to load creator feed.';
      setError(message);
      if (silent) showToast('error', message);
    } finally {
      setLoadingInitial(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setQuery(queryInput.trim());
    }, 260);
    return () => window.clearTimeout(timeout);
  }, [queryInput]);

  useEffect(() => {
    loadFeed({ targetPage: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, token]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.visibilityState !== 'visible' || loadingMore || loadingInitial) return;
      loadFeed({ silent: true, targetPage: 1 });
    }, 12000);
    return () => {
      window.clearInterval(interval);
    };
  }, [loadingInitial, loadingMore, sortBy, token, user?.id]);

  const totalLikes = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.likesCount || 0), 0),
    [items]
  );
  const totalComments = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.commentsCount ?? item.comments?.length ?? 0), 0),
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
        return Number(b.commentsCount ?? b.comments?.length ?? 0) - Number(a.commentsCount ?? a.comments?.length ?? 0);
      }
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
    return sorted;
  }, [items, mediaFilter, query, sortBy]);

  async function onLike(item: CreatorItem) {
    if (!token) return;
    const previous = item;
    setError('');
    setBusyLikeId(item.id);
    setItems((prev) =>
      prev.map((row) => {
        if (row.id !== item.id) return row;
        const likedByMe = !Boolean(row.likedByMe);
        const likesCount = Math.max(0, Number(row.likesCount || 0) + (likedByMe ? 1 : -1));
        return { ...row, likedByMe, likesCount };
      })
    );
    try {
      const updated = await likeCreatorFeedContent(item.id, token);
      const normalized = normalizeFeedItem({ ...item, ...updated }, user?.id);
      setItems((prev) => prev.map((row) => (row.id === item.id ? { ...row, ...normalized } : row)));
      showToast('success', normalized.likedByMe ? 'Liked.' : 'Like removed.');
    } catch (err: any) {
      setItems((prev) => prev.map((row) => (row.id === previous.id ? previous : row)));
      const message = err?.message || 'Unable to update like.';
      setError(message);
      showToast('error', message);
    } finally {
      setBusyLikeId('');
    }
  }

  async function onComment(event: FormEvent<HTMLFormElement>, item: CreatorItem) {
    event.preventDefault();
    if (!token) return;
    const text = String(comments[item.id] || '').trim();
    if (!text) return;
    const optimisticComment = {
      id: `local-${Date.now()}`,
      userName: user?.name || 'You',
      text
    };
    const previous = item;
    setError('');
    setBusyCommentId(item.id);
    setComments((prev) => ({ ...prev, [item.id]: '' }));
    setExpandedComments((prev) => ({ ...prev, [item.id]: true }));
    setItems((prev) =>
      prev.map((row) => {
        if (row.id !== item.id) return row;
        const nextPreview = [...(row.commentsPreview || []), optimisticComment].slice(-3);
        return {
          ...row,
          commentsCount: Number(row.commentsCount ?? row.comments?.length ?? 0) + 1,
          commentsPreview: nextPreview
        };
      })
    );

    try {
      const updated = await commentCreatorFeedContent(item.id, text, token);
      const normalized = normalizeFeedItem({ ...item, ...updated }, user?.id);
      setItems((prev) => prev.map((row) => (row.id === item.id ? { ...row, ...normalized } : row)));
      showToast('success', 'Comment added.');
    } catch (err: any) {
      setItems((prev) => prev.map((row) => (row.id === previous.id ? previous : row)));
      setComments((prev) => ({ ...prev, [item.id]: text }));
      const message = err?.message || 'Unable to add comment.';
      setError(message);
      showToast('error', message);
    } finally {
      setBusyCommentId('');
    }
  }

  return (
    <ProtectedPage>
      <main className="app-page-shell">
        <section className="creator-shell">
          <article className="premium-page-hero space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-400/90">Community</p>
            <h1 className="section-title text-3xl font-extrabold md:text-5xl">Creator Feed</h1>
            <p className="text-sm text-slate-300">
              Discover fresh creator uploads, react in real time, and engage with comments in a premium social feed.
            </p>
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
                value={queryInput}
                onChange={(event) => setQueryInput(event.target.value)}
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
              <button
                className="btn btn-sm"
                type="button"
                onClick={() => loadFeed({ targetPage: 1 })}
                disabled={loadingInitial || refreshing}
              >
                <RefreshCw size={14} className={refreshing ? 'creator-spin' : ''} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
            {error ? <p className="text-red-400">{error}</p> : null}
          </article>

          <AnimatePresence>
            {toasts.length ? (
              <motion.div
                className="creator-toast-stack"
                initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: 10 }}
              >
                {toasts.map((toast) => (
                  <motion.p
                    key={toast.id}
                    className={`creator-toast ${toast.tone === 'success' ? 'is-success' : 'is-error'}`}
                    initial={reduceMotion ? undefined : { opacity: 0, y: 6 }}
                    animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: 6 }}
                  >
                    {toast.message}
                  </motion.p>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>

          {loadingInitial ? <FeedSkeleton /> : null}

          <div className="creator-feed-grid">
            {visible.map((item, index) => (
              <motion.article
                key={item.id}
                className="creator-feed-card"
                initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.22 }}
                transition={{ duration: 0.32, delay: index * 0.04 }}
                whileHover={reduceMotion ? undefined : { y: -3 }}
              >
                <div className="creator-feed-media-wrap h-[230px]">
                  {item.mediaType === 'video' ? (
                    <video className="creator-feed-media" controls src={item.mediaUrl} preload="none" />
                  ) : (
                    <SafeImage
                      src={item.mediaUrl}
                      alt={item.title ? `Creator feed image: ${item.title}` : 'Creator feed image'}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="creator-feed-media"
                      loading="lazy"
                    />
                  )}
                  <span className="creator-media-chip">{item.mediaType === 'video' ? 'Video' : 'Photo'}</span>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <h2 className="font-semibold">{item.title}</h2>
                  <p className="text-xs text-slate-400">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</p>
                </div>
                <p className="text-xs text-slate-400">By {item.creatorName || 'Creator'}</p>
                {item.caption ? <p className="text-sm text-slate-300">{item.caption}</p> : null}
                <div className="mt-3 creator-action-row">
                  <button
                    className={`btn btn-sm creator-social-btn ${item.likedByMe ? 'is-active' : ''}`}
                    disabled={busyLikeId === item.id}
                    onClick={() => onLike(item)}
                  >
                    <ThumbsUp size={14} />
                    {item.likedByMe ? 'Liked' : 'Like'} ({item.likesCount || 0})
                  </button>
                  <button
                    className="btn btn-sm creator-social-btn"
                    type="button"
                    onClick={() => setExpandedComments((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                  >
                    <MessageCircle size={14} />
                    {expandedComments[item.id]
                      ? 'Hide Comments'
                      : `Comments (${item.commentsCount ?? item.comments?.length ?? 0})`}
                  </button>
                </div>
                <AnimatePresence initial={false}>
                  {expandedComments[item.id] ? (
                    <motion.div
                      className="creator-comment-list"
                      initial={reduceMotion ? undefined : { opacity: 0, height: 0 }}
                      animate={reduceMotion ? undefined : { opacity: 1, height: 'auto' }}
                      exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
                      transition={{ duration: 0.22 }}
                    >
                      {(item.commentsPreview || item.comments || []).length === 0 ? (
                        <p className="text-xs text-slate-400">No comments yet.</p>
                      ) : (
                        (item.commentsPreview || item.comments || []).map((comment) => (
                          <article key={comment.id} className="creator-comment-item">
                            <p className="text-xs text-slate-400">{comment.userName || 'User'}</p>
                            <p className="text-sm">{comment.text}</p>
                          </article>
                        ))
                      )}
                      {item.commentsCount && item.commentsCount > (item.commentsPreview || []).length ? (
                        <p className="text-[11px] text-slate-400">Showing latest {Math.min((item.commentsPreview || []).length, 3)} comments.</p>
                      ) : null}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
                <form className="creator-comment-form" onSubmit={(event) => onComment(event, item)}>
                  <div className="creator-comment-input-wrap">
                    <Search size={14} />
                    <input
                      value={comments[item.id] || ''}
                      onChange={(event) => setComments((prev) => ({ ...prev, [item.id]: event.target.value }))}
                      placeholder="Write comment"
                    />
                  </div>
                  <button className="btn btn-sm" type="submit" disabled={busyCommentId === item.id}>
                    {busyCommentId === item.id ? 'Posting...' : 'Comment'}
                  </button>
                </form>
              </motion.article>
            ))}
            {!loadingInitial && visible.length === 0 ? (
              <article className="page-content-card">
                <p className="text-slate-400">No creator posts match your search/filter right now.</p>
              </article>
            ) : null}
          </div>
          {!loadingInitial && hasMore ? (
            <div className="creator-loadmore-wrap">
              <button
                className="btn"
                type="button"
                disabled={loadingMore}
                onClick={() => loadFeed({ append: true, targetPage: page + 1 })}
              >
                {loadingMore ? 'Loading more...' : 'Load more'}
              </button>
            </div>
          ) : null}
        </section>
      </main>
    </ProtectedPage>
  );
}
