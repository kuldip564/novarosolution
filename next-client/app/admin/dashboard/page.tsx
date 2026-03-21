'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedPage from '@/components/auth/ProtectedPage';
import {
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
  const [actionId, setActionId] = useState('');
  const [query, setQuery] = useState('');
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

  async function loadOverview() {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const [overviewData, userRows, employeeRows, taskRows, submissionRows, appointmentRows, creatorRows] =
        await Promise.all([
          fetchAdminOverview(token),
          fetchAdminUsers(token),
          fetchAdminEmployees(token),
          fetchAdminEmployeeTasks(token),
          fetchContactSubmissions(token),
          fetchServiceAppointments(token),
          fetchAdminCreatorContent(token)
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

    const conversionRate = contactSubmissions.length
      ? ((appointments.length / contactSubmissions.length) * 100).toFixed(1)
      : '0.0';

    return { roleCounts, taskStatus, conversionRate };
  }, [users, employeeTasks, contactSubmissions.length, appointments.length]);

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
          <Link className="admin-btn" href="/admin/project-chats">Admin Chats</Link>
          <Link className="admin-btn" href="/admin/contact-submissions">Contact Submissions</Link>
          <Link className="admin-btn" href="/admin/settings">Settings</Link>
          <button className="admin-btn" type="button" onClick={loadOverview}>Reload</button>
        </div>
        </article>

        {loading ? <p className="text-slate-300">Loading dashboard...</p> : null}
        {error ? <p className="text-red-400">{error}</p> : null}

        {!loading ? (
          <>
            <div className="admin-stat-grid">
              <article className="admin-stat-card"><p>Total Users</p><p className="text-2xl font-bold">{overview.totalUsers}</p></article>
              <article className="admin-stat-card"><p>Admins</p><p className="text-2xl font-bold">{overview.totalAdmins}</p></article>
              <article className="admin-stat-card"><p>Employees</p><p className="text-2xl font-bold">{overview.totalEmployees}</p></article>
              <article className="admin-stat-card"><p>Creators</p><p className="text-2xl font-bold">{overview.totalCreators}</p></article>
              <article className="admin-stat-card"><p>Creator Requests</p><p className="text-2xl font-bold">{overview.pendingCreatorRequests}</p></article>
              <article className="admin-stat-card"><p>Contact Requests</p><p className="text-2xl font-bold">{overview.totalSubmissions}</p></article>
              <article className="admin-stat-card"><p>Appointments</p><p className="text-2xl font-bold">{overview.totalAppointments}</p></article>
              <article className="admin-stat-card"><p>Creator Uploads</p><p className="text-2xl font-bold">{creatorContent.length}</p></article>
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
