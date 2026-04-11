'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ProtectedPage from '@/components/auth/ProtectedPage';
import { useAuth } from '@/context/AuthContext';
import {
  AdminChatThread,
  ProjectChatMessage,
  deleteAdminChatThread,
  fetchAdminChatMessages,
  fetchAdminChatThreads,
  sendAdminChatMessage
} from '@/lib/clientApi';

export default function AdminProjectChatsPage() {
  const { token } = useAuth();
  const [threads, setThreads] = useState<AdminChatThread[]>([]);
  const [messages, setMessages] = useState<ProjectChatMessage[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [search, setSearch] = useState('');
  const [reply, setReply] = useState('');
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const selectedThread = useMemo(
    () => threads.find((item) => item.userId === selectedUserId) || null,
    [threads, selectedUserId]
  );

  const filteredThreads = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return threads;
    return threads.filter((item) => {
      const text = `${item.userName || ''} ${item.userEmail || ''} ${item.lastMessage || ''}`.toLowerCase();
      return text.includes(q);
    });
  }, [search, threads]);

  const orderedMessages = useMemo(
    () => [...messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [messages]
  );

  async function loadThreads(silent = false) {
    if (!token) return;
    if (!silent) {
      setLoadingThreads(true);
    }
    try {
      const rows = await fetchAdminChatThreads(token);
      setThreads(rows);
      if (!selectedUserId && rows.length > 0) {
        setSelectedUserId(rows[0].userId);
      } else if (selectedUserId && !rows.some((item) => item.userId === selectedUserId)) {
        setSelectedUserId(rows[0]?.userId || '');
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to load chat threads.');
    } finally {
      if (!silent) {
        setLoadingThreads(false);
      }
    }
  }

  async function loadMessages(userId: string, silent = false) {
    if (!token || !userId) return;
    if (!silent) {
      setLoadingMessages(true);
    }
    try {
      const rows = await fetchAdminChatMessages(userId, token);
      setMessages(rows);
    } catch (err: any) {
      setError(err?.message || 'Unable to load chat messages.');
    } finally {
      if (!silent) {
        setLoadingMessages(false);
      }
    }
  }

  useEffect(() => {
    loadThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (!selectedUserId) {
      setMessages([]);
      return;
    }
    loadMessages(selectedUserId);
    const interval = window.setInterval(() => {
      loadMessages(selectedUserId, true);
      loadThreads(true);
    }, 5000);
    return () => {
      window.clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserId, token]);

  async function onSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !selectedUserId || reply.trim().length < 2) return;
    setSending(true);
    setError('');
    setStatus('');
    try {
      await sendAdminChatMessage(selectedUserId, { message: reply.trim() }, token);
      setReply('');
      await Promise.all([loadMessages(selectedUserId, true), loadThreads(true)]);
      setStatus('Reply sent.');
    } catch (err: any) {
      setError(err?.message || 'Unable to send reply.');
    } finally {
      setSending(false);
    }
  }

  async function onDeleteThread() {
    if (!token || !selectedUserId) return;
    if (!window.confirm('Delete this full chat thread permanently?')) return;
    setDeleting(true);
    setError('');
    setStatus('');
    try {
      await deleteAdminChatThread(selectedUserId, token);
      setStatus('Chat thread deleted.');
      setMessages([]);
      setSelectedUserId('');
      await loadThreads(true);
    } catch (err: any) {
      setError(err?.message || 'Unable to delete chat thread.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <ProtectedPage requireAdmin>
      <main className="app-page-shell">
        <section className="admin-shell">
          <article className="premium-page-hero space-y-3">
            <h1 className="section-title text-3xl font-extrabold md:text-5xl">Admin Project Chats</h1>
            <p className="text-sm text-slate-300">Read user messages and send direct replies from one place.</p>
            <div className="admin-toolbar">
              <button className="admin-btn" type="button" onClick={() => loadThreads()} disabled={loadingThreads}>
                {loadingThreads ? 'Refreshing...' : 'Refresh Threads'}
              </button>
              <Link className="admin-btn" href="/admin/dashboard">
                Back to Dashboard
              </Link>
            </div>
          </article>

          <section className="admin-chat-layout">
            <article className="page-content-card space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">Chat Threads</h2>
                <p className="text-xs text-slate-400">{threads.length} total</p>
              </div>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, email, or message..."
              />
              <div className="admin-chat-thread-list">
                {loadingThreads ? <p className="text-slate-300">Loading threads...</p> : null}
                {!loadingThreads && filteredThreads.length === 0 ? <p className="text-slate-400">No chats found.</p> : null}
                {filteredThreads.map((item) => (
                  <button
                    key={item.userId}
                    type="button"
                    className={`admin-chat-thread-btn ${selectedUserId === item.userId ? 'is-active' : ''}`}
                    onClick={() => setSelectedUserId(item.userId)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{item.userName || 'User'}</p>
                        <p className="text-xs text-slate-400">{item.userEmail}</p>
                      </div>
                      {item.userDeleteRequested ? <span className="admin-chip">Delete requested</span> : null}
                    </div>
                    <p className="mt-1 text-sm text-slate-300">{String(item.lastMessage || '').slice(0, 100)}</p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {item.lastSenderRole} • {item.lastMessageAt ? new Date(item.lastMessageAt).toLocaleString() : 'Time unavailable'}
                    </p>
                  </button>
                ))}
              </div>
            </article>

            <article className="page-content-card space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold">Conversation</h2>
                  <p className="text-xs text-slate-400">
                    {selectedThread
                      ? `${selectedThread.userName || 'User'} (${selectedThread.userEmail})`
                      : 'Select a thread to start replying'}
                  </p>
                </div>
                <button
                  className="admin-btn admin-btn-danger"
                  type="button"
                  onClick={onDeleteThread}
                  disabled={!selectedUserId || deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete Thread'}
                </button>
              </div>

              <div className="admin-chat-messages">
                {!selectedUserId ? <p className="text-slate-400">Choose a chat from the left list.</p> : null}
                {selectedUserId && loadingMessages ? <p className="text-slate-300">Loading messages...</p> : null}
                {selectedUserId && !loadingMessages && orderedMessages.length === 0 ? (
                  <p className="text-slate-400">No messages in this thread yet.</p>
                ) : null}
                {orderedMessages.map((item) => (
                  <article
                    key={item.id}
                    className={`admin-chat-bubble ${item.senderRole === 'admin' ? 'is-admin' : 'is-user'}`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{item.message}</p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {item.senderRole} • {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </article>
                ))}
              </div>

              <div className="admin-toolbar">
                {['Thanks, we are reviewing this now.', 'Can you share timeline and budget?', 'Please share references or screenshots.'].map(
                  (quickReply) => (
                    <button
                      key={quickReply}
                      className="admin-btn"
                      type="button"
                      onClick={() => setReply(quickReply)}
                    >
                      {quickReply}
                    </button>
                  )
                )}
              </div>

              <form className="admin-chat-compose" onSubmit={onSend}>
                <textarea
                  rows={3}
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  placeholder="Write admin reply..."
                  disabled={!selectedUserId}
                />
                <button className="admin-btn" type="submit" disabled={!selectedUserId || sending || reply.trim().length < 2}>
                  {sending ? 'Sending...' : 'Send Reply'}
                </button>
              </form>

              {status ? <p className="text-emerald-400">{status}</p> : null}
              {error ? <p className="text-red-400">{error}</p> : null}
            </article>
          </section>
        </section>
      </main>
    </ProtectedPage>
  );
}
