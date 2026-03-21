'use client';

import { FormEvent, useEffect, useState } from 'react';
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

  return (
    <ProtectedPage>
      <section className="card space-y-4">
        <h1 className="text-3xl font-extrabold md:text-5xl">Project Chat</h1>
        <p className="text-slate-300">Discuss your project directly with admin.</p>
        <button className="btn" type="button" onClick={onDeleteRequest}>
          Request Delete Chat
        </button>
        {loading ? <p className="text-slate-300">Loading messages...</p> : null}
        <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
          {messages.length === 0 ? (
            <p className="text-slate-300">No messages yet.</p>
          ) : (
            messages.map((item) => (
              <article key={item.id} className="rounded-lg border border-white/10 bg-black/20 p-3">
                <p>{item.message}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {item.senderRole} - {new Date(item.createdAt).toLocaleString()}
                </p>
              </article>
            ))
          )}
        </div>
        <form className="flex gap-2" onSubmit={onSend}>
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Type your message"
          />
          <button className="btn" type="submit" disabled={sending || message.trim().length < 3}>
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
        {status ? <p className="text-emerald-400">{status}</p> : null}
        {error ? <p className="text-red-400">{error}</p> : null}
      </section>
    </ProtectedPage>
  );
}
