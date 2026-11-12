import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Cookie Policy",
  description:
    "Which cookies novarosolution.com uses — essential, preference, analytics and advertising — why we use them, and how to block or delete them in your browser.",
  ogEyebrow: "Legal",
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  return (
    <LegalDocument
      title="Cookie Policy"
      description="What cookies we use and how you can control them."
      lastUpdated="November 12, 2026"
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
          <strong>Advertising</strong> — set by Google AdSense, which shows ads on this site.
          Google and its partners use these cookies to serve ads based on your visits to this and
          other websites. Where the law requires it, we ask for your consent first.
        </li>
      </ul>
      <p>
        You can turn off personalized ads in{" "}
        <a href="https://adssettings.google.com" rel="noopener noreferrer" target="_blank">
          Google Ads Settings
        </a>
        . See our <a href="/privacy-policy">Privacy Policy</a> for more on how advertising
        partners use this information.
      </p>
      <h2>Managing cookies</h2>
      <p>
        You can change preferences anytime via our cookie banner (coming soon) or your
        browser settings.
      </p>
    </LegalDocument>
  );
}
