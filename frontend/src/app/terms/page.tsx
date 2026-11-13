import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { formattedAddress } from "@/lib/geo-seo";
import { site } from "@/lib/site-data";
import { createPageMetadata, siteBaseUrl } from "@/lib/site-metadata";
import { ORGANIZATION_ID, WEBSITE_ID } from "@/lib/structured-data";
import { jsonLdString } from "@/lib/json-ld";

const path = "/terms";
const lastUpdated = "November 10, 2026";
const description =
  "Terms & Conditions for using novarosolution.com and hiring Novaro Solution for software, AI, web, SEO and marketing work: payments, IP, warranty and liability.";

export const metadata: Metadata = createPageMetadata({
  title: "Terms & Conditions",
  description,
  path,
  ogEyebrow: "Legal",
  keywords: [
    "Novaro Solution terms and conditions",
    "software development terms and conditions",
    "IT services terms of service India",
  ],
});

const phoneHref = `tel:${site.phone.replace(/\s/g, "")}`;

export default function TermsPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${siteBaseUrl()}${path}#webpage`,
      url: `${siteBaseUrl()}${path}`,
      name: `Terms & Conditions — ${site.name}`,
      description,
      inLanguage: "en",
      dateModified: "2026-11-10",
      isPartOf: { "@id": WEBSITE_ID },
      publisher: { "@id": ORGANIZATION_ID },
    },
    // BreadcrumbList comes from LegalDocument, built from the visible breadcrumb trail.
  ];

  return (
    <LegalDocument
      title="Terms & Conditions"
      description="The rules for using our website and the terms on which we design, build and market software for you."
      lastUpdated={lastUpdated}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Terms & Conditions" }]}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />

      <div className="legal-summary" role="note" aria-label="Summary">
        <p className="legal-summary__title">In short</p>
        <ul>
          <li>Your signed proposal or contract sets the scope, price and timeline. These terms fill in everything else.</li>
          <li>You own the final deliverables once they are paid for. We keep our own tools and pre-existing code.</li>
          <li>Changes are priced in writing before we build them. Invoices are due within 15 days unless agreed otherwise.</li>
          <li>We fix defects in our code free for 30 days after launch. SEO and ad results are never guaranteed.</li>
          <li>Indian law applies. Disputes go to arbitration seated in Gandhinagar, Gujarat.</li>
        </ul>
      </div>

      <h2>1. About these terms</h2>
      <p>
        These Terms &amp; Conditions (the &quot;Terms&quot;) govern your use of{" "}
        <Link href="/">novarosolution.com</Link>{" "}(the &quot;Website&quot;) and every service we provide,
        including software and web development, mobile apps, AI and machine learning, UI/UX design, cloud
        and DevOps, SEO, digital marketing, maintenance and support (the &quot;Services&quot;).
      </p>
      <p>
        By using the Website, submitting an enquiry, accepting a proposal, or paying an invoice, you agree to
        these Terms. If you are accepting on behalf of a company, you confirm you have authority to bind it.
        If you do not agree, please do not use the Website or the Services.
      </p>

      <h2>2. Who we are</h2>
      <p>
        The Website and Services are provided by <strong>{site.name}</strong>{" "}(&quot;Novaro&quot;,
        &quot;we&quot;, &quot;us&quot;, &quot;our&quot;), a software development studio founded in{" "}
        {site.founded}.
      </p>
      <ul className="legal-facts">
        <li>
          <span>Business name</span>
          <strong>{site.name}</strong>
        </li>
        <li>
          <span>Studio address</span>
          <strong>{formattedAddress()}</strong>
        </li>
        <li>
          <span>Email</span>
          <strong>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </strong>
        </li>
        <li>
          <span>Phone</span>
          <strong>
            <a href={phoneHref}>{site.phone}</a>
          </strong>
        </li>
        <li>
          <span>Business hours</span>
          <strong>{site.businessHours}</strong>
        </li>
        <li>
          <span>Website</span>
          <strong>
            <a href={siteBaseUrl()}>{siteBaseUrl().replace("https://", "")}</a>
          </strong>
        </li>
      </ul>

      <h2>3. Definitions</h2>
      <ul>
        <li>
          <strong>Client</strong> or <strong>you</strong> — the person or company that requests or receives the
          Services.
        </li>
        <li>
          <strong>Proposal</strong> — our written quote, statement of work (SOW), or contract describing scope,
          deliverables, timeline, and fees for a project.
        </li>
        <li>
          <strong>Deliverables</strong> — the code, designs, documents, content, and other materials we create
          specifically for you under a Proposal.
        </li>
        <li>
          <strong>Pre-existing Materials</strong> — tools, libraries, components, templates, know-how, and code
          that we owned or developed before or outside your project.
        </li>
        <li>
          <strong>Third-party Services</strong> — software, platforms, APIs, hosting, and assets provided by
          other companies (for example cloud providers, payment gateways, AI model providers, fonts, and stock
          images).
        </li>
      </ul>

      <h2>4. Using the Website</h2>
      <p>You may browse the Website and use its content for your own information. You agree not to:</p>
      <ul>
        <li>attempt to gain unauthorised access to the Website, our admin area, servers, or databases;</li>
        <li>upload malware, run vulnerability scans, or interfere with the Website&apos;s operation;</li>
        <li>scrape, copy, or republish our content, designs, or case studies for commercial use without written permission;</li>
        <li>submit false, misleading, or unlawful information through our forms; or</li>
        <li>use the Website in breach of any applicable law.</li>
      </ul>
      <p>
        You must be at least 18 years old to submit an enquiry or engage our Services. We may suspend access to
        the Website at any time for maintenance, security, or legal reasons.
      </p>

      <h2>5. Enquiries, proposals and quotes</h2>
      <p>
        Enquiries sent through our contact form, email, or phone are not binding on either side. After a
        discovery call we send a Proposal, usually within 2–3 business days. Unless it states otherwise, a
        Proposal is valid for 30 days.
      </p>
      <p>
        Estimates are our best judgement based on the information available at the time. Fixed-price Proposals
        cover only the scope written in them. Work becomes binding when you accept the Proposal in writing
        (including by email) or pay the first invoice.
      </p>

      <h2>6. How these Terms and your Proposal fit together</h2>
      <p>
        Each project is governed by its Proposal and these Terms. If they conflict, the order of priority is:
        (1) a signed master services agreement, if any; (2) the accepted Proposal or SOW; (3) a signed data
        processing agreement or NDA, for the matters it covers; and (4) these Terms.
      </p>

      <h2>7. Your responsibilities</h2>
      <p>To keep a project on schedule, you agree to:</p>
      <ul>
        <li>name one decision-maker and give feedback and approvals within the agreed review windows;</li>
        <li>
          provide content, brand assets, data, and access to accounts, servers, domains, and Third-party
          Services we need;
        </li>
        <li>make sure the materials you give us are accurate, lawful, and that you have the right to use them;</li>
        <li>keep your own account credentials secure and pay Third-party Service fees in your name; and</li>
        <li>test Deliverables during acceptance and report issues in writing.</li>
      </ul>
      <p>
        Delays caused by late feedback, missing content, or access we cannot get may move the timeline and,
        if the team has to be rescheduled, may be charged as a change.
      </p>

      <h2>8. Fees, invoices and payment</h2>
      <ul>
        <li>
          Fees, currency, and the payment schedule are set out in your Proposal. Unless it says otherwise, we
          invoice an advance before work starts and the balance at agreed milestones or monthly for retainers.
        </li>
        <li>Invoices are payable within 15 days of the invoice date unless the Proposal states another term.</li>
        <li>
          Prices exclude taxes. Applicable taxes (such as GST in India), bank and transfer charges, and any
          withholding taxes are payable by you in addition to the fees.
        </li>
        <li>
          If an invoice is overdue by more than 15 days, we may pause work and access to staging environments
          until it is paid. Timelines move by the length of the pause.
        </li>
        <li>
          Third-party Service costs — hosting, domains, licences, API usage, and advertising budgets — are paid
          by you directly to the provider unless we agree in writing to pass them through.
        </li>
      </ul>

      <h2>9. Changes to scope</h2>
      <p>
        Anything not described in the Proposal is a change. We will estimate the cost and timeline impact in
        writing and only start once you approve it. Small changes may be absorbed at our discretion; that does
        not waive our right to price later changes.
      </p>

      <h2>10. Timelines and delivery</h2>
      <p>
        We work in weekly sprints and share a working build or progress update every week. Timelines in a
        Proposal are good-faith estimates that depend on timely input from you. We will tell you promptly if
        we expect a delay and agree a revised plan with you.
      </p>

      <h2>11. Acceptance and warranty</h2>
      <ul>
        <li>
          When we deliver a milestone, you have 7 business days to test it and send us a written list of
          defects against the agreed scope. If we receive none, or you use the Deliverable in production, the
          milestone is accepted.
        </li>
        <li>
          For 30 days after launch (go-live), we fix defects in code we wrote that stop it from working as
          specified, at no extra cost.
        </li>
        <li>
          The warranty does not cover changes made by anyone else, misuse, new features, browser or platform
          updates released after delivery, or failures of Third-party Services. Work outside the warranty is
          available under a support retainer or at our standard rates.
        </li>
      </ul>

      <h2>12. Intellectual property</h2>
      <ul>
        <li>
          <strong>Your Deliverables.</strong> Once you have paid all fees due for a Deliverable, ownership of
          the intellectual property in it passes to you. Until then, you have a licence to use it for review and
          testing only.
        </li>
        <li>
          <strong>Our Pre-existing Materials.</strong> We keep ownership of our Pre-existing Materials. Where
          they are part of a Deliverable, we grant you a perpetual, worldwide, non-exclusive, royalty-free
          licence to use and modify them as part of that Deliverable.
        </li>
        <li>
          <strong>Open-source and third-party components.</strong> These are provided under their own licences,
          which we will identify on request. You agree to follow those licences.
        </li>
        <li>
          <strong>Your materials.</strong> You keep ownership of the content, data, trademarks, and assets you
          give us, and grant us a licence to use them only to perform the Services.
        </li>
        <li>
          <strong>Website content.</strong> Everything on the Website — text, graphics, logos, code, and case
          studies — belongs to {site.name} or our clients and may not be reused without permission.
        </li>
      </ul>

      <h2>13. Portfolio and publicity</h2>
      <p>
        Unless you ask us not to in writing, we may name you as a client and show non-confidential screenshots
        or a short description of the work in our portfolio, proposals, and social media. We will never publish
        confidential information or unreleased work without your consent.
      </p>

      <h2>14. Confidentiality</h2>
      <p>
        Each party will keep the other&apos;s confidential information — business plans, source code, data,
        pricing, and anything marked or reasonably understood as confidential — secret and use it only for the
        project. This does not apply to information that is public, already known, independently developed, or
        that must be disclosed by law. These obligations continue for three years after the engagement ends.
        We are happy to sign your NDA before a discovery call.
      </p>

      <h2>15. Data protection and privacy</h2>
      <p>
        We handle personal data as described in our <Link href="/privacy-policy">Privacy Policy</Link> and{" "}
        <Link href="/cookie-policy">Cookie Policy</Link>. When we process personal data on your behalf, you are
        the data controller (or &quot;data fiduciary&quot;) and we act as your processor. We will process it only
        on your instructions, protect it with appropriate security measures, and, on request, sign a data
        processing agreement covering laws such as India&apos;s Digital Personal Data Protection Act, 2023, the
        GDPR, or the UK GDPR.
      </p>

      <h2>16. Third-party services and hosting</h2>
      <p>
        Our work often relies on Third-party Services. We are not responsible for their availability, pricing
        changes, policy changes, data loss, or security incidents. Where possible, accounts should be opened in
        your name so you keep control of them after the project.
      </p>

      <h2>17. AI features</h2>
      <p>
        AI and machine-learning outputs are probabilistic and can be wrong, incomplete, or biased. We design AI
        features with a fallback and, where it matters, a person reviewing the result. You are responsible for
        how AI outputs are used in your business and for checking them before relying on them for legal,
        medical, financial, or other important decisions.
      </p>

      <h2>18. SEO, advertising and marketing results</h2>
      <p>
        Search rankings, traffic, leads, and advertising performance depend on search engines, ad platforms,
        competitors, and market conditions we do not control. We commit to doing the agreed work well and
        reporting honestly, but we do not guarantee specific rankings, traffic, conversions, or return on ad
        spend. Advertising budgets are paid directly to the ad platforms and are non-refundable by us.
      </p>

      <h2>19. Support, maintenance and retainers</h2>
      <p>
        Support after the warranty period is provided under a monthly retainer or on a time-and-materials
        basis. The retainer&apos;s scope, hours, and response times are set out in the Proposal. Unused retainer
        hours do not roll over unless we agree otherwise in writing.
      </p>

      <h2>20. Non-solicitation</h2>
      <p>
        During the engagement and for 12 months after it ends, neither party will directly hire or engage the
        other&apos;s employees who worked on the project without the other&apos;s written consent. General job
        adverts are not covered by this clause.
      </p>

      <h2>21. Disclaimers</h2>
      <p>
        The Website and its content are provided &quot;as is&quot; for general information. Blog posts, cost
        ranges, timelines, and case-study results are illustrative and are not professional, legal, or financial
        advice — see our <Link href="/disclaimer">Disclaimer</Link>. Except as stated in these Terms or your
        Proposal, we make no other warranties, express or implied, to the fullest extent permitted by law.
      </p>

      <h2>22. Limitation of liability</h2>
      <ul>
        <li>
          Neither party is liable for indirect or consequential losses, including lost profits, revenue, data,
          or goodwill.
        </li>
        <li>
          Our total liability arising from any project is limited to the fees you paid us under the relevant
          Proposal in the three (3) months before the event giving rise to the claim.
        </li>
        <li>
          Nothing in these Terms limits liability that cannot be limited by law, such as liability for fraud or
          wilful misconduct.
        </li>
      </ul>

      <h2>23. Indemnity</h2>
      <p>
        You agree to indemnify us against claims arising from content, data, or materials you supplied, or from
        your use of the Deliverables in breach of law or these Terms. We agree to indemnify you against claims
        that original code we wrote for you infringes a third party&apos;s intellectual property, provided you
        notify us promptly and let us control the defence.
      </p>

      <h2>24. Termination</h2>
      <ul>
        <li>Either party may end a project for convenience with 15 days&apos; written notice.</li>
        <li>
          Either party may end a project immediately if the other materially breaches these Terms and does not
          fix the breach within 15 days of written notice, or becomes insolvent.
        </li>
        <li>
          On termination you pay for all work performed and expenses incurred up to the termination date. Once
          paid, we hand over the Deliverables completed so far, in their current state.
        </li>
        <li>
          Sections on fees, intellectual property, confidentiality, liability, indemnity, and governing law
          survive termination.
        </li>
      </ul>

      <h2>25. Cancellations and refunds</h2>
      <p>
        Fees for work already performed are non-refundable. If you cancel before work starts, we refund any
        advance minus the cost of discovery or planning work already done. If we end a project without cause,
        we refund any prepaid fees for work we have not yet performed.
      </p>

      <h2>26. Force majeure</h2>
      <p>
        Neither party is responsible for delays caused by events beyond its reasonable control — natural
        disasters, epidemics, war, government action, power or internet outages, or failures of major cloud
        providers. The affected party will notify the other promptly, and timelines will be adjusted.
      </p>

      <h2>27. Links to other websites</h2>
      <p>
        The Website links to client sites and other third-party websites. We do not control them and are not
        responsible for their content, availability, or privacy practices.
      </p>

      <h2>28. Governing law and disputes</h2>
      <p>
        These Terms and every project under them are governed by the laws of India. If a dispute arises, both
        parties will first try to resolve it in good faith within 30 days of written notice. If that fails, the
        dispute will be referred to arbitration by a sole arbitrator under the Arbitration and Conciliation
        Act, 1996. The seat and venue of arbitration is Gandhinagar, Gujarat, and the language is English.
        Subject to this, the courts at Gandhinagar, Gujarat have exclusive jurisdiction.
      </p>

      <h2>29. General</h2>
      <ul>
        <li>
          <strong>Entire agreement.</strong> These Terms and your Proposal are the whole agreement about the
          project and replace earlier discussions.
        </li>
        <li>
          <strong>Independent parties.</strong> We act as an independent contractor. Nothing creates a
          partnership, joint venture, or employment relationship.
        </li>
        <li>
          <strong>Assignment.</strong> Neither party may transfer its rights under a project without the
          other&apos;s written consent, except to a successor in a merger or sale of the business.
        </li>
        <li>
          <strong>Severability and waiver.</strong> If any clause is unenforceable, the rest remains in effect.
          Not enforcing a right is not a waiver of it.
        </li>
        <li>
          <strong>Notices.</strong> Notices may be sent by email to the addresses each party uses for the
          project; ours is <a href={`mailto:${site.email}`}>{site.email}</a>.
        </li>
      </ul>

      <h2>30. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. The &quot;Last updated&quot; date shows the latest
        version. Changes apply to new Proposals; the version in force when you accepted a Proposal continues
        to apply to that project unless both parties agree otherwise.
      </p>

      <h2>31. Contact us</h2>
      <p>Questions about these Terms? Get in touch:</p>
      <address className="legal-contact">
        <strong>{site.name}</strong>
        <span>{formattedAddress()}</span>
        <span>
          Email: <a href={`mailto:${site.email}`}>{site.email}</a>
        </span>
        <span>
          Phone: <a href={phoneHref}>{site.phone}</a>
        </span>
        <span>Hours: {site.businessHours}</span>
      </address>
    </LegalDocument>
  );
}
