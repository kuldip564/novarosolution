import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "How Novaro Solution collects, uses, and protects your personal information.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      description="How we handle your data when you visit our site or contact us."
      lastUpdated="June 14, 2026"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Privacy Policy" },
      ]}
    >
      <p>
        Novaro Solution (&quot;we&quot;, &quot;us&quot;) respects your privacy. This policy
        explains what we collect, why we collect it, and the choices you have.
      </p>
      <h2>Information we collect</h2>
      <p>
        When you use our contact form, we collect your name, email, project details,
        selected services, and optional budget range. We also collect standard technical
        logs (IP address, browser type, pages visited) for security and analytics.
      </p>
      <h2>How we use information</h2>
      <p>
        We use contact submissions to respond to enquiries and propose project work. We do
        not sell personal data. Analytics help us improve the site experience.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about this policy? Email{" "}
        <a href="mailto:hello@novarosolution.com">hello@novarosolution.com</a>.
      </p>
      <p className="legal-note">
        Full GDPR/CCPA disclosures and third-party advertising details will be expanded in
        our upcoming compliance update.
      </p>
    </LegalDocument>
  );
}
