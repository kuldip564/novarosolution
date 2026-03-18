import { useEffect, useMemo, useState } from 'react';
import HomeLayout from '../assets/componet/HomeLayout';
import { fetchCreatorFeed } from '../config/api';

const PLATFORM_ORDER = ['all', 'instagram', 'facebook', 'twitter'];

const CreatorFeedPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [platform, setPlatform] = useState('all');
  const [query, setQuery] = useState('');

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

  const platforms = useMemo(() => {
    const set = new Set(rows.map((item) => item.platform).filter(Boolean));
    const inOrder = PLATFORM_ORDER.filter((item) => item === 'all' || set.has(item));
    return inOrder.length ? inOrder : ['all'];
  }, [rows]);

  const visibleRows = useMemo(() => {
    const byPlatform = platform === 'all' ? rows : rows.filter((item) => item.platform === platform);
    const q = String(query || '').trim().toLowerCase();
    if (!q) return byPlatform;
    return byPlatform.filter((item) => {
      return (
        String(item.title || '').toLowerCase().includes(q) ||
        String(item.caption || '').toLowerCase().includes(q) ||
        String(item.creatorName || '').toLowerCase().includes(q)
      );
    });
  }, [rows, platform, query]);

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
          <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, caption, creator..."
              className="w-full rounded-xl border border-white/12 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
            />
            <div className="flex flex-wrap gap-2">
              {platforms.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPlatform(item)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    platform === item
                      ? 'border-pink-400/50 bg-pink-500/20 text-pink-100'
                      : 'border-white/15 bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {item === 'all' ? 'All' : item}
                </button>
              ))}
            </div>
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
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-pink-300">
                      {item.platform}
                    </p>
                    <h2 className="mt-1 text-base font-semibold text-slate-100">{item.title}</h2>
                    {item.caption && <p className="mt-2 text-sm text-slate-300 line-clamp-3">{item.caption}</p>}
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
