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
import ApplicationDocumentLinks from '@/components/shared/ApplicationDocumentLinks';

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
      setStatus('Application sent. We will be in touch soon.');
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

  const asideContent = !isAuthenticated ? (
    <div className="page-content-card profile-callout profile-callout--amber space-y-3">
      <p className="profile-panel-title">Sign in to apply</p>
      <p className="profile-panel-desc jobs-text-muted">We use your account name and email on the application.</p>
      {deadline?.past ? (
        <p className="premium-alert premium-alert--error text-sm">Applications closed ({deadline.label}).</p>
      ) : null}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Link href={`/login?redirect=${encodeURIComponent(`/jobs/${job.id}`)}`} className="btn btn-sm justify-center">
          Sign in
        </Link>
        <Link href={`/register?redirect=${encodeURIComponent(`/jobs/${job.id}`)}`} className="btn-secondary btn-sm justify-center">
          Create account
        </Link>
      </div>
    </div>
  ) : already && myApplication ? (
    <div className="space-y-4">
      <div className="page-content-card profile-callout profile-callout--emerald space-y-3">
        <p className="profile-panel-title">Application received</p>
        <div className="flex flex-wrap gap-2">
          <span className="job-meta-chip job-meta-chip--soft">{formatApplicationStatus(myApplication.status)}</span>
          {myApplication.interviewRound && myApplication.interviewRound !== 'none' ? (
            <span className="job-meta-chip job-meta-chip--indigo">{formatInterviewRound(myApplication.interviewRound)}</span>
          ) : null}
        </div>
        <p className="profile-panel-desc jobs-text-muted text-sm">
          Submitted {myApplication.createdAt ? new Date(myApplication.createdAt).toLocaleString() : '—'}
        </p>
      </div>
      <ApplicationDocumentLinks
        resumeUrl={myApplication.resumeUrl}
        additionalDocumentUrl={myApplication.additionalDocumentUrl}
        additionalDocumentName={myApplication.additionalDocumentName}
        linkedInUrl={myApplication.linkedInUrl}
        portfolioUrl={myApplication.portfolioUrl}
        emptyMessage="No document links found. Contact support if you submitted files."
      />
      <Link href="/jobs" className="btn-secondary btn-sm inline-flex w-full justify-center">
        All roles
      </Link>
    </div>
  ) : already ? (
    <div className="page-content-card profile-callout profile-callout--emerald space-y-3">
      <p className="profile-panel-title">Already applied</p>
      <Link href="/jobs" className="btn-secondary btn-sm mt-1 inline-flex w-full justify-center">
        More roles
      </Link>
    </div>
  ) : deadline?.past ? (
    <div className="page-content-card profile-callout profile-callout--rose space-y-2">
      <p className="profile-panel-title">Applications closed</p>
      <p className="profile-panel-desc jobs-text-muted text-sm">Closed after {deadline.label}.</p>
      <Link href="/jobs" className="btn-secondary btn-sm mt-2 inline-flex w-full justify-center">
        Browse open roles
      </Link>
    </div>
  ) : (
    <form onSubmit={onSubmit} className="careers-apply-form space-y-4">
      <div>
        <p className="profile-panel-label">Apply</p>
        <h2 className="profile-panel-title text-lg">This role</h2>
        <p className="profile-panel-desc text-sm jobs-text-muted">
          {user?.name} · {user?.email}
        </p>
      </div>

      <label className="flex flex-col gap-2">
        <span className="form-label-premium">Cover letter *</span>
        <textarea
          required
          minLength={20}
          rows={5}
          className="premium-field-input min-h-[120px] resize-y"
          value={form.coverLetter}
          onChange={(e) => setForm((f) => ({ ...f, coverLetter: e.target.value }))}
          placeholder="Why you and this role — a few short paragraphs."
        />
      </label>

      <div className="job-form-inset gap-3">
        <p className="text-sm font-semibold jobs-text">Resume *</p>
        <div className="job-upload-zone">
          <span className="job-upload-zone__label">File</span>
          <label className="job-upload-zone__btn">
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
            {uploading === 'resume' ? 'Uploading…' : 'Choose PDF or Word'}
          </label>
          <p className="text-xs jobs-text-muted">Max ~10MB · or paste a link below</p>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="form-label-premium">Resume URL</span>
          <input
            className="premium-field-input"
            value={form.resumeUrl}
            onChange={(e) => {
              setResumeSourceLabel('');
              setForm((f) => ({ ...f, resumeUrl: e.target.value }));
            }}
            placeholder="https://…"
            type="url"
            inputMode="url"
          />
        </label>
        {form.resumeUrl && resumeSourceLabel ? (
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-300/90">Attached: {resumeSourceLabel}</p>
        ) : form.resumeUrl ? (
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-300/90">Link saved</p>
        ) : (
          <p className="text-xs jobs-text-muted">Add a file or https link to continue.</p>
        )}
      </div>

      <div className="job-form-inset gap-3">
        <p className="text-sm font-semibold jobs-text">Extra file (optional)</p>
        <div className="flex flex-wrap items-center gap-2">
          <label className="job-upload-zone__btn">
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
            <>
              <span className="max-w-[200px] truncate text-xs text-emerald-600 dark:text-emerald-300/90">
                {form.additionalDocumentName || 'File'}
              </span>
              <button
                type="button"
                className="text-xs font-medium text-rose-600 underline underline-offset-2 dark:text-rose-300"
                onClick={() => setForm((f) => ({ ...f, additionalDocumentUrl: '', additionalDocumentName: '' }))}
              >
                Remove
              </button>
            </>
          ) : (
            <span className="text-xs jobs-text-muted">None</span>
          )}
        </div>
      </div>

      <details className="job-apply-optional">
        <summary>Optional — links & contact</summary>
        <div className="job-apply-optional__body">
          <label className="flex flex-col gap-2">
            <span className="form-label-premium">LinkedIn</span>
            <input
              className="premium-field-input"
              value={form.linkedInUrl}
              onChange={(e) => setForm((f) => ({ ...f, linkedInUrl: e.target.value }))}
              placeholder="https://"
              type="url"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="form-label-premium">Portfolio</span>
            <input
              className="premium-field-input"
              value={form.portfolioUrl}
              onChange={(e) => setForm((f) => ({ ...f, portfolioUrl: e.target.value }))}
              placeholder="https://"
              type="url"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="form-label-premium">Phone</span>
              <input
                className="premium-field-input"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+1 …"
                autoComplete="tel"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="form-label-premium">Experience</span>
              <input
                className="premium-field-input"
                value={form.yearsExperience}
                onChange={(e) => setForm((f) => ({ ...f, yearsExperience: e.target.value }))}
                placeholder="e.g. 4 years"
              />
            </label>
          </div>
        </div>
      </details>

      {error ? <p className="premium-alert premium-alert--error text-sm">{error}</p> : null}
      {status ? <p className="premium-alert premium-alert--success text-sm">{status}</p> : null}

      <button type="submit" className="btn btn-sm w-full justify-center py-3 sm:py-2" disabled={submitting || !form.resumeUrl.trim()}>
        {submitting ? 'Sending…' : 'Submit application'}
      </button>
    </form>
  );

  return (
    <main className="app-page-shell job-detail-page">
      <div className="job-detail-layout">
        <div className="job-detail-main">
          <nav className="page-content-card py-2">
            <Link href="/jobs" className="job-detail-back">
              ← All roles
            </Link>
          </nav>

          <header className="premium-page-hero premium-page-hero--prime space-y-4">
            <div className="relative z-1 space-y-3">
              <p className="premium-eyebrow">Role</p>
              <div className="flex flex-wrap items-center gap-1.5">
                {job.featured ? <span className="job-meta-chip job-meta-chip--featured">Featured</span> : null}
                <span className="job-meta-chip job-meta-chip--category">{job.category}</span>
                {job.department ? <span className="job-meta-chip job-meta-chip--soft">{job.department}</span> : null}
                <span className="job-meta-chip job-meta-chip--soft">{formatEmployment(job.employmentType)}</span>
                <span className="job-meta-chip job-meta-chip--soft">{formatWorkMode(job.workMode)}</span>
                <span className="job-meta-chip job-meta-chip--indigo">{formatExperienceLevel(job.experienceLevel || 'any')}</span>
              </div>
              <h1 className="section-title text-2xl font-extrabold tracking-tight md:text-4xl">{job.title}</h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm jobs-text-muted">
                {job.location ? <span>{job.location}</span> : null}
                {job.salaryHint ? <span className="font-medium jobs-text-soft">{job.salaryHint}</span> : null}
                {deadline ? (
                  <span
                    className={
                      deadline.past ? 'font-medium text-rose-500 dark:text-rose-300' : 'font-medium text-emerald-600 dark:text-emerald-300'
                    }
                  >
                    {deadline.past ? 'Closed · ' : 'Apply by '}
                    {deadline.label}
                  </span>
                ) : null}
              </div>
            </div>
          </header>

          <div className="job-detail-section">
            <p className="profile-panel-label">Overview</p>
            <h2>About the role</h2>
            <p className="whitespace-pre-wrap text-base leading-relaxed">{job.description}</p>
          </div>

          {hasResp ? (
            <section className="job-detail-section">
              <h2>Responsibilities</h2>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{job.responsibilities}</p>
            </section>
          ) : null}

          {hasReq ? (
            <section className="job-detail-section">
              <h2>Requirements</h2>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{job.requirements}</p>
            </section>
          ) : null}

          {hasBenefits ? (
            <section className="job-detail-section job-detail-section--benefits">
              <h2>Benefits</h2>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{job.benefits}</p>
            </section>
          ) : null}

          {isAuthenticated && already && myApplication && (myApplication.applicantMessages || []).length > 0 ? (
            <section className="job-detail-section">
              <h2>Updates from our team</h2>
              <p className="profile-panel-desc jobs-text-muted text-sm">Messages about your process.</p>
              <ul className="mt-3 space-y-3">
                {(myApplication.applicantMessages || []).map((m) => (
                  <li key={m.id} className="jobs-application-msg text-sm jobs-text-soft">
                    <p className="whitespace-pre-wrap">{m.body}</p>
                    <p className="mt-2 text-[10px] jobs-text-muted">{m.sentAt ? new Date(m.sentAt).toLocaleString() : ''}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : isAuthenticated && already && myApplication ? (
            <p className="premium-empty-hint text-sm">We will post updates here when your status changes.</p>
          ) : null}
        </div>

        <aside className="job-detail-aside job-detail-aside--sticky">{asideContent}</aside>
      </div>
    </main>
  );
}
