'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import ProtectedPage from '@/components/auth/ProtectedPage';
import { fetchSiteContentClient, updateSiteContent } from '@/lib/clientApi';
import { useAuth } from '@/context/AuthContext';

export default function AdminSettingsPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [siteContent, setSiteContent] = useState<Record<string, any> | null>(null);
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  const [allowProjectChat, setAllowProjectChat] = useState(true);
  const [autoReplyMessage, setAutoReplyMessage] = useState(
    'Thanks for your message. Our admin team received your project details and will reply soon.'
  );
  const [allowUserRegistration, setAllowUserRegistration] = useState(true);
  const [allowServiceAppointments, setAllowServiceAppointments] = useState(true);
  const [allowContactSubmissions, setAllowContactSubmissions] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    'Platform updates are in progress. Some actions are temporarily unavailable. Please try again soon.'
  );
  const [announcementEnabled, setAnnouncementEnabled] = useState(false);
  const [announcementText, setAnnouncementText] = useState(
    'New: Premium project strategy sessions are now available. Book your slot this week.'
  );

  useEffect(() => {
    async function load() {
      try {
        const content = await fetchSiteContentClient();
        setSiteContent(content);
        setAutoReplyEnabled(content?.chatSettings?.autoReplyEnabled ?? true);
        setAllowProjectChat(content?.chatSettings?.allowProjectChat ?? true);
        setAutoReplyMessage(
          content?.chatSettings?.autoReplyMessage ||
            'Thanks for your message. Our admin team received your project details and will reply soon.'
        );
        setAllowUserRegistration(content?.systemSettings?.allowUserRegistration ?? true);
        setAllowServiceAppointments(content?.systemSettings?.allowServiceAppointments ?? true);
        setAllowContactSubmissions(content?.systemSettings?.allowContactSubmissions ?? true);
        setMaintenanceMode(content?.systemSettings?.maintenanceMode ?? false);
        setMaintenanceMessage(
          content?.systemSettings?.maintenanceMessage ||
            'Platform updates are in progress. Some actions are temporarily unavailable. Please try again soon.'
        );
        setAnnouncementEnabled(content?.uiSettings?.announcementEnabled ?? false);
        setAnnouncementText(
          content?.uiSettings?.announcementText ||
            'New: Premium project strategy sessions are now available. Book your slot this week.'
        );
      } catch (err: any) {
        setError(err?.message || 'Failed to load settings.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setSaving(true);
    setStatus('');
    setError('');
    try {
      const base = siteContent || (await fetchSiteContentClient());
      const payload = {
        ...base,
        chatSettings: {
          ...base.chatSettings,
          autoReplyEnabled,
          allowProjectChat,
          autoReplyMessage: autoReplyMessage.trim()
        },
        systemSettings: {
          ...base.systemSettings,
          allowUserRegistration,
          allowServiceAppointments,
          allowContactSubmissions,
          maintenanceMode,
          maintenanceMessage: maintenanceMessage.trim()
        },
        uiSettings: {
          ...base.uiSettings,
          announcementEnabled,
          announcementText: announcementText.trim()
        }
      };
      const updated = await updateSiteContent(payload, token);
      setSiteContent(updated);
      setStatus('Settings updated successfully.');
    } catch (err: any) {
      setError(err?.message || 'Unable to save settings.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedPage requireAdmin>
      <main className="app-page-shell">
      <section className="admin-shell">
        <article className="page-hero-shell space-y-3">
        <h1 className="section-title text-3xl font-extrabold md:text-5xl">Admin Settings</h1>
        {loading ? <p className="text-slate-300">Loading settings...</p> : null}
        </article>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="page-content-card space-y-2">
            <h2 className="text-xl font-semibold">Chat Settings</h2>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={allowProjectChat} onChange={(e) => setAllowProjectChat(e.target.checked)} />
              Allow project chat
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={autoReplyEnabled} onChange={(e) => setAutoReplyEnabled(e.target.checked)} />
              Enable auto reply
            </label>
            <textarea
              rows={3}
              value={autoReplyMessage}
              onChange={(e) => setAutoReplyMessage(e.target.value)}
              placeholder="Auto reply message"
            />
          </div>

          <div className="page-content-card space-y-2">
            <h2 className="text-xl font-semibold">Platform Access</h2>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={allowUserRegistration} onChange={(e) => setAllowUserRegistration(e.target.checked)} />
              Allow user registration
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={allowServiceAppointments} onChange={(e) => setAllowServiceAppointments(e.target.checked)} />
              Allow service appointments
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={allowContactSubmissions} onChange={(e) => setAllowContactSubmissions(e.target.checked)} />
              Allow contact submissions
            </label>
          </div>

          <div className="page-content-card space-y-2">
            <h2 className="text-xl font-semibold">Maintenance Mode</h2>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} />
              Enable maintenance mode
            </label>
            <textarea
              rows={3}
              value={maintenanceMessage}
              onChange={(e) => setMaintenanceMessage(e.target.value)}
              placeholder="Maintenance message"
            />
          </div>

          <div className="page-content-card space-y-2">
            <h2 className="text-xl font-semibold">Announcement Bar</h2>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={announcementEnabled} onChange={(e) => setAnnouncementEnabled(e.target.checked)} />
              Show announcement
            </label>
            <textarea
              rows={3}
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="Announcement text"
            />
          </div>

          <button className="admin-btn" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
        {status ? <p className="text-emerald-400">{status}</p> : null}
        {error ? <p className="text-red-400">{error}</p> : null}
        <Link className="admin-btn inline-block" href="/admin/dashboard">
          Back to dashboard
        </Link>
      </section>
      </main>
    </ProtectedPage>
  );
}
