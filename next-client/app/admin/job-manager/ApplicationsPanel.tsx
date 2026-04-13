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
import SafeImage from '@/components/ui/SafeImage';
import ApplicationDocumentLinks from '@/components/shared/ApplicationDocumentLinks';

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
    <div className="applications-panel applications-panel--prime">
      <div className="applications-panel__surface applications-panel__surface--sidebar">
        <div className="applications-panel__head applications-panel__head--minimal">
          <p className="applications-panel__eyebrow">Inbox</p>
        </div>
        <div>
          <label className="applications-panel__label">
            Search
            <div className="applications-panel__search-row">
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setSearchApplicants(searchInput);
                }}
                placeholder="Name or email · Enter"
                className="applications-panel__control"
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
        <label className="applications-panel__label">
          Job
          <select
            className="applications-panel__control"
            value={filterJobId}
            onChange={(e) => setFilterJobId(e.target.value)}
          >
            <option value="">All jobs</option>
            {jobOptions}
          </select>
        </label>
        <label className="applications-panel__label">
          Status
          <select
            className="applications-panel__control"
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

        <div className="applications-panel__list">
          {applications.map((row) => (
            <button
              key={row.id}
              type="button"
              onClick={() => setSelectedId(row.id)}
              className={
                selectedId === row.id
                  ? 'applications-panel__applicant applications-panel__applicant--selected'
                  : 'applications-panel__applicant'
              }
            >
              <div className="flex items-start gap-2">
                {row.userAvatarUrl ? (
                  <span className="applications-panel__avatar applications-panel__avatar--photo relative">
                    <SafeImage
                      src={row.userAvatarUrl}
                      alt={row.userName || row.applicantName ? `Avatar of ${row.userName || row.applicantName}` : 'Applicant avatar'}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </span>
                ) : (
                  <span className="applications-panel__avatar">
                    {(row.userName || row.applicantName || '?').slice(0, 1).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium admin-theme-text">{row.userName || row.applicantName}</p>
                  <p className="truncate text-xs admin-theme-muted">{row.userEmail || row.applicantEmail}</p>
                  <p className="applications-panel__job-line truncate">{row.jobTitle}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <span className="applications-panel__pill">{formatApplicationStatus(row.status)}</span>
                    {row.interviewRound && row.interviewRound !== 'none' ? (
                      <span className="applications-panel__pill applications-panel__pill--round">
                        {formatInterviewRound(row.interviewRound)}
                      </span>
                    ) : null}
                    {row.unreadUpdates ? <span className="applications-panel__pill applications-panel__pill--msg">Msg</span> : null}
                  </div>
                </div>
              </div>
            </button>
          ))}
          {applications.length === 0 ? <p className="text-sm admin-theme-muted">No results.</p> : null}
        </div>

        <div className="applications-panel__footer">
          <button
            type="button"
            className="btn-secondary px-2 py-1"
            disabled={appPage <= 1 || saving}
            onClick={() => loadApplications(appPage - 1)}
          >
            Prev
          </button>
          <span className="admin-theme-muted">
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

      <div className="applications-panel__surface applications-panel__surface--detail">
        {!selectedId ? (
          <div className="applications-panel__detail-empty">
            <p>Select a candidate</p>
          </div>
        ) : detailLoading ? (
          <p className="admin-theme-muted">Loading applicant…</p>
        ) : app && user && job ? (
          <div className="space-y-5">
            <header className="applications-panel__detail-header">
              <div className="flex gap-4">
                {user.avatarUrl ? (
                  <span className="applications-panel__avatar applications-panel__avatar--lg applications-panel__avatar--photo relative">
                    <SafeImage
                      src={user.avatarUrl}
                      alt={user.name ? `Profile photo of ${user.name}` : 'Applicant profile photo'}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </span>
                ) : (
                  <span className="applications-panel__avatar applications-panel__avatar--lg">{user.name.slice(0, 1).toUpperCase()}</span>
                )}
                <div>
                  <h2 className="text-xl font-bold admin-theme-text">{user.name}</h2>
                  <p className="text-sm admin-theme-muted">{user.email}</p>
                  <p className="mt-1 text-xs admin-theme-subtle">
                    Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'} · Role{' '}
                    <span className="admin-theme-text">{user.role}</span>
                    {user.isActive === false ? <span className="ml-2 admin-theme-warn">(inactive)</span> : null}
                  </p>
                </div>
              </div>
              <div className="applications-panel__position-box">
                <p className="applications-panel__eyebrow">Role</p>
                <p className="applications-panel__position-title">{job.title}</p>
                <p className="mt-1 text-xs admin-theme-muted">
                  {job.category} · {job.location || 'Remote flexible'}
                </p>
              </div>
            </header>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="admin-theme-muted">Status</span>
                <select
                  className="applications-panel__control py-2.5"
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
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="admin-theme-muted">Round</span>
                <select
                  className="applications-panel__control py-2.5"
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

            <div className="applications-panel__block">
              <p className="applications-panel__eyebrow">Application</p>
              <p className="mt-2 whitespace-pre-wrap text-sm admin-theme-text">{app.coverLetter}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs admin-theme-muted">
                {app.phone ? <span>Phone: {app.phone}</span> : null}
                {app.yearsExperience ? <span>Exp: {app.yearsExperience}</span> : null}
              </div>
              <div className="mt-4">
                <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] admin-theme-muted">
                  Resume & links
                </p>
                <ApplicationDocumentLinks
                  resumeUrl={app.resumeUrl}
                  additionalDocumentUrl={app.additionalDocumentUrl}
                  additionalDocumentName={app.additionalDocumentName}
                  linkedInUrl={app.linkedInUrl}
                  portfolioUrl={app.portfolioUrl}
                />
              </div>
            </div>

            <label className="block text-sm">
              <span className="admin-theme-muted">Internal notes</span>
              <textarea
                className="applications-panel__control mt-2 w-full resize-y"
                rows={3}
                defaultValue={app.adminNote || ''}
                onBlur={(e) => {
                  const next = e.target.value.trim();
                  if (next !== (app.adminNote || '')) onPatch({ adminNote: next });
                }}
              />
            </label>

            <div>
              <p className="text-sm font-semibold admin-theme-text">Candidate messages</p>
              <div className="applications-panel__messages mt-2">
                {(app.applicantMessages || []).length === 0 ? (
                  <p className="text-sm admin-theme-muted">No messages yet.</p>
                ) : (
                  (app.applicantMessages || []).map((m) => (
                    <div key={m.id} className="applications-panel__message-item mb-3 last:mb-0">
                      <p>{m.body}</p>
                      <p>{m.sentAt ? new Date(m.sentAt).toLocaleString() : ''}</p>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={onSendMessage} className="applications-panel__form-row">
                <textarea
                  value={messageDraft}
                  onChange={(e) => setMessageDraft(e.target.value)}
                  placeholder="Update for the candidate…"
                  className="applications-panel__control applications-panel__control--textarea flex-1"
                />
                <button type="submit" className="admin-btn h-fit shrink-0 self-end px-4 py-2" disabled={saving || !messageDraft.trim()}>
                  Send update
                </button>
              </form>
            </div>
          </div>
        ) : (
          <p className="admin-theme-muted">Could not load this application.</p>
        )}
      </div>
    </div>
  );
}
