import { useEffect, useMemo, useState } from 'react';
import HomeLayout from '../assets/componet/HomeLayout';
import { commentCreatorFeedContent, fetchCreatorFeed, likeCreatorFeedContent } from '../config/api';
import { useAuth } from '../context/AuthContext';

const CreatorFeedPage = () => {
  const { token, user, isAuthenticated } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [commentDrafts, setCommentDrafts] = useState({});
  const [actionId, setActionId] = useState('');

  useEffect(() => {
    let mounted = true;
    async function loadFeed() {
      try {
        const data = await fetchCreatorFeed();
        if (!mounted) return;
        setRows(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Unable to load creator feed.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadFeed();
    return () => {
      mounted = false;
    };
  }, []);

  const visibleRows = useMemo(() => {
    const q = String(query || '').trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((item) => {
      return (
        String(item.title || '').toLowerCase().includes(q) ||
        String(item.caption || '').toLowerCase().includes(q) ||
        String(item.creatorName || '').toLowerCase().includes(q)
      );
    });
  }, [rows, query]);

  const handleLike = async (item) => {
    if (!isAuthenticated) {
      setError('Login required to like content.');
      return;
    }
    setActionId(`like-${item.id}`);
    try {
      const updated = await likeCreatorFeedContent(item.id, token);
      setRows((prev) => prev.map((row) => (row.id === item.id ? { ...row, ...updated } : row)));
    } catch (err) {
      setError(err.message || 'Unable to update like.');
    } finally {
      setActionId('');
    }
  };

  const handleComment = async (item) => {
    if (!isAuthenticated) {
      setError('Login required to comment.');
      return;
    }
    const text = String(commentDrafts[item.id] || '').trim();
    if (!text) return;
    setActionId(`comment-${item.id}`);
    try {
      const updated = await commentCreatorFeedContent(item.id, text, token);
      setRows((prev) => prev.map((row) => (row.id === item.id ? { ...row, ...updated } : row)));
      setCommentDrafts((prev) => ({ ...prev, [item.id]: '' }));
    } catch (err) {
      setError(err.message || 'Unable to add comment.');
    } finally {
      setActionId('');
    }
  };

  return (
    <HomeLayout>
      <main className="mx-auto w-[96vw] max-w-[1260px] px-2 pb-14 pt-8 md:px-0 text-white">
        <section className="overflow-hidden rounded-3xl border border-white/12 bg-slate-950/80 p-6 md:p-8">
          <div className="relative">
            <div className="pointer-events-none absolute -top-24 -right-24 h-60 w-60 rounded-full bg-linear-to-br from-pink-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl" />
            <h1 className="relative text-2xl font-semibold text-slate-100 md:text-3xl">Content Feed</h1>
            <p className="relative mt-2 text-sm text-slate-300">
              Browse all creator uploads published on your website.
            </p>
          </div>
          <div className="mt-5">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, caption, creator..."
              className="w-full rounded-xl border border-white/12 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
            />
          </div>
        </section>

        <section className="mt-6">
          {loading ? (
            <p className="text-sm text-slate-400">Loading content feed...</p>
          ) : error ? (
            <p className="text-sm text-red-400">{error}</p>
          ) : visibleRows.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center text-sm text-slate-400">
              No content available for selected filter.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleRows.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-[0_10px_30px_rgba(0,0,0,0.22)]"
                >
                  <div className="h-52 w-full bg-slate-950/70">
                    {item.mediaType === 'video' ? (
                      <video src={item.mediaUrl} controls className="h-full w-full object-cover" />
                    ) : (
                      <img src={item.mediaUrl} alt={item.title} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="p-4">
                    <h2 className="mt-1 text-base font-semibold text-slate-100">{item.title}</h2>
                    {item.caption && <p className="mt-2 text-sm text-slate-300 line-clamp-3">{item.caption}</p>}
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        disabled={actionId === `like-${item.id}`}
                        onClick={() => handleLike(item)}
                        className="rounded-lg border border-pink-400/35 bg-pink-500/10 px-3 py-1.5 text-xs font-semibold text-pink-200 disabled:opacity-60"
                      >
                        {Array.isArray(item.likedBy) && user?.id && item.likedBy.includes(user.id) ? 'Unlike' : 'Like'} ({item.likesCount || 0})
                      </button>
                      <span className="text-xs text-slate-400">
                        Comments: {Array.isArray(item.comments) ? item.comments.length : 0}
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex gap-2">
                        <input
                          value={commentDrafts[item.id] || ''}
                          onChange={(event) =>
                            setCommentDrafts((prev) => ({ ...prev, [item.id]: event.target.value }))
                          }
                          placeholder={isAuthenticated ? 'Write a comment...' : 'Login to comment'}
                          disabled={!isAuthenticated}
                          className="flex-1 rounded-lg border border-white/12 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-pink-500 disabled:opacity-60"
                        />
                        <button
                          type="button"
                          disabled={!isAuthenticated || actionId === `comment-${item.id}`}
                          onClick={() => handleComment(item)}
                          className="rounded-lg border border-emerald-400/35 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-200 disabled:opacity-60"
                        >
                          Comment
                        </button>
                      </div>
                      {Array.isArray(item.comments) && item.comments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {item.comments.slice(-3).map((comment) => (
                            <div key={comment.id} className="rounded-lg border border-white/10 bg-slate-950/50 px-2 py-1.5">
                              <p className="text-[11px] text-slate-200">
                                <span className="font-semibold text-pink-200">{comment.userName || 'User'}:</span>{' '}
                                {comment.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                      by {item.creatorName || 'Creator'} •{' '}
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'now'}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </HomeLayout>
  );
};

export default CreatorFeedPage;
