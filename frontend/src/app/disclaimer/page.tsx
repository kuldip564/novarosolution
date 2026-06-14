import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Disclaimer",
  description: "General disclaimer for Novaro Solution website content.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <LegalDocument
      title="Disclaimer"
      description="Important limitations on the information we publish."
      lastUpdated="June 14, 2026"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Disclaimer" }]}
    >
      <p>
        Information on this website is provided in good faith for general guidance. It does
        not constitute professional, legal, or financial advice.
      </p>
      <h2>No warranties</h2>
      <p>
        We strive for accuracy but make no warranties about completeness or suitability for
        a particular purpose. Use the information at your own risk.
      </p>
      <h2>External links</h2>
      <p>
        Links to third-party sites are provided for convenience. We are not responsible for
        their content or privacy practices.
      </p>
    </LegalDocument>
  );
}
