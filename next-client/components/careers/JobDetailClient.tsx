'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import type { JobApplicationRow, PublicJob } from '@/lib/clientApi';
import { applyToJob, fetchMyJobApplications, markJobApplicationRead } from '@/lib/clientApi';
import { useAuth } from '@/context/AuthContext';
import { formatApplicationStatus, formatInterviewRound } from './interviewLabels';
import { formatEmployment, formatWorkMode } from './jobLabels';

type Props = {
  job: PublicJob;
};

export default function JobDetailClient({ job }: Props) {
  const { token, isAuthenticated, user } = useAuth();
  const [form, setForm] = useState({
    phone: '',
    coverLetter: '',
    linkedInUrl: '',
    portfolioUrl: '',
    resumeUrl: '',
    yearsExperience: ''
  });
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

  return (
    <main className="app-page-shell">
      <article className="space-y-6">
        <nav className="text-sm text-slate-400">
          <Link href="/careers" className="hover:text-cyan-200">
            ← All careers
          </Link>
        </nav>

        <header className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-cyan-200">{job.category}</span>
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
              {formatEmployment(job.employmentType)}
            </span>
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
              {formatWorkMode(job.workMode)}
            </span>
          </div>
          <h1 className="section-title text-3xl font-extrabold md:text-5xl">{job.title}</h1>
          <div className="flex flex-wrap gap-3 text-sm text-slate-400">
            {job.location ? <span>{job.location}</span> : null}
            {job.salaryHint ? <span className="text-slate-300">{job.salaryHint}</span> : null}
          </div>
        </header>

        <div className="prose prose-invert max-w-none rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-slate-200">
          <p className="whitespace-pre-wrap text-base leading-relaxed">{job.description}</p>
        </div>

        {!isAuthenticated ? (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-amber-100">
            <p className="font-semibold">Sign in required</p>
            <p className="mt-1 text-sm text-amber-200/90">
              Create an account or sign in to submit your application. We attach your profile name and email automatically.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href={`/login?redirect=${encodeURIComponent(`/careers/${job.id}`)}`} className="btn inline-flex">
                Sign in
              </Link>
              <Link href={`/register?redirect=${encodeURIComponent(`/careers/${job.id}`)}`} className="btn-secondary inline-flex">
                Register
              </Link>
            </div>
          </div>
        ) : already && myApplication ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/15 to-transparent p-6">
              <p className="font-semibold text-emerald-100">You have applied for this role</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
                  {formatApplicationStatus(myApplication.status)}
                </span>
                {myApplication.interviewRound && myApplication.interviewRound !== 'none' ? (
                  <span className="rounded-full bg-indigo-500/25 px-3 py-1 text-xs text-indigo-100">
                    {formatInterviewRound(myApplication.interviewRound)}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-slate-400">
                Submitted {myApplication.createdAt ? new Date(myApplication.createdAt).toLocaleString() : '—'}
              </p>
            </div>

            {(myApplication.applicantMessages || []).length > 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <h2 className="text-lg font-bold text-slate-50">Updates from our team</h2>
                <p className="text-sm text-slate-400">Messages about your interview stages and next steps.</p>
                <ul className="mt-4 space-y-4">
                  {(myApplication.applicantMessages || []).map((m) => (
                    <li
                      key={m.id}
                      className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-200"
                    >
                      <p className="whitespace-pre-wrap">{m.body}</p>
                      <p className="mt-2 text-[10px] text-slate-500">
                        {m.sentAt ? new Date(m.sentAt).toLocaleString() : ''}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-6 text-center text-sm text-slate-400">
                When your status changes or an interview is scheduled, updates will appear here.
              </p>
            )}

            <Link href="/careers" className="btn-secondary inline-flex">
              ← All careers
            </Link>
          </div>
        ) : already ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-emerald-100">
            <p className="font-semibold">You have already applied for this role.</p>
            <Link href="/careers" className="btn-secondary mt-4 inline-flex">
              Browse more roles
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="careers-apply-form space-y-5 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-6 md:p-8">
            <div>
              <h2 className="text-xl font-bold text-slate-50">Apply for this role</h2>
              <p className="mt-1 text-sm text-slate-400">
                Applying as <span className="text-slate-200">{user?.name}</span> ({user?.email})
              </p>
            </div>

            <label className="flex flex-col gap-2 text-sm">
              <span className="text-slate-300">Phone (optional)</span>
              <input
                className="rounded-xl border border-white/15 bg-[var(--surface-strong)] px-4 py-3 text-slate-100 outline-none focus:border-[var(--primary)]"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+1 …"
                autoComplete="tel"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="text-slate-300">Years of experience (optional)</span>
              <input
                className="rounded-xl border border-white/15 bg-[var(--surface-strong)] px-4 py-3 text-slate-100 outline-none focus:border-[var(--primary)]"
                value={form.yearsExperience}
                onChange={(e) => setForm((f) => ({ ...f, yearsExperience: e.target.value }))}
                placeholder="e.g. 3 years in product design"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="text-slate-300">Cover letter *</span>
              <textarea
                required
                minLength={20}
                rows={6}
                className="rounded-xl border border-white/15 bg-[var(--surface-strong)] px-4 py-3 text-slate-100 outline-none focus:border-[var(--primary)]"
                value={form.coverLetter}
                onChange={(e) => setForm((f) => ({ ...f, coverLetter: e.target.value }))}
                placeholder="Tell us why you are a great fit (at least 20 characters)."
              />
            </label>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="flex flex-col gap-2 text-sm md:col-span-1">
                <span className="text-slate-300">LinkedIn URL</span>
                <input
                  className="rounded-xl border border-white/15 bg-[var(--surface-strong)] px-4 py-3 text-slate-100 outline-none focus:border-[var(--primary)]"
                  value={form.linkedInUrl}
                  onChange={(e) => setForm((f) => ({ ...f, linkedInUrl: e.target.value }))}
                  placeholder="https://"
                  type="url"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm md:col-span-1">
                <span className="text-slate-300">Portfolio URL</span>
                <input
                  className="rounded-xl border border-white/15 bg-[var(--surface-strong)] px-4 py-3 text-slate-100 outline-none focus:border-[var(--primary)]"
                  value={form.portfolioUrl}
                  onChange={(e) => setForm((f) => ({ ...f, portfolioUrl: e.target.value }))}
                  placeholder="https://"
                  type="url"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm md:col-span-1">
                <span className="text-slate-300">Resume URL</span>
                <input
                  className="rounded-xl border border-white/15 bg-[var(--surface-strong)] px-4 py-3 text-slate-100 outline-none focus:border-[var(--primary)]"
                  value={form.resumeUrl}
                  onChange={(e) => setForm((f) => ({ ...f, resumeUrl: e.target.value }))}
                  placeholder="Link to PDF or site"
                  type="url"
                />
              </label>
            </div>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            {status ? <p className="text-sm text-emerald-400">{status}</p> : null}

            <button type="submit" className="btn inline-flex disabled:opacity-60" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit application'}
            </button>
          </form>
        )}
      </article>
    </main>
  );
}
