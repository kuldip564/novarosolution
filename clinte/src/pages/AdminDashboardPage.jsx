import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import HomeLayout from '../assets/componet/HomeLayout';
import LoadingState from '../components/LoadingState';
import {
  fetchAdminCreatorContent,
  deleteAdminUser,
  fetchAdminEmployees,
  fetchAdminEmployeeTasks,
  fetchAdminOverview,
  fetchAdminUsers,
  fetchContactSubmissions,
  fetchServiceAppointments,
  revokeAdminUserSessions,
  reviewAdminCreatorRequest,
  updateAdminUserRole,
  updateAdminUserStatus,
} from '../config/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboardPage = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeTasks, setEmployeeTasks] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [creatorContent, setCreatorContent] = useState([]);
  const [query, setQuery] = useState('');
  const [actionId, setActionId] = useState('');
  const [overview, setOverview] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalMembers: 0,
    totalEmployees: 0,
    totalCreators: 0,
    pendingCreatorRequests: 0,
    totalSubmissions: 0,
    totalAppointments: 0,
  });

  useEffect(() => {
    let active = true;

    async function loadOverview() {
      try {
        const [overviewData, userRows, employeeRows, taskRows, submissionRows, appointmentRows, creatorRows] = await Promise.all([
          fetchAdminOverview(token),
          fetchAdminUsers(token),
          fetchAdminEmployees(token),
          fetchAdminEmployeeTasks(token),
          fetchContactSubmissions(token),
          fetchServiceAppointments(token),
          fetchAdminCreatorContent(token),
        ]);
        if (!active) return;
        setOverview({
          totalUsers: overviewData?.totalUsers || 0,
          totalAdmins: overviewData?.totalAdmins || 0,
          totalMembers: overviewData?.totalMembers || 0,
          totalEmployees: overviewData?.totalEmployees || 0,
          totalCreators: overviewData?.totalCreators || 0,
          pendingCreatorRequests: overviewData?.pendingCreatorRequests || 0,
          totalSubmissions: overviewData?.totalSubmissions || 0,
          totalAppointments: overviewData?.totalAppointments || 0,
        });
        setUsers(userRows || []);
        setEmployees(employeeRows || []);
        setEmployeeTasks(taskRows || []);
        setContactSubmissions(submissionRows || []);
        setAppointments(appointmentRows || []);
        setCreatorContent(creatorRows || []);
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Unable to load dashboard.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOverview();
    return () => {
      active = false;
    };
  }, [token]);

  const filteredUsers = users.filter((item) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      String(item.name || '').toLowerCase().includes(q) ||
      String(item.email || '').toLowerCase().includes(q) ||
      String(item.role || '').toLowerCase().includes(q)
    );
  });

  const analytics = useMemo(() => {
    const roleCounts = users.reduce(
      (acc, user) => {
        if (user.role === 'admin') acc.admin += 1;
        else if (user.role === 'employee') acc.employee += 1;
        else if (user.role === 'creator') acc.creator += 1;
        else acc.user += 1;
        if (user.isActive) acc.active += 1;
        else acc.inactive += 1;
        return acc;
      },
      { admin: 0, employee: 0, creator: 0, user: 0, active: 0, inactive: 0 },
    );

    const taskStatus = employeeTasks.reduce(
      (acc, task) => {
        if (task.status === 'completed') acc.completed += 1;
        else if (task.status === 'in_progress') acc.inProgress += 1;
        else acc.pending += 1;
        return acc;
      },
      { completed: 0, inProgress: 0, pending: 0 },
    );

    const monthMap = {};
    employeeTasks.forEach((task) => {
      if (!task.workDate) return;
      const d = new Date(task.workDate);
      if (Number.isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthMap[key] = (monthMap[key] || 0) + 1;
    });
    const monthlyTaskRows = Object.entries(monthMap)
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .slice(0, 6);

    const conversionRate = contactSubmissions.length
      ? ((appointments.length / contactSubmissions.length) * 100).toFixed(1)
      : '0.0';

    return { roleCounts, taskStatus, monthlyTaskRows, conversionRate };
  }, [users, employeeTasks, contactSubmissions.length, appointments.length]);

  const reloadUsers = async () => {
    const rows = await fetchAdminUsers(token);
    setUsers(rows || []);
  };

  const handleCreatorRequestReview = async (user, action) => {
    setActionId(`creator-${action}-${user.id}`);
    setError('');
    try {
      await reviewAdminCreatorRequest(user.id, action, token);
      await reloadUsers();
    } catch (err) {
      setError(err.message || 'Unable to review creator request.');
    } finally {
      setActionId('');
    }
  };

  const handleRole = async (user, role) => {
    const confirmed = window.confirm(`Change ${user.name}'s role to ${role}?`);
    if (!confirmed) return;
    setActionId(`role-${user.id}`);
    setError('');
    try {
      await updateAdminUserRole(user.id, role, token);
      await reloadUsers();
    } catch (err) {
      setError(err.message || 'Unable to update role.');
    } finally {
      setActionId('');
    }
  };

  const handleStatus = async (user) => {
    setActionId(`status-${user.id}`);
    setError('');
    try {
      await updateAdminUserStatus(user.id, !user.isActive, token);
      await reloadUsers();
    } catch (err) {
      setError(err.message || 'Unable to update status.');
    } finally {
      setActionId('');
    }
  };

  const handleRevoke = async (user) => {
    setActionId(`revoke-${user.id}`);
    setError('');
    try {
      await revokeAdminUserSessions(user.id, token);
    } catch (err) {
      setError(err.message || 'Unable to revoke sessions.');
    } finally {
      setActionId('');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete user ${user.name}?`)) return;
    setActionId(`delete-${user.id}`);
    setError('');
    try {
      await deleteAdminUser(user.id, token);
      await reloadUsers();
    } catch (err) {
      setError(err.message || 'Unable to delete user.');
    } finally {
      setActionId('');
    }
  };

  const cards = [
    { label: 'Total Users', value: overview.totalUsers },
    { label: 'Total Admins', value: overview.totalAdmins },
    { label: 'Total Members', value: overview.totalMembers },
    { label: 'Total Employees', value: overview.totalEmployees },
    { label: 'Total Creators', value: overview.totalCreators },
    { label: 'Creator Requests', value: overview.pendingCreatorRequests },
    { label: 'Contact Requests', value: overview.totalSubmissions },
    { label: 'Appointments', value: overview.totalAppointments },
  ];

  return (
    <HomeLayout>
      <section className="mx-auto w-[96vw] max-w-[1260px] px-2 pb-14 pt-8 md:px-0">
        <div className="rounded-2xl border border-white/10 bg-slate-950/75 p-6">
          <h1 className="text-2xl font-semibold text-slate-100">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-slate-400">System overview and activity snapshot.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/admin/content-manager"
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-slate-200"
            >
              Content Manager
            </Link>
            <Link
              to="/admin/service-manager"
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-slate-200"
            >
              Service Manager
            </Link>
            <Link
              to="/admin/projects-manager"
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-slate-200"
            >
              Projects Manager
            </Link>
            <Link
              to="/admin/project-chats"
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-slate-200"
            >
              Admin Chats
            </Link>
            <Link
              to="/admin/settings"
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-slate-200"
            >
              Settings
            </Link>
            <Link
              to="/admin/contact-submissions"
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-slate-200"
            >
              Contact Submissions
            </Link>
            <Link
              to="/admin/employee-manager"
              className="rounded-xl border border-pink-400/35 bg-pink-500/15 px-4 py-2 text-sm text-pink-200"
            >
              Open Employee Manager
            </Link>
          </div>

          {loading ? (
            <div className="mt-8">
              <LoadingState label="Loading dashboard..." />
            </div>
          ) : error ? (
            <p className="mt-8 text-sm text-red-400">{error}</p>
          ) : (
            <>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-8">
                {cards.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-400">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-100">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                <h2 className="mb-4 text-lg font-semibold text-slate-100">Analytics</h2>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400">User Roles</p>
                    <p className="mt-1 text-sm text-slate-300">
                      Admin: {analytics.roleCounts.admin} | Employee: {analytics.roleCounts.employee} | Creator:{' '}
                      {analytics.roleCounts.creator} | User: {analytics.roleCounts.user}
                    </p>
                    <p className="text-xs text-slate-500">
                      Active: {analytics.roleCounts.active} | Disabled: {analytics.roleCounts.inactive}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Employee Tasks</p>
                    <p className="mt-1 text-sm text-slate-300">
                      Completed: {analytics.taskStatus.completed} | In Progress: {analytics.taskStatus.inProgress} |
                      Pending: {analytics.taskStatus.pending}
                    </p>
                    <p className="text-xs text-slate-500">Employees tracked: {employees.length}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Lead Conversion</p>
                    <p className="mt-1 text-sm text-slate-300">
                      Contacts: {contactSubmissions.length} | Appointments: {appointments.length}
                    </p>
                    <p className="text-xs text-slate-500">Conversion: {analytics.conversionRate}%</p>
                  </div>
                </div>
                <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/60 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Monthly Task Activity</p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    {analytics.monthlyTaskRows.map(([month, count]) => (
                      <div key={month} className="rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2">
                        <p className="text-xs text-slate-400">{month}</p>
                        <p className="text-sm font-semibold text-slate-100">{count} tasks</p>
                      </div>
                    ))}
                    {analytics.monthlyTaskRows.length === 0 && (
                      <p className="text-sm text-slate-400">No task activity data yet.</p>
                    )}
                  </div>
                </div>
                <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/60 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Creator Uploads</p>
                  <p className="mt-1 text-sm text-slate-300">Total uploads: {creatorContent.length}</p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-slate-100">User Management</h2>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search users..."
                    className="w-full max-w-xs rounded-xl border border-white/15 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-left text-slate-400">
                        <th className="px-2 py-2">Name</th>
                        <th className="px-2 py-2">Email</th>
                        <th className="px-2 py-2">Role</th>
                        <th className="px-2 py-2">Creator Request</th>
                        <th className="px-2 py-2">Status</th>
                        <th className="px-2 py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-white/5">
                          <td className="px-2 py-2 text-slate-100">{user.name}</td>
                          <td className="px-2 py-2 text-slate-300">{user.email}</td>
                          <td className="px-2 py-2 text-slate-300">{user.role}</td>
                          <td className="px-2 py-2 text-slate-300">
                            <div className="flex flex-col gap-1">
                              <span>{user.creatorRequestStatus || 'none'}</span>
                              {user.creatorRequestMessage ? (
                                <span className="text-xs text-slate-500">
                                  {String(user.creatorRequestMessage).slice(0, 60)}
                                </span>
                              ) : null}
                            </div>
                          </td>
                          <td className="px-2 py-2">
                            <span
                              className={`rounded-full px-2 py-1 text-xs ${
                                user.isActive
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-red-500/20 text-red-300'
                              }`}
                            >
                              {user.isActive ? 'Active' : 'Disabled'}
                            </span>
                          </td>
                          <td className="px-2 py-2">
                            <div className="flex flex-wrap justify-end gap-2">
                              <button
                                type="button"
                                disabled={actionId === `role-${user.id}`}
                                onClick={() => handleRole(user, 'admin')}
                                className="rounded-lg border border-blue-400/35 bg-blue-500/10 px-2 py-1 text-xs text-blue-200 disabled:opacity-50"
                              >
                                Admin
                              </button>
                              <button
                                type="button"
                                disabled={actionId === `role-${user.id}`}
                                onClick={() => handleRole(user, 'user')}
                                className="rounded-lg border border-slate-400/35 bg-slate-500/10 px-2 py-1 text-xs text-slate-200 disabled:opacity-50"
                              >
                                User
                              </button>
                              <button
                                type="button"
                                disabled={actionId === `role-${user.id}`}
                                onClick={() => handleRole(user, 'employee')}
                                className="rounded-lg border border-emerald-400/35 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-200 disabled:opacity-50"
                              >
                                Employee
                              </button>
                              <button
                                type="button"
                                disabled={actionId === `role-${user.id}`}
                                onClick={() => handleRole(user, 'creator')}
                                className="rounded-lg border border-fuchsia-400/35 bg-fuchsia-500/10 px-2 py-1 text-xs text-fuchsia-200 disabled:opacity-50"
                              >
                                Creator
                              </button>
                              {user.creatorRequestStatus === 'pending' && (
                                <>
                                  <button
                                    type="button"
                                    disabled={actionId === `creator-approve-${user.id}`}
                                    onClick={() => handleCreatorRequestReview(user, 'approve')}
                                    className="rounded-lg border border-lime-400/35 bg-lime-500/10 px-2 py-1 text-xs text-lime-200 disabled:opacity-50"
                                  >
                                    Approve Creator
                                  </button>
                                  <button
                                    type="button"
                                    disabled={actionId === `creator-reject-${user.id}`}
                                    onClick={() => handleCreatorRequestReview(user, 'reject')}
                                    className="rounded-lg border border-orange-400/35 bg-orange-500/10 px-2 py-1 text-xs text-orange-200 disabled:opacity-50"
                                  >
                                    Reject Creator
                                  </button>
                                </>
                              )}
                              <button
                                type="button"
                                disabled={actionId === `status-${user.id}`}
                                onClick={() => handleStatus(user)}
                                className="rounded-lg border border-amber-400/35 bg-amber-500/10 px-2 py-1 text-xs text-amber-200 disabled:opacity-50"
                              >
                                {user.isActive ? 'Disable' : 'Enable'}
                              </button>
                              <button
                                type="button"
                                disabled={actionId === `revoke-${user.id}`}
                                onClick={() => handleRevoke(user)}
                                className="rounded-lg border border-violet-400/35 bg-violet-500/10 px-2 py-1 text-xs text-violet-200 disabled:opacity-50"
                              >
                                Revoke
                              </button>
                              <button
                                type="button"
                                disabled={actionId === `delete-${user.id}`}
                                onClick={() => handleDelete(user)}
                                className="rounded-lg border border-red-400/35 bg-red-500/10 px-2 py-1 text-xs text-red-200 disabled:opacity-50"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </HomeLayout>
  );
};

export default AdminDashboardPage;
