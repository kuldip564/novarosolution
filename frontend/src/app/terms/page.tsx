import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Service",
  description: "Terms governing use of the Novaro Solution website and services.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of Service"
      description="Rules for using our website and engaging our services."
      lastUpdated="June 14, 2026"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Terms" }]}
    >
      <p>
        By accessing novarosolution.com you agree to these terms. If you disagree, please
        do not use the site.
      </p>
      <h2>Use of the site</h2>
      <p>
        Content is provided for general information about our IT services, blog, and
        portfolio. You may not misuse the site, attempt unauthorized access, or scrape
        content for commercial reuse without permission.
      </p>
      <h2>Intellectual property</h2>
      <p>
        All branding, copy, code samples, and case study materials remain the property of
        Novaro Solution or respective clients unless stated otherwise.
      </p>
      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of India. Disputes shall be subject to the
        courts of Gujarat, India.
      </p>
    </LegalDocument>
  );
}
