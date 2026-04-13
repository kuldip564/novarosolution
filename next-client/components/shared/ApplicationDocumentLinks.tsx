'use client';

import { useCallback, useState } from 'react';
import { normalizeHttpUrl } from '@/lib/documentLinks';

type Item = {
  label: string;
  subtitle?: string;
  url: string;
};

function DocRow({ label, subtitle, url }: Item) {
  const [copied, setCopied] = useState(false);
  const safe = normalizeHttpUrl(url);

  const onCopy = useCallback(async () => {
    if (!safe) return;
    try {
      await navigator.clipboard.writeText(safe);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [safe]);

  if (!safe) return null;

  return (
    <div className="admin-doc-row">
      <div className="admin-doc-row__meta">
        <p className="admin-doc-row__label">{label}</p>
        {subtitle ? <p className="admin-doc-row__sub">{subtitle}</p> : null}
        <p className="admin-doc-row__url" title={safe}>
          {safe.length > 72 ? `${safe.slice(0, 68)}…` : safe}
        </p>
      </div>
      <div className="admin-doc-row__actions">
        <a href={safe} target="_blank" rel="noopener" className="admin-doc-row__btn admin-doc-row__btn--primary">
          Open
        </a>
        <button type="button" className="admin-doc-row__btn" onClick={onCopy}>
          {copied ? 'Copied' : 'Copy link'}
        </button>
      </div>
    </div>
  );
}

type Props = {
  resumeUrl?: string;
  additionalDocumentUrl?: string;
  additionalDocumentName?: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  /** Shown when nothing validates as a link */
  emptyMessage?: string;
};

export default function ApplicationDocumentLinks({
  resumeUrl,
  additionalDocumentUrl,
  additionalDocumentName,
  linkedInUrl,
  portfolioUrl,
  emptyMessage = 'No links or files on this application.'
}: Props) {
  const resume = normalizeHttpUrl(resumeUrl || '');
  const extra = normalizeHttpUrl(additionalDocumentUrl || '');
  const li = normalizeHttpUrl(linkedInUrl || '');
  const pf = normalizeHttpUrl(portfolioUrl || '');

  if (!resume && !extra && !li && !pf) {
    return <p className="admin-doc-empty">{emptyMessage}</p>;
  }

  return (
    <div className="admin-doc-stack">
      {resume ? (
        <DocRow label="Resume" subtitle="PDF, Word, or hosted file" url={resumeUrl || ''} />
      ) : null}
      {extra ? (
        <DocRow label={additionalDocumentName?.trim() || 'Additional file'} subtitle="Supporting document" url={additionalDocumentUrl || ''} />
      ) : null}
      {li ? <DocRow label="LinkedIn" url={linkedInUrl || ''} /> : null}
      {pf ? <DocRow label="Portfolio" url={portfolioUrl || ''} /> : null}
    </div>
  );
}
