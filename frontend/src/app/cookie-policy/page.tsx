import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Cookie Policy",
  description: "How Novaro Solution uses cookies and similar technologies.",
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  return (
    <LegalDocument
      title="Cookie Policy"
      description="What cookies we use and how you can control them."
      lastUpdated="June 14, 2026"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Cookie Policy" },
      ]}
    >
      <p>
        Cookies are small files stored on your device. We use them to keep the site
        secure, remember preferences, and — with your consent — measure traffic and show
        relevant ads.
      </p>
      <h2>Categories</h2>
      <ul>
        <li>
          <strong>Necessary</strong> — required for core functionality and security.
        </li>
        <li>
          <strong>Analytics</strong> — help us understand how visitors use the site.
        </li>
        <li>
          <strong>Advertising</strong> — may be used to deliver relevant ads (consent
          required).
        </li>
      </ul>
      <h2>Managing cookies</h2>
      <p>
        You can change preferences anytime via our cookie banner (coming soon) or your
        browser settings.
      </p>
    </LegalDocument>
  );
}
