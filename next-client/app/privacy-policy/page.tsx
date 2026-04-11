import type { Metadata } from 'next';
import { fetchSiteContent } from '@/lib/api';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy | Novaro Solution',
  description:
    'Read how Novaro Solution collects, uses, stores, and protects personal data, including cookie usage and Google AdSense disclosures.',
  keywords: ['privacy policy', 'cookies', 'google adsense privacy', 'data protection'],
  path: '/privacy-policy'
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

export default async function PrivacyPolicyPage() {
  const siteContent = await fetchSiteContent({ noStore: true }).catch(() => ({} as any));
  const managed = (siteContent as any)?.legalPages?.privacyPolicy || null;
  const external = (siteContent as any)?.legalPages?.externalOptions || {};

  if (managed && (managed?.title || managed?.lastUpdated || managed?.content)) {
    return (
      <main className="app-page-shell">
        <section className="premium-page-hero space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-400/90">Legal</p>
          <h1 className="section-title text-3xl font-extrabold md:text-5xl">
            {String(managed?.title || 'Privacy Policy')}
          </h1>
          <p className="text-slate-300">Last updated: {String(managed?.lastUpdated || 'March 2026')}</p>
        </section>
        <article className="page-content-card space-y-4 legal-copy">
          {String(managed.content || '').trim()
            ? renderManagedContent(String(managed.content))
            : <p>No privacy policy content has been configured yet.</p>}
        </article>
        {renderExternalOptions(external, 'privacyPolicySourceUrl')}
      </main>
    );
  }

  return (
    <main className="app-page-shell">
      <section className="premium-page-hero space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-400/90">Legal</p>
        <h1 className="section-title text-3xl font-extrabold md:text-5xl">Privacy Policy</h1>
        <p className="text-slate-300">Last updated: March 2026</p>
      </section>

      <article className="page-content-card space-y-4 legal-copy">
        <h2>Who We Are</h2>
        <p>
          Novaro Solution provides digital product services, including UI/UX design, web development, mobile
          development, and related consulting. This Privacy Policy explains what information we collect when you visit
          our website, submit forms, or engage with our services, and how we use and protect that information.
        </p>

        <h2>Information We Collect</h2>
        <p>
          We may collect personal details such as your name, email address, message content, and project requirements
          when you contact us or submit requests through forms. We also collect technical information automatically,
          such as browser type, device details, approximate location, referral source, pages visited, and session
          behavior. This helps us improve website security, performance, and user experience.
        </p>
        <p>
          We do not intentionally collect sensitive personal data unless you voluntarily provide it in a support
          message. We request that users avoid sharing confidential legal, financial, or health information through
          standard website forms.
        </p>

        <h2>How We Use Data</h2>
        <p>
          We use collected information to respond to inquiries, deliver requested services, improve website
          functionality, monitor uptime and abuse, analyze traffic trends, and support advertising operations. We may
          also use contact information to communicate project updates, policy notices, or account-related
          notifications. We do not sell personal data to third parties.
        </p>

        <h2>Cookies and Similar Technologies</h2>
        <p>
          Our website uses essential cookies for core functionality, including authentication state, security checks,
          and performance stability. We may also use analytics and advertising cookies to understand traffic and show
          relevant ads. On your first visit, we provide a cookie choice banner so you can accept or reject optional
          cookies.
        </p>
        <p>
          Essential cookies remain active because they are required for secure operation. Optional cookies are used
          only according to your consent choice. You can update your preference later through the cookie settings link
          in our footer.
        </p>

        <h2>Google Analytics and Google AdSense</h2>
        <p>
          We use Google services to understand traffic and support ad monetization. Google Analytics helps us review
          aggregate behavior such as page visits, device categories, and engagement quality. Google AdSense may use
          cookies to display ads based on your visits to this and other websites, subject to your consent where
          applicable and regional law.
        </p>
        <p>
          Google and its partners may use advertising cookies for ad personalization and measurement. You can learn
          more about Google data practices in Google Privacy & Terms and Ads Settings. If you reject optional cookies,
          personalized ad features and related measurement may be limited or disabled.
        </p>

        <h2>Data Sharing</h2>
        <p>
          We share data only when necessary for service operation, legal compliance, fraud prevention, and security.
          Examples include hosting providers, analytics providers, anti-abuse tooling, and regulated law-enforcement
          requests. All sharing is limited to the minimum information needed for the relevant purpose.
        </p>

        <h2>Data Retention</h2>
        <p>
          We retain contact submissions and operational logs only as long as needed for support, legal, and business
          requirements. Data no longer needed is deleted or anonymized according to reasonable retention schedules.
        </p>

        <h2>Security Practices</h2>
        <p>
          We apply practical technical and organizational safeguards including HTTPS transport, access controls,
          validation checks, and monitoring to reduce unauthorized access or misuse. No web system can guarantee
          absolute security, but we continuously improve controls to reduce risk.
        </p>

        <h2>Your Rights and Choices</h2>
        <p>
          Depending on your jurisdiction, you may have rights to access, correct, delete, or restrict processing of
          personal data. You may also object to certain processing and withdraw consent for optional cookies. To submit
          a request, contact us through our Contact page and include enough detail for verification.
        </p>

        <h2>Children&apos;s Privacy</h2>
        <p>
          Our services are not directed to children under the age required by local law for independent consent. If
          you believe a child provided personal information without proper authorization, contact us and we will review
          and remove it where appropriate.
        </p>

        <h2>Policy Updates</h2>
        <p>
          We may update this policy as legal requirements, products, or ad technologies change. The latest version and
          update date will always be posted on this page. Continued use of the website after changes means you accept
          the updated policy.
        </p>

        <h2>Contact</h2>
        <p>
          For privacy requests, policy questions, or data concerns, use the Contact page and include the subject
          &quot;Privacy Request&quot; so our team can respond faster.
        </p>
      </article>
    </main>
  );
}
