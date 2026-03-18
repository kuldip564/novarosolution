import { useEffect, useState } from 'react';
import HomeLayout from '../assets/componet/HomeLayout';
import {
  createMyCreatorContent,
  fetchMyCreatorContent,
} from '../config/api';
import { useAuth } from '../context/AuthContext';

async function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Unable to read selected file.'));
    reader.readAsDataURL(file);
  });
}

const CreatorStudioPage = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    title: '',
    platform: 'instagram',
    caption: '',
    mediaDataUrl: '',
  });
  const [selectedMediaType, setSelectedMediaType] = useState('');

  useEffect(() => {
    let mounted = true;
    async function loadRows() {
      try {
        const rows = await fetchMyCreatorContent(token);
        if (!mounted) return;
        setItems(Array.isArray(rows) ? rows : []);
      } catch (error) {
        if (!mounted) return;
        setStatus({ type: 'error', message: error.message || 'Unable to load creator content.' });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadRows();
    return () => {
      mounted = false;
    };
  }, [token]);

  const handleUploadFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const mime = String(file.type || '').toLowerCase();
    if (!mime.startsWith('image/') && !mime.startsWith('video/')) {
      setStatus({ type: 'error', message: 'Upload image or video only.' });
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      setStatus({ type: 'error', message: 'File size must be 30MB or smaller.' });
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      const mediaType = mime.startsWith('video/') ? 'video' : 'image';
      setForm((prev) => ({ ...prev, mediaDataUrl: dataUrl }));
      setSelectedMediaType(mediaType);
      setStatus({ type: 'success', message: 'Media selected. Review and click Publish.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to read media file.' });
    } finally {
      event.target.value = '';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus({ type: '', message: '' });
    try {
      const created = await createMyCreatorContent(form, token);
      setItems((prev) => [created, ...prev]);
      setForm({
        title: '',
        platform: 'instagram',
        caption: '',
        mediaDataUrl: '',
      });
      setSelectedMediaType('');
      setStatus({ type: 'success', message: 'Content uploaded successfully.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to upload content.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <HomeLayout>
      <main className="mx-auto w-[96vw] max-w-[1260px] px-2 pb-14 pt-8 md:px-0 text-white">
        <section className="overflow-hidden rounded-3xl border border-white/12 bg-slate-950/80 p-6 md:p-8">
          <div className="relative">
            <div className="pointer-events-none absolute -top-24 -right-24 h-60 w-60 rounded-full bg-linear-to-br from-pink-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl" />
            <h1 className="relative text-2xl font-semibold text-slate-100 md:text-3xl">Creator Studio</h1>
            <p className="relative mt-2 text-sm text-slate-300">
              Publish your social content to website feed with cleaner workflow.
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-widest text-slate-400">Supported Platforms</p>
              <p className="mt-2 text-sm text-slate-100">Instagram, Facebook, Twitter</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-widest text-slate-400">Allowed Media</p>
              <p className="mt-2 text-sm text-slate-100">Image and Video (up to 30MB)</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-widest text-slate-400">Publishing Scope</p>
              <p className="mt-2 text-sm text-slate-100">Visible on your website feed</p>
            </div>
          </div>

          <form className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]" onSubmit={handleSubmit}>
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">
                Content Details
              </h2>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Title</label>
                <input
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  className="w-full rounded-xl border border-white/12 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                  placeholder="Write content title..."
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Platform</label>
                <select
                  value={form.platform}
                  onChange={(event) => setForm((prev) => ({ ...prev, platform: event.target.value }))}
                  className="w-full rounded-xl border border-white/12 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                >
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Caption</label>
                <textarea
                  value={form.caption}
                  onChange={(event) => setForm((prev) => ({ ...prev, caption: event.target.value }))}
                  rows={4}
                  className="w-full rounded-xl border border-white/12 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                  placeholder="Write short caption..."
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">Media Upload</h2>
              <div className="mt-3">
                <label className="inline-flex cursor-pointer items-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10">
                  Choose Image/Video
                  <input type="file" accept="image/*,video/*" className="hidden" onChange={handleUploadFile} />
                </label>
              </div>
              {form.mediaDataUrl ? (
                <div className="mt-4 overflow-hidden rounded-xl border border-white/12 bg-slate-950/70">
                  {selectedMediaType === 'video' ? (
                    <video src={form.mediaDataUrl} controls className="h-56 w-full object-cover" />
                  ) : (
                    <img src={form.mediaDataUrl} alt="Selected upload preview" className="h-56 w-full object-cover" />
                  )}
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-white/20 bg-slate-950/50 p-6 text-center text-xs text-slate-500">
                  No media selected
                </div>
              )}
              <div className="mt-4 flex gap-2">
                {form.mediaDataUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, mediaDataUrl: '' }));
                      setSelectedMediaType('');
                    }}
                    className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
                  >
                    Remove Media
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving || !form.mediaDataUrl}
                  className="flex-1 rounded-xl bg-linear-to-r from-red-600 via-pink-600 to-purple-600 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? 'Publishing...' : 'Publish to Feed'}
                </button>
              </div>
              <p className="mt-3 text-[11px] text-slate-500">
                Upload appears on website feed. External platform auto-post is not enabled.
              </p>
            </div>

            <div className="space-y-2">
              {status.message && (
                <p className={`text-sm ${status.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                {status.message}
                </p>
              )}
            </div>
          </form>
        </section>

        <section className="mt-6 rounded-3xl border border-white/12 bg-slate-950/75 p-6">
          <h2 className="text-lg font-semibold text-slate-100">My Uploaded Content</h2>
          {loading ? (
            <p className="mt-3 text-sm text-slate-400">Loading...</p>
          ) : items.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">No content uploaded yet.</p>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70">
                  <div className="h-52 w-full bg-slate-950/70">
                    {item.mediaType === 'video' ? (
                      <video src={item.mediaUrl} controls className="h-full w-full object-cover" />
                    ) : (
                      <img src={item.mediaUrl} alt={item.title} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-pink-300">{item.platform}</p>
                    <h3 className="mt-1 text-base font-semibold text-slate-100">{item.title}</h3>
                    {item.caption && <p className="mt-2 text-sm text-slate-300 line-clamp-3">{item.caption}</p>}
                    <p className="mt-3 text-xs text-slate-500">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}
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

export default CreatorStudioPage;
