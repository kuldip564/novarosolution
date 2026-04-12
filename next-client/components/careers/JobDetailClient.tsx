'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import type { JobApplicationRow, PublicJob } from '@/lib/clientApi';
import {
  applyToJob,
  fetchMyJobApplications,
  markJobApplicationRead,
  uploadApplicationDocument
} from '@/lib/clientApi';
import { useAuth } from '@/context/AuthContext';
import { formatApplicationStatus, formatInterviewRound } from './interviewLabels';
import {
  formatApplicationDeadline,
  formatEmployment,
  formatExperienceLevel,
  formatWorkMode
} from './jobLabels';

type Props = {
  job: PublicJob;
};

const MAX_DOC_BYTES = 10 * 1024 * 1024;

async function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.readAsDataURL(file);
  });
}

export default function JobDetailClient({ job }: Props) {
  const { token, isAuthenticated, user } = useAuth();
  const [form, setForm] = useState({
    phone: '',
    coverLetter: '',
    linkedInUrl: '',
    portfolioUrl: '',
    resumeUrl: '',
    additionalDocumentUrl: '',
    additionalDocumentName: '',
    yearsExperience: ''
  });
  const [resumeSourceLabel, setResumeSourceLabel] = useState('');
  const [uploading, setUploading] = useState<'resume' | 'extra' | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [already, setAlready] = useState(false);
  const [myApplication, setMyApplication] = useState<JobApplicationRow | null>(null);

  useEffect(() => {
    if (!token || !isAuthenticated) return;
    fetchMyJobApplications(token)
      .then((rows) => {
        const hit = rows.find((r) => r.jobId === job.id);
        setAlready(!!hit);
        setMyApplication(hit || null);
        if (hit?.unreadUpdates && hit.id) {
          markJobApplicationRead(hit.id, token)
            .then((updated) => {
              if (updated) setMyApplication(updated);
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, [token, isAuthenticated, job.id]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setSubmitting(true);
    setError('');
    setStatus('');
    try {
      await applyToJob(
        job.id,
        {
          phone: form.phone.trim(),
          coverLetter: form.coverLetter.trim(),
          linkedInUrl: form.linkedInUrl.trim(),
          portfolioUrl: form.portfolioUrl.trim(),
          resumeUrl: form.resumeUrl.trim(),
          additionalDocumentUrl: form.additionalDocumentUrl.trim(),
          additionalDocumentName: form.additionalDocumentName.trim(),
          yearsExperience: form.yearsExperience.trim()
        },
        token
      );
      setAlready(true);
      setStatus('Application sent. We will review and get back to you.');
      const rows = await fetchMyJobApplications(token);
      setMyApplication(rows.find((r) => r.jobId === job.id) || null);
      setForm((f) => ({ ...f, coverLetter: '' }));
    } catch (err: any) {
      setError(err?.message || 'Could not submit application.');
    } finally {
      setSubmitting(false);
    }
  }

  const deadline = formatApplicationDeadline(job.applicationDeadline);
  const hasResp = Boolean((job.responsibilities || '').trim());
  const hasReq = Boolean((job.requirements || '').trim());
  const hasBenefits = Boolean((job.benefits || '').trim());

  async function handleResumeFile(file: File | null) {
    if (!file || !token) return;
    if (file.size > MAX_DOC_BYTES) {
      setError('Resume must be under 10MB.');
      return;
    }
    setUploading('resume');
    setError('');
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const url = await uploadApplicationDocument(dataUrl, token);
      setForm((f) => ({ ...f, resumeUrl: url }));
      setResumeSourceLabel(file.name);
    } catch (err: any) {
      setError(err?.message || 'Resume upload failed.');
    } finally {
      setUploading(null);
    }
  }

  async function handleExtraFile(file: File | null) {
    if (!file || !token) return;
    if (file.size > MAX_DOC_BYTES) {
      setError('Document must be under 10MB.');
      return;
    }
    setUploading('extra');
    setError('');
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const url = await uploadApplicationDocument(dataUrl, token);
      setForm((f) => ({ ...f, additionalDocumentUrl: url, additionalDocumentName: file.name }));
    } catch (err: any) {
      setError(err?.message || 'Document upload failed.');
    } finally {
      setUploading(null);
    }
  }

  return (
    <main className="app-page-shell">
      <div className="flex flex-col gap-6">
        <nav className="page-content-card job-detail-nav text-sm">
          <Link href="/jobs">← All jobs</Link>
        </nav>

        <header className="premium-page-hero space-y-5">
          <div className="relative z-[1] space-y-4">
            <p className="premium-eyebrow">Role</p>
            <div className="flex flex-wrap items-center gap-2">
              {job.featured ? <span className="job-meta-chip job-meta-chip--featured">Featured</span> : null}
              <span className="job-meta-chip job-meta-chip--category">{job.category}</span>
              {job.department ? <span className="job-meta-chip job-meta-chip--soft">{job.department}</span> : null}
              <span className="job-meta-chip job-meta-chip--soft">{formatEmployment(job.employmentType)}</span>
              <span className="job-meta-chip job-meta-chip--soft">{formatWorkMode(job.workMode)}</span>
              <span className="job-meta-chip job-meta-chip--indigo">
                {formatExperienceLevel(job.experienceLevel || 'any')}
              </span>
            </div>
            <h1 className="section-title text-3xl font-extrabold md:text-5xl">{job.title}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-400">
              {job.location ? <span>{job.location}</span> : null}
              {job.salaryHint ? <span className="font-medium text-slate-200">{job.salaryHint}</span> : null}
              {deadline ? (
                <span className={deadline.past ? 'font-medium text-rose-300' : 'font-medium text-emerald-300'}>
                  {deadline.past ? 'Applications closed · ' : 'Apply by '}
                  {deadline.label}
                </span>
              ) : null}
            </div>
          </div>
        </header>

        <div className="job-detail-section">
          <p className="profile-panel-label">Overview</p>
          <h2>About the role</h2>
          <p className="whitespace-pre-wrap text-base">{job.description}</p>
        </div>

        {hasResp ? (
          <section className="job-detail-section">
            <h2>Responsibilities</h2>
            <p className="whitespace-pre-wrap text-sm">{job.responsibilities}</p>
          </section>
        ) : null}

        {hasReq ? (
          <section className="job-detail-section">
            <h2>Requirements</h2>
            <p className="whitespace-pre-wrap text-sm">{job.requirements}</p>
          </section>
        ) : null}

        {hasBenefits ? (
          <section className="job-detail-section job-detail-section--benefits">
            <h2>Benefits & perks</h2>
            <p className="whitespace-pre-wrap text-sm">{job.benefits}</p>
          </section>
        ) : null}

        {!isAuthenticated ? (
          <div className="page-content-card profile-callout profile-callout--amber space-y-3">
            <p className="profile-panel-title">Sign in required</p>
            <p className="profile-panel-desc">
              Create an account or sign in to submit your application. We attach your profile name and email automatically.
            </p>
            {deadline?.past ? (
              <p className="premium-alert premium-alert--error text-sm">
                The application window for this role has closed ({deadline.label}).
              </p>
            ) : null}
            <div className="flex flex-wrap gap-3 pt-1">
              <Link href={`/login?redirect=${encodeURIComponent(`/jobs/${job.id}`)}`} className="btn btn-sm">
                Sign in
              </Link>
              <Link href={`/register?redirect=${encodeURIComponent(`/jobs/${job.id}`)}`} className="btn-secondary btn-sm">
                Register
              </Link>
            </div>
          </div>
        ) : already && myApplication ? (
          <div className="space-y-5">
            <div className="page-content-card profile-callout profile-callout--emerald space-y-3">
              <p className="profile-panel-title">You have applied for this role</p>
              <div className="flex flex-wrap gap-2">
                <span className="job-meta-chip job-meta-chip--soft">{formatApplicationStatus(myApplication.status)}</span>
                {myApplication.interviewRound && myApplication.interviewRound !== 'none' ? (
                  <span className="job-meta-chip job-meta-chip--indigo">
                    {formatInterviewRound(myApplication.interviewRound)}
                  </span>
                ) : null}
              </div>
              <p className="profile-panel-desc">
                Submitted {myApplication.createdAt ? new Date(myApplication.createdAt).toLocaleString() : '—'}
              </p>
              <div className="flex flex-wrap gap-2">
                {myApplication.resumeUrl ? (
                  <a
                    href={myApplication.resumeUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn-secondary btn-sm"
                  >
                    View resume
                  </a>
                ) : null}
                {myApplication.additionalDocumentUrl ? (
                  <a
                    href={myApplication.additionalDocumentUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn-secondary btn-sm"
                  >
                    {myApplication.additionalDocumentName?.trim() || 'Other document'}
                  </a>
                ) : null}
              </div>
            </div>

            {(myApplication.applicantMessages || []).length > 0 ? (
              <div className="job-detail-section">
                <h2>Updates from our team</h2>
                <p className="profile-panel-desc">Messages about your interview stages and next steps.</p>
                <ul className="mt-4 space-y-3">
                  {(myApplication.applicantMessages || []).map((m) => (
                    <li key={m.id} className="jobs-application-msg text-sm text-slate-200">
                      <p className="whitespace-pre-wrap">{m.body}</p>
                      <p className="mt-2 text-[10px] text-slate-500">
                        {m.sentAt ? new Date(m.sentAt).toLocaleString() : ''}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="premium-empty-hint text-sm">
                When your status changes or an interview is scheduled, updates will appear here.
              </p>
            )}

            <Link href="/jobs" className="btn-secondary btn-sm inline-flex">
              ← All jobs
            </Link>
          </div>
        ) : already ? (
          <div className="page-content-card profile-callout profile-callout--emerald">
            <p className="profile-panel-title">You have already applied for this role.</p>
            <Link href="/jobs" className="btn-secondary btn-sm mt-4 inline-flex">
              Browse more roles
            </Link>
          </div>
        ) : deadline?.past ? (
          <div className="page-content-card profile-callout profile-callout--rose">
            <p className="profile-panel-title">Applications are closed</p>
            <p className="profile-panel-desc">
              This role stopped accepting new applications after {deadline.label}.
            </p>
            <Link href="/jobs" className="btn-secondary btn-sm mt-4 inline-flex">
              Browse open roles
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="careers-apply-form space-y-5">
            <div>
              <p className="profile-panel-label">Application</p>
              <h2 className="profile-panel-title">Apply for this role</h2>
              <p className="profile-panel-desc">
                Applying as <span className="text-slate-200">{user?.name}</span> ({user?.email})
              </p>
            </div>

            <label className="flex flex-col gap-2">
              <span className="form-label-premium">Cover letter *</span>
              <textarea
                required
                minLength={20}
                rows={6}
                className="premium-field-input min-h-[140px]"
                value={form.coverLetter}
                onChange={(e) => setForm((f) => ({ ...f, coverLetter: e.target.value }))}
                placeholder="Tell us why you are a great fit (at least 20 characters)."
              />
            </label>

            <div className="job-form-inset">
              <p className="text-sm font-semibold text-slate-200">Resume *</p>
              <p className="text-xs text-slate-500">Upload PDF or Word (max ~10MB), or paste a public https link.</p>
              <div className="flex flex-wrap items-center gap-3">
                <label className="btn-secondary btn-sm cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="sr-only"
                    disabled={!!uploading || submitting}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      e.target.value = '';
                      void handleResumeFile(f || null);
                    }}
                  />
                  {uploading === 'resume' ? 'Uploading…' : 'Upload file'}
                </label>
                {form.resumeUrl && resumeSourceLabel ? (
                  <span className="text-xs text-emerald-300/90">Ready: {resumeSourceLabel}</span>
                ) : form.resumeUrl ? (
                  <span className="text-xs text-emerald-300/90">Resume link ready</span>
                ) : (
                  <span className="text-xs text-amber-200/80">Add a file or link before submitting.</span>
                )}
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="form-label-premium">Or resume URL (https)</span>
                <input
                  className="premium-field-input"
                  value={form.resumeUrl}
                  onChange={(e) => {
                    setResumeSourceLabel('');
                    setForm((f) => ({ ...f, resumeUrl: e.target.value }));
                  }}
                  placeholder="https://…"
                  type="url"
                />
              </label>
            </div>

            <div className="job-form-inset">
              <p className="text-sm font-semibold text-slate-200">Additional document (optional)</p>
              <p className="text-xs text-slate-500">Portfolio PDF, certificate, or other supporting file.</p>
              <div className="flex flex-wrap items-center gap-3">
                <label className="btn-secondary btn-sm cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="sr-only"
                    disabled={!!uploading || submitting}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      e.target.value = '';
                      void handleExtraFile(f || null);
                    }}
                  />
                  {uploading === 'extra' ? 'Uploading…' : 'Upload'}
                </label>
                {form.additionalDocumentUrl ? (
                  <span className="truncate text-xs text-emerald-300/90">{form.additionalDocumentName || 'File attached'}</span>
                ) : (
                  <span className="text-xs text-slate-500">No extra file</span>
                )}
                {form.additionalDocumentUrl ? (
                  <button
                    type="button"
                    className="text-xs font-medium text-rose-300 underline underline-offset-2"
                    onClick={() => setForm((f) => ({ ...f, additionalDocumentUrl: '', additionalDocumentName: '' }))}
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="form-label-premium">LinkedIn URL (optional)</span>
                <input
                  className="premium-field-input"
                  value={form.linkedInUrl}
                  onChange={(e) => setForm((f) => ({ ...f, linkedInUrl: e.target.value }))}
                  placeholder="https://"
                  type="url"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="form-label-premium">Portfolio URL (optional)</span>
                <input
                  className="premium-field-input"
                  value={form.portfolioUrl}
                  onChange={(e) => setForm((f) => ({ ...f, portfolioUrl: e.target.value }))}
                  placeholder="https://"
                  type="url"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="form-label-premium">Phone (optional)</span>
                <input
                  className="premium-field-input"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+1 …"
                  autoComplete="tel"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="form-label-premium">Years of experience (optional)</span>
                <input
                  className="premium-field-input"
                  value={form.yearsExperience}
                  onChange={(e) => setForm((f) => ({ ...f, yearsExperience: e.target.value }))}
                  placeholder="e.g. 3 years in product design"
                />
              </label>
            </div>

            {error ? <p className="premium-alert premium-alert--error text-sm">{error}</p> : null}
            {status ? <p className="premium-alert premium-alert--success text-sm">{status}</p> : null}

            <button
              type="submit"
              className="btn btn-sm disabled:opacity-60"
              disabled={submitting || !form.resumeUrl.trim()}
            >
              {submitting ? 'Submitting…' : 'Submit application'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
