'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
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
    setMediaType('image');
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setSaving(true);
    setError('');
    setStatus('');
    try {
      const payload = {
        title,
        caption,
        mediaDataUrl: mediaDataUrl || undefined,
        mediaUrl: !mediaDataUrl ? currentMediaUrl : undefined
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
    try {
      await deleteMyCreatorContent(item.id, token);
      setItems((prev) => prev.filter((x) => x.id !== item.id));
      if (editingId === item.id) resetForm();
    } catch (err: any) {
      setError(err?.message || 'Unable to delete content.');
    }
  }

  function startEdit(item: CreatorItem) {
    setEditingId(item.id);
    setTitle(item.title || '');
    setCaption(item.caption || '');
    setCurrentMediaUrl(item.mediaUrl || '');
    setMediaDataUrl('');
    setMediaType(item.mediaType || 'image');
  }

  return (
    <ProtectedPage requireCreator>
      <section className="card space-y-4">
        <h1 className="text-3xl font-extrabold md:text-5xl">Creator Studio</h1>
        <form className="space-y-3" onSubmit={onSubmit}>
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" required />
          <textarea value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="Caption" />
          <input type="file" accept="image/*,video/*" onChange={onFileChange} />
          {mediaDataUrl || currentMediaUrl ? (
            mediaType === 'video' ? (
              <video className="h-56 w-full rounded-xl object-cover" controls src={mediaDataUrl || currentMediaUrl} />
            ) : (
              <img className="h-56 w-full rounded-xl object-cover" src={mediaDataUrl || currentMediaUrl} alt="Preview" />
            )
          ) : null}
          <div className="flex gap-2">
            <button className="btn" type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update Content' : 'Publish'}
            </button>
            {editingId ? (
              <button className="btn" type="button" onClick={resetForm}>
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
        {status ? <p className="text-emerald-400">{status}</p> : null}
        {error ? <p className="text-red-400">{error}</p> : null}

        <div className="grid gap-4 md:grid-cols-2">
          {loading ? <p className="text-slate-300">Loading content...</p> : null}
          {items.map((item) => (
            <article key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
              {item.mediaType === 'video' ? (
                <video className="h-52 w-full rounded-lg object-cover" controls src={item.mediaUrl} />
              ) : (
                <img className="h-52 w-full rounded-lg object-cover" src={item.mediaUrl} alt={item.title} />
              )}
              <h2 className="mt-2 font-semibold">{item.title}</h2>
              {item.caption ? <p className="text-sm text-slate-300">{item.caption}</p> : null}
              <div className="mt-2 flex gap-2">
                <button className="btn" onClick={() => startEdit(item)}>
                  Edit
                </button>
                <button className="btn" onClick={() => onDelete(item)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </ProtectedPage>
  );
}
