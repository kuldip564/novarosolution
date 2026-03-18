import { useEffect, useState } from 'react';
import { FaArrowLeft, FaBullhorn, FaSave, FaShieldAlt, FaSlidersH } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import HomeLayout from '../assets/componet/HomeLayout';
import LoadingState from '../components/LoadingState';
import { fetchSiteContent, updateSiteContent } from '../config/api';
import { useAuth } from '../context/AuthContext';
import usePageReveal from '../hooks/usePageReveal';

const AdminSettingsPage = () => {
  const { token } = useAuth();
  const pageRef = usePageReveal();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [siteContent, setSiteContent] = useState(null);
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  const [allowProjectChat, setAllowProjectChat] = useState(true);
  const [autoReplyMessage, setAutoReplyMessage] = useState(
    'Thanks for your message. Our admin team received your project details and will reply soon.',
  );
  const [allowUserRegistration, setAllowUserRegistration] = useState(true);
  const [allowServiceAppointments, setAllowServiceAppointments] = useState(true);
  const [allowContactSubmissions, setAllowContactSubmissions] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    'Platform updates are in progress. Some actions are temporarily unavailable. Please try again soon.',
  );
  const [announcementEnabled, setAnnouncementEnabled] = useState(false);
  const [announcementText, setAnnouncementText] = useState(
    'New: Premium project strategy sessions are now available. Book your slot this week.',
  );

  useEffect(() => {
    let isMounted = true;
    async function loadSettings() {
      try {
        const content = await fetchSiteContent();
        if (!isMounted) return;
        setSiteContent(content);
        setAutoReplyEnabled(content?.chatSettings?.autoReplyEnabled ?? true);
        setAllowProjectChat(content?.chatSettings?.allowProjectChat ?? true);
        setAutoReplyMessage(
          content?.chatSettings?.autoReplyMessage ||
            'Thanks for your message. Our admin team received your project details and will reply soon.',
        );
        setAllowUserRegistration(content?.systemSettings?.allowUserRegistration ?? true);
        setAllowServiceAppointments(content?.systemSettings?.allowServiceAppointments ?? true);
        setAllowContactSubmissions(content?.systemSettings?.allowContactSubmissions ?? true);
        setMaintenanceMode(content?.systemSettings?.maintenanceMode ?? false);
        setMaintenanceMessage(
          content?.systemSettings?.maintenanceMessage ||
            'Platform updates are in progress. Some actions are temporarily unavailable. Please try again soon.',
        );
        setAnnouncementEnabled(content?.uiSettings?.announcementEnabled ?? false);
        setAnnouncementText(
          content?.uiSettings?.announcementText ||
            'New: Premium project strategy sessions are now available. Book your slot this week.',
        );
      } catch (error) {
        if (!isMounted) return;
        setStatus({ type: 'error', message: error.message || 'Failed to load settings.' });
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus({ type: '', message: '' });
    try {
      const baseContent = siteContent || (await fetchSiteContent());
      const payload = {
        ...baseContent,
        chatSettings: {
          ...baseContent.chatSettings,
          autoReplyEnabled,
          allowProjectChat,
          autoReplyMessage: autoReplyMessage.trim(),
        },
        systemSettings: {
          ...baseContent.systemSettings,
          allowUserRegistration,
          allowServiceAppointments,
          allowContactSubmissions,
          maintenanceMode,
          maintenanceMessage: maintenanceMessage.trim(),
        },
        uiSettings: {
          ...baseContent.uiSettings,
          announcementEnabled,
          announcementText: announcementText.trim(),
        },
      };
      const updated = await updateSiteContent(payload, token);
      setSiteContent(updated);
      setStatus({ type: 'success', message: 'Settings updated successfully.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to save settings.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <HomeLayout>
      <main ref={pageRef} className="app-page-shell w-full min-h-screen px-4 py-16 text-white md:py-20">
        <section className="js-reveal mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300 hover:bg-white/10"
            >
              <FaArrowLeft />
              Back to Dashboard
            </Link>
          </div>
          <h1 className="section-title mt-4 text-3xl font-bold md:text-5xl">Admin Settings</h1>
          <p className="mt-3 text-sm text-slate-300">
            Configure automatic chat responses and system behavior for user discussions.
          </p>
        </section>

        {loading ? (
          <section className="js-reveal mx-auto mt-8 max-w-4xl">
            <LoadingState label="Loading settings..." />
          </section>
        ) : (
          <section className="js-reveal mx-auto mt-8 max-w-4xl">
            <form
              onSubmit={handleSave}
              className="space-y-6 rounded-3xl border border-white/12 bg-slate-950/75 p-6 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] md:p-8"
            >
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <h2 className="text-lg font-semibold text-slate-100">Auto Reply for User Chat</h2>
                <p className="mt-1 text-sm text-slate-300">
                  When enabled, users automatically receive your custom admin message after sending chat.
                </p>

                <div className="mt-4 space-y-3">
                  <label className="inline-flex items-center gap-3 text-sm text-slate-200">
                    <input
                      type="checkbox"
                      checked={allowProjectChat}
                      onChange={(event) => setAllowProjectChat(event.target.checked)}
                      className="h-4 w-4 rounded border-white/20 bg-slate-900 text-pink-500 focus:ring-pink-500"
                    />
                    Allow project chat for users
                  </label>

                  <label className="inline-flex items-center gap-3 text-sm text-slate-200">
                    <input
                      type="checkbox"
                      checked={autoReplyEnabled}
                      onChange={(event) => setAutoReplyEnabled(event.target.checked)}
                      className="h-4 w-4 rounded border-white/20 bg-slate-900 text-pink-500 focus:ring-pink-500"
                    />
                    Enable automatic reply
                  </label>
                </div>

                <div className="mt-4 space-y-2">
                  <label className="text-sm text-slate-300">Custom Auto Reply Message</label>
                  <textarea
                    rows="4"
                    value={autoReplyMessage}
                    onChange={(event) => setAutoReplyMessage(event.target.value)}
                    placeholder="Write the automatic message admin should send..."
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-slate-100">
                  <FaShieldAlt className="text-pink-300" />
                  Platform Access Controls
                </h2>
                <p className="mt-1 text-sm text-slate-300">
                  Control registration and service bookings from one place.
                </p>

                <div className="mt-4 space-y-3">
                  <label className="inline-flex items-center gap-3 text-sm text-slate-200">
                    <input
                      type="checkbox"
                      checked={allowUserRegistration}
                      onChange={(event) => setAllowUserRegistration(event.target.checked)}
                      className="h-4 w-4 rounded border-white/20 bg-slate-900 text-pink-500 focus:ring-pink-500"
                    />
                    Allow new user registration
                  </label>

                  <label className="inline-flex items-center gap-3 text-sm text-slate-200">
                    <input
                      type="checkbox"
                      checked={allowServiceAppointments}
                      onChange={(event) => setAllowServiceAppointments(event.target.checked)}
                      className="h-4 w-4 rounded border-white/20 bg-slate-900 text-pink-500 focus:ring-pink-500"
                    />
                    Allow service appointment booking
                  </label>

                  <label className="inline-flex items-center gap-3 text-sm text-slate-200">
                    <input
                      type="checkbox"
                      checked={allowContactSubmissions}
                      onChange={(event) => setAllowContactSubmissions(event.target.checked)}
                      className="h-4 w-4 rounded border-white/20 bg-slate-900 text-pink-500 focus:ring-pink-500"
                    />
                    Allow contact form submissions
                  </label>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <h2 className="text-lg font-semibold text-slate-100">Maintenance Mode</h2>
                <p className="mt-1 text-sm text-slate-300">
                  Temporarily pause registration, appointments, contact submissions, and project chat.
                </p>
                <label className="mt-4 inline-flex items-center gap-3 text-sm text-slate-200">
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={(event) => setMaintenanceMode(event.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-slate-900 text-pink-500 focus:ring-pink-500"
                  />
                  Enable maintenance mode
                </label>
                <div className="mt-4 space-y-2">
                  <label className="text-sm text-slate-300">Maintenance message</label>
                  <textarea
                    rows="3"
                    value={maintenanceMessage}
                    onChange={(event) => setMaintenanceMessage(event.target.value)}
                    placeholder="Message users should see while maintenance mode is active..."
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-slate-100">
                  <FaBullhorn className="text-pink-300" />
                  Public Announcement Bar
                </h2>
                <p className="mt-1 text-sm text-slate-300">
                  Show an important announcement at the top of all pages.
                </p>
                <label className="mt-4 inline-flex items-center gap-3 text-sm text-slate-200">
                  <input
                    type="checkbox"
                    checked={announcementEnabled}
                    onChange={(event) => setAnnouncementEnabled(event.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-slate-900 text-pink-500 focus:ring-pink-500"
                  />
                  Show announcement bar
                </label>
                <div className="mt-4 space-y-2">
                  <label className="text-sm text-slate-300">Announcement text</label>
                  <textarea
                    rows="3"
                    value={announcementText}
                    onChange={(event) => setAnnouncementText(event.target.value)}
                    placeholder="Write your public announcement text..."
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              {status.message && (
                <p className={`text-sm ${status.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {status.message}
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-red-600 via-pink-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white disabled:opacity-70"
              >
                <FaSave />
                <FaSlidersH />
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          </section>
        )}
      </main>
    </HomeLayout>
  );
};

export default AdminSettingsPage;

