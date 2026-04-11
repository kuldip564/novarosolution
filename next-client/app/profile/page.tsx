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
      <div className="app-page-shell">
        <section className="profile-shell">
          {status || error ? (
            <div className="flex flex-col gap-2">
              {status ? <div className="premium-alert premium-alert--success">{status}</div> : null}
              {error ? <div className="premium-alert premium-alert--error">{error}</div> : null}
            </div>
          ) : null}

          <motion.article className="premium-page-hero overflow-hidden" {...sectionMotion}>
            <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="relative flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
                <div className="relative shrink-0">
                  <div className="absolute -inset-1 rounded-full bg-linear-to-br from-cyan-400/25 via-indigo-500/20 to-fuchsia-500/30 blur-lg" />
                  <div className="relative rounded-full p-[4px] ring-2 ring-white/20 ring-offset-[3px] ring-offset-slate-950">
                    {avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatar}
                        alt=""
                        className="relative h-32 w-32 rounded-full border border-white/25 object-cover shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:h-36 sm:w-36"
                      />
                    ) : (
                      <div className="flex h-32 w-32 items-center justify-center rounded-full border border-white/20 bg-linear-to-br from-white/18 to-white/5 text-3xl font-bold tracking-tight text-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:h-36 sm:w-36">
                        {userInitials || 'U'}
                      </div>
                    )}
                  </div>
                </div>
                <div className="min-w-0 flex-1 space-y-4 text-center sm:text-left">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-400/90">Account</p>
                    <h1 className="section-title mt-1 text-3xl font-extrabold md:text-4xl">Your profile</h1>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-400">
                      Manage how you appear across Novaro, keep your password secure, and open tools for your role.
                    </p>
                    {joinedDate && !Number.isNaN(joinedDate.getTime()) ? (
                      <p className="mt-2 text-xs text-slate-500">
                        Member since <span className="text-slate-400">{joinedDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                      </p>
                    ) : null}
                  </div>
                  <div className="mx-auto max-w-xs sm:mx-0">
                    <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      <span>Profile strength</span>
                      <span className="text-cyan-300/90">{profileScore}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/5">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-cyan-400/90 via-sky-500/90 to-indigo-500/90 transition-[width] duration-500 ease-out"
                        style={{ width: `${profileScore}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <span className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium capitalize text-slate-100 shadow-sm shadow-black/20">
                      {user?.role || 'Member'}
                    </span>
                    {creatorRequestPending ? (
                      <span className="rounded-full border border-amber-400/35 bg-amber-500/15 px-3.5 py-1.5 text-xs font-medium text-amber-100">
                        Creator request pending
                      </span>
                    ) : null}
                  </div>
                  <div className="space-y-1.5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-400">
                    <p className="font-semibold text-slate-100">{user?.name}</p>
                    <p className="break-all text-slate-300">{user?.email}</p>
                    <p className="font-mono text-[11px] text-slate-500">ID · {user?.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.article>

          <motion.article className="page-content-card" {...sectionMotion}>
            <div className="profile-section-head">
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Quick actions</h2>
                <p className="mt-1 text-xs text-slate-500">Shortcuts for support and data export.</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
              {(
                [
                  { label: 'Refresh', onClick: refreshMe },
                  { label: 'Copy ID', onClick: onCopyUserId },
                  { label: 'Copy email', onClick: onCopyEmail },
                  { label: 'Export JSON', onClick: onDownloadProfile },
                  { label: 'Reset form', onClick: onResetProfileForm }
                ] as const
              ).map((action) => (
                <button
                  key={action.label}
                  type="button"
                  className="rounded-xl border border-white/12 bg-white/[0.05] px-3 py-2.5 text-center text-xs font-medium text-slate-200 shadow-sm shadow-black/5 transition hover:border-cyan-500/25 hover:bg-white/[0.08] hover:text-white"
                  onClick={action.onClick}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </motion.article>

          <motion.article className="page-content-card" {...sectionMotion}>
            <div className="profile-section-head">
              <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-100">Activity</h2>
                  <p className="text-sm text-slate-500">Project chat and account signals.</p>
                </div>
                <p className="text-xs text-slate-500 sm:text-right">
                  {activityLoading ? 'Syncing…' : `Updated ${lastSyncedAt || '—'}`}
                </p>
              </div>
            </div>
            <div className="admin-stat-grid mt-5">
              <div className="admin-stat-card">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Messages</p>
                <p className="relative z-[1] mt-1 text-2xl font-semibold tabular-nums text-slate-100">{projectMessages.length}</p>
              </div>
              <div className="admin-stat-card">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Admin replies</p>
                <p className="relative z-[1] mt-1 text-2xl font-semibold tabular-nums text-slate-100">{adminRepliesCount}</p>
              </div>
              <div className="admin-stat-card">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Tenure</p>
                <p className="relative z-[1] mt-1 text-2xl font-semibold tabular-nums text-slate-100">{accountAgeDays}d</p>
              </div>
              <div className="admin-stat-card">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Joined</p>
                <p className="relative z-[1] mt-1 text-base font-semibold text-slate-100">
                  {joinedDate && !Number.isNaN(joinedDate.getTime()) ? joinedDate.toLocaleDateString() : '—'}
                </p>
              </div>
              <div className="admin-stat-card">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Profile</p>
                <p className="relative z-[1] mt-1 text-2xl font-semibold tabular-nums text-slate-100">{profileScore}%</p>
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-white/10 bg-linear-to-br from-white/12 to-transparent p-5 md:p-6">
              {activityLoading ? (
                <p className="text-sm text-slate-500">Loading activity…</p>
              ) : lastMessage ? (
                <div className="border-l-2 border-cyan-400/50 pl-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Latest project message</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200">{lastMessage.message}</p>
                  <p className="mt-3 text-xs text-slate-500">
                    {lastMessage.senderRole} ·{' '}
                    {lastMessage.createdAt ? new Date(lastMessage.createdAt).toLocaleString() : '—'}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-slate-500">No project messages yet — start a thread from project chat.</p>
              )}
            </div>
            <div className="mt-4">
              <Link className="btn inline-flex text-sm" href="/project-chat">
                Open project chat
              </Link>
            </div>
          </motion.article>

          <motion.form className="page-content-card space-y-5" onSubmit={onProfileSubmit} {...sectionMotion}>
            <div className="profile-section-head">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">Profile details</h2>
                <p className="mt-1 text-sm text-slate-500">Name, email, and photo apply across the product.</p>
              </div>
            </div>
            <div>
              <label className="form-label-premium" htmlFor="profile-name">
                Display name
              </label>
              <input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required />
            </div>
            <div>
              <label className="form-label-premium" htmlFor="profile-email">
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                required
              />
            </div>
            <div>
              <span className="form-label-premium">Profile photo</span>
              <label className="profile-upload-label mt-2 inline-flex">
                <input className="sr-only" type="file" accept="image/*" onChange={onAvatarChange} />
                Choose image · JPG / PNG · max 5MB
              </label>
            </div>
            {photoEditorSource ? (
              <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-5 ring-1 ring-white/5">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Photo fit</p>
                <p className="mt-1 text-xs text-slate-500">Adjust zoom and position, then apply fit before saving.</p>
                <div className="mt-4 flex flex-wrap gap-6">
                  <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full border border-white/20 bg-black/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoEditorSource}
                      alt=""
                      className="h-full w-full object-cover"
                      style={{
                        transform: `translate(${photoOffsetX * 0.4}%, ${photoOffsetY * 0.4}%) scale(${photoZoom})`,
                        transformOrigin: 'center'
                      }}
                    />
                  </div>
                  <div className="min-w-[220px] flex-1 space-y-4">
                    <label className="block text-xs text-slate-400">
                      Zoom ({photoZoom.toFixed(2)}×)
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.05"
                        value={photoZoom}
                        onChange={(event) => setPhotoZoom(Number(event.target.value))}
                        className="mt-1 w-full accent-cyan-500"
                      />
                    </label>
                    <label className="block text-xs text-slate-400">
                      Horizontal ({photoOffsetX})
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        step="1"
                        value={photoOffsetX}
                        onChange={(event) => setPhotoOffsetX(Number(event.target.value))}
                        className="mt-1 w-full accent-cyan-500"
                      />
                    </label>
                    <label className="block text-xs text-slate-400">
                      Vertical ({photoOffsetY})
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        step="1"
                        value={photoOffsetY}
                        onChange={(event) => setPhotoOffsetY(Number(event.target.value))}
                        className="mt-1 w-full accent-cyan-500"
                      />
                    </label>
                    <div className="admin-toolbar">
                      <button className="btn text-sm" type="button" onClick={onApplyPhotoFit} disabled={isApplyingPhotoFit}>
                        {isApplyingPhotoFit ? 'Applying…' : 'Apply fit'}
                      </button>
                      <button className="btn-secondary text-sm" type="button" onClick={onResetPhotoFit}>
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            <div className="admin-toolbar border-t border-white/10 pt-5">
              <button className="btn" type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save profile'}
              </button>
              <button className="btn-secondary" type="button" onClick={onAvatarOnlyUpdate} disabled={saving}>
                {saving ? 'Saving…' : 'Save photo only'}
              </button>
            </div>
          </motion.form>

          <motion.form className="page-content-card space-y-5 ring-1 ring-white/[0.04]" onSubmit={onPasswordSubmit} {...sectionMotion}>
            <div className="profile-section-head">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">Password</h2>
                <p className="mt-1 text-sm text-slate-500">Use at least six characters for your new password.</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="form-label-premium" htmlFor="pw-current">
                  Current password
                </label>
                <input
                  id="pw-current"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="form-label-premium" htmlFor="pw-new">
                  New password
                </label>
                <input
                  id="pw-new"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Min. 6 characters"
                  minLength={6}
                  required
                />
              </div>
              <div>
                <label className="form-label-premium" htmlFor="pw-confirm">
                  Confirm new password
                </label>
                <input
                  id="pw-confirm"
                  type={showNewPassword ? 'text' : 'password'}
                  value={confirmNewPassword}
                  onChange={(event) => setConfirmNewPassword(event.target.value)}
                  placeholder="Repeat password"
                  minLength={6}
                  required
                />
              </div>
            </div>
            <div className="admin-toolbar">
              <button className="btn-secondary text-sm" type="button" onClick={() => setShowCurrentPassword((prev) => !prev)}>
                {showCurrentPassword ? 'Hide current' : 'Show current'}
              </button>
              <button className="btn-secondary text-sm" type="button" onClick={() => setShowNewPassword((prev) => !prev)}>
                {showNewPassword ? 'Hide new' : 'Show new'}
              </button>
            </div>
            <button className="btn" type="submit">
              Update password
            </button>
          </motion.form>

          {!isCreator ? (
            creatorRequestPending ? (
              <div className="page-content-card border-amber-400/25 bg-amber-500/[0.07] text-sm text-amber-100">
                Creator request is pending admin approval. You will gain studio access once it is approved.
              </div>
            ) : (
              <div className="page-content-card flex flex-col gap-4 border border-cyan-500/15 bg-linear-to-br from-cyan-500/[0.07] to-transparent sm:flex-row sm:items-center sm:justify-between">
                <div className="profile-section-head min-w-0 flex-1">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-100">Creator program</h2>
                    <p className="mt-1 text-sm text-slate-500">Publish content and manage posts in Creator Studio.</p>
                  </div>
                </div>
                <button className="btn shrink-0" type="button" onClick={onCreatorRequest}>
                  Request creator role
                </button>
              </div>
            )
          ) : (
            <div className="page-content-card border border-emerald-500/15 bg-linear-to-br from-emerald-500/[0.06] to-transparent">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400/90">Creator</h2>
              <div className="admin-toolbar mt-4">
                <Link className="btn" href="/creator/studio">
                  Creator Studio
                </Link>
                <Link className="btn-secondary" href="/creator-feed">
                  Creator feed
                </Link>
              </div>
            </div>
          )}

          {(isAdmin || isEmployee) ? (
            <div className="page-content-card space-y-4 border border-indigo-500/15 bg-linear-to-br from-indigo-500/[0.06] to-transparent">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-300/90">Workspace access</h2>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {isAdmin ? (
                  <Link className="btn inline-flex flex-1 justify-center sm:flex-none" href="/admin/dashboard">
                    Admin dashboard
                  </Link>
                ) : null}
                {isEmployee ? (
                  <Link className="btn inline-flex flex-1 justify-center sm:flex-none" href="/employee/tasks">
                    Employee tasks
                  </Link>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="page-content-card flex flex-col gap-4 border border-red-500/25 bg-linear-to-br from-red-500/[0.08] to-transparent sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-200">Sign out on this device</p>
              <p className="text-xs text-slate-500">You will need to sign in again to access your account.</p>
            </div>
            <button
              className="btn shrink-0 border border-red-400/35 bg-red-500/15 text-red-100 hover:bg-red-500/25"
              type="button"
              onClick={logout}
            >
              Log out
            </button>
          </div>
        </section>
      </div>
    </ProtectedPage>
  );
}
