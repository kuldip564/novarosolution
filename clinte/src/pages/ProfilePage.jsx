import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaUserCircle, FaCrown, FaSyncAlt, FaCopy, FaChartLine } from 'react-icons/fa';
import { MdEmail, MdDateRange, MdSecurity, MdOutlineTrackChanges } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { fetchMyProjectMessages } from '../config/api';
import { useAuth } from '../context/AuthContext';
import HomeLayout from '../assets/componet/HomeLayout';
import usePageReveal from '../hooks/usePageReveal';

async function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

const ProfilePage = () => {
  const { user, token, isAdmin, isEmployee, updateProfile, changePassword, logout } = useAuth();
  const pageRef = usePageReveal();
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState('');
  const [projectMessages, setProjectMessages] = useState([]);
  const [lastSyncedAt, setLastSyncedAt] = useState('');
  const [profileAvatarPreview, setProfileAvatarPreview] = useState(user?.avatarUrl || '');
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : 'N/A';
  const accountAgeDays = user?.createdAt
    ? Math.max(
        1,
        Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
      )
    : 0;
  const hasProfileName = Boolean((profileForm.name || '').trim());
  const hasProfileEmail = Boolean((profileForm.email || '').trim());
  const profileScore = [hasProfileName, hasProfileEmail].filter(Boolean).length * 50;

  useEffect(() => {
    setProfileForm({
      name: user?.name || '',
      email: user?.email || '',
    });
  }, [user?.name, user?.email]);

  useEffect(() => {
    setProfileAvatarPreview(user?.avatarUrl || '');
  }, [user?.avatarUrl]);

  const loadActivity = useCallback(async () => {
    if (!token) return;
    setActivityLoading(true);
    setActivityError('');
    try {
      const rows = await fetchMyProjectMessages(token);
      setProjectMessages(Array.isArray(rows) ? rows : []);
      setLastSyncedAt(new Date().toLocaleTimeString());
    } catch (error) {
      setActivityError(error.message || 'Unable to track profile activity.');
    } finally {
      setActivityLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadActivity();
  }, [loadActivity]);

  useEffect(() => {
    setAvatarLoadFailed(false);
  }, [profileAvatarPreview]);

  const adminRepliesCount = useMemo(
    () => projectMessages.filter((item) => item.senderRole === 'admin').length,
    [projectMessages],
  );
  const lastMessageAt = projectMessages.length
    ? new Date(projectMessages[projectMessages.length - 1].createdAt).toLocaleString()
    : 'No activity yet';

  const cards = [
    {
      id: 'email',
      icon: <MdEmail className="text-xl text-sky-300" />,
      label: 'Email Address',
      value: user?.email || 'N/A',
    },
    {
      id: 'role',
      icon: <MdSecurity className="text-xl text-emerald-300" />,
      label: 'Account Role',
      value: isAdmin ? 'Administrator' : 'Member',
    },
    {
      id: 'joined',
      icon: <MdDateRange className="text-xl text-amber-300" />,
      label: 'Joined On',
      value: joinedDate,
    },
    {
      id: 'age',
      icon: <FaChartLine className="text-xl text-violet-300" />,
      label: 'Account Age',
      value: accountAgeDays ? `${accountAgeDays} day(s)` : 'N/A',
    },
    {
      id: 'profileScore',
      icon: <MdOutlineTrackChanges className="text-xl text-pink-300" />,
      label: 'Profile Completion',
      value: `${profileScore}%`,
    },
    {
      id: 'messages',
      icon: <FaChartLine className="text-xl text-cyan-300" />,
      label: 'Project Messages',
      value: String(projectMessages.length),
    },
  ];

  const onProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const onPasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const onProfilePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!String(file.type || '').startsWith('image/')) {
      setStatus({ type: 'error', message: 'Please select a valid image file.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setStatus({ type: 'error', message: 'Image must be 5MB or smaller.' });
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setProfileAvatarPreview(dataUrl);
      setStatus({ type: 'success', message: 'Profile photo selected. Click Save Changes.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to read selected image.' });
    } finally {
      event.target.value = '';
    }
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    setIsSaving(true);
    try {
      await updateProfile({
        name: profileForm.name,
        email: profileForm.email,
        avatarDataUrl: profileAvatarPreview.startsWith('data:image/')
          ? profileAvatarPreview
          : undefined,
        avatarUrl: !profileAvatarPreview.startsWith('data:image/') ? profileAvatarPreview : undefined,
      });
      setStatus({ type: 'success', message: 'Profile updated successfully.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordStatus({ type: '', message: '' });
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'Please fill all password fields.' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordStatus({ type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }
    if (passwordForm.newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New password and confirm password must match.' });
      return;
    }
    setIsChangingPassword(true);
    try {
      await changePassword(passwordForm);
      setPasswordStatus({ type: 'success', message: 'Password changed successfully.' });
      setPasswordForm({ currentPassword: '', newPassword: '' });
      setConfirmPassword('');
    } catch (error) {
      setPasswordStatus({ type: 'error', message: error.message || 'Failed to change password.' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const resetProfileForm = () => {
    setProfileForm({
      name: user?.name || '',
      email: user?.email || '',
    });
    setProfileAvatarPreview(user?.avatarUrl || '');
    setStatus({ type: 'success', message: 'Profile form reset to current account values.' });
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(user?.email || '');
      setStatus({ type: 'success', message: 'Email copied to clipboard.' });
    } catch {
      setStatus({ type: 'error', message: 'Clipboard unavailable. Copy email manually.' });
    }
  };

  const copyUserId = async () => {
    try {
      await navigator.clipboard.writeText(user?.id || '');
      setStatus({ type: 'success', message: 'User ID copied to clipboard.' });
    } catch {
      setStatus({ type: 'error', message: 'Clipboard unavailable. Copy user ID manually.' });
    }
  };

  const downloadProfileData = () => {
    const payload = {
      id: user?.id || '',
      name: profileForm.name || '',
      email: profileForm.email || '',
      role: user?.role || '',
      avatarUrl: profileAvatarPreview || '',
      createdAt: user?.createdAt || '',
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'profile-data.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus({ type: 'success', message: 'Profile data downloaded.' });
  };

  return (
    <HomeLayout>
      <main ref={pageRef} className="app-page-shell w-full min-h-screen text-white px-4 py-16 md:py-20">
        <section className="js-reveal mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/8 backdrop-blur-2xl p-8 md:p-12 shadow-[0_10px_50px_rgba(0,0,0,0.35)]">
            <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-linear-to-br from-purple-500/20 via-pink-500/20 to-red-500/20 blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
              <div className="relative">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border border-white/25 bg-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.3)] md:h-28 md:w-28">
                  {profileAvatarPreview && !avatarLoadFailed ? (
                    <img
                      src={profileAvatarPreview}
                      alt="Profile"
                      className="h-full w-full object-cover"
                      onError={() => setAvatarLoadFailed(true)}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <FaUserCircle className="text-7xl md:text-8xl text-white/90" />
                    </div>
                  )}
                </div>
                {isAdmin && (
                  <span className="absolute -right-1 -bottom-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-slate-950">
                    <FaCrown className="text-sm" />
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Profile</p>
                <h1 className="mt-2 text-3xl md:text-5xl font-bold bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  {user?.name || 'User Account'}
                </h1>
                <p className="mt-2 text-sm md:text-base text-slate-300">
                  Manage your account details and check your access level.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="js-reveal mx-auto max-w-6xl mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-white/12 bg-slate-950/75 p-5 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-400">{item.label}</span>
                {item.icon}
              </div>
              <p className="text-base md:text-lg font-semibold text-slate-100 break-all">{item.value}</p>
            </article>
          ))}
        </section>

        <section className="js-reveal mx-auto max-w-6xl mt-6 grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-white/12 bg-slate-950/75 p-6 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
            <h2 className="text-xl font-semibold text-slate-100">Activity Tracker</h2>
            <p className="mt-1 text-sm text-slate-400">
              Track your account activity and communication progress.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-widest text-slate-400">Admin Replies</p>
                <p className="mt-2 text-lg font-semibold text-slate-100">{adminRepliesCount}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-widest text-slate-400">Last Message</p>
                <p className="mt-2 text-sm text-slate-200">{lastMessageAt}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
              >
                <FaCopy />
                Copy Email
              </button>
              <Link
                to="/project-chat"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
              >
                <MdOutlineTrackChanges />
                Open Project Chat
              </Link>
              {isEmployee && (
                <Link
                  to="/employee/tasks"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
                >
                  <MdOutlineTrackChanges />
                  Open Daily Tasks
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
                >
                  <MdSecurity />
                  Open Admin Dashboard
                </Link>
              )}
              <button
                type="button"
                onClick={loadActivity}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
              >
                <FaSyncAlt />
                Refresh Activity
              </button>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/20"
              >
                Logout Account
              </button>
            </div>
            <div className="mt-3 text-xs text-slate-500">
              {activityLoading
                ? 'Tracking latest account activity...'
                : activityError
                  ? activityError
                  : `Last synced at ${lastSyncedAt || 'N/A'}`}
            </div>
          </article>

          <article className="rounded-2xl border border-white/12 bg-slate-950/75 p-6 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
            <h2 className="text-xl font-semibold text-slate-100">Profile Management Options</h2>
            <p className="mt-1 text-sm text-slate-400">
              Quick controls to safely manage and update your profile.
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>• Keep your name and email updated for better communication.</li>
              <li>• Use a strong password and change it regularly.</li>
              <li>• Track your project conversation status in one place.</li>
              <li>• Reset profile form anytime before saving changes.</li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={resetProfileForm}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
              >
                <FaSyncAlt />
                Reset Profile Form
              </button>
              <button
                type="button"
                onClick={copyUserId}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
              >
                <FaCopy />
                Copy User ID
              </button>
              <button
                type="button"
                onClick={downloadProfileData}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
              >
                <MdDateRange />
                Download Profile Data
              </button>
            </div>
          </article>
        </section>

        <section className="js-reveal mx-auto max-w-6xl mt-8 grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-white/12 bg-slate-950/75 p-6 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
            <h2 className="text-xl font-semibold text-slate-100">Edit Profile</h2>
            <p className="mt-1 text-sm text-slate-400">Update your account name and email.</p>
            <form className="mt-5 space-y-4" onSubmit={handleProfileSubmit}>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Name</label>
                <input
                  name="name"
                  value={profileForm.name}
                  onChange={onProfileChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Email</label>
                <input
                  name="email"
                  type="email"
                  value={profileForm.email}
                  onChange={onProfileChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Profile Photo</label>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10">
                    Upload Photo
                    <input type="file" accept="image/*" className="hidden" onChange={onProfilePhotoChange} />
                  </label>
                  {profileAvatarPreview && (
                    <button
                      type="button"
                      onClick={() => setProfileAvatarPreview('')}
                      className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>
              {status.message && (
                <p className={`text-sm ${status.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {status.message}
                </p>
              )}
              <button
                type="submit"
                disabled={isSaving}
                className="w-full rounded-xl bg-linear-to-r from-red-600 via-pink-600 to-purple-600 py-3 text-sm font-semibold text-white"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </article>

          <article className="rounded-2xl border border-white/12 bg-slate-950/75 p-6 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
            <h2 className="text-xl font-semibold text-slate-100">Change Password</h2>
            <p className="mt-1 text-sm text-slate-400">Use a strong password for better account security.</p>
            <form className="mt-5 space-y-4" onSubmit={handlePasswordSubmit}>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Current Password</label>
                <input
                  name="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={onPasswordChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">New Password</label>
                <input
                  name="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={onPasswordChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Confirm New Password</label>
                <input
                  name="confirmPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                />
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-slate-300 hover:bg-white/10"
                >
                  {showCurrentPassword ? 'Hide Current Password' : 'Show Current Password'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-slate-300 hover:bg-white/10"
                >
                  {showNewPassword ? 'Hide New Password' : 'Show New Password'}
                </button>
              </div>
              {passwordStatus.message && (
                <p className={`text-sm ${passwordStatus.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {passwordStatus.message}
                </p>
              )}
              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full rounded-xl border border-white/20 bg-white/10 py-3 text-sm font-semibold text-slate-100 hover:bg-white/20 transition-colors"
              >
                {isChangingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </article>
        </section>
      </main>
    </HomeLayout>
  );
};

export default ProfilePage;

