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
      <section className="premium-page-hero relative space-y-4 px-6 py-10 md:px-10">
        <div className="relative z-[1] space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400/90">Careers</p>
          <h1 className="section-title text-3xl font-extrabold md:text-5xl">Build with us</h1>
          <p className="max-w-2xl text-slate-300">
            Explore open roles across design, engineering, and operations. Sign in to apply and track your applications
            in one place.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/" className="btn-secondary inline-flex">
              Back to home
            </Link>
            {!isAuthenticated ? (
              <Link href="/login" className="btn inline-flex">
                Sign in to apply
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mt-12 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Open positions</h2>
            <p className="text-sm text-slate-400">Featured roles first · filter by category.</p>
          </div>
          <label className="flex flex-col gap-1 text-sm text-slate-300">
            <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="min-w-[200px] rounded-xl border border-white/15 bg-[var(--surface-strong)] px-4 py-2.5 text-slate-100 outline-none focus:border-[var(--primary)]"
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

        {loading ? <p className="text-slate-400">Refreshing listings…</p> : null}

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
              className={`careers-card group relative overflow-hidden rounded-2xl border bg-gradient-to-br from-white/[0.08] to-transparent p-6 shadow-[0_18px_60px_rgba(15,23,42,0.35)] ${
                featured
                  ? 'border-amber-400/35 ring-1 ring-amber-400/20'
                  : 'border-white/10'
              }`}
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-indigo-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {featured ? (
                    <span className="rounded-full bg-amber-500/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-100">
                      Featured
                    </span>
                  ) : null}
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-cyan-200">{job.category}</span>
                  {job.department ? (
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">{job.department}</span>
                  ) : null}
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                    {formatEmployment(job.employmentType)}
                  </span>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                    {formatWorkMode(job.workMode)}
                  </span>
                  <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-100">
                    {formatExperienceLevel(job.experienceLevel || 'any')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-50">{job.title}</h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-slate-300">{jobCardTeaser(job)}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                  {job.location ? <span>{job.location}</span> : null}
                  {job.salaryHint ? <span className="text-slate-300">{job.salaryHint}</span> : null}
                  {deadline ? (
                    <span
                      className={
                        deadline.past ? 'text-rose-300/90' : 'text-emerald-300/90'
                      }
                    >
                      {deadline.past ? 'Closed ' : 'Apply by '}
                      {deadline.label}
                    </span>
                  ) : null}
                </div>
                <Link
                  href={`/careers/${job.id}`}
                  className="btn mt-2 inline-flex w-fit"
                >
                  View role & apply
                </Link>
              </div>
            </motion.article>
          );})}
        </div>

        {!loading && jobs.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center text-slate-400">
            No published roles match this filter yet.{' '}
            <span className="text-slate-300">Check back soon or contact us through the contact page.</span>
          </p>
        ) : null}
      </section>

      {isAuthenticated && mine.length > 0 ? (
        <section className="mt-14 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Your applications</h2>
            <p className="text-sm text-slate-400">Track status, interview stage, and messages from the hiring team.</p>
          </div>
          <div className="grid gap-4">
            {mine.map((row) => {
              const expanded = openAppId === row.id;
              const msgCount = (row.applicantMessages || []).length;
              return (
                <motion.article
                  key={row.id}
                  layout
                  className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent"
                >
                  <button
                    type="button"
                    className="flex w-full flex-col gap-3 p-5 text-left md:flex-row md:items-center md:justify-between"
                    onClick={() => {
                      const next = expanded ? null : row.id;
                      setOpenAppId(next);
                      if (!expanded && row.unreadUpdates && token) {
                        markJobApplicationRead(row.id, token)
                          .then((upd) => {
                            if (upd)
                              setMine((prev) => prev.map((p) => (p.id === upd.id ? { ...p, ...upd } : p)));
                          })
                          .catch(() => {});
                      }
                    }}
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/careers/${row.jobId}`}
                          className="text-lg font-semibold text-slate-50 hover:text-cyan-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {row.jobTitle || 'Role'}
                        </Link>
                        {row.unreadUpdates ? (
                          <span className="rounded-full bg-rose-500/30 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-rose-100">
                            New
                          </span>
                        ) : null}
                      </div>
                      {row.jobCategory ? <p className="text-xs text-slate-500">{row.jobCategory}</p> : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
                        {formatApplicationStatus(row.status)}
                      </span>
                      {row.interviewRound && row.interviewRound !== 'none' ? (
                        <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-100">
                          {formatInterviewRound(row.interviewRound)}
                        </span>
                      ) : null}
                      {msgCount > 0 ? (
                        <span className="text-xs text-slate-500">{msgCount} update{msgCount === 1 ? '' : 's'}</span>
                      ) : null}
                      <span className="text-xs text-slate-500">
                        {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                  </button>
                  {expanded ? (
                    <div className="border-t border-white/10 bg-black/20 px-5 py-4">
                      {(row.applicantMessages || []).length === 0 ? (
                        <p className="text-sm text-slate-500">No messages from the team yet.</p>
                      ) : (
                        <ul className="space-y-3">
                          {(row.applicantMessages || []).map((m) => (
                            <li key={m.id} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200">
                              <p className="whitespace-pre-wrap">{m.body}</p>
                              <p className="mt-2 text-[10px] text-slate-500">
                                {m.sentAt ? new Date(m.sentAt).toLocaleString() : ''}
                              </p>
                            </li>
                          ))}
                        </ul>
                      )}
                      <Link href={`/careers/${row.jobId}`} className="btn-secondary mt-4 inline-flex text-sm">
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
