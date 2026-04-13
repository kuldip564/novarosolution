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
      <main className="app-page-shell job-manager-page">
        <section className="admin-shell">
          <article className="premium-page-hero premium-page-hero--prime space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="section-title text-2xl font-extrabold tracking-tight md:text-3xl">Jobs</h1>
                <p className="admin-theme-muted mt-1 text-xs md:text-sm">Listings and applications</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
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
                <Link className="btn-secondary shrink-0 px-3 py-2 text-xs font-semibold" href="/admin/dashboard">
                  Dashboard
                </Link>
              </div>
            </div>
          </article>

        <section className="job-manager-page__body space-y-4">
          {loading ? <p className="admin-theme-muted">Loading…</p> : null}
          {error ? <p className="premium-alert premium-alert--error text-sm">{error}</p> : null}
          {notice ? <p className="premium-alert premium-alert--success text-sm">{notice}</p> : null}

          {tab === 'jobs' ? (
            <div className="job-manager-page__grid grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)] lg:gap-8">
              <form onSubmit={onSaveJob} className="premium-form-panel job-manager-page__form space-y-6">
                <div className="premium-form-panel__head">
                  <h2 className="admin-theme-text text-lg font-bold">{editingId ? 'Edit listing' : 'New listing'}</h2>
                  {editingId ? (
                    <button type="button" className="btn-secondary text-xs" onClick={resetJobForm}>
                      Cancel
                    </button>
                  ) : null}
                </div>

                <div className="space-y-3">
                  <p className="premium-form-section-label">Basics</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="premium-field-label">
                      Title *
                      <input
                        required
                        className="premium-field-input"
                        value={jobForm.title}
                        onChange={(e) => setJobForm((f) => ({ ...f, title: e.target.value }))}
                        placeholder="Role title"
                      />
                    </label>
                    <label className="premium-field-label">
                      Department
                      <input
                        className="premium-field-input"
                        list="department-suggestions"
                        value={jobForm.department}
                        onChange={(e) => setJobForm((f) => ({ ...f, department: e.target.value }))}
                        placeholder="Department"
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
                        placeholder="e.g. Engineering"
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
                        placeholder="Location"
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="premium-form-section-label">Copy</p>
                  <label className="premium-field-label">
                    Summary
                    <textarea
                      rows={3}
                      maxLength={500}
                      className="premium-field-input min-h-[72px] resize-y"
                      value={jobForm.summary}
                      onChange={(e) => setJobForm((f) => ({ ...f, summary: e.target.value }))}
                      placeholder="Short blurb for the job grid (optional)"
                    />
                    <span className="admin-theme-subtle text-[10px] font-normal normal-case tracking-normal">
                      {jobForm.summary.length}/500
                    </span>
                  </label>
                  <label className="premium-field-label">
                    Description *
                    <textarea
                      required
                      minLength={20}
                      rows={5}
                      className="premium-field-input min-h-[120px] resize-y"
                      value={jobForm.description}
                      onChange={(e) => setJobForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder="Role overview"
                    />
                  </label>
                </div>

                <div className="space-y-3">
                  <p className="premium-form-section-label">Optional</p>
                  <label className="premium-field-label">
                    Responsibilities
                    <textarea
                      rows={4}
                      className="premium-field-input min-h-[88px] resize-y text-[13px] leading-relaxed"
                      value={jobForm.responsibilities}
                      onChange={(e) => setJobForm((f) => ({ ...f, responsibilities: e.target.value }))}
                      placeholder="Bullets or short lines"
                    />
                  </label>
                  <label className="premium-field-label">
                    Requirements
                    <textarea
                      rows={4}
                      className="premium-field-input min-h-[88px] resize-y text-[13px] leading-relaxed"
                      value={jobForm.requirements}
                      onChange={(e) => setJobForm((f) => ({ ...f, requirements: e.target.value }))}
                      placeholder="Skills, experience, tools"
                    />
                  </label>
                  <label className="premium-field-label">
                    Benefits
                    <textarea
                      rows={3}
                      className="premium-field-input min-h-[72px] resize-y"
                      value={jobForm.benefits}
                      onChange={(e) => setJobForm((f) => ({ ...f, benefits: e.target.value }))}
                      placeholder="Perks, PTO, stipends…"
                    />
                  </label>
                </div>

                <div className="space-y-3">
                  <p className="premium-form-section-label">Role & pay</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="premium-field-label">
                      Compensation
                      <input
                        className="premium-field-input"
                        value={jobForm.salaryHint}
                        onChange={(e) => setJobForm((f) => ({ ...f, salaryHint: e.target.value }))}
                        placeholder="Range or hint"
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

                <div className="space-y-3">
                  <p className="premium-form-section-label">Publish</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="premium-field-label">
                      Deadline
                      <input
                        type="datetime-local"
                        className="premium-field-input"
                        value={jobForm.applicationDeadlineLocal}
                        onChange={(e) => setJobForm((f) => ({ ...f, applicationDeadlineLocal: e.target.value }))}
                        title="Optional; shown on the public listing"
                      />
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
                        title="Higher sorts above non-featured roles"
                      />
                    </label>
                  </div>
                  <label className="premium-inset-option">
                    <input
                      type="checkbox"
                      checked={jobForm.featured}
                      onChange={(e) => setJobForm((f) => ({ ...f, featured: e.target.checked }))}
                    />
                    <span className="admin-theme-text font-semibold">Featured</span>
                  </label>
                  <label className="premium-inset-option">
                    <input
                      type="checkbox"
                      checked={jobForm.isPublished}
                      onChange={(e) => setJobForm((f) => ({ ...f, isPublished: e.target.checked }))}
                    />
                    <span className="admin-theme-text font-semibold">Live on careers page</span>
                  </label>
                </div>

                <div className="premium-form-panel__actions">
                  <button type="submit" className="admin-btn" disabled={saving}>
                    {saving ? 'Saving…' : editingId ? 'Save' : 'Publish'}
                  </button>
                  {editingId ? (
                    <button type="button" className="btn-secondary" onClick={resetJobForm}>
                      Discard
                    </button>
                  ) : null}
                </div>
              </form>

              <aside className="job-manager-page__aside lg:sticky lg:top-24 lg:self-start">
                <h2 className="admin-theme-text text-sm font-bold uppercase tracking-wider">Open roles · {jobs.length}</h2>
                <ul className="mt-3 max-h-[min(70vh,720px)] space-y-2 overflow-y-auto pr-1">
                  {jobs.map((job) => (
                    <li key={job.id} className="admin-list-card">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="admin-theme-text font-semibold">{job.title}</p>
                          <p className="admin-theme-muted mt-1 text-[11px]">
                            {job.department ? `${job.department} · ` : ''}
                            {job.category}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <span className="admin-job-pill">{formatEmployment(job.employmentType)}</span>
                            <span className="admin-job-pill">{formatWorkMode(job.workMode)}</span>
                            <span className="admin-job-pill admin-job-pill--exp">
                              {formatExperienceLevel(job.experienceLevel || 'any')}
                            </span>
                            {job.featured ? (
                              <span className="admin-job-pill admin-job-pill--featured">Featured</span>
                            ) : null}
                            {job.isPublished === false ? (
                              <span className="admin-job-pill admin-job-pill--draft">Draft</span>
                            ) : null}
                          </div>
                          <p className="admin-theme-subtle mt-1.5 text-[10px] tabular-nums">
                            P{typeof job.sortOrder === 'number' ? job.sortOrder : 0}
                            {job.applicationDeadline ? ` · ${new Date(job.applicationDeadline).toLocaleDateString()}` : ''}
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
                  <p className="admin-theme-muted mt-3 text-sm">No listings yet.</p>
                ) : null}
              </aside>
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
