import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaComments, FaPaperPlane, FaSearch, FaSyncAlt, FaUserCircle } from 'react-icons/fa';
import HomeLayout from '../assets/componet/HomeLayout';
import LoadingState from '../components/LoadingState';
import {
  deleteAdminChatThread,
  fetchAdminChatMessages,
  fetchAdminChatThreads,
  sendAdminChatMessage,
} from '../config/api';
import { useAuth } from '../context/AuthContext';
import usePageReveal from '../hooks/usePageReveal';

const AdminProjectChatsPage = () => {
  const { token } = useAuth();
  const pageRef = usePageReveal();
  const [threads, setThreads] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [messages, setMessages] = useState([]);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  const selectedThread = useMemo(
    () => threads.find((item) => item.userId === selectedUserId) || null,
    [threads, selectedUserId],
  );

  const filteredThreads = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return threads;
    return threads.filter(
      (item) =>
        item.userName.toLowerCase().includes(query) ||
        item.userEmail.toLowerCase().includes(query) ||
        String(item.lastMessage || '')
          .toLowerCase()
          .includes(query),
    );
  }, [threads, searchQuery]);

  const pendingReplyCount = useMemo(
    () => threads.filter((item) => item.lastSenderRole === 'user').length,
    [threads],
  );

  const loadThreads = useCallback(
    async (silent = false) => {
      if (!silent) setLoadingThreads(true);
      try {
        const rows = await fetchAdminChatThreads(token);
        const safeRows = Array.isArray(rows) ? rows : [];
        setThreads(safeRows);
        if (!selectedUserId && safeRows[0]?.userId) {
          setSelectedUserId(safeRows[0].userId);
        } else if (selectedUserId && !safeRows.some((item) => item.userId === selectedUserId)) {
          setSelectedUserId(safeRows[0]?.userId || '');
        }
      } catch (error) {
        setStatus({ type: 'error', message: error.message || 'Unable to load chat threads.' });
      } finally {
        if (!silent) setLoadingThreads(false);
      }
    },
    [token, selectedUserId],
  );

  const loadMessages = useCallback(
    async (userId, silent = false) => {
      if (!userId) {
        setMessages([]);
        return;
      }
      if (!silent) setLoadingMessages(true);
      try {
        const rows = await fetchAdminChatMessages(userId, token);
        setMessages(Array.isArray(rows) ? rows : []);
      } catch (error) {
        setStatus({ type: 'error', message: error.message || 'Unable to load messages.' });
      } finally {
        if (!silent) setLoadingMessages(false);
      }
    },
    [token],
  );

  useEffect(() => {
    let isMounted = true;

    async function init() {
      if (!isMounted) return;
      await loadThreads();
    }

    init();
    const interval = setInterval(() => {
      if (!isMounted) return;
      loadThreads(true);
      if (selectedUserId) {
        loadMessages(selectedUserId, true);
      }
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [loadMessages, loadThreads, selectedUserId]);

  useEffect(() => {
    loadMessages(selectedUserId);
  }, [selectedUserId, loadMessages]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!selectedUserId || !message.trim()) return;
    setSending(true);
    setStatus({ type: '', message: '' });
    try {
      await sendAdminChatMessage(selectedUserId, { message: message.trim() }, token);
      setMessage('');
      await Promise.all([loadThreads(true), loadMessages(selectedUserId, true)]);
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to send message.' });
    } finally {
      setSending(false);
    }
  };

  const handlePermanentDelete = async () => {
    if (!selectedUserId) return;
    const ok = window.confirm(
      'Delete this entire chat thread permanently? This cannot be undone.',
    );
    if (!ok) return;
    setStatus({ type: '', message: '' });
    try {
      await deleteAdminChatThread(selectedUserId, token);
      setSelectedUserId('');
      setMessages([]);
      await loadThreads();
      setStatus({ type: 'success', message: 'Chat thread deleted permanently.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to delete chat thread.' });
    }
  };

  const quickReplies = [
    'Thanks for sharing. We are reviewing your project details now.',
    'Great requirement. Can you confirm your preferred timeline and budget range?',
    'We can help. Our team will send a detailed implementation plan shortly.',
  ];

  return (
    <HomeLayout>
      <main ref={pageRef} className="app-page-shell w-full min-h-screen px-4 py-16 text-white md:py-20">
        <section className="js-reveal mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Admin Chat</p>
          <h1 className="section-title mt-3 text-3xl font-bold md:text-5xl">Project discussion center</h1>
          <p className="mt-3 text-sm text-slate-300">
            Review all user chats and respond quickly from one workspace.
          </p>
        </section>

        <section className="js-reveal mx-auto mt-6 grid max-w-6xl gap-4 md:grid-cols-3">
          <article className="premium-card rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Total Threads</p>
            <p className="mt-2 text-3xl font-bold text-slate-100">{threads.length}</p>
          </article>
          <article className="premium-card rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Pending Reply</p>
            <p className="mt-2 text-3xl font-bold text-pink-300">{pendingReplyCount}</p>
          </article>
          <article className="premium-card rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Messages In Thread</p>
            <p className="mt-2 text-3xl font-bold text-slate-100">{messages.length}</p>
          </article>
        </section>

        <section className="js-reveal mx-auto mt-8 grid max-w-6xl gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="premium-card admin-threads-panel rounded-3xl p-4 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">
                <FaComments />
                User Threads
              </h2>
              <button
                type="button"
                onClick={() => {
                  loadThreads();
                  if (selectedUserId) loadMessages(selectedUserId, true);
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10"
              >
                <FaSyncAlt />
                Refresh
              </button>
            </div>

            <div className="relative mt-4">
              <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by name, email, message..."
                className="admin-threads-search w-full rounded-xl border border-white/10 bg-slate-900/80 py-2.5 pl-9 pr-3 text-xs text-slate-100 outline-none focus:border-pink-500"
              />
            </div>
            {loadingThreads ? (
              <div className="mt-4">
                <LoadingState label="Loading threads..." />
              </div>
            ) : filteredThreads.length === 0 ? (
              <p className="mt-4 text-sm text-slate-400">No chat conversations yet.</p>
            ) : (
              <div className="mt-4 space-y-2">
                {filteredThreads.map((item) => (
                  <button
                    key={item.userId}
                    type="button"
                    onClick={() => setSelectedUserId(item.userId)}
                    className={`admin-thread-card w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                      selectedUserId === item.userId
                        ? 'admin-thread-card-active border-pink-500/70 bg-pink-500/10 shadow-[0_8px_24px_rgba(236,72,153,0.2)]'
                        : 'border-white/10 bg-slate-900/80 hover:bg-white/8'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-100">{item.userName}</p>
                      {item.userDeleteRequested ? (
                        <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-semibold text-red-300">
                          Delete Requested
                        </span>
                      ) : item.lastSenderRole === 'user' ? (
                        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                          Waiting
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                          Replied
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{item.userEmail}</p>
                    <p className="mt-2 line-clamp-2 text-xs text-slate-300">{item.lastMessage}</p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {new Date(item.lastMessageAt).toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </aside>

          <section className="premium-card rounded-3xl p-5 backdrop-blur-xl md:p-7">
            {!selectedThread ? (
              <p className="text-sm text-slate-400">Select a user thread to view messages.</p>
            ) : (
              <>
                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-r from-red-500/75 via-pink-500/75 to-purple-500/75">
                    <FaUserCircle className="text-white" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">{selectedThread.userName}</h3>
                    <p className="text-xs text-slate-400">{selectedThread.userEmail}</p>
                    {selectedThread.userDeleteRequested && (
                      <p className="mt-1 text-[11px] font-semibold text-red-300">
                        User requested chat deletion
                      </p>
                    )}
                  </div>
                </div>

                {selectedThread.userDeleteRequested && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={handlePermanentDelete}
                      className="rounded-xl border border-red-400/50 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/20"
                    >
                      Delete Chat Permanently
                    </button>
                  </div>
                )}

                {loadingMessages ? (
                  <div className="mt-4">
                    <LoadingState label="Loading messages..." />
                  </div>
                ) : (
                  <div className="mt-4 max-h-[48vh] space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-slate-900/35 p-4 pr-2">
                    {messages.length === 0 ? (
                      <p className="text-sm text-slate-400">No messages in this thread.</p>
                    ) : (
                      messages.map((item) => (
                        <article
                          key={item.id}
                          className={`max-w-[85%] rounded-2xl p-3 ${
                            item.senderRole === 'admin'
                              ? 'ml-auto bg-linear-to-r from-red-600/85 via-pink-600/85 to-purple-600/85 shadow-[0_10px_28px_rgba(236,72,153,0.3)]'
                              : 'mr-auto border border-white/12 bg-slate-900/90'
                          }`}
                        >
                          <p className="text-sm text-slate-100">{item.message}</p>
                          <p className="mt-2 text-[11px] text-slate-200/80">
                            {item.senderRole === 'admin' ? 'You' : selectedThread.userName} ·{' '}
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                        </article>
                      ))
                    )}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {quickReplies.map((template) => (
                    <button
                      key={template}
                      type="button"
                      onClick={() => setMessage(template)}
                      className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[11px] text-slate-300 hover:bg-white/10"
                    >
                      {template}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSend} className="mt-5 flex gap-3">
                  <input
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Reply to this user..."
                    className="flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-red-600 via-pink-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-70"
                  >
                    <FaPaperPlane />
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </form>
              </>
            )}

            {status.message && (
              <p className={`mt-3 text-sm ${status.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
                {status.message}
              </p>
            )}
          </section>
        </section>
      </main>
    </HomeLayout>
  );
};

export default AdminProjectChatsPage;

