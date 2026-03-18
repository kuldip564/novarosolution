import { useEffect, useMemo, useState } from 'react';
import HomeLayout from '../assets/componet/HomeLayout';
import { fetchCreatorFeed } from '../config/api';

const CreatorFeedPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [platform, setPlatform] = useState('all');

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
    return ['all', ...Array.from(set)];
  }, [rows]);

  const visibleRows = useMemo(() => {
    if (platform === 'all') return rows;
    return rows.filter((item) => item.platform === platform);
  }, [rows, platform]);

  return (
    <HomeLayout>
      <main className="mx-auto w-[96vw] max-w-[1260px] px-2 pb-14 pt-8 md:px-0 text-white">
        <section className="rounded-2xl border border-white/12 bg-slate-950/75 p-6">
          <h1 className="text-2xl font-semibold text-slate-100">Creator Content Feed</h1>
          <p className="mt-1 text-sm text-slate-400">
            View all uploaded content from creators on this website.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
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
                {item === 'all' ? 'All Platforms' : item}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6">
          {loading ? (
            <p className="text-sm text-slate-400">Loading content feed...</p>
          ) : error ? (
            <p className="text-sm text-red-400">{error}</p>
          ) : visibleRows.length === 0 ? (
            <p className="text-sm text-slate-400">No content available for selected platform.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {visibleRows.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70"
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
                    {item.caption && <p className="mt-2 text-sm text-slate-300">{item.caption}</p>}
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
