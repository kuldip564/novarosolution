import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { createPageMetadata } from "@/lib/site-metadata";
import { site } from "@/lib/site-data";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "How Novaro Solution collects, uses, stores, protects, and manages personal information.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      description="How we collect, use, store, protect, and share personal information."
      lastUpdated="August 20, 2026"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Privacy Policy" },
      ]}
    >
      <p>
        Novaro Solution (&quot;Novaro&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
        respects your privacy and is committed to protecting the personal information of
        individuals who use our website, applications, and services (collectively, the
        &quot;Services&quot;). This Privacy Policy explains what information we collect, how we
        collect it, how we use and share it, how we protect it, and the choices and rights
        available to you. By accessing or using the Services, you acknowledge that you have read
        and understood this Privacy Policy.
      </p>

      <h2>Information we collect</h2>
      <p>We collect information in the following ways:</p>
      <ul>
        <li>
          <strong>Information you provide.</strong> When you submit our contact or project
          enquiry form, we collect your name, email address, project details or message, the
          services you&apos;re interested in, and an optional budget range.
        </li>
        <li>
          <strong>Technical and usage information.</strong> Like most websites, we automatically
          collect standard technical logs — IP address, browser and device type, pages visited,
          referring URL, and timestamps — for security, troubleshooting, and analytics.
        </li>
        <li>
          <strong>Cookies and similar technologies.</strong> We use cookies to keep the site
          secure, remember preferences, and understand how visitors use the site. See our{" "}
          <a href="/cookie-policy">Cookie Policy</a> for details and how to manage them.
        </li>
      </ul>

      <h2>How we use your information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Respond to enquiries and propose or deliver project work;</li>
        <li>Operate, maintain, and improve the Services;</li>
        <li>Monitor for security issues, fraud, and abuse;</li>
        <li>Understand site usage through analytics; and</li>
        <li>Comply with legal obligations.</li>
      </ul>
      <p>We do not sell personal information.</p>

      <h2>How we share information</h2>
      <p>We share personal information only in the following circumstances:</p>
      <ul>
        <li>
          <strong>Service providers.</strong> With trusted vendors who host our infrastructure,
          send email on our behalf, or provide analytics, under obligations to protect your data
          and use it only for the purpose we specify.
        </li>
        <li>
          <strong>Legal reasons.</strong> Where required to comply with applicable law, regulation,
          legal process, or a valid governmental request.
        </li>
        <li>
          <strong>Business transfers.</strong> If Novaro is involved in a merger, acquisition, or
          sale of assets, personal information may be transferred as part of that transaction.
        </li>
      </ul>

      <h2>Data retention</h2>
      <p>
        We retain personal information for as long as necessary to respond to your enquiry,
        deliver the Services, meet legal or accounting requirements, and resolve disputes. When
        information is no longer needed for these purposes, we delete or anonymize it.
      </p>

      <h2>Data security</h2>
      <p>
        We use reasonable administrative, technical, and organizational safeguards designed to
        protect personal information against unauthorized access, loss, misuse, or alteration. No
        method of transmission or storage is completely secure, so we cannot guarantee absolute
        security.
      </p>

      <h2>Your rights and choices</h2>
      <p>
        Depending on your location, applicable law — such as India&apos;s Digital Personal Data
        Protection Act, 2023, or the EU/UK GDPR — may give you rights to access, correct, update,
        or request deletion of your personal information, to object to or restrict certain
        processing, and to withdraw consent where processing is based on consent. To exercise any
        of these rights, contact us using the details below.
      </p>

      <h2>International visitors</h2>
      <p>
        Novaro is based in Gandhinagar, Gujarat, India, and we work with clients across India and
        remotely worldwide. If you access the Services from outside India, your information may be
        transferred to, stored, and processed in India or other countries where our service
        providers operate, which may have data protection laws different from those of your home
        jurisdiction.
      </p>

      <h2>Children&apos;s privacy</h2>
      <p>
        Our Services are not directed to children who are below the minimum age required under
        applicable law to provide personal information without parental or guardian consent, and
        we do not knowingly collect personal information from children in circumstances where
        such collection is prohibited by law. If you believe a child has provided personal
        information to us, please contact us so we can take reasonable steps to delete it.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time to reflect changes to our Services,
        business practices, technologies, or applicable laws. When we do, we&apos;ll update the
        &quot;Last updated&quot; date at the top of this page, and where required by law, we&apos;ll
        provide additional notice of material changes.
      </p>

      <h2>Contact us</h2>
      <p>
        Questions about this Privacy Policy or how we handle your personal information? Email{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> or call{" "}
        <a href={`tel:${site.phone.replace(/\s+/g, "")}`}>{site.phone}</a>.
      </p>
    </LegalDocument>
  );
}
