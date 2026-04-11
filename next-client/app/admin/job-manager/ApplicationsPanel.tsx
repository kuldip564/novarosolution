'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import {
  AdminJobApplicantDetail,
  JobApplicationRow,
  PublicJob,
  fetchAdminJobApplicationDetail,
  fetchAdminJobApplications,
  updateAdminJobApplication
} from '@/lib/clientApi';
import { formatApplicationStatus, formatInterviewRound } from '@/components/careers/interviewLabels';

const STATUS_OPTIONS: JobApplicationRow['status'][] = [
  'pending',
  'reviewing',
  'shortlisted',
  'interview',
  'offer',
  'rejected',
  'hired'
];

const INTERVIEW_OPTIONS: string[] = [
  'none',
  'screening',
  'technical',
  'system_design',
  'behavioral',
  'final',
  'offer'
];

function safeHttpUrl(raw: string) {
  const t = String(raw || '').trim();
  if (!t) return '';
  try {
    const u = new URL(t);
    if (u.protocol === 'http:' || u.protocol === 'https:') return u.href;
  } catch {
    return '';
  }
  return '';
}

type Props = {
  token: string;
  jobs: PublicJob[];
  saving: boolean;
  setSaving: (v: boolean) => void;
  setError: (v: string) => void;
  setNotice: (v: string) => void;
};

export default function ApplicationsPanel({ token, jobs, saving, setSaving, setError, setNotice }: Props) {
  const [applications, setApplications] = useState<JobApplicationRow[]>([]);
  const [appPage, setAppPage] = useState(1);
  const [appTotalPages, setAppTotalPages] = useState(1);
  const [filterJobId, setFilterJobId] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchApplicants, setSearchApplicants] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdminJobApplicantDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [messageDraft, setMessageDraft] = useState('');

  const loadApplications = useCallback(
    async (page = 1) => {
      const result = await fetchAdminJobApplications(token, {
        page,
        limit: 15,
        jobId: filterJobId || undefined,
        status: filterStatus || undefined,
        q: searchApplicants.trim() || undefined
      });
      setApplications(result.items);
      setAppPage(result.page);
      setAppTotalPages(result.totalPages);
    },
    [token, filterJobId, filterStatus, searchApplicants]
  );

  useEffect(() => {
    loadApplications(1).catch((err: any) => setError(err?.message || 'Unable to load applications.'));
  }, [loadApplications, setError]);

  async function loadDetail(id: string) {
    setDetailLoading(true);
    setError('');
    try {
      const d = await fetchAdminJobApplicationDetail(id, token);
      setDetail(d);
      setMessageDraft('');
    } catch (err: any) {
      setError(err?.message || 'Unable to load applicant.');
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  }

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    loadDetail(selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, token]);

  async function refreshAll() {
    await loadApplications(appPage);
    if (selectedId) await loadDetail(selectedId);
  }

  async function onPatch(payload: Parameters<typeof updateAdminJobApplication>[1]) {
    if (!selectedId) return;
    setSaving(true);
    setError('');
    try {
      await updateAdminJobApplication(selectedId, payload, token);
      setNotice('Saved.');
      await refreshAll();
    } catch (err: any) {
      setError(err?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  }

  function onSendMessage(event: FormEvent) {
    event.preventDefault();
    const text = messageDraft.trim();
    if (!text) return;
    onPatch({ appendApplicantMessage: text });
  }

  const jobOptions = jobs.map((j) => (
    <option key={j.id} value={j.id}>
      {j.title}
    </option>
  ));

  const app = detail?.application;
  const user = detail?.user;
  const job = detail?.job;

  return (
    <div className="grid min-h-[560px] gap-6 lg:grid-cols-[minmax(280px,340px)_1fr]">
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-[var(--surface)]/30 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
        <div className="border-b border-white/10 pb-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">Pipeline</p>
          <p className="mt-1 text-sm text-slate-500">Search and filter applicants.</p>
        </div>
        <div>
          <label className="flex flex-col gap-1 text-xs text-slate-400">
            Search name or email
            <div className="flex gap-2">
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setSearchApplicants(searchInput);
                }}
                placeholder="Type and press Enter"
                className="flex-1 rounded-lg border border-white/15 bg-black/25 px-3 py-2 text-sm text-slate-100"
              />
              <button
                type="button"
                className="admin-btn shrink-0 px-3 py-2 text-xs"
                onClick={() => setSearchApplicants(searchInput)}
              >
                Go
              </button>
            </div>
          </label>
        </div>
        <label className="flex flex-col gap-1 text-xs text-slate-400">
          Job
          <select
            className="rounded-lg border border-white/15 bg-black/25 px-3 py-2 text-sm"
            value={filterJobId}
            onChange={(e) => setFilterJobId(e.target.value)}
          >
            <option value="">All jobs</option>
            {jobOptions}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-400">
          Status
          <select
            className="rounded-lg border border-white/15 bg-black/25 px-3 py-2 text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {formatApplicationStatus(s)}
              </option>
            ))}
          </select>
        </label>

        <div className="max-h-[420px] flex-1 space-y-2 overflow-y-auto pr-1">
          {applications.map((row) => (
            <button
              key={row.id}
              type="button"
              onClick={() => setSelectedId(row.id)}
              className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                selectedId === row.id
                  ? 'border-cyan-500/50 bg-cyan-500/10'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20'
              }`}
            >
              <div className="flex items-start gap-2">
                {row.userAvatarUrl ? (
                  <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={row.userAvatarUrl} alt="" className="h-full w-full object-cover" />
                  </span>
                ) : (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-slate-200">
                    {(row.userName || row.applicantName || '?').slice(0, 1).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-100">{row.userName || row.applicantName}</p>
                  <p className="truncate text-xs text-slate-500">{row.userEmail || row.applicantEmail}</p>
                  <p className="mt-1 truncate text-xs text-cyan-200/90">{row.jobTitle}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
                      {formatApplicationStatus(row.status)}
                    </span>
                    {row.interviewRound && row.interviewRound !== 'none' ? (
                      <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] text-indigo-200">
                        {formatInterviewRound(row.interviewRound)}
                      </span>
                    ) : null}
                    {row.unreadUpdates ? (
                      <span className="rounded-full bg-rose-500/30 px-2 py-0.5 text-[10px] text-rose-100">Msg</span>
                    ) : null}
                  </div>
                </div>
              </div>
            </button>
          ))}
          {applications.length === 0 ? <p className="text-sm text-slate-500">No applications match.</p> : null}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-white/10 pt-3 text-xs">
          <button
            type="button"
            className="btn-secondary px-2 py-1"
            disabled={appPage <= 1 || saving}
            onClick={() => loadApplications(appPage - 1)}
          >
            Prev
          </button>
          <span className="text-slate-500">
            {appPage} / {appTotalPages}
          </span>
          <button
            type="button"
            className="btn-secondary px-2 py-1"
            disabled={appPage >= appTotalPages || saving}
            onClick={() => loadApplications(appPage + 1)}
          >
            Next
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent p-5 shadow-[0_24px_60px_rgba(0,0,0,0.28)] md:p-6">
        {!selectedId ? (
          <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center text-slate-500">
            <p className="text-lg font-medium text-slate-400">Select an applicant</p>
            <p className="mt-2 max-w-sm text-sm">View full profile, interview stage, and send updates the candidate will see in their account.</p>
          </div>
        ) : detailLoading ? (
          <p className="text-slate-400">Loading applicant…</p>
        ) : app && user && job ? (
          <div className="space-y-6">
            <header className="flex flex-col gap-4 border-b border-white/10 pb-4 md:flex-row md:items-start md:justify-between">
              <div className="flex gap-4">
                {user.avatarUrl ? (
                  <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
                  </span>
                ) : (
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl font-bold">
                    {user.name.slice(0, 1).toUpperCase()}
                  </span>
                )}
                <div>
                  <h2 className="text-xl font-bold text-slate-50">{user.name}</h2>
                  <p className="text-sm text-slate-400">{user.email}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'} · Role{' '}
                    <span className="text-slate-300">{user.role}</span>
                    {user.isActive === false ? <span className="ml-2 text-amber-400">(inactive)</span> : null}
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500">Position</p>
                <p className="font-semibold text-cyan-100">{job.title}</p>
                <p className="text-xs text-slate-500">
                  {job.category} · {job.location || 'Remote flexible'}
                </p>
              </div>
            </header>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-slate-400">Pipeline status</span>
                <select
                  className="rounded-xl border border-white/15 bg-black/30 px-3 py-2.5"
                  value={app.status}
                  disabled={saving}
                  onChange={(e) => onPatch({ status: e.target.value as JobApplicationRow['status'] })}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {formatApplicationStatus(s)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-slate-400">Interview round</span>
                <select
                  className="rounded-xl border border-white/15 bg-black/30 px-3 py-2.5"
                  value={app.interviewRound || 'none'}
                  disabled={saving}
                  onChange={(e) => onPatch({ interviewRound: e.target.value })}
                >
                  {INTERVIEW_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {formatInterviewRound(r)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Application</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{app.coverLetter}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs">
                {app.phone ? <span className="text-slate-400">Phone: {app.phone}</span> : null}
                {app.yearsExperience ? <span className="text-slate-400">Exp: {app.yearsExperience}</span> : null}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {safeHttpUrl(app.linkedInUrl || '') ? (
                  <a
                    href={safeHttpUrl(app.linkedInUrl || '')}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-cyan-300 hover:bg-white/15"
                  >
                    LinkedIn
                  </a>
                ) : null}
                {safeHttpUrl(app.portfolioUrl || '') ? (
                  <a
                    href={safeHttpUrl(app.portfolioUrl || '')}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-cyan-300 hover:bg-white/15"
                  >
                    Portfolio
                  </a>
                ) : null}
                {safeHttpUrl(app.resumeUrl || '') ? (
                  <a
                    href={safeHttpUrl(app.resumeUrl || '')}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-cyan-300 hover:bg-white/15"
                  >
                    Resume
                  </a>
                ) : null}
              </div>
            </div>

            <label className="block text-sm">
              <span className="text-slate-400">Internal notes (not visible to candidate)</span>
              <textarea
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
                rows={3}
                defaultValue={app.adminNote || ''}
                onBlur={(e) => {
                  const next = e.target.value.trim();
                  if (next !== (app.adminNote || '')) onPatch({ adminNote: next });
                }}
              />
            </label>

            <div>
              <p className="text-sm font-semibold text-slate-200">Messages to candidate</p>
              <p className="text-xs text-slate-500">These appear on their Careers page and job application view.</p>
              <div className="mt-3 max-h-48 space-y-3 overflow-y-auto rounded-xl border border-white/10 bg-black/25 p-3">
                {(app.applicantMessages || []).length === 0 ? (
                  <p className="text-sm text-slate-500">No messages yet.</p>
                ) : (
                  (app.applicantMessages || []).map((m) => (
                    <div key={m.id} className="rounded-lg border border-white/5 bg-white/[0.04] p-3 text-sm">
                      <p className="whitespace-pre-wrap text-slate-200">{m.body}</p>
                      <p className="mt-2 text-[10px] text-slate-500">
                        {m.sentAt ? new Date(m.sentAt).toLocaleString() : ''}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={onSendMessage} className="mt-3 flex flex-col gap-2 sm:flex-row">
                <textarea
                  value={messageDraft}
                  onChange={(e) => setMessageDraft(e.target.value)}
                  placeholder="e.g. You are invited to Round 2 on Tuesday 3pm IST (link in email)."
                  className="min-h-[80px] flex-1 rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
                />
                <button type="submit" className="admin-btn h-fit shrink-0 self-end px-4 py-2" disabled={saving || !messageDraft.trim()}>
                  Send update
                </button>
              </form>
            </div>
          </div>
        ) : (
          <p className="text-slate-500">Could not load this application.</p>
        )}
      </div>
    </div>
  );
}
