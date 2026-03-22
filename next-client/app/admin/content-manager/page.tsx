'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import ProtectedPage from '@/components/auth/ProtectedPage';
import { fetchSiteContentClient, updateSiteContent } from '@/lib/clientApi';
import { useAuth } from '@/context/AuthContext';

type LegalDocForm = {
  title: string;
  lastUpdated: string;
  content: string;
};

type LegalForms = {
  privacyPolicy: LegalDocForm;
  termsAndConditions: LegalDocForm;
  disclaimer: LegalDocForm;
};

type ExternalOptionsForm = {
  supportEmail: string;
  supportPhone: string;
  companyAddress: string;
  privacyPolicySourceUrl: string;
  termsSourceUrl: string;
  disclaimerSourceUrl: string;
};

const EMPTY_LEGAL_DOC: LegalDocForm = {
  title: '',
  lastUpdated: '',
  content: ''
};

const EMPTY_EXTERNAL_OPTIONS: ExternalOptionsForm = {
  supportEmail: '',
  supportPhone: '',
  companyAddress: '',
  privacyPolicySourceUrl: '',
  termsSourceUrl: '',
  disclaimerSourceUrl: ''
};

function toWordCount(text: string) {
  return String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function getLegalForms(content: Record<string, any>): LegalForms {
  const legal = content?.legalPages || {};
  return {
    privacyPolicy: {
      title: String(legal?.privacyPolicy?.title || 'Privacy Policy'),
      lastUpdated: String(legal?.privacyPolicy?.lastUpdated || 'March 2026'),
      content: String(legal?.privacyPolicy?.content || '')
    },
    termsAndConditions: {
      title: String(legal?.termsAndConditions?.title || 'Terms and Conditions'),
      lastUpdated: String(legal?.termsAndConditions?.lastUpdated || 'March 2026'),
      content: String(legal?.termsAndConditions?.content || '')
    },
    disclaimer: {
      title: String(legal?.disclaimer?.title || 'Disclaimer'),
      lastUpdated: String(legal?.disclaimer?.lastUpdated || 'March 2026'),
      content: String(legal?.disclaimer?.content || '')
    }
  };
}

function getExternalOptions(content: Record<string, any>): ExternalOptionsForm {
  const external = content?.legalPages?.externalOptions || {};
  return {
    supportEmail: String(external?.supportEmail || ''),
    supportPhone: String(external?.supportPhone || ''),
    companyAddress: String(external?.companyAddress || ''),
    privacyPolicySourceUrl: String(external?.privacyPolicySourceUrl || ''),
    termsSourceUrl: String(external?.termsSourceUrl || ''),
    disclaimerSourceUrl: String(external?.disclaimerSourceUrl || '')
  };
}

export default function AdminContentManagerPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<'json' | 'legal'>('legal');
  const [siteContent, setSiteContent] = useState<Record<string, any> | null>(null);
  const [jsonText, setJsonText] = useState('{}');
  const [legalForms, setLegalForms] = useState<LegalForms>({
    privacyPolicy: EMPTY_LEGAL_DOC,
    termsAndConditions: EMPTY_LEGAL_DOC,
    disclaimer: EMPTY_LEGAL_DOC
  });
  const [externalOptions, setExternalOptions] = useState<ExternalOptionsForm>(EMPTY_EXTERNAL_OPTIONS);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const content = await fetchSiteContentClient();
        setSiteContent(content);
        setJsonText(JSON.stringify(content, null, 2));
        setLegalForms(getLegalForms(content));
        setExternalOptions(getExternalOptions(content));
      } catch (err: any) {
        setError(err?.message || 'Unable to load content.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function onSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setSaving(true);
    setStatus('');
    setError('');
    try {
      const payload = JSON.parse(jsonText);
      const updated = await updateSiteContent(payload, token);
      setSiteContent(updated);
      setJsonText(JSON.stringify(updated, null, 2));
      setLegalForms(getLegalForms(updated));
      setExternalOptions(getExternalOptions(updated));
      setStatus('Content updated successfully.');
    } catch (err: any) {
      setError(err?.message || 'Invalid JSON or save failed.');
    } finally {
      setSaving(false);
    }
  }

  async function onSaveLegal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    if (!siteContent) return;
    setSaving(true);
    setStatus('');
    setError('');
    try {
      const payload = {
        ...siteContent,
        legalPages: {
          ...(siteContent.legalPages || {}),
          externalOptions: {
            supportEmail: externalOptions.supportEmail.trim(),
            supportPhone: externalOptions.supportPhone.trim(),
            companyAddress: externalOptions.companyAddress.trim(),
            privacyPolicySourceUrl: externalOptions.privacyPolicySourceUrl.trim(),
            termsSourceUrl: externalOptions.termsSourceUrl.trim(),
            disclaimerSourceUrl: externalOptions.disclaimerSourceUrl.trim()
          },
          privacyPolicy: {
            title: legalForms.privacyPolicy.title.trim() || 'Privacy Policy',
            lastUpdated: legalForms.privacyPolicy.lastUpdated.trim() || 'March 2026',
            content: legalForms.privacyPolicy.content.trim()
          },
          termsAndConditions: {
            title: legalForms.termsAndConditions.title.trim() || 'Terms and Conditions',
            lastUpdated: legalForms.termsAndConditions.lastUpdated.trim() || 'March 2026',
            content: legalForms.termsAndConditions.content.trim()
          },
          disclaimer: {
            title: legalForms.disclaimer.title.trim() || 'Disclaimer',
            lastUpdated: legalForms.disclaimer.lastUpdated.trim() || 'March 2026',
            content: legalForms.disclaimer.content.trim()
          }
        }
      };
      const updated = await updateSiteContent(payload, token);
      setSiteContent(updated);
      setJsonText(JSON.stringify(updated, null, 2));
      setLegalForms(getLegalForms(updated));
      setExternalOptions(getExternalOptions(updated));
      setStatus('Legal pages updated successfully.');
    } catch (err: any) {
      setError(err?.message || 'Unable to save legal pages.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedPage requireAdmin>
      <main className="app-page-shell">
      <section className="admin-shell">
        <article className="page-hero-shell space-y-3">
        <h1 className="section-title text-3xl font-extrabold md:text-5xl">Admin Content Manager</h1>
        <p className="text-slate-300">Manage full site content JSON and legal pages stored in database.</p>
        {loading ? <p className="text-slate-300">Loading content...</p> : null}
        <div className="admin-toolbar">
          <button className="admin-btn" type="button" onClick={() => setMode('legal')}>
            Legal Manage
          </button>
          <button className="admin-btn" type="button" onClick={() => setMode('json')}>
            JSON Manage
          </button>
        </div>
        </article>
        {mode === 'json' ? (
          <form className="page-content-card space-y-3" onSubmit={onSave}>
            <textarea
              rows={26}
              value={jsonText}
              onChange={(event) => setJsonText(event.target.value)}
              className="font-mono text-xs"
            />
            <button className="admin-btn" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Website Content'}
            </button>
          </form>
        ) : (
          <form className="page-content-card space-y-4" onSubmit={onSaveLegal}>
            <h2 className="text-xl font-semibold">Legal Manage</h2>
            <p className="text-sm text-slate-300">
              Recommended for AdSense policy review: keep each legal page above 600 words.
            </p>

            <div className="space-y-3">
              <h3 className="font-semibold">Privacy Policy</h3>
              <input
                value={legalForms.privacyPolicy.title}
                onChange={(event) =>
                  setLegalForms((prev) => ({
                    ...prev,
                    privacyPolicy: { ...prev.privacyPolicy, title: event.target.value }
                  }))
                }
                placeholder="Title"
              />
              <input
                value={legalForms.privacyPolicy.lastUpdated}
                onChange={(event) =>
                  setLegalForms((prev) => ({
                    ...prev,
                    privacyPolicy: { ...prev.privacyPolicy, lastUpdated: event.target.value }
                  }))
                }
                placeholder="Last updated"
              />
              <textarea
                rows={10}
                value={legalForms.privacyPolicy.content}
                onChange={(event) =>
                  setLegalForms((prev) => ({
                    ...prev,
                    privacyPolicy: { ...prev.privacyPolicy, content: event.target.value }
                  }))
                }
                placeholder="Policy content..."
              />
              <p className="text-xs text-slate-400">
                Word count: {toWordCount(legalForms.privacyPolicy.content)}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Terms & Conditions</h3>
              <input
                value={legalForms.termsAndConditions.title}
                onChange={(event) =>
                  setLegalForms((prev) => ({
                    ...prev,
                    termsAndConditions: { ...prev.termsAndConditions, title: event.target.value }
                  }))
                }
                placeholder="Title"
              />
              <input
                value={legalForms.termsAndConditions.lastUpdated}
                onChange={(event) =>
                  setLegalForms((prev) => ({
                    ...prev,
                    termsAndConditions: { ...prev.termsAndConditions, lastUpdated: event.target.value }
                  }))
                }
                placeholder="Last updated"
              />
              <textarea
                rows={10}
                value={legalForms.termsAndConditions.content}
                onChange={(event) =>
                  setLegalForms((prev) => ({
                    ...prev,
                    termsAndConditions: { ...prev.termsAndConditions, content: event.target.value }
                  }))
                }
                placeholder="Terms content..."
              />
              <p className="text-xs text-slate-400">
                Word count: {toWordCount(legalForms.termsAndConditions.content)}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Disclaimer</h3>
              <input
                value={legalForms.disclaimer.title}
                onChange={(event) =>
                  setLegalForms((prev) => ({
                    ...prev,
                    disclaimer: { ...prev.disclaimer, title: event.target.value }
                  }))
                }
                placeholder="Title"
              />
              <input
                value={legalForms.disclaimer.lastUpdated}
                onChange={(event) =>
                  setLegalForms((prev) => ({
                    ...prev,
                    disclaimer: { ...prev.disclaimer, lastUpdated: event.target.value }
                  }))
                }
                placeholder="Last updated"
              />
              <textarea
                rows={10}
                value={legalForms.disclaimer.content}
                onChange={(event) =>
                  setLegalForms((prev) => ({
                    ...prev,
                    disclaimer: { ...prev.disclaimer, content: event.target.value }
                  }))
                }
                placeholder="Disclaimer content..."
              />
              <p className="text-xs text-slate-400">
                Word count: {toWordCount(legalForms.disclaimer.content)}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">External Options (DB + Frontend)</h3>
              <p className="text-xs text-slate-400">
                These values are stored in database and displayed on frontend legal pages.
              </p>
              <input
                value={externalOptions.supportEmail}
                onChange={(event) => setExternalOptions((prev) => ({ ...prev, supportEmail: event.target.value }))}
                placeholder="Support email (example: support@novarosolution.com)"
              />
              <input
                value={externalOptions.supportPhone}
                onChange={(event) => setExternalOptions((prev) => ({ ...prev, supportPhone: event.target.value }))}
                placeholder="Support phone (optional)"
              />
              <input
                value={externalOptions.companyAddress}
                onChange={(event) => setExternalOptions((prev) => ({ ...prev, companyAddress: event.target.value }))}
                placeholder="Company address (optional)"
              />
              <input
                value={externalOptions.privacyPolicySourceUrl}
                onChange={(event) =>
                  setExternalOptions((prev) => ({ ...prev, privacyPolicySourceUrl: event.target.value }))
                }
                placeholder="Privacy policy external URL (optional)"
              />
              <input
                value={externalOptions.termsSourceUrl}
                onChange={(event) => setExternalOptions((prev) => ({ ...prev, termsSourceUrl: event.target.value }))}
                placeholder="Terms external URL (optional)"
              />
              <input
                value={externalOptions.disclaimerSourceUrl}
                onChange={(event) =>
                  setExternalOptions((prev) => ({ ...prev, disclaimerSourceUrl: event.target.value }))
                }
                placeholder="Disclaimer external URL (optional)"
              />
            </div>

            <button className="admin-btn" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Legal Content'}
            </button>
          </form>
        )}
        {status ? <p className="text-emerald-400">{status}</p> : null}
        {error ? <p className="text-red-400">{error}</p> : null}
        <Link className="admin-btn inline-block" href="/admin/dashboard">
          Back to dashboard
        </Link>
      </section>
      </main>
    </ProtectedPage>
  );
}
