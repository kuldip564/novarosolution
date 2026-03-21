'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedPage from '@/components/auth/ProtectedPage';
import {
  fetchAdminChatThreads,
  deleteAdminUser,
  fetchAdminCreatorContent,
  fetchAdminEmployeeTasks,
  fetchAdminEmployees,
  fetchAdminOverview,
  fetchAdminUsers,
  fetchContactSubmissions,
  fetchServiceAppointments,
  reviewAdminCreatorRequest,
  revokeAdminUserSessions,
  updateAdminUserRole,
  updateAdminUserStatus
} from '@/lib/clientApi';

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [actionId, setActionId] = useState('');
  const [query, setQuery] = useState('');
  const [globalQuery, setGlobalQuery] = useState('');
  const [overview, setOverview] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalMembers: 0,
    totalEmployees: 0,
    totalCreators: 0,
    pendingCreatorRequests: 0,
    totalSubmissions: 0,
    totalAppointments: 0
  });
  const [users, setUsers] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [employeeTasks, setEmployeeTasks] = useState<any[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [creatorContent, setCreatorContent] = useState<any[]>([]);
  const [chatThreads, setChatThreads] = useState<any[]>([]);

  async function loadOverview() {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const [overviewData, userRows, employeeRows, taskRows, submissionRows, appointmentRows, creatorRows, chatRows] =
        await Promise.all([
          fetchAdminOverview(token),
          fetchAdminUsers(token),
          fetchAdminEmployees(token),
          fetchAdminEmployeeTasks(token),
          fetchContactSubmissions(token),
          fetchServiceAppointments(token),
          fetchAdminCreatorContent(token),
          fetchAdminChatThreads(token)
        ]);
      setOverview({
        totalUsers: overviewData?.totalUsers || 0,
        totalAdmins: overviewData?.totalAdmins || 0,
        totalMembers: overviewData?.totalMembers || 0,
        totalEmployees: overviewData?.totalEmployees || 0,
        totalCreators: overviewData?.totalCreators || 0,
        pendingCreatorRequests: overviewData?.pendingCreatorRequests || 0,
        totalSubmissions: overviewData?.totalSubmissions || 0,
        totalAppointments: overviewData?.totalAppointments || 0
      });
      setUsers(userRows || []);
      setEmployees(employeeRows || []);
      setEmployeeTasks(taskRows || []);
      setContactSubmissions(submissionRows || []);
      setAppointments(appointmentRows || []);
      setCreatorContent(creatorRows || []);
      setChatThreads(chatRows || []);
    } catch (err: any) {
      setError(err?.message || 'Unable to load dashboard.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((item) => {
      return (
        String(item.name || '').toLowerCase().includes(q) ||
        String(item.email || '').toLowerCase().includes(q) ||
        String(item.role || '').toLowerCase().includes(q)
      );
    });
  }, [users, query]);

  const analytics = useMemo(() => {
    const roleCounts = users.reduce(
      (acc: any, user: any) => {
        if (user.role === 'admin') acc.admin += 1;
        else if (user.role === 'employee') acc.employee += 1;
        else if (user.role === 'creator') acc.creator += 1;
        else acc.user += 1;
        if (user.isActive) acc.active += 1;
        else acc.inactive += 1;
        return acc;
      },
      { admin: 0, employee: 0, creator: 0, user: 0, active: 0, inactive: 0 }
    );

    const taskStatus = employeeTasks.reduce(
      (acc: any, task: any) => {
        if (task.status === 'completed') acc.completed += 1;
        else if (task.status === 'in_progress') acc.inProgress += 1;
        else acc.pending += 1;
        return acc;
      },
      { completed: 0, inProgress: 0, pending: 0 }
    );

    const monthMap = employeeTasks.reduce((acc: Record<string, number>, task: any) => {
      if (!task?.workDate) return acc;
      const date = new Date(task.workDate);
      if (Number.isNaN(date.getTime())) return acc;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const monthlyTaskRows = Object.entries(monthMap)
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .slice(0, 6);

    const conversionRate = contactSubmissions.length
      ? ((appointments.length / contactSubmissions.length) * 100).toFixed(1)
      : '0.0';

    return { roleCounts, taskStatus, monthlyTaskRows, conversionRate };
  }, [users, employeeTasks, contactSubmissions.length, appointments.length]);

  const sectionSearch = globalQuery.trim().toLowerCase();

  const filteredTasks = useMemo(() => {
    if (!sectionSearch) return employeeTasks;
    return employeeTasks.filter((item: any) => {
      const text = `${item?.title || ''} ${item?.status || ''} ${item?.employeeName || ''}`.toLowerCase();
      return text.includes(sectionSearch);
    });
  }, [employeeTasks, sectionSearch]);

  const filteredContacts = useMemo(() => {
    if (!sectionSearch) return contactSubmissions;
    return contactSubmissions.filter((item: any) => {
      const text = `${item?.name || ''} ${item?.email || ''} ${item?.subject || ''}`.toLowerCase();
      return text.includes(sectionSearch);
    });
  }, [contactSubmissions, sectionSearch]);

  const filteredAppointments = useMemo(() => {
    if (!sectionSearch) return appointments;
    return appointments.filter((item: any) => {
      const text = `${item?.name || ''} ${item?.email || ''} ${item?.serviceTitle || ''} ${item?.phone || ''}`.toLowerCase();
      return text.includes(sectionSearch);
    });
  }, [appointments, sectionSearch]);

  const filteredCreatorContent = useMemo(() => {
    if (!sectionSearch) return creatorContent;
    return creatorContent.filter((item: any) => {
      const text = `${item?.title || ''} ${item?.caption || ''} ${item?.creatorName || ''}`.toLowerCase();
      return text.includes(sectionSearch);
    });
  }, [creatorContent, sectionSearch]);

  const filteredChats = useMemo(() => {
    if (!sectionSearch) return chatThreads;
    return chatThreads.filter((item: any) => {
      const text = `${item?.userName || ''} ${item?.userEmail || ''} ${item?.lastMessage || ''}`.toLowerCase();
      return text.includes(sectionSearch);
    });
  }, [chatThreads, sectionSearch]);

  const recentActivity = useMemo(() => {
    const toMs = (value: any) => {
      const time = new Date(value || '').getTime();
      return Number.isFinite(time) ? time : 0;
    };

    const rows = [
      ...employeeTasks.map((item: any) => ({
        id: `task-${item.id || item._id || Math.random()}`,
        type: 'Task',
        title: item.title || 'Employee task updated',
        meta: `${item.status || 'pending'}${item.employeeName ? ` - ${item.employeeName}` : ''}`,
        time: toMs(item.updatedAt || item.createdAt || item.workDate),
        href: '/admin/employee-manager'
      })),
      ...contactSubmissions.map((item: any) => ({
        id: `contact-${item.id || item._id || Math.random()}`,
        type: 'Contact',
        title: item.subject || `Message from ${item.name || 'visitor'}`,
        meta: item.email || '',
        time: toMs(item.createdAt || item.updatedAt),
        href: '/admin/contact-submissions'
      })),
      ...appointments.map((item: any) => ({
        id: `appointment-${item.id || item._id || Math.random()}`,
        type: 'Appointment',
        title: item.serviceTitle || 'Service appointment request',
        meta: item.name || item.email || '',
        time: toMs(item.createdAt || item.updatedAt || item.preferredDate),
        href: '/admin/service-manager'
      })),
      ...creatorContent.map((item: any) => ({
        id: `creator-${item.id || item._id || Math.random()}`,
        type: 'Creator',
        title: item.title || 'Creator content update',
        meta: item.creatorName || item.status || '',
        time: toMs(item.createdAt || item.updatedAt),
        href: '/admin/content-manager'
      })),
      ...chatThreads.map((item: any) => ({
        id: `chat-${item.userId || item.id || Math.random()}`,
        type: 'Chat',
        title: item.userName ? `Chat with ${item.userName}` : 'Project chat update',
        meta: item.lastMessage || '',
        time: toMs(item.lastMessageAt),
        href: '/admin/project-chats'
      }))
    ];

    return rows.sort((a, b) => b.time - a.time).slice(0, 12);
  }, [employeeTasks, contactSubmissions, appointments, creatorContent, chatThreads]);

  function downloadSnapshot() {
    const payload = {
      generatedAt: new Date().toISOString(),
      overview,
      users,
      employees,
      employeeTasks,
      contactSubmissions,
      appointments,
      creatorContent
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `admin-dashboard-snapshot-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice('Admin snapshot downloaded.');
  }

  async function copySummary() {
    const text = [
      `Users: ${overview.totalUsers}`,
      `Admins: ${overview.totalAdmins}`,
      `Employees: ${overview.totalEmployees}`,
      `Creators: ${overview.totalCreators}`,
      `Contacts: ${overview.totalSubmissions}`,
      `Appointments: ${overview.totalAppointments}`,
      `Tasks: ${employeeTasks.length}`,
      `Creator uploads: ${creatorContent.length}`,
      `Conversion rate: ${analytics.conversionRate}%`
    ].join(' | ');

    try {
      await navigator.clipboard.writeText(text);
      setNotice('Dashboard summary copied.');
    } catch {
      setNotice('Unable to copy summary on this browser.');
    }
  }

  async function refreshUsers() {
    if (!token) return;
    const rows = await fetchAdminUsers(token);
    setUsers(rows || []);
  }

  async function handleRole(userId: string, role: string, name: string) {
    if (!token) return;
    if (!window.confirm(`Change ${name}'s role to ${role}?`)) return;
    setActionId(`role-${userId}`);
    setError('');
    try {
      await updateAdminUserRole(userId, role, token);
      await refreshUsers();
    } catch (err: any) {
      setError(err?.message || 'Unable to update role.');
    } finally {
      setActionId('');
    }
  }

  async function handleCreatorRequest(userId: string, action: 'approve' | 'reject') {
    if (!token) return;
    setActionId(`creator-${action}-${userId}`);
    setError('');
    try {
      await reviewAdminCreatorRequest(userId, action, token);
      await refreshUsers();
    } catch (err: any) {
      setError(err?.message || 'Unable to review creator request.');
    } finally {
      setActionId('');
    }
  }

  async function handleStatus(userId: string, nextActive: boolean) {
    if (!token) return;
    setActionId(`status-${userId}`);
    setError('');
    try {
      await updateAdminUserStatus(userId, nextActive, token);
      await refreshUsers();
    } catch (err: any) {
      setError(err?.message || 'Unable to update status.');
    } finally {
      setActionId('');
    }
  }

  async function handleRevoke(userId: string) {
    if (!token) return;
    setActionId(`revoke-${userId}`);
    setError('');
    try {
      await revokeAdminUserSessions(userId, token);
    } catch (err: any) {
      setError(err?.message || 'Unable to revoke sessions.');
    } finally {
      setActionId('');
    }
  }

  async function handleDelete(userId: string, name: string) {
    if (!token) return;
    if (!window.confirm(`Delete user ${name}?`)) return;
    setActionId(`delete-${userId}`);
    setError('');
    try {
      await deleteAdminUser(userId, token);
      await refreshUsers();
    } catch (err: any) {
      setError(err?.message || 'Unable to delete user.');
    } finally {
      setActionId('');
    }
  }

  return (
    <ProtectedPage requireAdmin>
      <main className="app-page-shell">
      <section className="admin-shell">
        <article className="page-hero-shell space-y-3">
        <h1 className="section-title text-3xl font-extrabold md:text-5xl">Admin Dashboard</h1>
        <p className="text-sm text-slate-300">Manage users, analytics, approvals, and operational controls.</p>
        <div className="admin-toolbar">
          <Link className="admin-btn" href="/admin/content-manager">Content Manager</Link>
          <Link className="admin-btn" href="/admin/service-manager">Service Manager</Link>
          <Link className="admin-btn" href="/admin/projects-manager">Projects Manager</Link>
          <Link className="admin-btn" href="/admin/employee-manager">Employee Manager</Link>
          <Link className="admin-btn" href="/admin/contact-submissions">Contact Submissions</Link>
          <Link className="admin-btn" href="/admin/project-chats">Project Chats</Link>
          <Link className="admin-btn" href="/admin/settings">Settings</Link>
          <button className="admin-btn" type="button" onClick={loadOverview}>Reload</button>
        </div>
        </article>

        {loading ? <p className="text-slate-300">Loading dashboard...</p> : null}
        {error ? <p className="text-red-400">{error}</p> : null}
        {notice ? <p className="text-emerald-400">{notice}</p> : null}

        {!loading ? (
          <>
            <div className="admin-stat-grid">
              {[
                ['Total Users', overview.totalUsers],
                ['Admins', overview.totalAdmins],
                ['Employees', overview.totalEmployees],
                ['Creators', overview.totalCreators],
                ['Creator Requests', overview.pendingCreatorRequests],
                ['Contact Requests', overview.totalSubmissions],
                ['Appointments', overview.totalAppointments],
                ['Creator Uploads', creatorContent.length]
              ].map(([label, value], index) => (
                <motion.article
                  key={String(label)}
                  className="admin-stat-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: index * 0.03 }}
                >
                  <p>{label}</p>
                  <p className="text-2xl font-bold">{value}</p>
                </motion.article>
              ))}
            </div>

            <div className="page-content-card space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">All Sections Control Center</h2>
                <div className="admin-toolbar">
                  <button className="admin-btn" type="button" onClick={loadOverview}>Refresh All Data</button>
                  <button className="admin-btn" type="button" onClick={downloadSnapshot}>Download Snapshot</button>
                  <button className="admin-btn" type="button" onClick={copySummary}>Copy Summary</button>
                </div>
              </div>
              <input
                value={globalQuery}
                onChange={(event) => setGlobalQuery(event.target.value)}
                placeholder="Search across tasks, contacts, appointments, creator content..."
              />
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                <article className="admin-list-card space-y-2">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Employee Tasks</p>
                  <p className="text-2xl font-semibold">{filteredTasks.length}</p>
                  <p className="text-xs text-slate-400">Total records: {employeeTasks.length}</p>
                  <Link className="admin-btn inline-flex w-fit" href="/admin/employee-manager">Open Tasks</Link>
                </article>
                <article className="admin-list-card space-y-2">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Contact Submissions</p>
                  <p className="text-2xl font-semibold">{filteredContacts.length}</p>
                  <p className="text-xs text-slate-400">Total records: {contactSubmissions.length}</p>
                  <Link className="admin-btn inline-flex w-fit" href="/admin/contact-submissions">Open Contacts</Link>
                </article>
                <article className="admin-list-card space-y-2">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Appointments</p>
                  <p className="text-2xl font-semibold">{filteredAppointments.length}</p>
                  <p className="text-xs text-slate-400">Total records: {appointments.length}</p>
                  <Link className="admin-btn inline-flex w-fit" href="/admin/service-manager">Open Services</Link>
                </article>
                <article className="admin-list-card space-y-2">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Creator Content</p>
                  <p className="text-2xl font-semibold">{filteredCreatorContent.length}</p>
                  <p className="text-xs text-slate-400">Total records: {creatorContent.length}</p>
                  <Link className="admin-btn inline-flex w-fit" href="/admin/content-manager">Open Creator Content</Link>
                </article>
                <article className="admin-list-card space-y-2">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Project Chats</p>
                  <p className="text-2xl font-semibold">{filteredChats.length}</p>
                  <p className="text-xs text-slate-400">Total records: {chatThreads.length}</p>
                  <Link className="admin-btn inline-flex w-fit" href="/admin/project-chats">Open Chats</Link>
                </article>
              </div>
            </div>

            <div className="page-content-card space-y-2">
              <h2 className="text-xl font-semibold">Analytics</h2>
              <p className="text-slate-300">
                Roles - Admin: {analytics.roleCounts.admin}, Employee: {analytics.roleCounts.employee}, Creator: {analytics.roleCounts.creator}, User: {analytics.roleCounts.user}
              </p>
              <p className="text-slate-300">
                Tasks - Completed: {analytics.taskStatus.completed}, In Progress: {analytics.taskStatus.inProgress}, Pending: {analytics.taskStatus.pending}
              </p>
              <p className="text-slate-300">
                Conversion - Contacts: {contactSubmissions.length}, Appointments: {appointments.length}, Rate: {analytics.conversionRate}%
              </p>
              <p className="text-slate-400 text-sm">Employees tracked: {employees.length}</p>
              <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Monthly Task Activity</p>
                <div className="mt-2 grid gap-2 md:grid-cols-3">
                  {analytics.monthlyTaskRows.map(([month, count]) => (
                    <div key={month} className="rounded-lg border border-white/10 bg-black/20 p-2">
                      <p className="text-xs text-slate-400">{month}</p>
                      <p className="text-sm font-semibold text-slate-200">{count} tasks</p>
                    </div>
                  ))}
                  {analytics.monthlyTaskRows.length === 0 ? (
                    <p className="text-sm text-slate-400">No task activity data yet.</p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="page-content-card space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">Recent Activity Across All Sections</h2>
                <p className="text-xs text-slate-400">{recentActivity.length} recent updates</p>
              </div>
              <div className="space-y-2">
                {recentActivity.map((item) => (
                  <article key={item.id} className="admin-list-card">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.14em] text-slate-400">{item.type}</p>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-xs text-slate-400">{item.meta || 'No additional info'}</p>
                      </div>
                      <div className="admin-toolbar">
                        <p className="text-xs text-slate-500">
                          {item.time ? new Date(item.time).toLocaleString() : 'Time unavailable'}
                        </p>
                        <Link className="admin-btn" href={item.href}>Open</Link>
                      </div>
                    </div>
                  </article>
                ))}
                {recentActivity.length === 0 ? (
                  <p className="text-slate-400">No activity yet across tasks, contacts, appointments, or creator updates.</p>
                ) : null}
              </div>
            </div>

            <div className="page-content-card space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">User Management</h2>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search users..."
                  className="max-w-xs"
                />
              </div>
              <div className="space-y-3">
                {filteredUsers.map((user: any) => (
                  <article key={user.id} className="admin-list-card">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-slate-300">{user.email}</p>
                        <p className="text-xs text-slate-400">
                          Role: {user.role} | Status: {user.isActive ? 'Active' : 'Disabled'} | Creator Request: {user.creatorRequestStatus || 'none'}
                        </p>
                        {user.creatorRequestMessage ? (
                          <p className="mt-1 text-xs text-slate-500">{String(user.creatorRequestMessage).slice(0, 90)}</p>
                        ) : null}
                      </div>
                      <div className="admin-toolbar">
                        <button className="admin-btn" disabled={actionId === `role-${user.id}`} onClick={() => handleRole(user.id, 'admin', user.name)}>Admin</button>
                        <button className="admin-btn" disabled={actionId === `role-${user.id}`} onClick={() => handleRole(user.id, 'employee', user.name)}>Employee</button>
                        <button className="admin-btn" disabled={actionId === `role-${user.id}`} onClick={() => handleRole(user.id, 'creator', user.name)}>Creator</button>
                        <button className="admin-btn" disabled={actionId === `role-${user.id}`} onClick={() => handleRole(user.id, 'user', user.name)}>User</button>
                        {user.creatorRequestStatus === 'pending' ? (
                          <>
                            <button className="admin-btn" disabled={actionId === `creator-approve-${user.id}`} onClick={() => handleCreatorRequest(user.id, 'approve')}>Approve Creator</button>
                            <button className="admin-btn" disabled={actionId === `creator-reject-${user.id}`} onClick={() => handleCreatorRequest(user.id, 'reject')}>Reject Creator</button>
                          </>
                        ) : null}
                        <button className="admin-btn" disabled={actionId === `status-${user.id}`} onClick={() => handleStatus(user.id, !user.isActive)}>
                          {user.isActive ? 'Disable' : 'Enable'}
                        </button>
                        <button className="admin-btn" disabled={actionId === `revoke-${user.id}`} onClick={() => handleRevoke(user.id)}>Revoke</button>
                        <button className="admin-btn admin-btn-danger" disabled={actionId === `delete-${user.id}`} onClick={() => handleDelete(user.id, user.name)}>Delete</button>
                      </div>
                    </div>
                  </article>
                ))}
                {filteredUsers.length === 0 ? <p className="text-slate-400">No users found.</p> : null}
              </div>
            </div>
          </>
        ) : null}

        <Link className="admin-btn inline-block" href="/profile">
          Back to profile
        </Link>
      </section>
      </main>
    </ProtectedPage>
  );
}
