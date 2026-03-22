import type { Metadata } from 'next';
import { fetchSiteContent } from '@/lib/api';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Terms and Conditions | Novaro Solution',
  description:
    'Read the terms that govern use of the Novaro Solution website, services, intellectual property, and user responsibilities.',
  keywords: ['terms and conditions', 'website terms', 'service terms', 'legal'],
  path: '/terms-and-conditions'
});

function renderManagedContent(rawContent: string) {
  const blocks = String(rawContent || '')
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
  return blocks.map((block, index) => <p key={`${index}-${block.slice(0, 16)}`}>{block}</p>);
}

export default async function TermsAndConditionsPage() {
  const siteContent = await fetchSiteContent({ revalidate: 180 }).catch(() => ({} as any));
  const managed = (siteContent as any)?.legalPages?.termsAndConditions || null;

  if (managed?.content) {
    return (
      <main className="app-page-shell">
        <section className="page-hero-shell space-y-3">
          <h1 className="section-title text-3xl font-extrabold md:text-5xl">
            {String(managed?.title || 'Terms and Conditions')}
          </h1>
          <p className="text-slate-300">Last updated: {String(managed?.lastUpdated || 'March 2026')}</p>
        </section>
        <article className="page-content-card space-y-4 legal-copy">{renderManagedContent(String(managed.content))}</article>
      </main>
    );
  }

  return (
    <main className="app-page-shell">
      <section className="page-hero-shell space-y-3">
        <h1 className="section-title text-3xl font-extrabold md:text-5xl">Terms and Conditions</h1>
        <p className="text-slate-300">Last updated: March 2026</p>
      </section>

      <article className="page-content-card space-y-4 legal-copy">
        <h2>Acceptance of Terms</h2>
        <p>
          By accessing or using the Novaro Solution website, you agree to these Terms and Conditions. If you do not
          agree, please do not use the website. These terms apply to visitors, prospective clients, account holders,
          and anyone interacting with our content or forms.
        </p>

        <h2>Website Purpose</h2>
        <p>
          Our website provides information about services, expertise, case studies, articles, and communication
          channels. Content is intended for general business and informational use. We may update, modify, suspend, or
          discontinue any part of the site without prior notice.
        </p>

        <h2>Eligibility and User Conduct</h2>
        <p>
          You agree to use the site lawfully and responsibly. You must not attempt unauthorized access, scrape content
          in abusive ways, bypass security controls, upload malicious code, or interfere with availability. Any misuse
          may result in blocked access and possible legal action.
        </p>

        <h2>Account and Authentication Areas</h2>
        <p>
          Certain features may require authentication. You are responsible for maintaining your credentials and all
          activity under your account. Notify us promptly if you suspect unauthorized access. We may suspend accounts
          that violate policy, legal obligations, or security requirements.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          Unless otherwise stated, text, design assets, logos, source code, and media on this website are owned by or
          licensed to Novaro Solution and protected by applicable intellectual property laws. You may not copy, reuse,
          republish, or redistribute content for commercial purposes without written permission.
        </p>

        <h2>Service Discussions and Proposals</h2>
        <p>
          Information submitted through contact forms or chats does not automatically create a client relationship,
          partnership, or binding agreement. Scope, pricing, delivery timelines, warranties, and maintenance terms are
          defined only in executed contracts or statements of work.
        </p>

        <h2>Third-Party Links and Tools</h2>
        <p>
          The website may include links to third-party services, including analytics, ad providers, and social
          platforms. We are not responsible for third-party content, practices, or availability. Your interactions with
          third-party services are governed by their own terms and policies.
        </p>

        <h2>Advertising and Sponsored Content</h2>
        <p>
          We may display advertising through Google AdSense or similar networks. Ad placements are labeled to avoid
          misleading interfaces. We do not guarantee availability, relevance, or outcomes from any third-party
          advertisement and are not responsible for advertiser claims, products, or services.
        </p>

        <h2>Disclaimers and Limitation of Liability</h2>
        <p>
          The website is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We do not guarantee uninterrupted operation,
          complete accuracy, or fitness for every purpose. To the maximum extent permitted by law, Novaro Solution is
          not liable for indirect, incidental, special, consequential, or business-interruption damages arising from
          website use or inability to use the website.
        </p>

        <h2>Indemnification</h2>
        <p>
          You agree to defend and indemnify Novaro Solution against claims, losses, liabilities, and expenses arising
          from your misuse of the website, violation of these terms, or infringement of rights of another party.
        </p>

        <h2>Privacy and Cookies</h2>
        <p>
          Your use of this website is also governed by our Privacy Policy, which explains data handling and cookie
          choices, including Google advertising cookies and analytics controls.
        </p>

        <h2>Termination</h2>
        <p>
          We may restrict or terminate access to any part of the site at our discretion when required to protect users,
          enforce policy, meet legal obligations, or maintain operational integrity.
        </p>

        <h2>Governing Law</h2>
        <p>
          These terms are governed by applicable laws of the business operating jurisdiction, unless mandatory local
          law requires otherwise. Any disputes should first be addressed through good-faith communication using our
          Contact page.
        </p>

        <h2>Changes to Terms</h2>
        <p>
          We may revise these terms as our services evolve. Updated terms become effective when posted. Continued use
          of the site after updates indicates acceptance of the revised terms.
        </p>
      </article>
    </main>
  );
}
