import React, { useEffect, useMemo, useState } from 'react';
import HomeLayout from '../assets/componet/HomeLayout';
import LoadingState from '../components/LoadingState';
import {
  createMyDailyTask,
  deleteMyDailyTask,
  downloadMyMonthlyTaskReport,
  fetchMyDailyTasks,
  updateMyDailyTask,
} from '../config/api';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  title: '',
  plannedTask: '',
  workDate: new Date().toISOString().slice(0, 10),
  workUpdate: '',
  proofLink: '',
  status: 'pending',
};

const PROOF_FORMAT_OPTIONS = {
  all: '',
  images: '.png,.jpg,.jpeg,.webp,.gif,.bmp,.svg',
  pdf: '.pdf',
  docs: '.doc,.docx,.txt,.rtf,.odt,.xls,.xlsx,.csv,.ppt,.pptx',
  videos: '.mp4,.mov,.avi,.mkv,.webm',
  archives: '.zip,.rar,.7z',
};

const formatTimeValue = (value) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Unable to read selected file.'));
    reader.readAsDataURL(file);
  });

const EmployeeTasksPage = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reportMonth, setReportMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [form, setForm] = useState(initialForm);
  const [proofFileName, setProofFileName] = useState('');
  const [proofFormat, setProofFormat] = useState('all');

  const loadTasks = async () => {
    setLoading(true);
    try {
      const rows = await fetchMyDailyTasks(token);
      setTasks(rows || []);
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to load tasks.' });
    } finally {
      setLoading(false);
    }
  };

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
    [tasks, selectedDay],
  );

  const visibleTasks = useMemo(() => {
    if (statusFilter === 'all') return filteredTasks;
    return filteredTasks.filter((task) => task.status === statusFilter);
  }, [filteredTasks, statusFilter]);

  const completedCount = useMemo(
    () => filteredTasks.filter((task) => task.status === 'completed').length,
    [filteredTasks],
  );

  const returnedTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.approvalRejected && task.status !== 'completed')
        .sort((a, b) => new Date(b.updatedAt || b.workDate || 0).getTime() - new Date(a.updatedAt || a.workDate || 0).getTime()),
    [tasks],
  );

  useEffect(() => {
    if (!returnedTasks.length) return;
    const firstReturnedDay = returnedTasks[0]?.workDate
      ? new Date(returnedTasks[0].workDate).toISOString().slice(0, 10)
      : '';
    if (statusFilter !== 'pending') setStatusFilter('pending');
    if (firstReturnedDay && selectedDay !== firstReturnedDay) setSelectedDay(firstReturnedDay);
  }, [returnedTasks, statusFilter, selectedDay]);

  const resetForm = () => {
    setEditingTaskId('');
    setProofFileName('');
    setForm({
      ...initialForm,
      workDate: selectedDay || new Date().toISOString().slice(0, 10),
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      status: form.status,
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
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to save task.' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (task) => {
    const workDate = task.workDate ? new Date(task.workDate).toISOString().slice(0, 10) : '';
    setEditingTaskId(task.id);
    setForm({
      title: task.title || '',
      plannedTask: task.plannedTask || '',
      workDate,
      workUpdate: task.workUpdate || '',
      proofLink: task.proofLink || '',
      status: task.status || 'pending',
    });
    setProofFileName(task.proofLink ? 'Existing proof attached' : '');
  };

  const handleOpenReturnedTask = (task) => {
    const taskDay = task.workDate ? new Date(task.workDate).toISOString().slice(0, 10) : '';
    if (taskDay) setSelectedDay(taskDay);
    setStatusFilter('pending');
    handleEdit(task);
  };

  const handleProofFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setForm((prev) => ({ ...prev, proofLink: dataUrl }));
      setProofFileName(file.name);
      setStatus({ type: 'success', message: 'Proof file attached.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to attach proof file.' });
    }
  };

  const handleDelete = async (task) => {
    const confirmed = window.confirm(`Delete task "${task.title}"?`);
    if (!confirmed) return;
    try {
      await deleteMyDailyTask(task.id, token);
      setStatus({ type: 'success', message: 'Task deleted.' });
      await loadTasks();
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to delete task.' });
    }
  };

  const handleDownload = async () => {
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
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to download report.' });
    }
  };

  return (
    <HomeLayout>
      <section className="mx-auto w-[96vw] max-w-[1260px] px-2 pb-14 pt-8 md:px-0">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm dark:border-white/10 dark:bg-slate-950/75 dark:text-slate-100">
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              {editingTaskId ? 'Update Daily Task' : 'Create Daily Task'}
            </h1>
            <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
              <input className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400" placeholder="Task title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
              <textarea className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400" rows={3} placeholder="Planned task" value={form.plannedTask} onChange={(e) => setForm((p) => ({ ...p, plannedTask: e.target.value }))} />
              <input type="date" className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100" value={form.workDate} onChange={(e) => setForm((p) => ({ ...p, workDate: e.target.value }))} required />
              <textarea className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400" rows={3} placeholder="Work update" value={form.workUpdate} onChange={(e) => setForm((p) => ({ ...p, workUpdate: e.target.value }))} />
              <input className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400" placeholder="Proof link (optional)" value={form.proofLink} onChange={(e) => { setForm((p) => ({ ...p, proofLink: e.target.value })); setProofFileName(''); }} />
              <div className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 dark:border-white/15 dark:bg-slate-900/70">
                <label className="block text-xs text-slate-700 dark:text-slate-300">Attach proof file (all formats)</label>
                <div className="mt-1 grid gap-2 sm:grid-cols-2">
                  <select
                    value={proofFormat}
                    onChange={(e) => setProofFormat(e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 dark:border-white/15 dark:bg-slate-950 dark:text-slate-200"
                  >
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
                    className="block w-full text-xs text-slate-700 dark:text-slate-300 file:mr-3 file:rounded-lg file:border file:border-slate-300 dark:file:border-white/20 file:bg-slate-100 dark:file:bg-white/10 file:px-2 file:py-1 file:text-xs"
                  />
                </div>
                {proofFileName && <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-300">Attached: {proofFileName}</p>}
              </div>
              <select className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Request Completion (Admin Approval)</option>
              </select>
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="rounded-xl border border-pink-500/45 bg-pink-500/10 px-4 py-2 text-sm font-medium text-pink-700 disabled:opacity-60 dark:border-pink-400/35 dark:bg-pink-500/15 dark:text-pink-200">
                  {saving ? 'Saving...' : editingTaskId ? 'Update Task' : 'Add Task'}
                </button>
                {editingTaskId && (
                  <button type="button" onClick={resetForm} className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 dark:border-white/20 dark:text-slate-200">
                    New Task
                  </button>
                )}
              </div>
            </form>
            {status.message && (
              <p className={`mt-3 text-sm ${status.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                {status.message}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-950/75">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Daily Task Manager</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-4">
              <input type="date" className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100" value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} />
              <button type="button" onClick={() => setSelectedDay(new Date().toISOString().slice(0, 10))} className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 dark:border-white/20 dark:text-slate-200">Today</button>
              <button type="button" onClick={() => setSelectedDay('')} className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 dark:border-white/20 dark:text-slate-200">All Days</button>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-300">Completed Tasks: {completedCount}</p>
            {returnedTasks.length > 0 && (
              <div className="mt-2 rounded-xl border border-amber-400/35 bg-amber-100 p-2 dark:border-amber-400/25 dark:bg-amber-950/20">
                <p className="text-xs text-amber-800 dark:text-amber-200">Returned by Admin: {returnedTasks.length}</p>
                <p className="text-[11px] text-amber-700 dark:text-amber-300/90">Please update and request approval again.</p>
                <div className="mt-2 space-y-1">
                  {returnedTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between gap-2 rounded-lg border border-amber-300/50 bg-white px-2 py-1 dark:border-amber-400/20 dark:bg-slate-900/40">
                      <p className="text-xs text-slate-800 dark:text-slate-200">{task.title}</p>
                      <button
                        type="button"
                        onClick={() => handleOpenReturnedTask(task)}
                        className="rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-800 dark:text-amber-200"
                      >
                        Open Task
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-3 flex gap-2">
              <input type="month" value={reportMonth} onChange={(e) => setReportMonth(e.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100" />
              <button type="button" onClick={handleDownload} className="rounded-xl border border-indigo-400/35 bg-indigo-500/15 px-3 py-2 text-sm text-indigo-200">Download XLS</button>
            </div>
            <div className="mt-4 space-y-3">
              {loading ? (
                <LoadingState label="Loading tasks..." />
              ) : visibleTasks.length === 0 ? (
                <p className="text-sm text-slate-600 dark:text-slate-400">No tasks for current filter. Try All Days and All status.</p>
              ) : (
                visibleTasks.map((task) => (
                  <div key={task.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-slate-900/60">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-slate-900 dark:text-slate-100">{task.title}</p>
                      <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-700 dark:bg-white/10 dark:text-slate-200">
                        {task.status || 'pending'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{task.plannedTask || 'No plan'}</p>
                    <p className="mt-1 text-xs text-slate-700 dark:text-slate-500">
                      Start: {formatTimeValue(task.jobStartAt)} | End: {formatTimeValue(task.jobEndAt)}
                    </p>
                    {task.approvalRejected && (
                      <p className="mt-1 text-xs text-amber-300">
                        Admin did not approve this task yet. Please update and submit again.
                      </p>
                    )}
                    {task.proofLink && (
                      <a
                        href={task.proofLink}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block text-xs text-indigo-300 hover:underline"
                      >
                        Open Proof
                      </a>
                    )}
                    <div className="mt-2 flex gap-2">
                      <button type="button" onClick={() => handleEdit(task)} className="rounded-lg border border-blue-400/35 bg-blue-500/10 px-3 py-1 text-xs text-blue-200">Edit</button>
                      <button type="button" onClick={() => handleDelete(task)} className="rounded-lg border border-red-400/35 bg-red-500/10 px-3 py-1 text-xs text-red-200">Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </HomeLayout>
  );
};

export default EmployeeTasksPage;
