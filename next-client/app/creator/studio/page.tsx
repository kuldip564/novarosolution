'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import ProtectedPage from '@/components/auth/ProtectedPage';
import { useAuth } from '@/context/AuthContext';
import {
  createMyCreatorContent,
  CreatorItem,
  deleteMyCreatorContent,
  fetchMyCreatorContent,
  updateMyCreatorContent
} from '@/lib/clientApi';

async function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Unable to read selected file.'));
    reader.readAsDataURL(file);
  });
}

export default function CreatorStudioPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<CreatorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState('');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [mediaDataUrl, setMediaDataUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [currentMediaUrl, setCurrentMediaUrl] = useState('');
  const [externalMediaUrl, setExternalMediaUrl] = useState('');
  const [search, setSearch] = useState('');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'image' | 'video'>('all');
  const [busyDeleteId, setBusyDeleteId] = useState('');

  useEffect(() => {
    if (!token) return;
    let mounted = true;
    fetchMyCreatorContent(token)
      .then((rows) => {
        if (mounted) setItems(rows);
      })
      .catch((err: any) => {
        if (mounted) setError(err?.message || 'Unable to load creator content.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [token]);

  async function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const mime = String(file.type || '').toLowerCase();
    if (!mime.startsWith('image/') && !mime.startsWith('video/')) {
      setError('Upload image or video only.');
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      setError('File size must be 30MB or smaller.');
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setMediaDataUrl(dataUrl);
    setMediaType(mime.startsWith('video/') ? 'video' : 'image');
    event.target.value = '';
  }

  function resetForm() {
    setEditingId('');
    setTitle('');
    setCaption('');
    setMediaDataUrl('');
    setCurrentMediaUrl('');
    setExternalMediaUrl('');
    setMediaType('image');
  }

  const visibleItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const passType = mediaFilter === 'all' || item.mediaType === mediaFilter;
      const passQuery =
        !q ||
        String(item.title || '').toLowerCase().includes(q) ||
        String(item.caption || '').toLowerCase().includes(q);
      return passType && passQuery;
    });
  }, [items, mediaFilter, search]);

  const draftPreviewUrl = mediaDataUrl || externalMediaUrl.trim() || currentMediaUrl;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    const fallbackUrl = externalMediaUrl.trim() || currentMediaUrl;
    if (!editingId && !mediaDataUrl && !fallbackUrl) {
      setError('Upload photo/video or provide media URL.');
      return;
    }

    setSaving(true);
    setError('');
    setStatus('');
    try {
      const payload = {
        title: title.trim(),
        caption: caption.trim(),
        mediaDataUrl: mediaDataUrl || undefined,
        mediaUrl: !mediaDataUrl ? fallbackUrl : undefined
      };
      const saved = editingId
        ? await updateMyCreatorContent(editingId, payload, token)
        : await createMyCreatorContent(payload, token);
      setItems((prev) => (editingId ? prev.map((x) => (x.id === editingId ? saved : x)) : [saved, ...prev]));
      setStatus(editingId ? 'Content updated.' : 'Content published.');
      resetForm();
    } catch (err: any) {
      setError(err?.message || 'Unable to save content.');
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(item: CreatorItem) {
    if (!token) return;
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    setBusyDeleteId(item.id);
    try {
      await deleteMyCreatorContent(item.id, token);
      setItems((prev) => prev.filter((x) => x.id !== item.id));
      if (editingId === item.id) resetForm();
      setStatus('Content deleted.');
    } catch (err: any) {
      setError(err?.message || 'Unable to delete content.');
    } finally {
      setBusyDeleteId('');
    }
  }

  function startEdit(item: CreatorItem) {
    setEditingId(item.id);
    setTitle(item.title || '');
    setCaption(item.caption || '');
    setCurrentMediaUrl(item.mediaUrl || '');
    setMediaDataUrl('');
    setExternalMediaUrl('');
    setMediaType(item.mediaType || 'image');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <ProtectedPage requireCreator>
      <main className="app-page-shell">
        <section className="creator-shell">
          <article className="premium-page-hero space-y-3">
            <h1 className="section-title text-3xl font-extrabold md:text-5xl">Creator Studio</h1>
            <p className="text-sm text-slate-300">Publish and update your photos/videos with stronger editing controls.</p>
            <div className="creator-stat-grid">
              <article className="creator-stat-card">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">My Posts</p>
                <p className="text-2xl font-bold">{items.length}</p>
              </article>
              <article className="creator-stat-card">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Images</p>
                <p className="text-2xl font-bold">{items.filter((item) => item.mediaType === 'image').length}</p>
              </article>
              <article className="creator-stat-card">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Videos</p>
                <p className="text-2xl font-bold">{items.filter((item) => item.mediaType === 'video').length}</p>
              </article>
            </div>
          </article>

          <article className="page-content-card space-y-3">
            <h2 className="text-lg font-semibold">{editingId ? 'Edit Content' : 'Publish New Content'}</h2>
            <form className="space-y-3" onSubmit={onSubmit}>
              <div className="creator-form-grid">
                <div>
                  <label className="text-xs text-slate-400">Title</label>
                  <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" required />
                  <p className="mt-1 text-xs text-slate-500">{title.trim().length}/80</p>
                </div>
                <div>
                  <label className="text-xs text-slate-400">Media Type</label>
                  <select value={mediaType} onChange={(event) => setMediaType(event.target.value as 'image' | 'video')}>
                    <option value="image">Image / Photo</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400">Caption</label>
                <textarea value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="Caption" rows={4} />
                <p className="mt-1 text-xs text-slate-500">{caption.trim().length}/300</p>
              </div>
              <div className="creator-form-grid">
                <div>
                  <label className="text-xs text-slate-400">Upload Photo / Video</label>
                  <input type="file" accept="image/*,video/*" onChange={onFileChange} />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Or use media URL</label>
                  <input
                    value={externalMediaUrl}
                    onChange={(event) => setExternalMediaUrl(event.target.value)}
                    placeholder="https://... image or video URL"
                  />
                </div>
              </div>
              {draftPreviewUrl ? (
                <div className="creator-preview-shell">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Preview</p>
                  {mediaType === 'video' ? (
                    <video className="creator-studio-preview-media" controls src={draftPreviewUrl} />
                  ) : (
                    <img className="creator-studio-preview-media" src={draftPreviewUrl} alt="Preview" />
                  )}
                </div>
              ) : null}
              <div className="admin-toolbar">
                <button className="btn btn-sm" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update Content' : 'Publish'}
                </button>
                <button
                  className="btn btn-sm"
                  type="button"
                  onClick={() => {
                    setMediaDataUrl('');
                    setExternalMediaUrl('');
                    setCurrentMediaUrl('');
                  }}
                >
                  Clear Media
                </button>
                {editingId ? (
                  <button className="btn btn-sm" type="button" onClick={resetForm}>
                    Cancel Edit
                  </button>
                ) : null}
              </div>
            </form>
            {status ? <p className="text-emerald-400">{status}</p> : null}
            {error ? <p className="text-red-400">{error}</p> : null}
          </article>

          <article className="page-content-card space-y-3">
            <div className="creator-toolbar">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search your title/caption..."
              />
              <select value={mediaFilter} onChange={(event) => setMediaFilter(event.target.value as 'all' | 'image' | 'video')}>
                <option value="all">All media</option>
                <option value="image">Image only</option>
                <option value="video">Video only</option>
              </select>
            </div>
          </article>

          <div className="creator-feed-grid">
            {loading ? <p className="text-slate-300">Loading content...</p> : null}
            {visibleItems.map((item) => (
              <article key={item.id} className="creator-feed-card">
                <div className="creator-feed-media-wrap">
                  {item.mediaType === 'video' ? (
                    <video className="creator-feed-media" controls src={item.mediaUrl} />
                  ) : (
                    <img className="creator-feed-media" src={item.mediaUrl} alt={item.title} />
                  )}
                  <span className="creator-media-chip">{item.mediaType === 'video' ? 'Video' : 'Photo'}</span>
                </div>
                <h2 className="mt-2 font-semibold">{item.title}</h2>
                {item.caption ? <p className="text-sm text-slate-300">{item.caption}</p> : null}
                <p className="mt-1 text-xs text-slate-400">
                  Likes: {item.likesCount || 0} • Comments: {item.comments?.length || 0}
                  {item.createdAt ? ` • ${new Date(item.createdAt).toLocaleDateString()}` : ''}
                </p>
                <div className="mt-3 admin-toolbar">
                  <button className="btn btn-sm" onClick={() => startEdit(item)}>
                    Edit
                  </button>
                  <button className="btn btn-sm" disabled={busyDeleteId === item.id} onClick={() => onDelete(item)}>
                    {busyDeleteId === item.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </article>
            ))}
            {!loading && visibleItems.length === 0 ? (
              <article className="page-content-card">
                <p className="text-slate-400">No content found with current filters.</p>
              </article>
            ) : null}
          </div>
        </section>
      </main>
    </ProtectedPage>
  );
}
