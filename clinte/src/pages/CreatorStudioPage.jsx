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
      setForm((prev) => ({ ...prev, mediaDataUrl: dataUrl }));
      setStatus({ type: 'success', message: 'Media selected. Submit to upload.' });
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
        <section className="rounded-2xl border border-white/12 bg-slate-950/75 p-6">
          <h1 className="text-2xl font-semibold text-slate-100">Creator Studio</h1>
          <p className="mt-1 text-sm text-slate-400">
            Upload social media content for Twitter, Facebook, Instagram, and more.
          </p>
          <p className="mt-2 text-xs text-amber-300">
            Note: this upload publishes content to your website feed. External platform posting (direct API publish to Facebook/Instagram/Twitter) is not enabled yet.
          </p>
          <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Title</label>
              <input
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                className="w-full rounded-xl border border-white/12 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                placeholder="Campaign headline..."
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Platform</label>
              <select
                value={form.platform}
                onChange={(event) => setForm((prev) => ({ ...prev, platform: event.target.value }))}
                className="w-full rounded-xl border border-white/12 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
              >
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
                <option value="youtube">YouTube</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-slate-300">Caption</label>
              <textarea
                value={form.caption}
                onChange={(event) => setForm((prev) => ({ ...prev, caption: event.target.value }))}
                rows={3}
                className="w-full rounded-xl border border-white/12 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                placeholder="Write your caption..."
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-slate-300">Media (Image/Video)</label>
              <label className="inline-flex cursor-pointer items-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10">
                Choose File
                <input type="file" accept="image/*,video/*" className="hidden" onChange={handleUploadFile} />
              </label>
              {form.mediaDataUrl && (
                <div className="mt-2 text-xs text-emerald-300">Media selected and ready to upload.</div>
              )}
            </div>
            {status.message && (
              <p className={`md:col-span-2 text-sm ${status.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                {status.message}
              </p>
            )}
            <button
              type="submit"
              disabled={saving || !form.mediaDataUrl}
              className="md:col-span-2 rounded-xl bg-linear-to-r from-red-600 via-pink-600 to-purple-600 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Uploading...' : 'Upload Content'}
            </button>
          </form>
        </section>

        <section className="mt-6 rounded-2xl border border-white/12 bg-slate-950/75 p-6">
          <h2 className="text-lg font-semibold text-slate-100">My Uploaded Content</h2>
          {loading ? (
            <p className="mt-3 text-sm text-slate-400">Loading...</p>
          ) : items.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">No content uploaded yet.</p>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {items.map((item) => (
                <article key={item.id} className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
                  <p className="text-xs uppercase tracking-widest text-pink-300">{item.platform}</p>
                  <h3 className="mt-1 text-base font-semibold text-slate-100">{item.title}</h3>
                  {item.caption && <p className="mt-2 text-sm text-slate-300">{item.caption}</p>}
                  <div className="mt-3 overflow-hidden rounded-lg border border-white/10 bg-slate-950/60">
                    {item.mediaType === 'video' ? (
                      <video src={item.mediaUrl} controls className="h-56 w-full object-cover" />
                    ) : (
                      <img src={item.mediaUrl} alt={item.title} className="h-56 w-full object-cover" />
                    )}
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
