import type { Metadata } from 'next';
import { fetchSiteContent } from '@/lib/api';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Disclaimer | Novaro Solution',
  description:
    'Read important disclaimers related to informational content, external links, ads, and liability limits on Novaro Solution.',
  keywords: ['disclaimer', 'liability notice', 'ads disclaimer', 'content disclaimer'],
  path: '/disclaimer'
});

function renderManagedContent(rawContent: string) {
  const safeHtml = String(rawContent || '')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, '')
    .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, '')
    .replace(/javascript:/gi, '');
  if (/<[a-z][\s\S]*>/i.test(safeHtml)) {
    return <div className="legal-html" dangerouslySetInnerHTML={{ __html: safeHtml }} />;
  }
  const blocks = String(rawContent || '')
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
  return blocks.map((block, index) => <p key={`${index}-${block.slice(0, 16)}`}>{block}</p>);
}

function renderExternalOptions(external: Record<string, any>, urlKey: 'privacyPolicySourceUrl' | 'termsSourceUrl' | 'disclaimerSourceUrl') {
  const sourceUrl = String(external?.[urlKey] || '').trim();
  const supportEmail = String(external?.supportEmail || '').trim();
  const supportPhone = String(external?.supportPhone || '').trim();
  const companyAddress = String(external?.companyAddress || '').trim();
  if (!sourceUrl && !supportEmail && !supportPhone && !companyAddress) return null;

  return (
    <section className="page-content-card space-y-2 legal-copy">
      <h2>External Information</h2>
      {sourceUrl ? (
        <p>
          Source reference:{' '}
          <a href={sourceUrl} target="_blank" rel="noreferrer noopener" className="underline">
            {sourceUrl}
          </a>
        </p>
      ) : null}
      {supportEmail ? (
        <p>
          Support email:{' '}
          <a href={`mailto:${supportEmail}`} className="underline">
            {supportEmail}
          </a>
        </p>
      ) : null}
      {supportPhone ? <p>Support phone: {supportPhone}</p> : null}
      {companyAddress ? <p>Address: {companyAddress}</p> : null}
    </section>
  );
}

export default async function DisclaimerPage() {
  const siteContent = await fetchSiteContent({ noStore: true }).catch(() => ({} as any));
  const managed = (siteContent as any)?.legalPages?.disclaimer || null;
  const external = (siteContent as any)?.legalPages?.externalOptions || {};

  if (managed && (managed?.title || managed?.lastUpdated || managed?.content)) {
    return (
      <main className="app-page-shell">
        <section className="premium-page-hero space-y-3">
          <h1 className="section-title text-3xl font-extrabold md:text-5xl">{String(managed?.title || 'Disclaimer')}</h1>
          <p className="text-slate-300">Last updated: {String(managed?.lastUpdated || 'March 2026')}</p>
        </section>
        <article className="page-content-card space-y-4 legal-copy">
          {String(managed.content || '').trim()
            ? renderManagedContent(String(managed.content))
            : <p>No disclaimer content has been configured yet.</p>}
        </article>
        {renderExternalOptions(external, 'disclaimerSourceUrl')}
      </main>
    );
  }

  return (
    <main className="app-page-shell">
      <section className="premium-page-hero space-y-3">
        <h1 className="section-title text-3xl font-extrabold md:text-5xl">Disclaimer</h1>
        <p className="text-slate-300">Last updated: March 2026</p>
      </section>

      <article className="page-content-card space-y-4 legal-copy">
        <h2>General Information Notice</h2>
        <p>
          The information on this website is provided for general informational and business communication purposes.
          While we aim to keep all content accurate and current, we make no guarantees that every page, article, or
          statement is complete, error-free, or suitable for every use case. You should evaluate all information
          independently before making business, legal, technical, or financial decisions.
        </p>

        <h2>No Professional Advice</h2>
        <p>
          Website content, blog posts, examples, and checklists do not constitute legal, accounting, tax, investment,
          medical, or regulated professional advice. Service recommendations are context-dependent and should be
          validated against your own operational, legal, and compliance requirements.
        </p>

        <h2>Project and Delivery Statements</h2>
        <p>
          Any references to timelines, costs, architecture, performance gains, or expected outcomes are illustrative
          unless explicitly documented in a signed contract. Actual results vary based on project scope, third-party
          dependencies, infrastructure, and governance constraints.
        </p>

        <h2>Third-Party Content and Links</h2>
        <p>
          Our site may link to third-party platforms, tools, resources, or social networks. We do not control and are
          not responsible for their availability, security, policy updates, or content accuracy. Visiting third-party
          websites is at your own discretion and governed by their terms.
        </p>

        <h2>Advertising Disclaimer</h2>
        <p>
          This website may display advertisements through Google AdSense or similar providers. Ads are supplied by
          third parties and do not imply endorsement, guarantee, or recommendation by Novaro Solution. We are not
          responsible for claims, offers, product quality, or outcomes related to advertised goods and services.
        </p>
        <p>
          Ad visibility may depend on consent choices, geolocation, and platform policies. We label ad areas to
          maintain transparency and avoid misleading interactions.
        </p>

        <h2>Availability and Technical Errors</h2>
        <p>
          We do not guarantee uninterrupted access to the site. Maintenance windows, security updates, third-party
          outages, or network issues may affect availability or performance. We reserve the right to modify or remove
          content and features without prior notice.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by applicable law, Novaro Solution will not be liable for direct, indirect,
          incidental, consequential, or special damages arising from website use, reliance on published content,
          advertising interactions, or inability to access the website.
        </p>

        <h2>User Responsibility</h2>
        <p>
          You are responsible for how you interpret and use website content. Before implementing technical, legal, or
          strategic actions based on website information, seek appropriate independent validation and qualified advice.
        </p>

        <h2>Contact for Clarification</h2>
        <p>
          If you need clarification regarding any statement on this website, use our Contact page and include the
          subject line &quot;Disclaimer Clarification&quot; so we can respond quickly.
        </p>
      </article>
    </main>
  );
}
