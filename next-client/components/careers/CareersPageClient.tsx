'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import type { PublicJob, JobApplicationRow } from '@/lib/clientApi';
import { fetchPublishedJobsClient, fetchMyJobApplications, markJobApplicationRead } from '@/lib/clientApi';
import { useAuth } from '@/context/AuthContext';
import { formatApplicationStatus, formatInterviewRound } from './interviewLabels';
import {
  formatApplicationDeadline,
  formatEmployment,
  formatExperienceLevel,
  formatWorkMode,
  jobCardTeaser
} from './jobLabels';

type Props = {
  initialJobs: PublicJob[];
};

export default function CareersPageClient({ initialJobs }: Props) {
  const { token, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState<PublicJob[]>(initialJobs);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [mine, setMine] = useState<JobApplicationRow[]>([]);
  const [openAppId, setOpenAppId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      if (j.category) set.add(j.category);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [jobs]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!category) {
        setJobs(initialJobs);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const rows = await fetchPublishedJobsClient(category);
        if (!cancelled) setJobs(rows);
      } catch {
        if (!cancelled) setJobs([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [category, initialJobs]);

  useEffect(() => {
    if (!token || !isAuthenticated) {
      setMine([]);
      return;
    }
    fetchMyJobApplications(token)
      .then(setMine)
      .catch(() => setMine([]));
  }, [token, isAuthenticated]);

  return (
    <main className="app-page-shell">
      <section className="premium-page-hero space-y-5">
        <div className="relative z-[1] space-y-4">
          <p className="premium-eyebrow">Careers</p>
          <h1 className="section-title text-3xl font-extrabold md:text-5xl">Open roles</h1>
          <p className="max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
            Explore roles across design, engineering, and operations. Sign in to apply and track applications in one
            place.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/" className="btn-secondary btn-sm">
              Back to home
            </Link>
            {!isAuthenticated ? (
              <Link href="/login" className="btn btn-sm">
                Sign in to apply
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="page-content-card space-y-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="profile-panel-label">Directory</p>
            <h2 className="profile-panel-title">All roles</h2>
            <p className="profile-panel-desc">Featured listings first · filter by category.</p>
          </div>
          <label className="flex min-w-0 flex-col gap-2 sm:max-w-xs">
            <span className="form-label-premium">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="premium-field-input"
              aria-label="Filter jobs by category"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        {loading ? <p className="jobs-loading-hint">Refreshing listings…</p> : null}

        <div className="grid gap-5 md:grid-cols-2">
          {jobs.map((job, index) => {
            const deadline = formatApplicationDeadline(job.applicationDeadline);
            const featured = job.featured === true;
            return (
              <motion.article
                key={job.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className={`careers-card group relative overflow-hidden ${featured ? 'is-featured' : ''}`}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-indigo-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative z-[1] flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {featured ? (
                      <span className="job-meta-chip job-meta-chip--featured">Featured</span>
                    ) : null}
                    <span className="job-meta-chip job-meta-chip--category">{job.category}</span>
                    {job.department ? (
                      <span className="job-meta-chip job-meta-chip--soft">{job.department}</span>
                    ) : null}
                    <span className="job-meta-chip job-meta-chip--soft">{formatEmployment(job.employmentType)}</span>
                    <span className="job-meta-chip job-meta-chip--soft">{formatWorkMode(job.workMode)}</span>
                    <span className="job-meta-chip job-meta-chip--indigo">
                      {formatExperienceLevel(job.experienceLevel || 'any')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-slate-100">{job.title}</h3>
                  <p className="line-clamp-3 text-sm leading-relaxed text-slate-300">{jobCardTeaser(job)}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                    {job.location ? <span>{job.location}</span> : null}
                    {job.salaryHint ? <span className="font-medium text-slate-300">{job.salaryHint}</span> : null}
                    {deadline ? (
                      <span className={deadline.past ? 'font-medium text-rose-300/90' : 'font-medium text-emerald-300/90'}>
                        {deadline.past ? 'Closed ' : 'Apply by '}
                        {deadline.label}
                      </span>
                    ) : null}
                  </div>
                  <Link href={`/jobs/${job.id}`} className="btn btn-sm mt-1 w-fit">
                    View role & apply
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>

        {!loading && jobs.length === 0 ? (
          <p className="premium-empty-hint">
            No published roles match this filter yet.{' '}
            <span className="text-slate-300">Check back soon or contact us through the contact page.</span>
          </p>
        ) : null}
      </section>

      {isAuthenticated && mine.length > 0 ? (
        <section className="page-content-card space-y-5">
          <div>
            <p className="profile-panel-label">Pipeline</p>
            <h2 className="profile-panel-title">Your applications</h2>
            <p className="profile-panel-desc">Status, interview stage, and updates from the hiring team.</p>
          </div>
          <div className="grid gap-4">
            {mine.map((row) => {
              const expanded = openAppId === row.id;
              const msgCount = (row.applicantMessages || []).length;
              return (
                <motion.article key={row.id} layout className="jobs-application-card">
                  <button
                    type="button"
                    className="flex w-full flex-col gap-3 p-5 text-left md:flex-row md:items-center md:justify-between"
                    onClick={() => {
                      const next = expanded ? null : row.id;
                      setOpenAppId(next);
                      if (!expanded && row.unreadUpdates && token) {
                        markJobApplicationRead(row.id, token)
                          .then((upd) => {
                            if (upd) setMine((prev) => prev.map((p) => (p.id === upd.id ? { ...p, ...upd } : p)));
                          })
                          .catch(() => {});
                      }
                    }}
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/jobs/${row.jobId}`}
                          className="text-lg font-semibold text-slate-100 transition hover:text-cyan-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {row.jobTitle || 'Role'}
                        </Link>
                        {row.unreadUpdates ? <span className="job-meta-chip job-meta-chip--new">New</span> : null}
                      </div>
                      {row.jobCategory ? <p className="mt-1 text-xs text-slate-500">{row.jobCategory}</p> : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="job-meta-chip job-meta-chip--soft">{formatApplicationStatus(row.status)}</span>
                      {row.interviewRound && row.interviewRound !== 'none' ? (
                        <span className="job-meta-chip job-meta-chip--indigo">
                          {formatInterviewRound(row.interviewRound)}
                        </span>
                      ) : null}
                      {msgCount > 0 ? (
                        <span className="text-xs text-slate-500">
                          {msgCount} update{msgCount === 1 ? '' : 's'}
                        </span>
                      ) : null}
                      <span className="text-xs text-slate-500">
                        {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                  </button>
                  {expanded ? (
                    <div className="jobs-application-card__expand px-5 py-4">
                      {(row.applicantMessages || []).length === 0 ? (
                        <p className="text-sm text-slate-500">No messages from the team yet.</p>
                      ) : (
                        <ul className="space-y-3">
                          {(row.applicantMessages || []).map((m) => (
                            <li key={m.id} className="jobs-application-msg text-sm text-slate-200">
                              <p className="whitespace-pre-wrap">{m.body}</p>
                              <p className="mt-2 text-[10px] text-slate-500">
                                {m.sentAt ? new Date(m.sentAt).toLocaleString() : ''}
                              </p>
                            </li>
                          ))}
                        </ul>
                      )}
                      <Link href={`/jobs/${row.jobId}`} className="btn-secondary btn-sm mt-4 inline-flex">
                        Open role page
                      </Link>
                    </div>
                  ) : null}
                </motion.article>
              );
            })}
          </div>
        </section>
      ) : null}
    </main>
  );
}
