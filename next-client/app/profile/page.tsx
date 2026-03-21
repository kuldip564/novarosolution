'use client';

import Link from 'next/link';
import { ChangeEvent, FormEvent, useState } from 'react';
import ProtectedPage from '@/components/auth/ProtectedPage';
import { useAuth } from '@/context/AuthContext';
import { requestCreatorAccess } from '@/lib/clientApi';

async function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

export default function ProfilePage() {
  const { user, token, isAdmin, isEmployee, isCreator, updateUserProfile, updateUserPassword, logout, refreshMe } =
    useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatarUrl || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const userInitials = String(user?.name || 'U')
    .split(/\s+/)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() || '')
    .join('');

  async function onAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!String(file.type || '').startsWith('image/')) {
      setError('Please choose a valid image.');
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setAvatar(dataUrl);
    event.target.value = '';
  }

  async function onAvatarOnlyUpdate() {
    setSaving(true);
    setStatus('');
    setError('');
    try {
      await updateUserProfile({
        avatarDataUrl: avatar.startsWith('data:image/') ? avatar : undefined,
        avatarUrl: !avatar.startsWith('data:image/') ? avatar : undefined
      });
      setStatus('Profile photo updated.');
    } catch (err: any) {
      setError(err?.message || 'Unable to update photo.');
    } finally {
      setSaving(false);
    }
  }

  async function onProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus('');
    setError('');
    try {
      await updateUserProfile({
        name,
        email,
        avatarDataUrl: avatar.startsWith('data:image/') ? avatar : undefined,
        avatarUrl: !avatar.startsWith('data:image/') ? avatar : undefined
      });
      setStatus('Profile updated.');
    } catch (err: any) {
      setError(err?.message || 'Unable to update profile.');
    } finally {
      setSaving(false);
    }
  }

  async function onPasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('');
    setError('');
    try {
      await updateUserPassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setStatus('Password updated.');
    } catch (err: any) {
      setError(err?.message || 'Unable to update password.');
    }
  }

  async function onCreatorRequest() {
    if (!token) return;
    setStatus('');
    setError('');
    try {
      await requestCreatorAccess(token);
      await refreshMe();
      setStatus('Creator role request sent.');
    } catch (err: any) {
      setError(err?.message || 'Unable to request creator role.');
    }
  }

  async function onCopyUserId() {
    try {
      await navigator.clipboard.writeText(String(user?.id || ''));
      setStatus('User ID copied.');
    } catch {
      setError('Unable to copy user ID.');
    }
  }

  function onDownloadProfile() {
    const payload = {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      role: user?.role,
      avatarUrl: user?.avatarUrl
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `profile-${user?.id || 'user'}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus('Profile data downloaded.');
  }

  return (
    <ProtectedPage>
      <main className="app-page-shell">
      <section className="admin-shell">
        <article className="page-hero-shell space-y-3">
        <h1 className="section-title text-3xl font-extrabold md:text-5xl">Profile</h1>
        <p className="text-slate-300">Manage account details and role access.</p>
        </article>

        <article className="page-content-card">
        <div className="flex flex-wrap items-center gap-3">
          {avatar ? (
            <img src={avatar} alt="Profile" className="h-16 w-16 rounded-full object-cover border border-white/20" />
          ) : (
            <div className="h-16 w-16 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-sm font-bold">
              {userInitials || 'U'}
            </div>
          )}
          <div className="text-sm text-slate-300">
            <p>{user?.name}</p>
            <p>{user?.email}</p>
            <p className="capitalize">Role: {user?.role}</p>
            <p>User ID: {user?.id}</p>
          </div>
          <div className="admin-toolbar">
            <button className="btn" type="button" onClick={refreshMe}>
              Refresh Activity
            </button>
            <button className="btn" type="button" onClick={onCopyUserId}>
              Copy User ID
            </button>
            <button className="btn" type="button" onClick={onDownloadProfile}>
              Download Profile
            </button>
          </div>
        </div>
        </article>

        <form className="page-content-card space-y-3" onSubmit={onProfileSubmit}>
          <h2 className="text-lg font-semibold">Profile Details</h2>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" required />
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" required />
          <input type="file" accept="image/*" onChange={onAvatarChange} />
          <div className="admin-toolbar">
          <button className="btn" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
          <button className="btn" type="button" onClick={onAvatarOnlyUpdate} disabled={saving}>
            {saving ? 'Saving...' : 'Update Photo Only'}
          </button>
          </div>
        </form>

        <form className="page-content-card space-y-3" onSubmit={onPasswordSubmit}>
          <h2 className="text-lg font-semibold">Password</h2>
          <input
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            placeholder="Current password"
            required
          />
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="New password"
            minLength={6}
            required
          />
          <button className="btn" type="submit">
            Update Password
          </button>
        </form>

        {!isCreator ? (
          <button className="btn" type="button" onClick={onCreatorRequest}>
            Request Creator Role
          </button>
        ) : (
          <div className="admin-toolbar">
            <Link className="btn" href="/creator/studio">
              Open Creator Studio
            </Link>
            <Link className="btn" href="/creator-feed">
              Open Creator Feed
            </Link>
          </div>
        )}

        <div className="text-sm text-slate-300 page-content-card">
          {isAdmin ? <p>Admin access enabled.</p> : null}
          {isAdmin ? <Link className="btn inline-block" href="/admin/dashboard">Open Admin Dashboard</Link> : null}
          {isEmployee ? <p>Employee access enabled.</p> : null}
          {isEmployee ? <Link className="btn inline-block" href="/employee/tasks">Open Employee Tasks</Link> : null}
        </div>

        <button className="btn" type="button" onClick={logout}>
          Logout
        </button>
        {status ? <p className="text-emerald-400">{status}</p> : null}
        {error ? <p className="text-red-400">{error}</p> : null}
      </section>
      </main>
    </ProtectedPage>
  );
}
