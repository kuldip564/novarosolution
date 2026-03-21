'use client';

import Link from 'next/link';
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import ProtectedPage from '@/components/auth/ProtectedPage';
import { useAuth } from '@/context/AuthContext';
import { fetchMyProjectMessages, requestCreatorAccess } from '@/lib/clientApi';

async function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

async function loadImageFromDataUrl(dataUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to load selected image.'));
    image.src = dataUrl;
  });
}

async function buildFittedAvatarDataUrl(sourceDataUrl: string, zoom = 1, offsetX = 0, offsetY = 0) {
  const image = await loadImageFromDataUrl(sourceDataUrl);
  const targetSize = 600;
  const canvas = document.createElement('canvas');
  canvas.width = targetSize;
  canvas.height = targetSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Unable to prepare image editor.');

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, targetSize, targetSize);

  const baseScale = Math.max(targetSize / image.width, targetSize / image.height);
  const scale = baseScale * Math.max(1, Number(zoom) || 1);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const maxShift = targetSize * 0.45;
  const shiftX = Math.max(-100, Math.min(100, Number(offsetX) || 0));
  const shiftY = Math.max(-100, Math.min(100, Number(offsetY) || 0));
  const drawX = (targetSize - drawWidth) / 2 + (shiftX / 100) * maxShift;
  const drawY = (targetSize - drawHeight) / 2 + (shiftY / 100) * maxShift;

  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  return canvas.toDataURL('image/jpeg', 0.92);
}

export default function ProfilePage() {
  const reduceMotion = useReducedMotion();
  const { user, token, isAdmin, isEmployee, isCreator, updateUserProfile, updateUserPassword, logout, refreshMe } =
    useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatarUrl || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [projectMessages, setProjectMessages] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState('');
  const [photoEditorSource, setPhotoEditorSource] = useState('');
  const [photoZoom, setPhotoZoom] = useState(1);
  const [photoOffsetX, setPhotoOffsetX] = useState(0);
  const [photoOffsetY, setPhotoOffsetY] = useState(0);
  const [isApplyingPhotoFit, setIsApplyingPhotoFit] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const creatorRequestPending = user?.creatorRequestStatus === 'pending';
  const profileScore = useMemo(() => {
    const hasProfileName = Boolean(String(name || '').trim());
    const hasProfileEmail = Boolean(String(email || '').trim());
    return [hasProfileName, hasProfileEmail].filter(Boolean).length * 50;
  }, [name, email]);
  const adminRepliesCount = useMemo(
    () => projectMessages.filter((item) => item?.senderRole === 'admin').length,
    [projectMessages]
  );
  const lastMessage = projectMessages[projectMessages.length - 1] || null;
  const joinedDate = user?.createdAt ? new Date(user.createdAt) : null;
  const accountAgeDays = joinedDate
    ? Math.max(0, Math.floor((Date.now() - joinedDate.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;
  const sectionMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 as const },
        transition: { duration: 0.4, ease: 'easeOut' as const }
      };

  useEffect(() => {
    async function loadActivity() {
      if (!token) return;
      setActivityLoading(true);
      try {
        const rows = await fetchMyProjectMessages(token);
        setProjectMessages(Array.isArray(rows) ? rows : []);
        setLastSyncedAt(new Date().toLocaleTimeString());
      } catch {
        setProjectMessages([]);
      } finally {
        setActivityLoading(false);
      }
    }
    loadActivity();
  }, [token]);

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setAvatar(user?.avatarUrl || '');
    setPhotoEditorSource('');
    setPhotoZoom(1);
    setPhotoOffsetX(0);
    setPhotoOffsetY(0);
  }, [user?.name, user?.email, user?.avatarUrl]);

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
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be 5MB or smaller.');
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setAvatar(dataUrl);
    setPhotoEditorSource(dataUrl);
    setPhotoZoom(1);
    setPhotoOffsetX(0);
    setPhotoOffsetY(0);
    setStatus('Profile photo selected. Adjust fit if needed, then save.');
    event.target.value = '';
  }

  async function onApplyPhotoFit() {
    if (!photoEditorSource) return;
    setIsApplyingPhotoFit(true);
    setStatus('');
    setError('');
    try {
      const fitted = await buildFittedAvatarDataUrl(photoEditorSource, photoZoom, photoOffsetX, photoOffsetY);
      setAvatar(fitted);
      setStatus('Photo fitted for profile. Save to apply.');
    } catch (err: any) {
      setError(err?.message || 'Unable to fit profile photo.');
    } finally {
      setIsApplyingPhotoFit(false);
    }
  }

  function onResetPhotoFit() {
    if (!photoEditorSource) return;
    setPhotoZoom(1);
    setPhotoOffsetX(0);
    setPhotoOffsetY(0);
    setAvatar(photoEditorSource);
    setStatus('Photo fit reset to original upload.');
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
    if (newPassword !== confirmNewPassword) {
      setError('New password and confirm password do not match.');
      return;
    }
    try {
      await updateUserPassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
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
      await requestCreatorAccess(
        token,
        'I want to upload creative content and manage posts in Creator Studio.'
      );
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

  async function onCopyEmail() {
    try {
      await navigator.clipboard.writeText(String(user?.email || ''));
      setStatus('Email copied.');
    } catch {
      setError('Unable to copy email.');
    }
  }

  function onResetProfileForm() {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setAvatar(user?.avatarUrl || '');
    setStatus('Profile form reset.');
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

        <motion.article className="page-content-card" {...sectionMotion}>
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
            <button className="btn" type="button" onClick={onCopyEmail}>
              Copy Email
            </button>
            <button className="btn" type="button" onClick={onDownloadProfile}>
              Download Profile
            </button>
            <button className="btn" type="button" onClick={onResetProfileForm}>
              Reset Form
            </button>
          </div>
        </div>
        </motion.article>

        <motion.article className="page-content-card" {...sectionMotion}>
          <h2 className="text-lg font-semibold">Activity Tracker</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="admin-list-card">
              <p className="text-xs text-slate-400">Project Messages</p>
              <p className="text-xl font-semibold">{projectMessages.length}</p>
            </div>
            <div className="admin-list-card">
              <p className="text-xs text-slate-400">Admin Replies</p>
              <p className="text-xl font-semibold">{adminRepliesCount}</p>
            </div>
            <div className="admin-list-card">
              <p className="text-xs text-slate-400">Account Age</p>
              <p className="text-xl font-semibold">{accountAgeDays} days</p>
            </div>
            <div className="admin-list-card">
              <p className="text-xs text-slate-400">Joined Date</p>
              <p className="text-sm font-semibold">
                {joinedDate && !Number.isNaN(joinedDate.getTime()) ? joinedDate.toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="admin-list-card">
              <p className="text-xs text-slate-400">Profile Completion</p>
              <p className="text-xl font-semibold">{profileScore}%</p>
            </div>
          </div>
          <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
            {activityLoading ? (
              <p>Loading activity...</p>
            ) : lastMessage ? (
              <>
                <p className="font-semibold">Last message</p>
                <p className="mt-1">{lastMessage.message}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {lastMessage.senderRole} - {lastMessage.createdAt ? new Date(lastMessage.createdAt).toLocaleString() : 'N/A'}
                </p>
              </>
            ) : (
              <p>No project messages yet.</p>
            )}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {activityLoading ? 'Tracking latest account activity...' : `Last synced at ${lastSyncedAt || 'N/A'}`}
          </p>
          <div className="mt-3">
            <Link className="btn" href="/project-chat">
              Open Project Chat
            </Link>
          </div>
        </motion.article>

        <motion.form className="page-content-card space-y-3" onSubmit={onProfileSubmit} {...sectionMotion}>
          <h2 className="text-lg font-semibold">Profile Details</h2>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" required />
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" required />
          <input type="file" accept="image/*" onChange={onAvatarChange} />
          {photoEditorSource ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">Photo Fit Editor</p>
              <p className="mt-1 text-xs text-slate-400">Adjust zoom and position, then click Apply Fit.</p>
              <div className="mt-3 flex flex-wrap gap-5">
                <div className="h-24 w-24 overflow-hidden rounded-full border border-white/20 bg-black/40">
                  <img
                    src={photoEditorSource}
                    alt="Photo fit preview"
                    className="h-full w-full object-cover"
                    style={{
                      transform: `translate(${photoOffsetX * 0.4}%, ${photoOffsetY * 0.4}%) scale(${photoZoom})`,
                      transformOrigin: 'center'
                    }}
                  />
                </div>
                <div className="min-w-[220px] flex-1 space-y-3">
                  <label className="block text-xs text-slate-300">
                    Zoom ({photoZoom.toFixed(2)}x)
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.05"
                      value={photoZoom}
                      onChange={(event) => setPhotoZoom(Number(event.target.value))}
                      className="mt-1 w-full"
                    />
                  </label>
                  <label className="block text-xs text-slate-300">
                    Move Left/Right ({photoOffsetX})
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      step="1"
                      value={photoOffsetX}
                      onChange={(event) => setPhotoOffsetX(Number(event.target.value))}
                      className="mt-1 w-full"
                    />
                  </label>
                  <label className="block text-xs text-slate-300">
                    Move Up/Down ({photoOffsetY})
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      step="1"
                      value={photoOffsetY}
                      onChange={(event) => setPhotoOffsetY(Number(event.target.value))}
                      className="mt-1 w-full"
                    />
                  </label>
                  <div className="admin-toolbar">
                    <button className="btn" type="button" onClick={onApplyPhotoFit} disabled={isApplyingPhotoFit}>
                      {isApplyingPhotoFit ? 'Applying...' : 'Apply Fit'}
                    </button>
                    <button className="btn" type="button" onClick={onResetPhotoFit}>
                      Reset Fit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          <div className="admin-toolbar">
          <button className="btn" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
          <button className="btn" type="button" onClick={onAvatarOnlyUpdate} disabled={saving}>
            {saving ? 'Saving...' : 'Update Photo Only'}
          </button>
          </div>
        </motion.form>

        <motion.form className="page-content-card space-y-3" onSubmit={onPasswordSubmit} {...sectionMotion}>
          <h2 className="text-lg font-semibold">Password</h2>
          <input
            type={showCurrentPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            placeholder="Current password"
            required
          />
          <input
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="New password"
            minLength={6}
            required
          />
          <input
            type={showNewPassword ? 'text' : 'password'}
            value={confirmNewPassword}
            onChange={(event) => setConfirmNewPassword(event.target.value)}
            placeholder="Confirm new password"
            minLength={6}
            required
          />
          <div className="admin-toolbar">
            <button className="btn" type="button" onClick={() => setShowCurrentPassword((prev) => !prev)}>
              {showCurrentPassword ? 'Hide Current Password' : 'Show Current Password'}
            </button>
            <button className="btn" type="button" onClick={() => setShowNewPassword((prev) => !prev)}>
              {showNewPassword ? 'Hide New Password' : 'Show New Password'}
            </button>
          </div>
          <button className="btn" type="submit">
            Update Password
          </button>
        </motion.form>

        {!isCreator ? (
          creatorRequestPending ? (
            <p className="page-content-card text-sm text-amber-300">Creator request pending admin approval.</p>
          ) : (
            <button className="btn" type="button" onClick={onCreatorRequest}>
              Request Creator Role
            </button>
          )
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
