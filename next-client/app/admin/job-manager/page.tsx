'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import ProtectedPage from '@/components/auth/ProtectedPage';
import { PublicJob, fetchAdminJobs, createAdminJob, updateAdminJob, deleteAdminJob } from '@/lib/clientApi';
import { useAuth } from '@/context/AuthContext';
import { formatEmployment, formatExperienceLevel, formatWorkMode } from '@/components/careers/jobLabels';
import ApplicationsPanel from './ApplicationsPanel';

const CATEGORY_SUGGESTIONS = ['Engineering', 'Design', 'Product', 'Marketing', 'Operations', 'Sales'];
const DEPARTMENT_SUGGESTIONS = ['Engineering', 'Design', 'Product', 'People', 'G&A'];

function isoToDatetimeLocalValue(iso: string | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const defaultForm = () => ({
  title: '',
  summary: '',
  description: '',
  responsibilities: '',
  requirements: '',
  benefits: '',
  category: 'Engineering',
  department: '',
  location: '',
  workMode: 'remote' as PublicJob['workMode'],
  employmentType: 'full_time' as PublicJob['employmentType'],
  experienceLevel: 'any' as NonNullable<PublicJob['experienceLevel']>,
  salaryHint: '',
  featured: false,
  sortOrder: 0,
  applicationDeadlineLocal: '',
  isPublished: true
});

type JobFormState = ReturnType<typeof defaultForm>;

export default function AdminJobManagerPage() {
  const { token } = useAuth();
  const [tab, setTab] = useState<'jobs' | 'applications'>('jobs');
  const [jobs, setJobs] = useState<PublicJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [jobForm, setJobForm] = useState<JobFormState>(defaultForm);

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
    setJobForm(defaultForm());
  }

  function startEdit(job: PublicJob) {
    setEditingId(job.id);
    setJobForm({
      title: job.title,
      summary: job.summary || '',
      description: job.description,
      responsibilities: job.responsibilities || '',
      requirements: job.requirements || '',
      benefits: job.benefits || '',
      category: job.category,
      department: job.department || '',
      location: job.location || '',
      workMode: job.workMode,
      employmentType: job.employmentType,
      experienceLevel: job.experienceLevel || 'any',
      salaryHint: job.salaryHint || '',
      featured: job.featured === true,
      sortOrder: typeof job.sortOrder === 'number' ? job.sortOrder : 0,
      applicationDeadlineLocal: isoToDatetimeLocalValue(job.applicationDeadline),
      isPublished: job.isPublished !== false
    });
  }

  function payloadFromForm(): Record<string, unknown> {
    const deadline =
      jobForm.applicationDeadlineLocal.trim() !== ''
        ? new Date(jobForm.applicationDeadlineLocal).toISOString()
        : '';
    return {
      title: jobForm.title,
      summary: jobForm.summary,
      description: jobForm.description,
      responsibilities: jobForm.responsibilities,
      requirements: jobForm.requirements,
      benefits: jobForm.benefits,
      category: jobForm.category,
      department: jobForm.department,
      location: jobForm.location,
      workMode: jobForm.workMode,
      employmentType: jobForm.employmentType,
      experienceLevel: jobForm.experienceLevel,
      salaryHint: jobForm.salaryHint,
      featured: jobForm.featured,
      sortOrder: jobForm.sortOrder,
      applicationDeadline: deadline,
      isPublished: jobForm.isPublished
    };
  }

  async function onSaveJob(event: FormEvent) {
    event.preventDefault();
    if (!token) return;
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const body = payloadFromForm();
      if (editingId) {
        await updateAdminJob(editingId, body, token);
        setNotice('Job updated.');
      } else {
        await createAdminJob(body, token);
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
      <main className="app-page-shell">
        <section className="admin-shell">
          <article className="premium-page-hero space-y-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="premium-eyebrow">Hiring</p>
                <h1 className="section-title mt-2 text-3xl font-extrabold md:text-4xl">Job manager</h1>
                <p className="mt-2 max-w-xl text-sm text-slate-400">
                  Craft rich listings with summary, responsibilities, and benefits. Feature priority roles and set optional
                  deadlines.
                </p>
              </div>
              <Link className="admin-btn inline-flex shrink-0 self-start" href="/admin/dashboard">
                ← Dashboard
              </Link>
            </div>

            <div className="premium-tab-group" role="tablist" aria-label="Job manager sections">
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'jobs'}
                className={tab === 'jobs' ? 'premium-tab premium-tab--active' : 'premium-tab'}
                onClick={() => setTab('jobs')}
              >
                Jobs
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'applications'}
                className={tab === 'applications' ? 'premium-tab premium-tab--active' : 'premium-tab'}
                onClick={() => setTab('applications')}
              >
                Applications
              </button>
            </div>
          </article>

        <section className="mt-2 space-y-4">
          {loading ? <p className="text-slate-400">Loading…</p> : null}
          {error ? <p className="premium-alert premium-alert--error text-sm">{error}</p> : null}
          {notice ? <p className="premium-alert premium-alert--success text-sm">{notice}</p> : null}

          {tab === 'jobs' ? (
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]">
              <form onSubmit={onSaveJob} className="premium-form-panel space-y-8">
                <div className="premium-form-panel__head">
                  <h2 className="text-xl font-bold text-slate-100">{editingId ? 'Edit job' : 'New job posting'}</h2>
                  {editingId ? (
                    <button type="button" className="btn-secondary text-sm" onClick={resetJobForm}>
                      Cancel edit
                    </button>
                  ) : null}
                </div>

                <div className="space-y-4">
                  <p className="premium-form-section-label">Basics</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="premium-field-label">
                      Title *
                      <input
                        required
                        className="premium-field-input"
                        value={jobForm.title}
                        onChange={(e) => setJobForm((f) => ({ ...f, title: e.target.value }))}
                        placeholder="e.g. Senior Product Designer"
                      />
                    </label>
                    <label className="premium-field-label">
                      Department
                      <input
                        className="premium-field-input"
                        list="department-suggestions"
                        value={jobForm.department}
                        onChange={(e) => setJobForm((f) => ({ ...f, department: e.target.value }))}
                        placeholder="Team or org unit"
                      />
                      <datalist id="department-suggestions">
                        {DEPARTMENT_SUGGESTIONS.map((d) => (
                          <option key={d} value={d} />
                        ))}
                      </datalist>
                    </label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="premium-field-label">
                      Category *
                      <input
                        required
                        className="premium-field-input"
                        list="category-suggestions"
                        value={jobForm.category}
                        onChange={(e) => setJobForm((f) => ({ ...f, category: e.target.value }))}
                        placeholder="Shown on jobs filter"
                      />
                      <datalist id="category-suggestions">
                        {CATEGORY_SUGGESTIONS.map((c) => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                    </label>
                    <label className="premium-field-label">
                      Location
                      <input
                        className="premium-field-input"
                        value={jobForm.location}
                        onChange={(e) => setJobForm((f) => ({ ...f, location: e.target.value }))}
                        placeholder="City, country, or “Global”"
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="premium-form-section-label">Listing copy</p>
                  <label className="premium-field-label">
                    Short summary
                    <textarea
                      rows={3}
                      maxLength={500}
                      className="premium-field-input min-h-[72px] resize-y"
                      value={jobForm.summary}
                      onChange={(e) => setJobForm((f) => ({ ...f, summary: e.target.value }))}
                      placeholder="2–3 sentences for the jobs grid. If empty, the first lines of the description are used."
                    />
                    <span className="text-[10px] font-normal normal-case tracking-normal text-slate-600">
                      {jobForm.summary.length}/500
                    </span>
                  </label>
                  <label className="premium-field-label">
                    About the role *
                    <textarea
                      required
                      minLength={20}
                      rows={5}
                      className="premium-field-input min-h-[120px] resize-y"
                      value={jobForm.description}
                      onChange={(e) => setJobForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder="Overview: mission, team, and what success looks like."
                    />
                  </label>
                </div>

                <div className="space-y-4">
                  <p className="premium-form-section-label">Role details (optional)</p>
                  <label className="premium-field-label">
                    Responsibilities
                    <textarea
                      rows={5}
                      className="premium-field-input min-h-[100px] resize-y font-mono text-[13px] leading-relaxed"
                      value={jobForm.responsibilities}
                      onChange={(e) => setJobForm((f) => ({ ...f, responsibilities: e.target.value }))}
                      placeholder={'Bullet-style lines OK:\n• Own the roadmap for…\n• Partner with engineering…'}
                    />
                  </label>
                  <label className="premium-field-label">
                    Requirements
                    <textarea
                      rows={5}
                      className="premium-field-input min-h-[100px] resize-y font-mono text-[13px] leading-relaxed"
                      value={jobForm.requirements}
                      onChange={(e) => setJobForm((f) => ({ ...f, requirements: e.target.value }))}
                      placeholder={'Years of experience, tools, education…'}
                    />
                  </label>
                  <label className="premium-field-label">
                    Benefits & perks
                    <textarea
                      rows={4}
                      className="premium-field-input min-h-[88px] resize-y"
                      value={jobForm.benefits}
                      onChange={(e) => setJobForm((f) => ({ ...f, benefits: e.target.value }))}
                      placeholder="Health, PTO, learning budget, remote stipend…"
                    />
                  </label>
                </div>

                <div className="space-y-4">
                  <p className="premium-form-section-label">Compensation & arrangement</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="premium-field-label">
                      Salary / comp hint
                      <input
                        className="premium-field-input"
                        value={jobForm.salaryHint}
                        onChange={(e) => setJobForm((f) => ({ ...f, salaryHint: e.target.value }))}
                        placeholder="e.g. $90k–$115k · Equity"
                      />
                    </label>
                    <label className="premium-field-label">
                      Experience level
                      <select
                        className="premium-field-input"
                        value={jobForm.experienceLevel}
                        onChange={(e) =>
                          setJobForm((f) => ({
                            ...f,
                            experienceLevel: e.target.value as JobFormState['experienceLevel']
                          }))
                        }
                      >
                        <option value="any">Any</option>
                        <option value="entry">Entry</option>
                        <option value="mid">Mid</option>
                        <option value="senior">Senior</option>
                        <option value="lead">Lead / Staff</option>
                      </select>
                    </label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="premium-field-label">
                      Work mode
                      <select
                        className="premium-field-input"
                        value={jobForm.workMode}
                        onChange={(e) => setJobForm((f) => ({ ...f, workMode: e.target.value as PublicJob['workMode'] }))}
                      >
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="onsite">On-site</option>
                      </select>
                    </label>
                    <label className="premium-field-label">
                      Employment type
                      <select
                        className="premium-field-input"
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
                </div>

                <div className="space-y-4">
                  <p className="premium-form-section-label">Visibility</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="premium-field-label">
                      Application deadline
                      <input
                        type="datetime-local"
                        className="premium-field-input"
                        value={jobForm.applicationDeadlineLocal}
                        onChange={(e) => setJobForm((f) => ({ ...f, applicationDeadlineLocal: e.target.value }))}
                      />
                      <span className="text-[10px] font-normal normal-case tracking-normal text-slate-600">
                        Leave empty for no deadline. Shown on listings when set.
                      </span>
                    </label>
                    <label className="premium-field-label">
                      Sort priority
                      <input
                        type="number"
                        min={-9999}
                        max={99999}
                        className="premium-field-input"
                        value={jobForm.sortOrder}
                        onChange={(e) => setJobForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))}
                      />
                      <span className="text-[10px] font-normal normal-case tracking-normal text-slate-600">
                        Higher numbers surface first (after featured roles).
                      </span>
                    </label>
                  </div>
                  <label className="premium-inset-option">
                    <input
                      type="checkbox"
                      checked={jobForm.featured}
                      onChange={(e) => setJobForm((f) => ({ ...f, featured: e.target.checked }))}
                    />
                    <span>
                      <span className="font-semibold text-slate-100">Featured role</span>
                      <span className="mt-0.5 block text-xs font-normal normal-case text-slate-500">
                        Pinned to the top of the jobs page with a badge.
                      </span>
                    </span>
                  </label>
                  <label className="premium-inset-option">
                    <input
                      type="checkbox"
                      checked={jobForm.isPublished}
                      onChange={(e) => setJobForm((f) => ({ ...f, isPublished: e.target.checked }))}
                    />
                    <span>
                      <span className="font-semibold text-slate-100">Published</span>
                      <span className="mt-0.5 block text-xs font-normal normal-case text-slate-500">
                        Visible on the public jobs page when enabled.
                      </span>
                    </span>
                  </label>
                </div>

                <div className="premium-form-panel__actions">
                  <button type="submit" className="admin-btn" disabled={saving}>
                    {saving ? 'Saving…' : editingId ? 'Save changes' : 'Publish job'}
                  </button>
                  {editingId ? (
                    <button type="button" className="btn-secondary" onClick={resetJobForm}>
                      Discard
                    </button>
                  ) : null}
                </div>
              </form>

              <div className="lg:sticky lg:top-24 lg:self-start">
                <h2 className="text-lg font-bold tracking-tight text-slate-100">All jobs ({jobs.length})</h2>
                <p className="mt-1 text-xs text-slate-500">Featured and higher priority sort first on the jobs page.</p>
                <ul className="mt-4 max-h-[70vh] space-y-3 overflow-y-auto pr-1">
                  {jobs.map((job) => (
                    <li key={job.id} className="admin-list-card">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-100">{job.title}</p>
                          <p className="mt-1 text-[11px] text-slate-500">
                            {job.department ? `${job.department} · ` : ''}
                            {job.category}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-300">
                              {formatEmployment(job.employmentType)}
                            </span>
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-300">
                              {formatWorkMode(job.workMode)}
                            </span>
                            <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] text-indigo-200">
                              {formatExperienceLevel(job.experienceLevel || 'any')}
                            </span>
                            {job.featured ? (
                              <span className="rounded-full bg-amber-500/25 px-2 py-0.5 text-[10px] font-medium text-amber-100">
                                Featured
                              </span>
                            ) : null}
                            {job.isPublished === false ? (
                              <span className="rounded-full bg-slate-600/40 px-2 py-0.5 text-[10px] text-slate-200">Draft</span>
                            ) : null}
                          </div>
                          <p className="mt-2 text-[10px] text-slate-600">
                            Priority {typeof job.sortOrder === 'number' ? job.sortOrder : 0}
                            {job.applicationDeadline
                              ? ` · Deadline ${new Date(job.applicationDeadline).toLocaleDateString()}`
                              : ''}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            className="btn-secondary btn-sm"
                            onClick={() => startEdit(job)}
                          >
                            Edit
                          </button>
                          <button type="button" className="btn btn-danger btn-sm" onClick={() => onDeleteJob(job.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                {jobs.length === 0 && !loading ? (
                  <p className="mt-4 text-sm text-slate-500">No jobs yet — create one on the left.</p>
                ) : null}
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
        </section>
      </main>
    </ProtectedPage>
  );
}
