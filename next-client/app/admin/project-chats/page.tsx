'use client';

import { FormEvent, useEffect, useState } from 'react';
import ProtectedPage from '@/components/auth/ProtectedPage';
import {
  AdminChatThread,
  deleteAdminChatThread,
  fetchAdminChatMessages,
  fetchAdminChatThreads,
  ProjectChatMessage,
  sendAdminChatMessage
} from '@/lib/clientApi';
import { useAuth } from '@/context/AuthContext';

export default function AdminProjectChatsPage() {
  const { token } = useAuth();
  const [threads, setThreads] = useState<AdminChatThread[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [messages, setMessages] = useState<ProjectChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadThreads() {
    if (!token) return;
    setLoading(true);
    try {
      const rows = await fetchAdminChatThreads(token);
      setThreads(rows);
      if (!selectedUserId && rows[0]?.userId) setSelectedUserId(rows[0].userId);
    } catch (err: any) {
      setError(err?.message || 'Unable to load threads.');
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages(userId: string) {
    if (!token || !userId) return;
    setLoadingMessages(true);
    try {
      const rows = await fetchAdminChatMessages(userId, token);
      setMessages(rows);
    } catch (err: any) {
      setError(err?.message || 'Unable to load messages.');
    } finally {
      setLoadingMessages(false);
    }
  }

  useEffect(() => {
    loadThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (selectedUserId) loadMessages(selectedUserId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserId]);

  async function onSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !selectedUserId || !message.trim()) return;
    try {
      await sendAdminChatMessage(selectedUserId, { message: message.trim() }, token);
      setMessage('');
      await loadMessages(selectedUserId);
      await loadThreads();
    } catch (err: any) {
      setError(err?.message || 'Unable to send message.');
    }
  }

  async function onDeleteThread() {
    if (!token || !selectedUserId) return;
    if (!window.confirm('Delete selected thread permanently?')) return;
    try {
      await deleteAdminChatThread(selectedUserId, token);
      setSelectedUserId('');
      setMessages([]);
      await loadThreads();
    } catch (err: any) {
      setError(err?.message || 'Unable to delete thread.');
    }
  }

  return (
    <ProtectedPage requireAdmin>
      <section className="card space-y-4">
        <h1 className="text-3xl font-extrabold md:text-5xl">Admin Project Chats</h1>
        {loading ? <p className="text-slate-300">Loading threads...</p> : null}
        <div className="grid gap-4 md:grid-cols-[320px_1fr]">
          <aside className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
            {threads.map((thread) => (
              <button
                key={thread.userId}
                type="button"
                onClick={() => setSelectedUserId(thread.userId)}
                className={`w-full rounded-lg border p-2 text-left ${
                  selectedUserId === thread.userId ? 'border-pink-400/60 bg-pink-500/10' : 'border-white/10 bg-black/20'
                }`}
              >
                <p className="font-semibold">{thread.userName}</p>
                <p className="text-xs text-slate-400">{thread.userEmail}</p>
              </button>
            ))}
          </aside>
          <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-3">
            <button className="btn" type="button" onClick={onDeleteThread} disabled={!selectedUserId}>
              Delete Selected Thread
            </button>
            {loadingMessages ? <p className="text-slate-300">Loading messages...</p> : null}
            <div className="space-y-2">
              {messages.map((item) => (
                <article key={item.id} className="rounded-lg border border-white/10 bg-black/20 p-3">
                  <p>{item.message}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {item.senderRole} - {new Date(item.createdAt).toLocaleString()}
                  </p>
                </article>
              ))}
            </div>
            <form className="flex gap-2" onSubmit={onSend}>
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Reply to selected user"
              />
              <button className="btn" type="submit">
                Send
              </button>
            </form>
          </div>
        </div>
        {error ? <p className="text-red-400">{error}</p> : null}
      </section>
    </ProtectedPage>
  );
}
