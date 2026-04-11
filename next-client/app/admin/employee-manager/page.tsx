'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import ProtectedPage from '@/components/auth/ProtectedPage';
import { useAuth } from '@/context/AuthContext';
import {
  createAdminEmployee,
  createAdminEmployeeTask,
  deleteAdminEmployee,
  deleteAdminEmployeeTask,
  downloadAdminEmployeeMonthlyReport,
  fetchAdminEmployeeTasks,
  fetchAdminEmployees,
  updateAdminEmployee,
  updateAdminEmployeeTask
} from '@/lib/clientApi';

const emptyEmployee = {
  name: '',
  email: '',
  password: '',
  role: 'Employee',
  department: '',
  phone: '',
  joinedAt: '',
  notes: '',
  isActive: true
};

const emptyTask = {
  employeeId: '',
  title: '',
  plannedTask: '',
  adminNote: '',
  workDate: new Date().toISOString().slice(0, 10),
  status: 'pending'
};

function calculateDurationHours(task: any) {
  if (!task?.jobStartAt || !task?.jobEndAt) return 0;
  const start = new Date(task.jobStartAt).getTime();
  const end = new Date(task.jobEndAt).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0;
  return (end - start) / (1000 * 60 * 60);
}

function formatTimeValue(value?: string) {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatStatusLabel(value?: string) {
  if (value === 'in_progress') return 'In Progress';
  if (value === 'completed') return 'Completed';
  return 'Pending';
}

function statusChipClass(value?: string) {
  if (value === 'completed') return 'border-emerald-400/35 bg-emerald-500/12 text-emerald-300';
  if (value === 'in_progress') return 'border-amber-400/35 bg-amber-500/12 text-amber-300';
  return 'border-blue-400/35 bg-blue-500/12 text-blue-300';
}

function toValidDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function formatDateValue(value?: string) {
  const date = toValidDate(value);
  return date ? date.toLocaleDateString() : 'N/A';
}

export default function AdminEmployeeManagerPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({
    type: '',
    message: ''
  });
  const [employees, setEmployees] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [employeeForm, setEmployeeForm] = useState<any>(emptyEmployee);
  const [editingEmployeeId, setEditingEmployeeId] = useState('');
  const [taskForm, setTaskForm] = useState<any>(emptyTask);
  const [editingTaskId, setEditingTaskId] = useState('');
  const [reportMonth, setReportMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [taskStatusFilter, setTaskStatusFilter] = useState('all');
  const [taskSearch, setTaskSearch] = useState('');
  const [timelineScope, setTimelineScope] = useState<'selected' | 'all'>('selected');
  const [viewTask, setViewTask] = useState<any | null>(null);

  async function loadData() {
    if (!token) return;
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const [employeeRows, taskRows] = await Promise.all([fetchAdminEmployees(token), fetchAdminEmployeeTasks(token)]);
      setEmployees(employeeRows || []);
      setTasks(taskRows || []);
    } catch (err: any) {
      setStatus({ type: 'error', message: err?.message || 'Unable to load employee workspace.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filteredEmployees = useMemo(() => {
    const q = employeeSearch.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((item) => {
      const name = String(item?.name || '').toLowerCase();
      const email = String(item?.email || '').toLowerCase();
      const dept = String(item?.department || '').toLowerCase();
      return name.includes(q) || email.includes(q) || dept.includes(q);
    });
  }, [employees, employeeSearch]);

  const selectedEmployee = useMemo(
    () => employees.find((item) => (item.userId || item.id) === selectedEmployeeId) || null,
    [employees, selectedEmployeeId]
  );
  const selectedEmployeeKey = selectedEmployee ? selectedEmployee.userId || selectedEmployee.id : '';

  const selectedEmployeeTasks = useMemo(() => {
    if (!selectedEmployeeKey) return [];
    return tasks.filter((item) => item.employeeId === selectedEmployeeKey);
  }, [tasks, selectedEmployeeKey]);

  const selectedMonthTasks = useMemo(() => {
    if (!reportMonth) return selectedEmployeeTasks;
    const [yearText, monthText] = reportMonth.split('-');
    const year = Number(yearText);
    const month = Number(monthText);
    if (!year || !month) return selectedEmployeeTasks;
    return selectedEmployeeTasks.filter((task) => {
      const date = task?.workDate ? new Date(task.workDate) : null;
      if (!date || Number.isNaN(date.getTime())) return false;
      return date.getFullYear() === year && date.getMonth() + 1 === month;
    });
  }, [selectedEmployeeTasks, reportMonth]);

  const allTasksSorted = useMemo(
    () =>
      [...tasks].sort(
        (a, b) =>
          new Date(b.updatedAt || b.workDate || b.createdAt || 0).getTime() -
          new Date(a.updatedAt || a.workDate || a.createdAt || 0).getTime()
      ),
    [tasks]
  );

  const timelineBaseTasks = useMemo(
    () => (timelineScope === 'all' ? allTasksSorted : selectedMonthTasks),
    [timelineScope, allTasksSorted, selectedMonthTasks]
  );

  const approvalQueueTasks = useMemo(
    () => timelineBaseTasks.filter((task) => task.approvalRequested),
    [timelineBaseTasks]
  );

  const monthStats = useMemo(() => {
    const uniqueDays = new Set<string>();
    let completed = 0;
    let inProgress = 0;
    let pending = 0;
    let totalHours = 0;
    for (const task of selectedMonthTasks) {
      const workDate = toValidDate(task?.workDate);
      if (workDate) uniqueDays.add(workDate.toISOString().slice(0, 10));
      if (task.status === 'completed') completed += 1;
      else if (task.status === 'in_progress') inProgress += 1;
      else pending += 1;
      totalHours += calculateDurationHours(task);
    }
    const totalTasks = selectedMonthTasks.length;
    const completionRate = totalTasks ? Math.round((completed / totalTasks) * 100) : 0;
    const avgHoursPerDay = uniqueDays.size ? Number((totalHours / uniqueDays.size).toFixed(2)) : 0;
    return {
      totalTasks,
      completed,
      inProgress,
      pending,
      daysWorked: uniqueDays.size,
      totalHours: Number(totalHours.toFixed(2)),
      completionRate,
      avgHoursPerDay
    };
  }, [selectedMonthTasks]);

  const visibleTimelineTasks = useMemo(() => {
    return timelineBaseTasks.filter((task) => {
      if (taskStatusFilter === 'approval_requested' && !task.approvalRequested) return false;
      if (taskStatusFilter !== 'all' && taskStatusFilter !== 'approval_requested' && task.status !== taskStatusFilter) {
        return false;
      }
      const q = taskSearch.trim().toLowerCase();
      if (!q) return true;
      return (
        String(task.title || '').toLowerCase().includes(q) ||
        String(task.plannedTask || '').toLowerCase().includes(q) ||
        String(task.workUpdate || '').toLowerCase().includes(q) ||
        String(task.employeeName || '').toLowerCase().includes(q)
      );
    });
  }, [timelineBaseTasks, taskSearch, taskStatusFilter]);

  const completedTimelineTasks = useMemo(
    () => timelineBaseTasks.filter((task) => task.status === 'completed'),
    [timelineBaseTasks]
  );

  async function onEmployeeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setStatus({ type: '', message: '' });
    try {
      if (editingEmployeeId) {
        await updateAdminEmployee(editingEmployeeId, employeeForm, token);
        setStatus({ type: 'success', message: 'Employee updated.' });
      } else {
        await createAdminEmployee(employeeForm, token);
        setStatus({ type: 'success', message: 'Employee added.' });
      }
      setEmployeeForm(emptyEmployee);
      setEditingEmployeeId('');
      await loadData();
    } catch (err: any) {
      setStatus({ type: 'error', message: err?.message || 'Unable to save employee.' });
    }
  }

  async function onTaskSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setStatus({ type: '', message: '' });
    try {
      if (editingTaskId) {
        await updateAdminEmployeeTask(editingTaskId, taskForm, token);
        setStatus({ type: 'success', message: 'Task updated.' });
      } else {
        await createAdminEmployeeTask(taskForm, token);
        setStatus({ type: 'success', message: 'Task assigned.' });
      }
      setTaskForm({ ...emptyTask, employeeId: selectedEmployeeId || '' });
      setEditingTaskId('');
      await loadData();
    } catch (err: any) {
      setStatus({ type: 'error', message: err?.message || 'Unable to save task.' });
    }
  }

  async function onDeleteEmployee(employee: any) {
    if (!token) return;
    if (!window.confirm(`Delete employee ${employee.name}?`)) return;
    try {
      await deleteAdminEmployee(employee.id, token);
      setStatus({ type: 'success', message: 'Employee deleted.' });
      await loadData();
    } catch (err: any) {
      setStatus({ type: 'error', message: err?.message || 'Unable to delete employee.' });
    }
  }

  async function onDeleteTask(task: any) {
    if (!token) return;
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    try {
      await deleteAdminEmployeeTask(task.id, token);
      setStatus({ type: 'success', message: 'Task deleted.' });
      await loadData();
    } catch (err: any) {
      setStatus({ type: 'error', message: err?.message || 'Unable to delete task.' });
    }
  }

  async function onApproveTask(task: any, approve: boolean) {
    if (!token) return;
    try {
      await updateAdminEmployeeTask(task.id, { approveTask: approve }, token);
      setStatus({ type: 'success', message: approve ? 'Task approved and completed.' : 'Task marked incomplete.' });
      await loadData();
    } catch (err: any) {
      setStatus({ type: 'error', message: err?.message || 'Unable to update approval.' });
    }
  }

  async function onDownloadMonthlyReport() {
    if (!token) return;
    if (!selectedEmployeeId) {
      setStatus({ type: 'error', message: 'Select employee first.' });
      return;
    }
    if (!reportMonth) {
      setStatus({ type: 'error', message: 'Select report month.' });
      return;
    }
    const [yearText, monthText] = reportMonth.split('-');
    const year = Number(yearText);
    const month = Number(monthText);
    if (!year || !month) {
      setStatus({ type: 'error', message: 'Invalid report month.' });
      return;
    }
    setStatus({ type: '', message: '' });
    try {
      const { blob, filename } = await downloadAdminEmployeeMonthlyReport(selectedEmployeeId, year, month, token);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setStatus({ type: 'success', message: 'Monthly report downloaded.' });
    } catch (err: any) {
      setStatus({ type: 'error', message: err?.message || 'Unable to download monthly report.' });
    }
  }

  return (
    <ProtectedPage requireAdmin>
      <main className="app-page-shell">
      <section className="admin-shell employee-workspace-shell">
        <article className="premium-page-hero space-y-3">
        <h1 className="section-title text-3xl font-extrabold md:text-5xl">Admin Employee Workspace</h1>
        <p className="max-w-3xl text-slate-300">
          Manage employees, assign and review tasks, and monitor work analytics from one clean dashboard.
        </p>
        {loading ? <p className="text-slate-300">Loading employee data...</p> : null}
        </article>

        <div className="admin-stat-grid">
          <article className="admin-stat-card">
            <p className="text-xs text-slate-400">Employees</p>
            <p className="text-2xl font-bold">{employees.length}</p>
          </article>
          <article className="admin-stat-card">
            <p className="text-xs text-slate-400">Tasks</p>
            <p className="text-2xl font-bold">{tasks.length}</p>
          </article>
          <article className="admin-stat-card">
            <p className="text-xs text-slate-400">Approval Queue</p>
            <p className="text-2xl font-bold">{approvalQueueTasks.length}</p>
          </article>
          <article className="admin-stat-card">
            <p className="text-xs text-slate-400">Timeline Results</p>
            <p className="text-2xl font-bold">{visibleTimelineTasks.length}</p>
          </article>
        </div>

        <div className="grid gap-4 lg:grid-cols-[330px_1fr]">
          <article className="page-content-card lg:sticky lg:top-24 lg:h-[calc(100vh-140px)]">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">Employees</h2>
              <span className="admin-chip">{filteredEmployees.length}</span>
            </div>
            <input
              value={employeeSearch}
              onChange={(event) => setEmployeeSearch(event.target.value)}
              placeholder="Search employee..."
            />
            <div className="mt-3 max-h-[70vh] space-y-2 overflow-y-auto pr-1">
              {filteredEmployees.map((employee, index) => {
                const key = employee.userId || employee.id;
                const active = selectedEmployeeId === key;
                return (
                  <motion.button
                    key={employee.userId || employee.id || employee.email || `employee-${index}`}
                    type="button"
                    onClick={() => {
                      setSelectedEmployeeId(key);
                      setTaskForm((prev: any) => ({ ...prev, employeeId: key }));
                    }}
                    className={`w-full rounded-xl border px-3 py-2 text-left ${
                      active
                        ? 'border-blue-400/50 bg-blue-500/10'
                        : 'border-white/10 bg-slate-900/45 hover:border-blue-400/30'
                    }`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                  >
                    <p className="font-medium text-slate-100">{employee.name}</p>
                    <p className="text-xs text-slate-400">{employee.email}</p>
                    <p className="text-[11px] text-slate-500">{employee.department || 'No department'}</p>
                  </motion.button>
                );
              })}
              {filteredEmployees.length === 0 ? (
                <p className="admin-list-card text-sm text-slate-400">No employees found.</p>
              ) : null}
            </div>
          </article>

          <div className="grid gap-4">
            <article className="page-content-card">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-amber-300">Approval Queue</h2>
                <span className="admin-chip">{approvalQueueTasks.length} pending</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Employees requested completion. Approve to mark completed, or keep incomplete.
              </p>
              <div className="mt-3 space-y-2">
                {approvalQueueTasks.map((task) => (
                  <article key={task.id || `${task.employeeId}-${task.title}-${task.workDate || 'no-date'}`} className="admin-list-card employee-queue-item space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">{task.title}</p>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase ${statusChipClass(task.status)}`}>
                        {formatStatusLabel(task.status)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {task.employeeName || 'Employee'} | {formatDateValue(task.workDate)}
                    </p>
                    <p className="text-xs text-slate-500">
                      Start: {formatTimeValue(task.jobStartAt)} | End: {formatTimeValue(task.jobEndAt)}
                    </p>
                    <div className="mt-2 employee-action-grid">
                      <button type="button" className="admin-btn" onClick={() => onApproveTask(task, true)}>
                        Approve Complete
                      </button>
                      <button type="button" className="admin-btn" onClick={() => onApproveTask(task, false)}>
                        Keep Incomplete
                      </button>
                      <button
                        type="button"
                        className="admin-btn"
                        onClick={() => {
                          setSelectedEmployeeId(task.employeeId || '');
                          setEditingTaskId(task.id);
                          setTaskForm({
                            employeeId: task.employeeId || '',
                            title: task.title || '',
                            plannedTask: task.plannedTask || '',
                            adminNote: task.adminNote || '',
                            workDate: task.workDate ? new Date(task.workDate).toISOString().slice(0, 10) : '',
                            status: task.status || 'pending'
                          });
                        }}
                      >
                        Open in Editor
                      </button>
                    </div>
                  </article>
                ))}
                {approvalQueueTasks.length === 0 ? (
                  <p className="text-sm text-slate-400">No tasks are waiting for approval.</p>
                ) : null}
              </div>
            </article>

            <div className="grid gap-4 xl:grid-cols-2 employee-form-grid">
              <form className="page-content-card space-y-2" onSubmit={onEmployeeSubmit}>
                <h2 className="text-xl font-semibold">{editingEmployeeId ? 'Edit Employee' : 'Add Employee'}</h2>
                <p className="text-xs text-slate-400">Create or update employee profile and contact details.</p>
                <input value={employeeForm.name} onChange={(e) => setEmployeeForm((p: any) => ({ ...p, name: e.target.value }))} placeholder="Name" required />
                <input type="email" value={employeeForm.email} onChange={(e) => setEmployeeForm((p: any) => ({ ...p, email: e.target.value }))} placeholder="Email" required />
                <input type="password" value={employeeForm.password} onChange={(e) => setEmployeeForm((p: any) => ({ ...p, password: e.target.value }))} placeholder={editingEmployeeId ? 'Password (optional)' : 'Password'} />
                <div className="grid gap-2 sm:grid-cols-2">
                  <input value={employeeForm.department} onChange={(e) => setEmployeeForm((p: any) => ({ ...p, department: e.target.value }))} placeholder="Department" />
                  <input type="date" value={employeeForm.joinedAt} onChange={(e) => setEmployeeForm((p: any) => ({ ...p, joinedAt: e.target.value }))} />
                </div>
                <input value={employeeForm.phone} onChange={(e) => setEmployeeForm((p: any) => ({ ...p, phone: e.target.value }))} placeholder="Phone" />
                <textarea rows={2} value={employeeForm.notes} onChange={(e) => setEmployeeForm((p: any) => ({ ...p, notes: e.target.value }))} placeholder="Notes" />
                <div className="admin-toolbar">
                  <button className="admin-btn" type="submit">{editingEmployeeId ? 'Update Employee' : 'Add Employee'}</button>
                  {editingEmployeeId ? (
                    <button
                      className="admin-btn"
                      type="button"
                      onClick={() => {
                        setEmployeeForm(emptyEmployee);
                        setEditingEmployeeId('');
                      }}
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
              </form>

              <form className="page-content-card space-y-2" onSubmit={onTaskSubmit}>
                <h2 className="text-xl font-semibold">{editingTaskId ? 'Update Task' : 'Assign Task'}</h2>
                <p className="text-xs text-slate-400">Assign daily work plans, notes, and execution status.</p>
                <select value={taskForm.employeeId} onChange={(e) => setTaskForm((p: any) => ({ ...p, employeeId: e.target.value }))} required>
                  <option value="">Select employee</option>
                  {employees.map((employee) => (
                    <option key={employee.userId || employee.id} value={employee.userId || employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
                <input value={taskForm.title} onChange={(e) => setTaskForm((p: any) => ({ ...p, title: e.target.value }))} placeholder="Task title" required />
                <textarea rows={2} value={taskForm.plannedTask} onChange={(e) => setTaskForm((p: any) => ({ ...p, plannedTask: e.target.value }))} placeholder="Planned task" />
                <textarea rows={2} value={taskForm.adminNote} onChange={(e) => setTaskForm((p: any) => ({ ...p, adminNote: e.target.value }))} placeholder="Admin note" />
                <input type="date" value={taskForm.workDate} onChange={(e) => setTaskForm((p: any) => ({ ...p, workDate: e.target.value }))} />
                <select value={taskForm.status} onChange={(e) => setTaskForm((p: any) => ({ ...p, status: e.target.value }))}>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <button className="admin-btn" type="submit">{editingTaskId ? 'Update Task' : 'Assign Task'}</button>
              </form>
            </div>
          </div>
        </div>

        <div className="page-content-card space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-semibold">Employee Profile + Monthly Report</h2>
            <div className="admin-toolbar">
              <input type="month" value={reportMonth} onChange={(e) => setReportMonth(e.target.value)} />
              <button className="admin-btn" type="button" onClick={onDownloadMonthlyReport}>
                Download XLS
              </button>
            </div>
          </div>
          {selectedEmployee ? (
            <>
              <p className="text-sm text-slate-300">
                {selectedEmployee.name} ({selectedEmployee.email}) - {selectedEmployee.department || 'No department'}
              </p>
              <div className="grid gap-3 md:grid-cols-5">
                <div className="admin-list-card">
                  <p className="text-xs text-slate-400">Total Tasks</p>
                  <p className="text-xl font-semibold">{monthStats.totalTasks}</p>
                </div>
                <div className="admin-list-card">
                  <p className="text-xs text-slate-400">Completed / In Progress / Pending</p>
                  <p className="text-xl font-semibold">
                    {monthStats.completed} / {monthStats.inProgress} / {monthStats.pending}
                  </p>
                </div>
                <div className="admin-list-card">
                  <p className="text-xs text-slate-400">Days Worked / Total Hours</p>
                  <p className="text-xl font-semibold">
                    {monthStats.daysWorked} / {monthStats.totalHours}
                  </p>
                </div>
                <div className="admin-list-card">
                  <p className="text-xs text-slate-400">Completion Rate</p>
                  <p className="text-xl font-semibold">{monthStats.completionRate}%</p>
                </div>
                <div className="admin-list-card">
                  <p className="text-xs text-slate-400">Avg Hours / Day</p>
                  <p className="text-xl font-semibold">{monthStats.avgHoursPerDay}</p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-400">Select employee from list by clicking Edit.</p>
          )}
        </div>

        <div className="page-content-card space-y-3">
          <h2 className="text-xl font-semibold">Employees</h2>
          <div className="space-y-2">
            {employees.map((employee, index) => (
              <article key={employee.userId || employee.id || employee.email || `list-employee-${index}`} className="admin-list-card space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{employee.name}</p>
                    <p className="text-sm text-slate-300">{employee.email}</p>
                  </div>
                  <div className="admin-toolbar">
                    <button className="admin-btn" type="button" onClick={() => {
                      setSelectedEmployeeId(employee.userId || employee.id);
                      setEmployeeForm({
                        name: employee.name || '',
                        email: employee.email || '',
                        password: '',
                        role: employee.role || 'Employee',
                        department: employee.department || '',
                        phone: employee.phone || '',
                        joinedAt: employee.joinedAt ? new Date(employee.joinedAt).toISOString().slice(0, 10) : '',
                        notes: employee.notes || '',
                        isActive: employee.isActive !== false
                      });
                      setEditingEmployeeId(employee.id);
                    }}>Edit</button>
                    <button className="admin-btn admin-btn-danger" type="button" onClick={() => onDeleteEmployee(employee)}>Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="page-content-card space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-semibold">Task Timeline</h2>
            <div className="employee-timeline-controls">
              <button type="button" className="admin-btn" onClick={() => setTimelineScope('selected')}>
                Selected Employee
              </button>
              <button type="button" className="admin-btn" onClick={() => setTimelineScope('all')}>
                View All Task Data
              </button>
              <input value={taskSearch} onChange={(e) => setTaskSearch(e.target.value)} placeholder="Search timeline..." className="min-w-[180px]" />
              <select value={taskStatusFilter} onChange={(e) => setTaskStatusFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="approval_requested">Approval Needed</option>
              </select>
            </div>
          </div>
          {selectedEmployeeId || timelineScope === 'all' ? (
            <div className="space-y-2">
              {visibleTimelineTasks.map((task, index) => (
                <motion.article
                  key={task.id || `${task.employeeId}-${task.title}-${task.workDate || 'no-date'}-${index}`}
                  className="admin-list-card"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, delay: Math.min(index * 0.01, 0.16) }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{task.title}</p>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase ${statusChipClass(task.status)}`}>
                      {formatStatusLabel(task.status)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">
                    {task.employeeName || selectedEmployee?.name || 'Employee'}
                  </p>
                  <p className="text-xs text-slate-400">
                    Date: {formatDateValue(task.workDate)} | Start: {formatTimeValue(task.jobStartAt)} | End: {formatTimeValue(task.jobEndAt)}
                  </p>
                  <p className="text-xs text-slate-400">Plan: {task.plannedTask || 'N/A'}</p>
                  <p className="text-xs text-slate-400">Admin Note: {task.adminNote || 'N/A'}</p>
                  <p className="text-xs text-slate-400">Update: {task.workUpdate || 'No employee update yet.'}</p>
                  <div className="mt-2 admin-toolbar">
                    <button className="admin-btn" type="button" onClick={() => {
                      setEditingTaskId(task.id);
                      setTaskForm({
                        employeeId: task.employeeId || '',
                        title: task.title || '',
                        plannedTask: task.plannedTask || '',
                        adminNote: task.adminNote || '',
                        workDate: task.workDate ? new Date(task.workDate).toISOString().slice(0, 10) : '',
                        status: task.status || 'pending'
                      });
                    }}>Edit</button>
                    <button className="admin-btn admin-btn-danger" type="button" onClick={() => onDeleteTask(task)}>Delete</button>
                    <button className="admin-btn" type="button" onClick={() => setViewTask(task)}>View Employee Data</button>
                    {task.approvalRequested ? (
                      <>
                        <button className="admin-btn" type="button" onClick={() => onApproveTask(task, true)}>Approve Complete</button>
                        <button className="admin-btn" type="button" onClick={() => onApproveTask(task, false)}>Keep Incomplete</button>
                      </>
                    ) : null}
                  </div>
                </motion.article>
              ))}
              {visibleTimelineTasks.length === 0 ? <p className="text-slate-400">No tasks match current filters.</p> : null}
            </div>
          ) : (
            <p className="text-slate-400">Select employee from list by clicking Edit.</p>
          )}
        </div>

        <div className="page-content-card space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-emerald-400">Completed Tasks</h2>
            <span className="admin-chip">{completedTimelineTasks.length}</span>
          </div>
          <div className="space-y-2">
            {completedTimelineTasks.map((task) => (
              <article key={`done-${task.id || `${task.employeeId}-${task.title}-${task.workDate || 'no-date'}`}`} className="admin-list-card">
                <p className="font-semibold">{task.title}</p>
                <p className="text-xs text-slate-400">
                  Completed: {toValidDate(task.completedAt) ? new Date(task.completedAt).toLocaleString() : 'Completed'}
                </p>
              </article>
            ))}
            {completedTimelineTasks.length === 0 ? (
              <p className="text-sm text-slate-400">No completed tasks for selected filters.</p>
            ) : null}
          </div>
        </div>

        {status.message ? (
          <p className={status.type === 'success' ? 'text-emerald-400' : 'text-red-400'}>{status.message}</p>
        ) : null}
        <Link className="admin-btn inline-block" href="/admin/dashboard">
          Back to dashboard
        </Link>
      </section>
      </main>

      <AnimatePresence>
        {viewTask ? (
          <motion.div
            className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/70 px-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-2xl rounded-2xl border border-white/15 bg-slate-900 p-5 shadow-2xl"
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-100">Employee Task Data</h3>
                  <p className="text-xs text-slate-400">
                    {viewTask.employeeName || selectedEmployee?.name || 'Employee'} | {formatStatusLabel(viewTask.status)}
                  </p>
                </div>
                <button type="button" className="admin-btn" onClick={() => setViewTask(null)}>
                  Close
                </button>
              </div>
              <div className="mt-3 grid gap-2 rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm">
                <p className="text-slate-100"><span className="text-slate-400">Title: </span>{viewTask.title || 'N/A'}</p>
                <p className="text-slate-100"><span className="text-slate-400">Date: </span>{formatDateValue(viewTask.workDate)}</p>
                <p className="text-slate-100"><span className="text-slate-400">Job Time: </span>Start: {formatTimeValue(viewTask.jobStartAt)} | End: {formatTimeValue(viewTask.jobEndAt)}</p>
                <p className="text-slate-100"><span className="text-slate-400">Approval: </span>{viewTask.approvalRequested ? 'Pending Admin Approval' : 'Not Pending'}</p>
                <p className="text-slate-100"><span className="text-slate-400">Planned Task: </span>{viewTask.plannedTask || 'N/A'}</p>
                <p className="text-slate-100"><span className="text-slate-400">Admin Note: </span>{viewTask.adminNote || 'N/A'}</p>
                <p className="text-slate-100"><span className="text-slate-400">Employee Update: </span>{viewTask.workUpdate || 'No update provided yet.'}</p>
                <p className="text-slate-100">
                  <span className="text-slate-400">Proof: </span>
                  {viewTask.proofLink ? (
                    <a href={viewTask.proofLink} target="_blank" rel="noreferrer" className="text-blue-300 hover:underline">
                      Open Proof File
                    </a>
                  ) : 'N/A'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </ProtectedPage>
  );
}
