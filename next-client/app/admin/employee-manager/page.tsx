'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import ProtectedPage from '@/components/auth/ProtectedPage';
import { useAuth } from '@/context/AuthContext';
import {
  createAdminEmployee,
  createAdminEmployeeTask,
  deleteAdminEmployee,
  deleteAdminEmployeeTask,
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

export default function AdminEmployeeManagerPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [employees, setEmployees] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [employeeForm, setEmployeeForm] = useState<any>(emptyEmployee);
  const [editingEmployeeId, setEditingEmployeeId] = useState('');
  const [taskForm, setTaskForm] = useState<any>(emptyTask);
  const [editingTaskId, setEditingTaskId] = useState('');

  async function loadData() {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const [employeeRows, taskRows] = await Promise.all([fetchAdminEmployees(token), fetchAdminEmployeeTasks(token)]);
      setEmployees(employeeRows || []);
      setTasks(taskRows || []);
    } catch (err: any) {
      setError(err?.message || 'Unable to load employee workspace.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const selectedEmployeeTasks = useMemo(() => {
    if (!selectedEmployeeId) return [];
    return tasks.filter((item) => item.employeeId === selectedEmployeeId);
  }, [tasks, selectedEmployeeId]);

  async function onEmployeeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setStatus('');
    setError('');
    try {
      if (editingEmployeeId) {
        await updateAdminEmployee(editingEmployeeId, employeeForm, token);
        setStatus('Employee updated.');
      } else {
        await createAdminEmployee(employeeForm, token);
        setStatus('Employee added.');
      }
      setEmployeeForm(emptyEmployee);
      setEditingEmployeeId('');
      await loadData();
    } catch (err: any) {
      setError(err?.message || 'Unable to save employee.');
    }
  }

  async function onTaskSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setStatus('');
    setError('');
    try {
      if (editingTaskId) {
        await updateAdminEmployeeTask(editingTaskId, taskForm, token);
        setStatus('Task updated.');
      } else {
        await createAdminEmployeeTask(taskForm, token);
        setStatus('Task assigned.');
      }
      setTaskForm({ ...emptyTask, employeeId: selectedEmployeeId || '' });
      setEditingTaskId('');
      await loadData();
    } catch (err: any) {
      setError(err?.message || 'Unable to save task.');
    }
  }

  async function onDeleteEmployee(employee: any) {
    if (!token) return;
    if (!window.confirm(`Delete employee ${employee.name}?`)) return;
    try {
      await deleteAdminEmployee(employee.id, token);
      setStatus('Employee deleted.');
      await loadData();
    } catch (err: any) {
      setError(err?.message || 'Unable to delete employee.');
    }
  }

  async function onDeleteTask(task: any) {
    if (!token) return;
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    try {
      await deleteAdminEmployeeTask(task.id, token);
      setStatus('Task deleted.');
      await loadData();
    } catch (err: any) {
      setError(err?.message || 'Unable to delete task.');
    }
  }

  async function onApproveTask(task: any, approve: boolean) {
    if (!token) return;
    try {
      await updateAdminEmployeeTask(task.id, { approveTask: approve }, token);
      setStatus(approve ? 'Task approved and completed.' : 'Task marked incomplete.');
      await loadData();
    } catch (err: any) {
      setError(err?.message || 'Unable to update approval.');
    }
  }

  return (
    <ProtectedPage requireAdmin>
      <main className="app-page-shell">
      <section className="admin-shell">
        <article className="page-hero-shell space-y-2">
        <h1 className="section-title text-3xl font-extrabold md:text-5xl">Admin Employee Manager</h1>
        {loading ? <p className="text-slate-300">Loading employee data...</p> : null}
        </article>
        <div className="grid gap-4 lg:grid-cols-2">
          <form className="page-content-card space-y-2" onSubmit={onEmployeeSubmit}>
            <h2 className="text-xl font-semibold">{editingEmployeeId ? 'Edit Employee' : 'Add Employee'}</h2>
            <input value={employeeForm.name} onChange={(e) => setEmployeeForm((p: any) => ({ ...p, name: e.target.value }))} placeholder="Name" required />
            <input type="email" value={employeeForm.email} onChange={(e) => setEmployeeForm((p: any) => ({ ...p, email: e.target.value }))} placeholder="Email" required />
            <input type="password" value={employeeForm.password} onChange={(e) => setEmployeeForm((p: any) => ({ ...p, password: e.target.value }))} placeholder={editingEmployeeId ? 'Password (optional)' : 'Password'} />
            <input value={employeeForm.department} onChange={(e) => setEmployeeForm((p: any) => ({ ...p, department: e.target.value }))} placeholder="Department" />
            <input value={employeeForm.phone} onChange={(e) => setEmployeeForm((p: any) => ({ ...p, phone: e.target.value }))} placeholder="Phone" />
            <textarea rows={2} value={employeeForm.notes} onChange={(e) => setEmployeeForm((p: any) => ({ ...p, notes: e.target.value }))} placeholder="Notes" />
            <button className="admin-btn" type="submit">{editingEmployeeId ? 'Update Employee' : 'Add Employee'}</button>
          </form>

          <form className="page-content-card space-y-2" onSubmit={onTaskSubmit}>
            <h2 className="text-xl font-semibold">{editingTaskId ? 'Update Task' : 'Assign Task'}</h2>
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

        <div className="page-content-card space-y-2">
          <h2 className="text-xl font-semibold">Employees</h2>
          <div className="space-y-2">
            {employees.map((employee) => (
              <article key={employee.id} className="admin-list-card">
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

        <div className="page-content-card space-y-2">
          <h2 className="text-xl font-semibold">Tasks {selectedEmployeeId ? `(Employee: ${selectedEmployeeId})` : ''}</h2>
          {selectedEmployeeId ? (
            <div className="space-y-2">
              {selectedEmployeeTasks.map((task) => (
                <article key={task.id} className="admin-list-card">
                  <p className="font-semibold">{task.title}</p>
                  <p className="text-sm text-slate-300">Status: {task.status}</p>
                  <p className="text-xs text-slate-400">{task.workDate ? new Date(task.workDate).toLocaleDateString() : 'No date'}</p>
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
                    {task.approvalRequested ? (
                      <>
                        <button className="admin-btn" type="button" onClick={() => onApproveTask(task, true)}>Approve Complete</button>
                        <button className="admin-btn" type="button" onClick={() => onApproveTask(task, false)}>Keep Incomplete</button>
                      </>
                    ) : null}
                  </div>
                </article>
              ))}
              {selectedEmployeeTasks.length === 0 ? <p className="text-slate-400">No tasks found for selected employee.</p> : null}
            </div>
          ) : (
            <p className="text-slate-400">Select employee from list by clicking Edit.</p>
          )}
        </div>

        {status ? <p className="text-emerald-400">{status}</p> : null}
        {error ? <p className="text-red-400">{error}</p> : null}
        <Link className="admin-btn inline-block" href="/admin/dashboard">
          Back to dashboard
        </Link>
      </section>
      </main>
    </ProtectedPage>
  );
}
