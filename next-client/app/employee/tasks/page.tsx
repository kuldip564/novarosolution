'use client';

import Link from 'next/link';
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import ProtectedPage from '@/components/auth/ProtectedPage';
import {
  createMyDailyTask,
  deleteMyDailyTask,
  downloadMyMonthlyTaskReport,
  fetchMyDailyTasks,
  updateMyDailyTask
} from '@/lib/clientApi';
import { useAuth } from '@/context/AuthContext';

type TaskForm = {
  title: string;
  plannedTask: string;
  workDate: string;
  workUpdate: string;
  proofLink: string;
  status: 'pending' | 'in_progress' | 'completed';
};

const initialForm: TaskForm = {
  title: '',
  plannedTask: '',
  workDate: new Date().toISOString().slice(0, 10),
  workUpdate: '',
  proofLink: '',
  status: 'pending'
};

const PROOF_FORMAT_OPTIONS: Record<string, string> = {
  all: '',
  images: '.png,.jpg,.jpeg,.webp,.gif,.bmp,.svg',
  pdf: '.pdf',
  docs: '.doc,.docx,.txt,.rtf,.odt,.xls,.xlsx,.csv,.ppt,.pptx',
  videos: '.mp4,.mov,.avi,.mkv,.webm',
  archives: '.zip,.rar,.7z'
};

function formatTimeValue(value?: string) {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Unable to read selected file.'));
    reader.readAsDataURL(file);
  });
}

export default function EmployeeTasksPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({
    type: '',
    message: ''
  });
  const [tasks, setTasks] = useState<any[]>([]);
  const [editingTaskId, setEditingTaskId] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reportMonth, setReportMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [form, setForm] = useState<TaskForm>({ ...initialForm });
  const [proofFileName, setProofFileName] = useState('');
  const [proofFormat, setProofFormat] = useState('all');

  async function loadTasks() {
    if (!token) return;
    setLoading(true);
    try {
      const rows = await fetchMyDailyTasks(token);
      setTasks(rows || []);
    } catch (error: any) {
      setStatus({ type: 'error', message: error?.message || 'Unable to load tasks.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filteredTasks = useMemo(
    () =>
      tasks.filter((item) => {
        if (!selectedDay) return true;
        const d = item.workDate ? new Date(item.workDate) : null;
        if (!d || Number.isNaN(d.getTime())) return false;
        return d.toISOString().slice(0, 10) === selectedDay;
      }),
    [tasks, selectedDay]
  );

  const visibleTasks = useMemo(() => {
    if (statusFilter === 'all') return filteredTasks;
    return filteredTasks.filter((task) => task.status === statusFilter);
  }, [filteredTasks, statusFilter]);

  const completedCount = useMemo(
    () => filteredTasks.filter((task) => task.status === 'completed').length,
    [filteredTasks]
  );

  const returnedTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.approvalRejected && task.status !== 'completed')
        .sort(
          (a, b) =>
            new Date(b.updatedAt || b.workDate || 0).getTime() -
            new Date(a.updatedAt || a.workDate || 0).getTime()
        ),
    [tasks]
  );

  useEffect(() => {
    if (!returnedTasks.length) return;
    const firstReturnedDay = returnedTasks[0]?.workDate
      ? new Date(returnedTasks[0].workDate).toISOString().slice(0, 10)
      : '';
    if (statusFilter !== 'pending') setStatusFilter('pending');
    if (firstReturnedDay && selectedDay !== firstReturnedDay) setSelectedDay(firstReturnedDay);
  }, [returnedTasks, statusFilter, selectedDay]);

  function resetForm() {
    setEditingTaskId('');
    setProofFileName('');
    setForm({
      ...initialForm,
      workDate: selectedDay || new Date().toISOString().slice(0, 10)
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setStatus({ type: '', message: '' });
    if (!form.workDate) {
      setStatus({ type: 'error', message: 'Work date is required.' });
      return;
    }

    const payload = {
      title: form.title,
      plannedTask: form.plannedTask,
      workDate: new Date(`${form.workDate}T00:00:00`).toISOString(),
      workUpdate: form.workUpdate,
      proofLink: form.proofLink,
      status: form.status
    };

    setSaving(true);
    try {
      if (editingTaskId) {
        await updateMyDailyTask(editingTaskId, payload, token);
        setStatus({ type: 'success', message: 'Task updated.' });
      } else {
        await createMyDailyTask(payload, token);
        setStatus({ type: 'success', message: 'Task created.' });
      }
      await loadTasks();
      resetForm();
    } catch (error: any) {
      setStatus({ type: 'error', message: error?.message || 'Unable to save task.' });
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(task: any) {
    const workDate = task.workDate ? new Date(task.workDate).toISOString().slice(0, 10) : '';
    setEditingTaskId(task.id);
    setForm({
      title: task.title || '',
      plannedTask: task.plannedTask || '',
      workDate,
      workUpdate: task.workUpdate || '',
      proofLink: task.proofLink || '',
      status: (task.status as TaskForm['status']) || 'pending'
    });
    setProofFileName(task.proofLink ? 'Existing proof attached' : '');
  }

  function handleOpenReturnedTask(task: any) {
    const taskDay = task.workDate ? new Date(task.workDate).toISOString().slice(0, 10) : '';
    if (taskDay) setSelectedDay(taskDay);
    setStatusFilter('pending');
    handleEdit(task);
  }

  async function handleProofFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setForm((prev) => ({ ...prev, proofLink: dataUrl }));
      setProofFileName(file.name);
      setStatus({ type: 'success', message: 'Proof file attached.' });
    } catch (error: any) {
      setStatus({ type: 'error', message: error?.message || 'Unable to attach proof file.' });
    } finally {
      event.target.value = '';
    }
  }

  async function handleDelete(task: any) {
    if (!token) return;
    const confirmed = window.confirm(`Delete task "${task.title}"?`);
    if (!confirmed) return;
    try {
      await deleteMyDailyTask(task.id, token);
      setStatus({ type: 'success', message: 'Task deleted.' });
      await loadTasks();
    } catch (error: any) {
      setStatus({ type: 'error', message: error?.message || 'Unable to delete task.' });
    }
  }

  async function handleDownload() {
    if (!token) return;
    const [yearText, monthText] = reportMonth.split('-');
    const year = Number(yearText);
    const month = Number(monthText);
    if (!year || !month) {
      setStatus({ type: 'error', message: 'Choose valid month first.' });
      return;
    }
    try {
      const { blob, filename } = await downloadMyMonthlyTaskReport(year, month, token);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setStatus({ type: 'success', message: 'Monthly XLS downloaded.' });
    } catch (error: any) {
      setStatus({ type: 'error', message: error?.message || 'Unable to download report.' });
    }
  }

  return (
    <ProtectedPage requireEmployee>
      <section className="admin-shell app-page-shell">
        <article className="page-hero-shell space-y-2">
          <h1 className="section-title text-3xl font-extrabold md:text-5xl">Daily Task Manager</h1>
          <p className="text-slate-300">Update work status, upload proof, and download monthly report.</p>
        </article>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <article className="page-content-card">
            <h2 className="text-xl font-semibold">{editingTaskId ? 'Update Daily Task' : 'Create Daily Task'}</h2>
            <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
              <input
                placeholder="Task title"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                required
              />
              <textarea
                rows={3}
                placeholder="Planned task"
                value={form.plannedTask}
                onChange={(e) => setForm((p) => ({ ...p, plannedTask: e.target.value }))}
              />
              <input
                type="date"
                value={form.workDate}
                onChange={(e) => setForm((p) => ({ ...p, workDate: e.target.value }))}
                required
              />
              <textarea
                rows={3}
                placeholder="Work update"
                value={form.workUpdate}
                onChange={(e) => setForm((p) => ({ ...p, workUpdate: e.target.value }))}
              />
              <input
                placeholder="Proof link (optional)"
                value={form.proofLink}
                onChange={(e) => {
                  setForm((p) => ({ ...p, proofLink: e.target.value }));
                  setProofFileName('');
                }}
              />
              <div className="admin-list-card">
                <label className="block text-xs text-slate-400">Attach proof file (all formats)</label>
                <div className="mt-1 grid gap-2 sm:grid-cols-2">
                  <select value={proofFormat} onChange={(e) => setProofFormat(e.target.value)}>
                    <option value="all">All Files</option>
                    <option value="images">Images</option>
                    <option value="pdf">PDF</option>
                    <option value="docs">Documents</option>
                    <option value="videos">Videos</option>
                    <option value="archives">Archives</option>
                  </select>
                  <input
                    type="file"
                    accept={PROOF_FORMAT_OPTIONS[proofFormat]}
                    onChange={handleProofFile}
                  />
                </div>
                {proofFileName ? (
                  <p className="mt-1 text-xs text-emerald-400">Attached: {proofFileName}</p>
                ) : null}
              </div>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((p) => ({ ...p, status: e.target.value as TaskForm['status'] }))
                }
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Request Completion (Admin Approval)</option>
              </select>
              <div className="admin-toolbar">
                <button type="submit" disabled={saving} className="btn">
                  {saving ? 'Saving...' : editingTaskId ? 'Update Task' : 'Add Task'}
                </button>
                {editingTaskId ? (
                  <button type="button" onClick={resetForm} className="btn">
                    New Task
                  </button>
                ) : null}
              </div>
            </form>
          </article>

          <article className="page-content-card">
            <h2 className="text-lg font-semibold">Task Filters + Reports</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input type="date" value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <button type="button" onClick={() => setSelectedDay(new Date().toISOString().slice(0, 10))} className="btn">
                Today
              </button>
              <button type="button" onClick={() => setSelectedDay('')} className="btn">
                All Days
              </button>
            </div>
            <p className="mt-2 text-xs text-emerald-400">Completed Tasks: {completedCount}</p>

            {returnedTasks.length ? (
              <div className="mt-3 admin-list-card">
                <p className="text-xs text-amber-300">Returned by Admin: {returnedTasks.length}</p>
                <p className="text-[11px] text-amber-300/90">Please update and submit again.</p>
                <div className="mt-2 space-y-1">
                  {returnedTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="admin-list-card">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-slate-200">{task.title}</p>
                        <button type="button" className="btn" onClick={() => handleOpenReturnedTask(task)}>
                          Open Task
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-3 admin-toolbar">
              <input type="month" value={reportMonth} onChange={(e) => setReportMonth(e.target.value)} />
              <button type="button" onClick={handleDownload} className="btn">
                Download XLS
              </button>
            </div>
          </article>
        </div>

        <article className="page-content-card space-y-3">
          <h2 className="text-lg font-semibold">Tasks</h2>
          {loading ? <p className="text-slate-300">Loading tasks...</p> : null}
          {!loading && visibleTasks.length === 0 ? (
            <p className="text-sm text-slate-400">No tasks for current filter. Try All Days and All status.</p>
          ) : null}
          <div className="space-y-3">
            {visibleTasks.map((task) => (
              <div key={task.id} className="admin-list-card">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{task.title}</p>
                  <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                    {task.status || 'pending'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">{task.plannedTask || 'No plan'}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Start: {formatTimeValue(task.jobStartAt)} | End: {formatTimeValue(task.jobEndAt)}
                </p>
                {task.approvalRejected ? (
                  <p className="mt-1 text-xs text-amber-300">
                    Admin did not approve this task yet. Please update and submit again.
                  </p>
                ) : null}
                {task.proofLink ? (
                  <a href={task.proofLink} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-indigo-300 hover:underline">
                    Open Proof
                  </a>
                ) : null}
                <div className="mt-2 admin-toolbar">
                  <button type="button" onClick={() => handleEdit(task)} className="btn">Edit</button>
                  <button type="button" onClick={() => handleDelete(task)} className="btn">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </article>

        {status.message ? (
          <p className={`text-sm ${status.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
            {status.message}
          </p>
        ) : null}

        <Link className="btn inline-block" href="/profile">
          Back to profile
        </Link>
      </section>
    </ProtectedPage>
  );
}
