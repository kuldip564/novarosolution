import React, { useEffect, useMemo, useState } from 'react';
import HomeLayout from '../assets/componet/HomeLayout';
import LoadingState from '../components/LoadingState';
import {
  createAdminEmployee,
  createAdminEmployeeTask,
  deleteAdminEmployee,
  deleteAdminEmployeeTask,
  downloadAdminEmployeeMonthlyReport,
  fetchAdminEmployees,
  fetchAdminEmployeeTasks,
  updateAdminEmployee,
  updateAdminEmployeeTask,
} from '../config/api';
import { useAuth } from '../context/AuthContext';

const emptyEmployeeForm = {
  name: '',
  email: '',
  password: '',
  role: 'Employee',
  department: '',
  phone: '',
  joinedAt: '',
  notes: '',
  isActive: true,
};

const emptyTaskForm = {
  employeeId: '',
  title: '',
  plannedTask: '',
  adminNote: '',
  workDate: new Date().toISOString().slice(0, 10),
  status: 'pending',
};

function calculateDurationHours(task) {
  if (!task.jobStartAt || !task.jobEndAt) return 0;
  const start = new Date(task.jobStartAt).getTime();
  const end = new Date(task.jobEndAt).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0;
  return (end - start) / (1000 * 60 * 60);
}

function formatTimeValue(value) {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatStatusLabel(value) {
  if (value === 'in_progress') return 'In Progress';
  if (value === 'completed') return 'Completed';
  return 'Pending';
}

const AdminEmployeeWorkspacePage = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });

  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [employeeSearch, setEmployeeSearch] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [reportMonth, setReportMonth] = useState('');
  const [taskStatusFilter, setTaskStatusFilter] = useState('all');
  const [taskSearch, setTaskSearch] = useState('');
  const [timelineScope, setTimelineScope] = useState('selected');

  const [employeeForm, setEmployeeForm] = useState(emptyEmployeeForm);
  const [editingEmployeeId, setEditingEmployeeId] = useState('');

  const [taskForm, setTaskForm] = useState(emptyTaskForm);
  const [editingTaskId, setEditingTaskId] = useState('');
  const [viewTask, setViewTask] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [employeeRows, taskRows] = await Promise.all([
        fetchAdminEmployees(token),
        fetchAdminEmployeeTasks(token),
      ]);
      setEmployees(employeeRows || []);
      setTasks(taskRows || []);
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to load employee workspace.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filteredEmployees = useMemo(() => {
    const q = employeeSearch.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((item) => {
      const name = String(item.name || '').toLowerCase();
      const email = String(item.email || '').toLowerCase();
      const dept = String(item.department || '').toLowerCase();
      return name.includes(q) || email.includes(q) || dept.includes(q);
    });
  }, [employeeSearch, employees]);

  const selectedEmployee = useMemo(
    () => employees.find((item) => (item.userId || item.id) === selectedEmployeeId) || null,
    [employees, selectedEmployeeId],
  );

  const selectedEmployeeKey = selectedEmployee ? selectedEmployee.userId || selectedEmployee.id : '';
  const selectedEmployeeAllTasks = useMemo(
    () => tasks.filter((item) => item.employeeId === selectedEmployeeKey),
    [tasks, selectedEmployeeKey],
  );

  const selectedMonthTasks = useMemo(() => {
    if (!reportMonth) return selectedEmployeeAllTasks;
    const [yearText, monthText] = reportMonth.split('-');
    const year = Number(yearText);
    const month = Number(monthText);
    if (!year || !month) return selectedEmployeeAllTasks;
    return selectedEmployeeAllTasks.filter((item) => {
      const d = item.workDate ? new Date(item.workDate) : null;
      if (!d || Number.isNaN(d.getTime())) return false;
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });
  }, [selectedEmployeeAllTasks, reportMonth]);

  const allTasksSorted = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const aTime = new Date(a.updatedAt || a.workDate || a.createdAt || 0).getTime();
      const bTime = new Date(b.updatedAt || b.workDate || b.createdAt || 0).getTime();
      return bTime - aTime;
    });
  }, [tasks]);

  const timelineBaseTasks = useMemo(
    () => (timelineScope === 'all' ? allTasksSorted : selectedMonthTasks),
    [timelineScope, allTasksSorted, selectedMonthTasks],
  );

  const monthStats = useMemo(() => {
    const uniqueDays = new Set();
    let completed = 0;
    let inProgress = 0;
    let pending = 0;
    let totalHours = 0;

    selectedMonthTasks.forEach((task) => {
      if (task.workDate) uniqueDays.add(new Date(task.workDate).toISOString().slice(0, 10));
      if (task.status === 'completed') completed += 1;
      else if (task.status === 'in_progress') inProgress += 1;
      else pending += 1;
      totalHours += calculateDurationHours(task);
    });

    return {
      totalTasks: selectedMonthTasks.length,
      completed,
      inProgress,
      pending,
      daysWorked: uniqueDays.size,
      totalHours: Number(totalHours.toFixed(2)),
    };
  }, [selectedMonthTasks]);

  const completionRate = useMemo(() => {
    if (!monthStats.totalTasks) return 0;
    return Math.round((monthStats.completed / monthStats.totalTasks) * 100);
  }, [monthStats.completed, monthStats.totalTasks]);

  const averageHoursPerDay = useMemo(() => {
    if (!monthStats.daysWorked) return 0;
    return Number((monthStats.totalHours / monthStats.daysWorked).toFixed(2));
  }, [monthStats.daysWorked, monthStats.totalHours]);

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
    [timelineBaseTasks],
  );

  const approvalQueueTasks = useMemo(() => {
    return [...tasks]
      .filter((task) => task.approvalRequested)
      .sort((a, b) => {
        const aTime = new Date(a.updatedAt || a.workDate || a.createdAt || 0).getTime();
        const bTime = new Date(b.updatedAt || b.workDate || b.createdAt || 0).getTime();
        return bTime - aTime;
      });
  }, [tasks]);

  const resetEmployeeForm = () => {
    setEmployeeForm(emptyEmployeeForm);
    setEditingEmployeeId('');
  };

  const resetTaskForm = () => {
    setTaskForm({
      ...emptyTaskForm,
      employeeId: selectedEmployeeKey || '',
    });
    setEditingTaskId('');
  };

  const handleEmployeeSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    try {
      if (editingEmployeeId) {
        await updateAdminEmployee(editingEmployeeId, employeeForm, token);
        setStatus({ type: 'success', message: 'Employee updated successfully.' });
      } else {
        await createAdminEmployee(employeeForm, token);
        setStatus({ type: 'success', message: 'Employee added successfully.' });
      }
      resetEmployeeForm();
      await loadData();
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to save employee.' });
    }
  };

  const handleEmployeeEdit = (employee) => {
    setSelectedEmployeeId(employee.userId || employee.id);
    setEditingEmployeeId(employee.id);
    setEmployeeForm({
      name: employee.name || '',
      email: employee.email || '',
      password: '',
      role: employee.role || 'Employee',
      department: employee.department || '',
      phone: employee.phone || '',
      joinedAt: employee.joinedAt ? new Date(employee.joinedAt).toISOString().slice(0, 10) : '',
      notes: employee.notes || '',
      isActive: employee.isActive !== false,
    });
  };

  const handleEmployeeDelete = async (employee) => {
    if (!window.confirm(`Delete employee ${employee.name}?`)) return;
    setStatus({ type: '', message: '' });
    try {
      await deleteAdminEmployee(employee.id, token);
      setStatus({ type: 'success', message: `${employee.name} deleted successfully.` });
      if (selectedEmployeeId === (employee.userId || employee.id)) setSelectedEmployeeId('');
      if (editingEmployeeId === employee.id) resetEmployeeForm();
      await loadData();
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to delete employee.' });
    }
  };

  const handleTaskSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    try {
      if (editingTaskId) {
        await updateAdminEmployeeTask(editingTaskId, taskForm, token);
        setStatus({ type: 'success', message: 'Task updated successfully.' });
      } else {
        await createAdminEmployeeTask(taskForm, token);
        setStatus({ type: 'success', message: 'Task assigned successfully.' });
      }
      resetTaskForm();
      await loadData();
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to save task.' });
    }
  };

  const handleTaskEdit = (task) => {
    setSelectedEmployeeId(task.employeeId || '');
    if (task.workDate) {
      const monthValue = new Date(task.workDate).toISOString().slice(0, 7);
      setReportMonth(monthValue);
    }
    setEditingTaskId(task.id);
    setTaskForm({
      employeeId: task.employeeId || '',
      title: task.title || '',
      plannedTask: task.plannedTask || '',
      adminNote: task.adminNote || '',
      workDate: task.workDate ? new Date(task.workDate).toISOString().slice(0, 10) : '',
      status: task.status || 'pending',
    });
  };

  const handleTaskDelete = async (task) => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    setStatus({ type: '', message: '' });
    try {
      await deleteAdminEmployeeTask(task.id, token);
      setStatus({ type: 'success', message: 'Task deleted successfully.' });
      if (editingTaskId === task.id) resetTaskForm();
      await loadData();
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to delete task.' });
    }
  };

  const closeTaskViewer = () => setViewTask(null);

  const handleDownload = async () => {
    if (!selectedEmployeeKey) {
      setStatus({ type: 'error', message: 'Select an employee first.' });
      return;
    }
    if (!reportMonth) {
      setStatus({ type: 'error', message: 'Select a report month.' });
      return;
    }
    const [yearText, monthText] = reportMonth.split('-');
    const year = Number(yearText);
    const month = Number(monthText);
    try {
      const { blob, filename } = await downloadAdminEmployeeMonthlyReport(selectedEmployeeKey, year, month, token);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setStatus({ type: 'success', message: 'Monthly XLS downloaded.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to download monthly report.' });
    }
  };

  const handleTaskApproval = async (task, approve) => {
    try {
      await updateAdminEmployeeTask(task.id, { approveTask: approve }, token);
      setStatus({
        type: 'success',
        message: approve ? `Task "${task.title}" approved and completed.` : `Task "${task.title}" marked incomplete.`,
      });
      await loadData();
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to update task approval.' });
    }
  };

  return (
    <HomeLayout>
      <section className="mx-auto w-[96vw] max-w-[1260px] px-2 pb-14 pt-8 md:px-0">
        <h1 className="text-2xl font-semibold text-slate-100">Employee Manager</h1>
        <p className="mt-1 text-sm text-slate-400">
          Full admin control for employees, tasks, monthly reports, and work history.
        </p>

        {status.message && (
          <p className={`mt-3 text-sm ${status.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
            {status.message}
          </p>
        )}

        {loading ? (
          <div className="mt-6">
            <LoadingState label="Loading employee workspace..." />
          </div>
        ) : (
          <div className="mt-5 grid gap-4">
            <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
              <div className="rounded-2xl border border-white/10 bg-slate-950/75 p-4">
                <div className="flex items-center gap-2">
                  <input
                    value={employeeSearch}
                    onChange={(event) => setEmployeeSearch(event.target.value)}
                    placeholder="Search employee..."
                    className="w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm"
                  />
                </div>
                <div className="mt-3 max-h-[70vh] space-y-2 overflow-y-auto pr-1">
                  {filteredEmployees.map((employee) => {
                    const key = employee.userId || employee.id;
                    const active = selectedEmployeeId === key;
                    return (
                      <button
                        key={employee.id}
                        type="button"
                        onClick={() => {
                          setSelectedEmployeeId(key);
                          setTaskForm((prev) => ({ ...prev, employeeId: key }));
                        }}
                        className={`w-full rounded-xl border px-3 py-2 text-left ${
                          active
                            ? 'border-pink-400/40 bg-pink-500/10'
                            : 'border-white/10 bg-slate-900/60 hover:border-white/20'
                        }`}
                      >
                        <p className="font-medium text-slate-100">{employee.name}</p>
                        <p className="text-xs text-slate-400">{employee.email}</p>
                        <p className="text-[11px] text-slate-500">{employee.department || 'No department'}</p>
                      </button>
                    );
                  })}
                  {filteredEmployees.length === 0 && (
                    <p className="rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2 text-sm text-slate-400">
                      No employees found.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-2xl border border-amber-400/25 bg-amber-950/10 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold text-amber-200">Approval Queue</h2>
                    <span className="rounded-full border border-amber-300/35 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-100">
                      {approvalQueueTasks.length} pending
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    Employees requested completion. Approve to mark task completed, or keep incomplete.
                  </p>
                  <div className="mt-3 space-y-2">
                    {approvalQueueTasks.map((task) => (
                      <div key={task.id} className="rounded-xl border border-amber-300/20 bg-slate-900/60 p-3">
                        <p className="font-medium text-slate-100">{task.title}</p>
                        <p className="text-xs text-slate-400">
                          {(task.employeeName || 'Employee')} | {task.workDate ? new Date(task.workDate).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className="text-xs text-slate-500">
                          Start: {formatTimeValue(task.jobStartAt)} | End: {formatTimeValue(task.jobEndAt)}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleTaskApproval(task, true)}
                            className="rounded-lg border border-emerald-400/35 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-200"
                          >
                            Approve Complete
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTaskApproval(task, false)}
                            className="rounded-lg border border-amber-400/35 bg-amber-500/10 px-2 py-1 text-xs text-amber-200"
                          >
                            Keep Incomplete
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTaskEdit(task)}
                            className="rounded-lg border border-blue-400/35 bg-blue-500/10 px-2 py-1 text-xs text-blue-200"
                          >
                            Open in Editor
                          </button>
                        </div>
                      </div>
                    ))}
                    {approvalQueueTasks.length === 0 && (
                      <p className="text-sm text-slate-400">No tasks are waiting for approval.</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/75 p-4">
                    <h2 className="text-lg font-semibold text-slate-100">
                      {editingEmployeeId ? 'Edit Employee' : 'Add Employee'}
                    </h2>
                    <form onSubmit={handleEmployeeSubmit} className="mt-3 grid gap-2">
                      <input
                        className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm"
                        placeholder="Name"
                        value={employeeForm.name}
                        onChange={(e) => setEmployeeForm((p) => ({ ...p, name: e.target.value }))}
                        required
                      />
                      <input
                        type="email"
                        className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm"
                        placeholder="Email"
                        value={employeeForm.email}
                        onChange={(e) => setEmployeeForm((p) => ({ ...p, email: e.target.value }))}
                        required
                      />
                      <input
                        type="password"
                        className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm"
                        placeholder={editingEmployeeId ? 'Password (optional)' : 'Password (required)'}
                        value={employeeForm.password}
                        onChange={(e) => setEmployeeForm((p) => ({ ...p, password: e.target.value }))}
                      />
                      <div className="grid gap-2 sm:grid-cols-2">
                        <input
                          className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm"
                          placeholder="Department"
                          value={employeeForm.department}
                          onChange={(e) => setEmployeeForm((p) => ({ ...p, department: e.target.value }))}
                        />
                        <div className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm text-slate-400">
                          Contact (optional)
                        </div>
                      </div>
                      <input
                        className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm"
                        placeholder="Phone"
                        value={employeeForm.phone}
                        onChange={(e) => setEmployeeForm((p) => ({ ...p, phone: e.target.value }))}
                      />
                      <textarea
                        rows={2}
                        className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm"
                        placeholder="Notes"
                        value={employeeForm.notes}
                        onChange={(e) => setEmployeeForm((p) => ({ ...p, notes: e.target.value }))}
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="rounded-xl border border-pink-400/35 bg-pink-500/15 px-3 py-2 text-sm text-pink-200"
                        >
                          {editingEmployeeId ? 'Update Employee' : 'Add Employee'}
                        </button>
                        {editingEmployeeId && (
                          <button
                            type="button"
                            onClick={resetEmployeeForm}
                            className="rounded-xl border border-white/20 px-3 py-2 text-sm text-slate-200"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>

                    {selectedEmployee && (
                      <div className="mt-4 rounded-xl border border-white/10 bg-slate-900/60 p-3">
                        <p className="font-medium text-slate-100">{selectedEmployee.name}</p>
                        <p className="text-xs text-slate-400">{selectedEmployee.email}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          Joined:{' '}
                          {selectedEmployee.joinedAt
                            ? new Date(selectedEmployee.joinedAt).toLocaleDateString()
                            : 'N/A'}
                        </p>
                        <p className="text-xs text-slate-500">
                          Department: {selectedEmployee.department || 'N/A'} | Phone:{' '}
                          {selectedEmployee.phone || 'N/A'}
                        </p>
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEmployeeEdit(selectedEmployee)}
                            className="rounded-lg border border-blue-400/35 bg-blue-500/10 px-2 py-1 text-xs text-blue-200"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEmployeeDelete(selectedEmployee)}
                            className="rounded-lg border border-red-400/35 bg-red-500/10 px-2 py-1 text-xs text-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/75 p-4">
                    <h2 className="text-lg font-semibold text-slate-100">
                      {editingTaskId ? 'Update Task' : 'Assign Task'}
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                      {editingTaskId
                        ? 'You are editing an existing task. Save to update.'
                        : 'Create and assign a new task to an employee.'}
                    </p>
                    <form onSubmit={handleTaskSubmit} className="mt-3 grid gap-2">
                      <select
                        className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm"
                        value={taskForm.employeeId}
                        onChange={(e) => setTaskForm((p) => ({ ...p, employeeId: e.target.value }))}
                        required
                      >
                        <option value="">Select employee</option>
                        {employees.map((item) => (
                          <option key={item.userId || item.id} value={item.userId || item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      <input
                        className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm"
                        placeholder="Task title"
                        value={taskForm.title}
                        onChange={(e) => setTaskForm((p) => ({ ...p, title: e.target.value }))}
                        required
                      />
                      <textarea
                        rows={2}
                        className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm"
                        placeholder="Planned task"
                        value={taskForm.plannedTask}
                        onChange={(e) => setTaskForm((p) => ({ ...p, plannedTask: e.target.value }))}
                      />
                      <input
                        type="date"
                        className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm"
                        value={taskForm.workDate}
                        onChange={(e) => setTaskForm((p) => ({ ...p, workDate: e.target.value }))}
                      />
                      <div className="grid gap-2 sm:grid-cols-2">
                        <textarea
                          rows={2}
                          className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm"
                          placeholder="Admin note"
                          value={taskForm.adminNote}
                          onChange={(e) => setTaskForm((p) => ({ ...p, adminNote: e.target.value }))}
                        />
                        <select
                          className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm"
                          value={taskForm.status}
                          onChange={(e) => setTaskForm((p) => ({ ...p, status: e.target.value }))}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        className="rounded-xl border border-indigo-400/35 bg-indigo-500/15 px-3 py-2 text-sm text-indigo-200"
                      >
                        {editingTaskId ? 'Update Task' : 'Assign Task'}
                      </button>
                    </form>
                    {editingTaskId && (
                      <button
                        type="button"
                        onClick={resetTaskForm}
                        className="mt-2 rounded-xl border border-white/20 px-3 py-1.5 text-xs text-slate-200"
                      >
                        Cancel Task Edit
                      </button>
                    )}
                  </div>
                </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/75 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold text-slate-100">Employee Profile + Monthly Stats</h2>
                  <div className="flex items-center gap-2">
                    <input
                      type="month"
                      value={reportMonth}
                      onChange={(e) => setReportMonth(e.target.value)}
                      className="rounded-xl border border-white/15 bg-slate-900 px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="rounded-lg border border-indigo-400/35 bg-indigo-500/10 px-2 py-1 text-xs text-indigo-200"
                    >
                      Download XLS
                    </button>
                  </div>
                </div>

                {selectedEmployee ? (
                  <div className="mt-3 grid gap-3 md:grid-cols-5">
                    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
                      <p className="text-xs text-slate-400">Total Tasks</p>
                      <p className="text-xl font-semibold text-slate-100">{monthStats.totalTasks}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
                      <p className="text-xs text-slate-400">Completed / In Progress / Pending</p>
                      <p className="text-xl font-semibold text-slate-100">
                        {monthStats.completed} / {monthStats.inProgress} / {monthStats.pending}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
                      <p className="text-xs text-slate-400">Days Worked / Total Hours</p>
                      <p className="text-xl font-semibold text-slate-100">
                        {monthStats.daysWorked} / {monthStats.totalHours}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
                      <p className="text-xs text-slate-400">Completion Rate</p>
                      <p className="text-xl font-semibold text-slate-100">{completionRate}%</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
                      <p className="text-xs text-slate-400">Avg Hours / Day</p>
                      <p className="text-xl font-semibold text-slate-100">{averageHoursPerDay}</p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-400">Select an employee from the left list.</p>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/75 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold text-slate-100">Task Timeline</h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTimelineScope('selected')}
                      className={`rounded-lg border px-2 py-1.5 text-xs ${
                        timelineScope === 'selected'
                          ? 'border-indigo-300/40 bg-indigo-500/15 text-indigo-200'
                          : 'border-white/15 bg-slate-900 text-slate-300'
                      }`}
                    >
                      Selected Employee
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimelineScope('all')}
                      className={`rounded-lg border px-2 py-1.5 text-xs ${
                        timelineScope === 'all'
                          ? 'border-indigo-300/40 bg-indigo-500/15 text-indigo-200'
                          : 'border-white/15 bg-slate-900 text-slate-300'
                      }`}
                    >
                      View All Task Data
                    </button>
                    <input
                      value={taskSearch}
                      onChange={(e) => setTaskSearch(e.target.value)}
                      placeholder="Search timeline..."
                      className="rounded-lg border border-white/15 bg-slate-900 px-3 py-1.5 text-xs text-slate-100"
                    />
                    <select
                      value={taskStatusFilter}
                      onChange={(e) => setTaskStatusFilter(e.target.value)}
                      className="rounded-lg border border-white/15 bg-slate-900 px-2 py-1.5 text-xs text-slate-100"
                    >
                      <option value="all">All</option>
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="approval_requested">Approval Needed</option>
                    </select>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  {timelineScope === 'all'
                    ? `Showing all tasks (${visibleTimelineTasks.length}).`
                    : `Showing selected employee tasks for ${reportMonth || 'selected month'} (${visibleTimelineTasks.length}).`}
                </p>
                <div className="mt-3 space-y-2">
                  {visibleTimelineTasks.map((task) => (
                    <div key={task.id} className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
                      <p className="font-medium text-slate-100">{task.title}</p>
                      <p className="text-xs text-slate-400">
                        {(task.employeeName || selectedEmployee?.name || 'Employee')} - {formatStatusLabel(task.status)}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Date:{' '}
                        {task.workDate ? new Date(task.workDate).toLocaleDateString() : 'N/A'} | Job Time:{' '}
                        Start: {formatTimeValue(task.jobStartAt)} | End: {formatTimeValue(task.jobEndAt)}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">Plan: {task.plannedTask || 'N/A'}</p>
                      <p className="text-xs text-slate-400">Admin Note: {task.adminNote || 'N/A'}</p>
                      <p className="text-xs text-slate-400">
                        Approval: {task.approvalRequested ? 'Pending Admin Approval' : 'Not Pending'}
                      </p>
                      <p className="text-xs text-slate-400">Update: {task.workUpdate || 'No employee update yet.'}</p>
                      <p className="text-xs text-slate-400">
                        Proof:{' '}
                        {task.proofLink ? (
                          <a
                            href={task.proofLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-300 hover:underline"
                          >
                            Open Proof
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </p>
                      <div className="mt-2 flex gap-2">
                        {task.approvalRequested && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleTaskApproval(task, true)}
                              className="rounded-lg border border-emerald-400/35 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-200"
                            >
                              Approve Complete
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTaskApproval(task, false)}
                              className="rounded-lg border border-amber-400/35 bg-amber-500/10 px-2 py-1 text-xs text-amber-200"
                            >
                              Keep Incomplete
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => setViewTask(task)}
                          className="rounded-lg border border-violet-400/35 bg-violet-500/10 px-2 py-1 text-xs text-violet-200"
                        >
                          View Employee Data
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTaskEdit(task)}
                          className="rounded-lg border border-blue-400/35 bg-blue-500/10 px-2 py-1 text-xs text-blue-200"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTaskDelete(task)}
                          className="rounded-lg border border-red-400/35 bg-red-500/10 px-2 py-1 text-xs text-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {visibleTimelineTasks.length === 0 && (
                    <p className="text-sm text-slate-400">No tasks match current filters.</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-950/10 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-emerald-200">Completed Tasks</h2>
                  <span className="rounded-full border border-emerald-400/35 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-200">
                    {completedTimelineTasks.length}
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  {completedTimelineTasks.map((task) => (
                    <div key={task.id} className="rounded-xl border border-emerald-400/20 bg-slate-900/60 p-3">
                      <p className="font-medium text-slate-100">{task.title}</p>
                      <p className="text-xs text-slate-400">
                        Completed:{' '}
                        {task.completedAt ? new Date(task.completedAt).toLocaleString() : 'Completed'}
                      </p>
                    </div>
                  ))}
                  {completedTimelineTasks.length === 0 && (
                    <p className="text-sm text-slate-400">No completed tasks for selected employee/month.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          </div>
        )}
      </section>
      {viewTask && (
        <div className="fixed inset-0 z-80 flex items-center justify-center bg-slate-950/70 px-3">
          <div className="w-full max-w-2xl rounded-2xl border border-white/15 bg-slate-900 p-4 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Employee Task Data</h3>
                <p className="text-xs text-slate-400">
                  {viewTask.employeeName || selectedEmployee?.name || 'Employee'} | {formatStatusLabel(viewTask.status)}
                </p>
              </div>
              <button
                type="button"
                onClick={closeTaskViewer}
                className="rounded-lg border border-white/20 px-2 py-1 text-xs text-slate-200"
              >
                Close
              </button>
            </div>
            <div className="mt-3 grid gap-2 rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm">
              <p className="text-slate-100">
                <span className="text-slate-400">Title: </span>
                {viewTask.title || 'N/A'}
              </p>
              <p className="text-slate-100">
                <span className="text-slate-400">Date: </span>
                {viewTask.workDate ? new Date(viewTask.workDate).toLocaleDateString() : 'N/A'}
              </p>
              <p className="text-slate-100">
                <span className="text-slate-400">Job Time: </span>
                Start: {formatTimeValue(viewTask.jobStartAt)} | End: {formatTimeValue(viewTask.jobEndAt)}
              </p>
              <p className="text-slate-100">
                <span className="text-slate-400">Approval: </span>
                {viewTask.approvalRequested ? 'Pending Admin Approval' : 'Not Pending'}
              </p>
              <p className="text-slate-100">
                <span className="text-slate-400">Planned Task: </span>
                {viewTask.plannedTask || 'N/A'}
              </p>
              <p className="text-slate-100">
                <span className="text-slate-400">Admin Note: </span>
                {viewTask.adminNote || 'N/A'}
              </p>
              <p className="text-slate-100">
                <span className="text-slate-400">Employee Update: </span>
                {viewTask.workUpdate || 'No update provided yet.'}
              </p>
              <p className="text-slate-100">
                <span className="text-slate-400">Proof: </span>
                {viewTask.proofLink ? (
                  <a
                    href={viewTask.proofLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-300 hover:underline"
                  >
                    Open Proof File
                  </a>
                ) : (
                  'N/A'
                )}
              </p>
            </div>
            {viewTask.approvalRequested && (
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleTaskApproval(viewTask, true);
                    closeTaskViewer();
                  }}
                  className="rounded-lg border border-emerald-400/35 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-200"
                >
                  Approve Complete
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleTaskApproval(viewTask, false);
                    closeTaskViewer();
                  }}
                  className="rounded-lg border border-amber-400/35 bg-amber-500/10 px-2 py-1 text-xs text-amber-200"
                >
                  Keep Incomplete
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </HomeLayout>
  );
};

export default AdminEmployeeWorkspacePage;
