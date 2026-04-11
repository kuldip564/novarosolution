'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import ProtectedPage from '@/components/auth/ProtectedPage';
import {
  fetchMyProjectMessages,
  ProjectChatMessage,
  requestDeleteMyProjectChat,
  sendMyProjectMessage
} from '@/lib/clientApi';
import { useAuth } from '@/context/AuthContext';

export default function ProjectChatPage() {
  const { token } = useAuth();
  const [messages, setMessages] = useState<ProjectChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [showStarterForm, setShowStarterForm] = useState(false);
  const [starterSending, setStarterSending] = useState(false);
  const [starter, setStarter] = useState({
    topic: '',
    service: 'Web Development',
    projectType: 'New Project',
    budget: 'Not Sure Yet',
    timeline: 'Within 1 Month',
    priority: 'Medium',
    goal: '',
    details: ''
  });
  const orderedMessages = useMemo(
    () => [...messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [messages]
  );
  const deleteRequested = orderedMessages.some((item) => item.userDeleteRequested);
  const quickPrompts = [
    'Please suggest best tech stack for this project.',
    'Can we schedule a kickoff call this week?',
    'What budget range is ideal for this requirement?'
  ];

  async function loadMessages(silent = false) {
    if (!token) return;
    if (!silent) setLoading(true);
    try {
      const rows = await fetchMyProjectMessages(token);
      setMessages(rows);
    } catch (err: any) {
      setError(err?.message || 'Unable to load messages.');
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
    const interval = window.setInterval(() => {
      loadMessages(true);
    }, 5000);
    return () => {
      window.clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function onSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || message.trim().length < 3) return;
    setSending(true);
    setError('');
    try {
      await sendMyProjectMessage({ message: message.trim() }, token);
      setMessage('');
      await loadMessages(true);
    } catch (err: any) {
      setError(err?.message || 'Unable to send message.');
    } finally {
      setSending(false);
    }
  }

  async function onDeleteRequest() {
    if (!token) return;
    if (!window.confirm('Send delete request to admin?')) return;
    try {
      await requestDeleteMyProjectChat(token);
      setStatus('Delete request sent to admin.');
      await loadMessages(true);
    } catch (err: any) {
      setError(err?.message || 'Unable to request deletion.');
    }
  }

  function onStarterChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;
    setStarter((prev) => ({ ...prev, [name]: value }));
  }

  async function onStarterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    const topic = starter.topic.trim();
    const goal = starter.goal.trim();
    const details = starter.details.trim();
    if (!topic || topic.length < 3 || !goal || !details || details.length < 20) {
      setError('Please add topic, goal, and at least 20 characters in details.');
      return;
    }
    const starterMessage = [
      messages.length > 0 ? 'Project Topic Update' : 'New Project Discussion Request',
      `Topic: ${topic}`,
      `Service: ${starter.service}`,
      `Project Type: ${starter.projectType}`,
      `Budget: ${starter.budget}`,
      `Timeline: ${starter.timeline}`,
      `Priority: ${starter.priority}`,
      `Main Goal: ${goal}`,
      `Project Details: ${details}`
    ].join('\n');

    setStarterSending(true);
    setError('');
    setStatus('');
    try {
      await sendMyProjectMessage({ message: starterMessage }, token);
      setStarter((prev) => ({ ...prev, topic: '', goal: '', details: '' }));
      setShowStarterForm(false);
      await loadMessages(true);
      setStatus(messages.length > 0 ? 'Project topic updated.' : 'Project details sent successfully.');
    } catch (err: any) {
      setError(err?.message || 'Unable to send project details.');
    } finally {
      setStarterSending(false);
    }
  }

  return (
    <ProtectedPage>
      <main className="app-page-shell">
        <header className="premium-page-hero space-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-400/90">Workspace</p>
            <h1 className="section-title mt-1 text-3xl font-extrabold md:text-5xl">Project chat</h1>
            <p className="mt-2 max-w-2xl text-slate-300">Discuss your project directly with our team.</p>
          </div>
          <div className="admin-toolbar">
            <button className="btn btn-sm" type="button" onClick={onDeleteRequest}>
              {deleteRequested ? 'Delete request sent' : 'Request delete chat'}
            </button>
            {!showStarterForm ? (
              <button className="btn btn-sm" type="button" onClick={() => setShowStarterForm(true)}>
                {messages.length > 0 ? 'Update project data' : 'Start project discussion'}
              </button>
            ) : null}
          </div>
        </header>

        <section className="page-content-card project-chat-shell space-y-4">
        {showStarterForm ? (
          <form className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2" onSubmit={onStarterSubmit}>
            <input
              name="topic"
              value={starter.topic}
              onChange={onStarterChange}
              placeholder="Project topic"
            />
            <input
              name="goal"
              value={starter.goal}
              onChange={onStarterChange}
              placeholder="Main goal"
            />
            <div className="grid gap-2 md:grid-cols-3">
              <select name="service" value={starter.service} onChange={onStarterChange}>
                <option>Web Development</option>
                <option>UI / UX Design</option>
                <option>App Development</option>
                <option>SEO & Growth</option>
              </select>
              <select name="projectType" value={starter.projectType} onChange={onStarterChange}>
                <option>New Project</option>
                <option>Existing Product Upgrade</option>
                <option>MVP Build</option>
              </select>
              <select name="budget" value={starter.budget} onChange={onStarterChange}>
                <option>Not Sure Yet</option>
                <option>Under $1,000</option>
                <option>$1,000 - $5,000</option>
                <option>$5,000 - $15,000</option>
                <option>$15,000+</option>
              </select>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <select name="timeline" value={starter.timeline} onChange={onStarterChange}>
                <option>Within 1 Month</option>
                <option>1 - 3 Months</option>
                <option>3 - 6 Months</option>
                <option>Flexible</option>
              </select>
              <select name="priority" value={starter.priority} onChange={onStarterChange}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>
            <textarea
              name="details"
              rows={4}
              value={starter.details}
              onChange={onStarterChange}
              placeholder="Project details (features, references, target users...)"
            />
            <div className="admin-toolbar">
              <button className="btn btn-sm" type="submit" disabled={starterSending}>
                {starterSending ? 'Sending...' : 'Send Project Details'}
              </button>
              <button className="btn btn-sm" type="button" onClick={() => setShowStarterForm(false)}>
                Hide
              </button>
            </div>
          </form>
        ) : null}
        {deleteRequested ? <p className="text-xs text-amber-300">Waiting for admin to delete chat permanently.</p> : null}
        {loading ? <p className="text-slate-300">Loading messages...</p> : null}
        <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
          {orderedMessages.length === 0 ? (
            <p className="text-slate-300">No messages yet.</p>
          ) : (
            orderedMessages.map((item) => (
              <article key={item.id} className="rounded-lg border border-white/10 bg-black/20 p-3">
                <p>{item.message}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {item.senderRole} - {new Date(item.createdAt).toLocaleString()}
                </p>
              </article>
            ))
          )}
        </div>
        <div className="admin-toolbar">
          {quickPrompts.map((prompt) => (
            <button key={prompt} className="btn btn-sm project-chat-prompt-btn" type="button" onClick={() => setMessage(prompt)}>
              {prompt}
            </button>
          ))}
        </div>
        <form className="flex flex-col gap-2 sm:flex-row" onSubmit={onSend}>
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Type your message"
          />
          <button className="btn btn-sm" type="submit" disabled={sending || message.trim().length < 3}>
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
        {status ? <p className="text-emerald-400">{status}</p> : null}
        {error ? <p className="text-red-400">{error}</p> : null}
        </section>
      </main>
    </ProtectedPage>
  );
}
