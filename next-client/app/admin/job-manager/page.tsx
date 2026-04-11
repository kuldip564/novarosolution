'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import ProtectedPage from '@/components/auth/ProtectedPage';
import { PublicJob, fetchAdminJobs, createAdminJob, updateAdminJob, deleteAdminJob } from '@/lib/clientApi';
import { useAuth } from '@/context/AuthContext';
import { formatEmployment, formatWorkMode } from '@/components/careers/jobLabels';
import ApplicationsPanel from './ApplicationsPanel';

export default function AdminJobManagerPage() {
  const { token } = useAuth();
  const [tab, setTab] = useState<'jobs' | 'applications'>('jobs');
  const [jobs, setJobs] = useState<PublicJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    category: 'Engineering',
    location: '',
    workMode: 'remote' as PublicJob['workMode'],
    employmentType: 'full_time' as PublicJob['employmentType'],
    salaryHint: '',
    isPublished: true
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadJobs() {
    if (!token) return;
    const rows = await fetchAdminJobs(token);
    setJobs(rows);
  }

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError('');
    loadJobs()
      .catch((err: any) => setError(err?.message || 'Unable to load.'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function resetJobForm() {
    setEditingId(null);
    setJobForm({
      title: '',
      description: '',
      category: 'Engineering',
      location: '',
      workMode: 'remote',
      employmentType: 'full_time',
      salaryHint: '',
      isPublished: true
    });
  }

  function startEdit(job: PublicJob) {
    setEditingId(job.id);
    setJobForm({
      title: job.title,
      description: job.description,
      category: job.category,
      location: job.location || '',
      workMode: job.workMode,
      employmentType: job.employmentType,
      salaryHint: job.salaryHint || '',
      isPublished: job.isPublished !== false
    });
  }

  async function onSaveJob(event: FormEvent) {
    event.preventDefault();
    if (!token) return;
    setSaving(true);
    setError('');
    setNotice('');
    try {
      if (editingId) {
        await updateAdminJob(editingId, { ...jobForm }, token);
        setNotice('Job updated.');
      } else {
        await createAdminJob({ ...jobForm }, token);
        setNotice('Job created.');
      }
      resetJobForm();
      await loadJobs();
    } catch (err: any) {
      setError(err?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  async function onDeleteJob(id: string) {
    if (!token) return;
    if (!window.confirm('Delete this job and its applications?')) return;
    setSaving(true);
    setError('');
    try {
      await deleteAdminJob(id, token);
      setNotice('Job deleted.');
      if (editingId === id) resetJobForm();
      await loadJobs();
    } catch (err: any) {
      setError(err?.message || 'Delete failed.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedPage requireAdmin>
      <section className="card space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold md:text-5xl">Job manager</h1>
            <p className="text-slate-400">Publish roles, manage categories, and review applicants.</p>
          </div>
          <Link className="admin-btn inline-block" href="/admin/dashboard">
            Dashboard
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === 'jobs' ? 'bg-white text-slate-900' : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
            onClick={() => setTab('jobs')}
          >
            Jobs
          </button>
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === 'applications' ? 'bg-white text-slate-900' : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
            onClick={() => setTab('applications')}
          >
            Applications
          </button>
        </div>

        {loading ? <p className="text-slate-400">Loading…</p> : null}
        {error ? <p className="text-red-400">{error}</p> : null}
        {notice ? <p className="text-emerald-400">{notice}</p> : null}

        {tab === 'jobs' ? (
          <div className="grid gap-8 lg:grid-cols-2">
            <form onSubmit={onSaveJob} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-xl font-bold">{editingId ? 'Edit job' : 'New job'}</h2>
              <label className="flex flex-col gap-1 text-sm">
                <span>Title</span>
                <input
                  required
                  className="rounded-lg border border-white/15 bg-black/20 px-3 py-2"
                  value={jobForm.title}
                  onChange={(e) => setJobForm((f) => ({ ...f, title: e.target.value }))}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span>Category</span>
                <input
                  required
                  className="rounded-lg border border-white/15 bg-black/20 px-3 py-2"
                  value={jobForm.category}
                  onChange={(e) => setJobForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="Engineering, Design, Marketing…"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span>Description</span>
                <textarea
                  required
                  minLength={20}
                  rows={6}
                  className="rounded-lg border border-white/15 bg-black/20 px-3 py-2"
                  value={jobForm.description}
                  onChange={(e) => setJobForm((f) => ({ ...f, description: e.target.value }))}
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm">
                  <span>Location</span>
                  <input
                    className="rounded-lg border border-white/15 bg-black/20 px-3 py-2"
                    value={jobForm.location}
                    onChange={(e) => setJobForm((f) => ({ ...f, location: e.target.value }))}
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span>Salary hint</span>
                  <input
                    className="rounded-lg border border-white/15 bg-black/20 px-3 py-2"
                    value={jobForm.salaryHint}
                    onChange={(e) => setJobForm((f) => ({ ...f, salaryHint: e.target.value }))}
                    placeholder="e.g. $80k–$100k"
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm">
                  <span>Work mode</span>
                  <select
                    className="rounded-lg border border-white/15 bg-black/20 px-3 py-2"
                    value={jobForm.workMode}
                    onChange={(e) => setJobForm((f) => ({ ...f, workMode: e.target.value as PublicJob['workMode'] }))}
                  >
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">On-site</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span>Employment</span>
                  <select
                    className="rounded-lg border border-white/15 bg-black/20 px-3 py-2"
                    value={jobForm.employmentType}
                    onChange={(e) =>
                      setJobForm((f) => ({ ...f, employmentType: e.target.value as PublicJob['employmentType'] }))
                    }
                  >
                    <option value="full_time">Full-time</option>
                    <option value="part_time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </label>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={jobForm.isPublished}
                  onChange={(e) => setJobForm((f) => ({ ...f, isPublished: e.target.checked }))}
                />
                Published (visible on careers page)
              </label>
              <div className="flex flex-wrap gap-2">
                <button type="submit" className="admin-btn" disabled={saving}>
                  {saving ? 'Saving…' : editingId ? 'Update job' : 'Create job'}
                </button>
                {editingId ? (
                  <button type="button" className="btn-secondary" onClick={resetJobForm}>
                    Cancel edit
                  </button>
                ) : null}
              </div>
            </form>

            <div className="space-y-3">
              <h2 className="text-xl font-bold">All jobs ({jobs.length})</h2>
              <ul className="space-y-3">
                {jobs.map((job) => (
                  <li
                    key={job.id}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold"> {job.title}</p>
                        <p className="text-xs text-slate-400">
                          {job.category} · {formatEmployment(job.employmentType)} · {formatWorkMode(job.workMode)}
                          {job.isPublished === false ? (
                            <span className="ml-2 rounded bg-amber-500/20 px-2 py-0.5 text-amber-200">Draft</span>
                          ) : null}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" className="text-xs text-cyan-300 hover:underline" onClick={() => startEdit(job)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-xs text-red-400 hover:underline"
                          onClick={() => onDeleteJob(job.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : token ? (
          <ApplicationsPanel
            token={token}
            jobs={jobs}
            saving={saving}
            setSaving={setSaving}
            setError={setError}
            setNotice={setNotice}
          />
        ) : null}
      </section>
    </ProtectedPage>
  );
}
