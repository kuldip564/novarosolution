import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaComments, FaPaperPlane, FaRegClock, FaRocket, FaTasks } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import HomeLayout from '../assets/componet/HomeLayout';
import LoadingState from '../components/LoadingState';
import {
  fetchMyProjectMessages,
  requestDeleteMyProjectChat,
  sendMyProjectMessage,
} from '../config/api';
import { useAuth } from '../context/AuthContext';
import usePageReveal from '../hooks/usePageReveal';

const ProjectChatPage = () => {
  const { token, user, isAdmin } = useAuth();
  const pageRef = usePageReveal();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [starterSending, setStarterSending] = useState(false);
  const [showStarterForm, setShowStarterForm] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [starter, setStarter] = useState({
    topic: '',
    service: 'Web Development',
    projectType: 'New Project',
    budget: 'Not Sure Yet',
    timeline: 'Within 1 Month',
    priority: 'Medium',
    collaborationType: 'Dedicated Team',
    goal: '',
    details: '',
  });

  const orderedMessages = useMemo(
    () =>
      [...messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [messages],
  );
  const adminReplies = messages.filter((item) => item.senderRole === 'admin').length;
  const deleteRequested = messages.some((item) => item.userDeleteRequested);
  const canSendMessage = message.trim().length >= 3;

  const loadMessages = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const rows = await fetchMyProjectMessages(token);
        setMessages(Array.isArray(rows) ? rows : []);
      } catch (error) {
        setStatus({ type: 'error', message: error.message || 'Unable to load messages.' });
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    let isMounted = true;

    async function init() {
      if (!isMounted) return;
      await loadMessages();
    }

    init();
    const interval = setInterval(() => {
      if (!isMounted) return;
      loadMessages(true);
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [loadMessages]);

  useEffect(() => {
    const container = document.getElementById('project-chat-scroll');
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [orderedMessages.length]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!canSendMessage) return;
    setSending(true);
    setStatus({ type: '', message: '' });
    try {
      await sendMyProjectMessage({ message: message.trim() }, token);
      setMessage('');
      await loadMessages(true);
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to send message.' });
    } finally {
      setSending(false);
    }
  };

  const handleStarterChange = (event) => {
    const { name, value } = event.target;
    setStarter((prev) => ({ ...prev, [name]: value }));
  };

  const handleStarterSubmit = async (event) => {
    event.preventDefault();
    const topic = starter.topic.trim();
    const goal = starter.goal.trim();
    const details = starter.details.trim();
    if (!topic || topic.length < 3 || !goal || !details || details.length < 20) {
      setStatus({
        type: 'error',
        message: 'Please add project topic, clear goal, and at least 20 characters in project details.',
      });
      return;
    }

    const isUpdateMode = messages.length > 0;
    const starterMessage = [
      isUpdateMode ? 'Project Topic Update' : 'New Project Discussion Request',
      `Topic: ${topic}`,
      `Service: ${starter.service}`,
      `Project Type: ${starter.projectType}`,
      `Budget: ${starter.budget}`,
      `Timeline: ${starter.timeline}`,
      `Priority: ${starter.priority}`,
      `Collaboration Type: ${starter.collaborationType}`,
      `Main Goal: ${goal}`,
      `Project Details: ${details}`,
    ].join('\n');

    setStarterSending(true);
    setStatus({ type: '', message: '' });
    try {
      await sendMyProjectMessage({ message: starterMessage }, token);
      setStarter((prev) => ({ ...prev, topic: '', goal: '', details: '' }));
      await loadMessages(true);
      setShowStarterForm(false);
      setStatus({
        type: 'success',
        message: isUpdateMode
          ? 'Project topic and details updated successfully.'
          : 'Project details sent to admin successfully.',
      });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to send project details.' });
    } finally {
      setStarterSending(false);
    }
  };

  const handleDeleteRequest = async () => {
    const ok = window.confirm(
      'Send delete request to admin? Admin will be notified and can delete this chat permanently.',
    );
    if (!ok) return;
    setStatus({ type: '', message: '' });
    try {
      await requestDeleteMyProjectChat(token);
      await loadMessages(true);
      setStatus({
        type: 'success',
        message: 'Delete request sent. Admin can now delete this chat permanently.',
      });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to request chat deletion.' });
    }
  };

  const starterPresets = [
    {
      label: 'Need Full MVP',
      values: {
        topic: 'MVP SaaS Product',
        service: 'Web Development',
        projectType: 'MVP Build',
        budget: '$5,000 - $15,000',
        timeline: '1 - 3 Months',
        priority: 'High',
        collaborationType: 'Dedicated Team',
        goal: 'Launch MVP with auth, dashboard, and payments.',
        details:
          'Need scalable backend, polished UI, and admin panel. Target: launch for first set of users quickly.',
      },
    },
    {
      label: 'Need UI Redesign',
      values: {
        topic: 'Product UX Redesign',
        service: 'UI / UX Design',
        projectType: 'Existing Product Upgrade',
        budget: '$1,000 - $5,000',
        timeline: 'Within 1 Month',
        priority: 'Medium',
        collaborationType: 'Sprint-Based',
        goal: 'Improve onboarding and dashboard usability.',
        details:
          'Need modern UI/UX with better conversion. Also want responsive design and cleaner component system.',
      },
    },
    {
      label: 'Need App Build',
      values: {
        topic: 'Cross-platform Mobile App',
        service: 'App Development',
        projectType: 'New Project',
        budget: '$15,000+',
        timeline: '3 - 6 Months',
        priority: 'High',
        collaborationType: 'Dedicated Team',
        goal: 'Build Android/iOS app with backend APIs.',
        details:
          'Need user auth, notifications, and payments. Include admin management and post-launch support.',
      },
    },
  ];

  const quickPrompts = [
    'Can you share expected timeline for this scope?',
    'Please suggest best tech stack for this project.',
    'Can we schedule a kickoff call this week?',
    'What budget range is ideal for this requirement?',
  ];

  return (
    <HomeLayout>
      <main ref={pageRef} className="project-chat-page w-full min-h-screen px-4 py-16 text-white md:py-20">
        <section data-scroll-speed="24" className="js-reveal project-chat-hero mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Project Chat</p>
          <h1 className="section-title mt-3 text-3xl font-bold md:text-5xl">Discuss your project with admin</h1>
          <p className="mt-3 text-sm text-slate-300">
            Share your requirements, timelines, and updates. Admin can reply directly here.
          </p>
          {isAdmin && (
            <Link
              to="/admin/project-chats"
              className="project-chat-admin-link mt-4 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300 hover:bg-white/10"
            >
              <FaComments />
              Open Admin Chats
            </Link>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDeleteRequest}
              disabled={deleteRequested}
              className="project-chat-preset rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 disabled:opacity-60"
            >
              {deleteRequested ? 'Delete Request Sent' : 'Request Delete Chat'}
            </button>
            {deleteRequested && (
              <span className="rounded-full border border-amber-400/50 bg-amber-500/15 px-3 py-1 text-[11px] font-semibold text-amber-200">
                Waiting for admin to delete permanently
              </span>
            )}
          </div>
        </section>

        <section data-scroll-speed="18" className="js-reveal mx-auto mt-6 grid max-w-5xl gap-4 md:grid-cols-3">
          <article className="premium-card project-chat-stat-card rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Total Messages</p>
            <p className="mt-2 text-3xl font-bold text-slate-100">{messages.length}</p>
          </article>
          <article className="premium-card project-chat-stat-card rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Admin Replies</p>
            <p className="mt-2 text-3xl font-bold text-pink-300">{adminReplies}</p>
          </article>
          <article className="premium-card project-chat-stat-card rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Discussion Status</p>
            <p className="mt-2 text-sm font-semibold text-emerald-300">
              {messages.length > 0 ? 'Active conversation' : 'Ready to start'}
            </p>
          </article>
        </section>

        <section
          data-scroll-speed="16"
          className="js-reveal project-chat-guide mx-auto mt-6 max-w-5xl rounded-3xl border border-white/12 bg-slate-950/70 p-5 backdrop-blur-xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base md:text-lg font-semibold text-slate-100">
              Best way to start communication
            </h2>
            <button
              type="button"
              onClick={() => setShowGuide((prev) => !prev)}
              className="project-chat-preset rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
            >
              {showGuide ? 'Hide Guide' : 'Show Guide'}
            </button>
          </div>
          {showGuide && (
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {[
                'Choose service, budget, and timeline first.',
                'Write goal in one clear line with expected result.',
                'Add feature details and references for faster estimate.',
              ].map((tip) => (
                <article key={tip} className="project-chat-tip rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <p className="text-sm text-slate-300">{tip}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section
          data-scroll-speed="14"
          className="js-reveal project-chat-conversation mx-auto mt-8 max-w-5xl rounded-3xl border border-white/12 bg-slate-950/75 p-5 backdrop-blur-xl md:p-7"
        >
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
            <h2 className="text-lg font-semibold text-slate-100">Conversation</h2>
            <span className="text-xs text-slate-400">Auto refresh every 5s</span>
          </div>

          {!showStarterForm ? (
            <div className="mt-4 flex justify-start">
              <button
                type="button"
                onClick={() => setShowStarterForm(true)}
                className="project-chat-preset rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-slate-200"
              >
                {messages.length > 0 ? 'Update Project Data' : 'Start Project Discussion'}
              </button>
            </div>
          ) : (
            <div className="project-chat-inline-starter mt-4 rounded-2xl border border-white/10 bg-slate-900/45 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">Start project discussion quickly</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Create or update project topic and send structured details inside conversation.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStarterForm(false)}
                  className="project-chat-preset rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200"
                >
                  Hide
                </button>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {[
                  { icon: <FaRocket />, title: 'Faster Kickoff', desc: 'Share structured details in one go.' },
                  { icon: <FaTasks />, title: 'Clear Scope', desc: 'Admin understands priorities instantly.' },
                  { icon: <FaRegClock />, title: 'Quick Replies', desc: 'Fewer back-and-forth clarifications.' },
                ].map((item) => (
                  <article key={item.title} className="project-chat-benefit rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-r from-red-500/70 via-pink-500/70 to-purple-500/70 text-white">
                      {item.icon}
                    </div>
                    <h4 className="mt-2 text-sm font-semibold text-slate-100">{item.title}</h4>
                    <p className="mt-1 text-xs text-slate-400">{item.desc}</p>
                  </article>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {starterPresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setStarter(preset.values)}
                    className="project-chat-preset rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-slate-200 hover:bg-white/10"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleStarterSubmit} className="mt-5 space-y-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      name="topic"
                      value={starter.topic}
                      onChange={handleStarterChange}
                      placeholder="Project topic (example: E-commerce MVP)"
                      className="project-chat-field w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                    />
                    <input
                      name="goal"
                      value={starter.goal}
                      onChange={handleStarterChange}
                      placeholder="Main goal (example: Launch MVP for my startup)"
                      className="project-chat-field w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                    />
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    <select
                      name="service"
                      value={starter.service}
                      onChange={handleStarterChange}
                      className="project-chat-field rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                    >
                      <option>Web Development</option>
                      <option>UI / UX Design</option>
                      <option>App Development</option>
                      <option>SEO & Growth</option>
                      <option>Other</option>
                    </select>
                    <select
                      name="projectType"
                      value={starter.projectType}
                      onChange={handleStarterChange}
                      className="project-chat-field rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                    >
                      <option>New Project</option>
                      <option>Existing Product Upgrade</option>
                      <option>Bug Fix & Maintenance</option>
                      <option>MVP Build</option>
                    </select>
                    <select
                      name="budget"
                      value={starter.budget}
                      onChange={handleStarterChange}
                      className="project-chat-field rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                    >
                      <option>Not Sure Yet</option>
                      <option>Under $1,000</option>
                      <option>$1,000 - $5,000</option>
                      <option>$5,000 - $15,000</option>
                      <option>$15,000+</option>
                    </select>
                    <select
                      name="timeline"
                      value={starter.timeline}
                      onChange={handleStarterChange}
                      className="project-chat-field rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                    >
                      <option>Within 1 Month</option>
                      <option>1 - 3 Months</option>
                      <option>3 - 6 Months</option>
                      <option>Flexible</option>
                    </select>
                    <select
                      name="collaborationType"
                      value={starter.collaborationType}
                      onChange={handleStarterChange}
                      className="project-chat-field rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                    >
                      <option>Dedicated Team</option>
                      <option>Sprint-Based</option>
                      <option>Consultation + Execution</option>
                      <option>Need Recommendation</option>
                    </select>
                    <select
                      name="priority"
                      value={starter.priority}
                      onChange={handleStarterChange}
                      className="project-chat-field rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                  </div>

                  <textarea
                    name="details"
                    rows="3"
                    value={starter.details}
                    onChange={handleStarterChange}
                    placeholder="Project details: features, reference websites, target users, etc."
                    className="project-chat-field w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                  />
                  <p className="text-xs text-slate-400">
                    Tip: include must-have features, target users, and any reference links.
                  </p>

                  <button
                    type="submit"
                    disabled={starterSending}
                    className="project-chat-primary-btn inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-red-600 via-pink-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-70"
                  >
                    <FaPaperPlane />
                    {starterSending
                      ? 'Sending details...'
                      : messages.length > 0
                        ? 'Send Topic Update'
                        : 'Send Project Details'}
                  </button>
              </form>
            </div>
          )}

          {loading ? (
            <LoadingState label="Loading conversation..." />
          ) : (
            <div
              id="project-chat-scroll"
              className="project-chat-scroll mt-4 max-h-[50vh] space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-slate-900/35 p-4 pr-2"
            >
              {orderedMessages.length === 0 ? (
                <p className="text-sm text-slate-400">No messages yet. Start discussion with admin.</p>
              ) : (
                orderedMessages.map((item) => {
                  const isMine = item.senderRole === 'user' || item.senderId === user?.id;
                  return (
                    <article
                      key={item.id}
                      className={`project-chat-message max-w-[85%] rounded-2xl p-3 ${
                        isMine
                          ? 'project-chat-message-user ml-auto bg-linear-to-r from-red-600/85 via-pink-600/85 to-purple-600/85 shadow-[0_10px_28px_rgba(236,72,153,0.3)]'
                          : 'project-chat-message-admin mr-auto border border-white/12 bg-slate-900/90'
                      }`}
                    >
                      <p className="text-sm leading-relaxed text-slate-100">{item.message}</p>
                      <p className="mt-2 text-[11px] text-slate-200/80">
                        {item.senderRole === 'admin' ? 'Admin' : 'You'} ·{' '}
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </article>
                  );
                })
              )}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setMessage(prompt)}
                className="project-chat-prompt rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[11px] text-slate-300 hover:bg-white/10"
              >
                {prompt}
              </button>
            ))}
          </div>

          <form onSubmit={handleSend} className="mt-5 flex gap-3">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Type your project message..."
              className="project-chat-field flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
            />
            <button
              type="submit"
              disabled={sending || !canSendMessage}
              className="project-chat-primary-btn inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-red-600 via-pink-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-70"
            >
              <FaPaperPlane />
              {sending ? 'Sending...' : 'Send'}
            </button>
          </form>
          {!canSendMessage && (
            <p className="mt-2 text-xs text-slate-500">Type at least 3 characters to send message.</p>
          )}

          {status.message && (
            <p className={`mt-3 text-sm ${status.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
              {status.message}
            </p>
          )}
        </section>
      </main>
    </HomeLayout>
  );
};

export default ProjectChatPage;

