import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHead } from "@/components/sections/PageHead";
import { createPageMetadata, siteBaseUrl } from "@/lib/site-metadata";
import { breadcrumbJsonLd, LOCAL_BUSINESS_ID } from "@/lib/structured-data";

const path = "/software-development-usa";

const faqs = [
  {
    question: "Do you have an office in the United States?",
    answer:
      "No. The studio is in Gandhinagar, India. US companies work with us remotely — shared Slack, weekly demos, and calls booked for the US morning.",
  },
  {
    question: "What time do you overlap with US teams?",
    answer:
      "Studio hours are Monday–Saturday, 10:00–19:00 IST. That covers the US East morning. The rest of the day runs asynchronously on Slack so your team is not blocked waiting for a reply.",
  },
  {
    question: "What do you build for US companies?",
    answer:
      "Web apps, mobile products, AI features, and the marketing site around them. Recent work includes D2C storefronts, logistics platforms, healthcare services, and fintech tools.",
  },
  {
    question: "How does a US company start a project?",
    answer:
      "Send a short brief. We do a 30-minute discovery call, then a written proposal with scope, timeline, and price — usually within 2–3 business days.",
  },
];

export const metadata: Metadata = createPageMetadata({
  title: "Software Development Company for US Teams",
  description:
    "Novaro Solution builds web apps, mobile products, and AI systems for companies in the United States. Remote studio in Gandhinagar, calls in the US morning.",
  path,
  keywords: [
    "software development company USA",
    "software development company for US companies",
    "hire software developers for a US startup",
    "offshore software development company",
    "custom software development USA",
  ],
});

export default function SoftwareDevelopmentUsaPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Software development for US companies",
      description:
        "Custom software, web apps, mobile products, and AI systems for companies in the United States.",
      url: `${siteBaseUrl()}${path}`,
      areaServed: { "@type": "Country", name: "United States" },
      provider: { "@id": LOCAL_BUSINESS_ID },
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Software for US teams", path },
    ]),
  ];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHead
        eyebrow="United States · Remote delivery"
        title="Software development for US companies"
        description="Web apps, mobile products, and AI systems for teams in the United States. One senior squad in Gandhinagar, weekly demos, and calls in the US morning."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "For US teams" },
        ]}
      />

      <section className="sec detail">
        <div className="wrap">
          <ul className="detail-metrics">
            <li>
              <strong>US morning</strong>
              <span>Calls at the end of the India workday</span>
            </li>
            <li>
              <strong>1 team</strong>
              <span>Design, engineering, and launch</span>
            </li>
            <li>
              <strong>Weekly</strong>
              <span>A working build, not a status deck</span>
            </li>
          </ul>

          <div className="detail-grid">
            <div className="detail-panel">
              <h2>How a US engagement runs</h2>
              <ul className="detail-points">
                <li>Discovery call in your morning. We send a scoped proposal within 2–3 business days.</li>
                <li>Shared Slack and a single backlog. Decisions happen in the thread, not in a chain of vendors.</li>
                <li>Weekly demo of something you can click. Scope changes get priced before they are built.</li>
                <li>Handover with docs. A retainer is optional if you want us after launch.</li>
              </ul>
            </div>
            <div className="detail-panel">
              <h2>What US teams hire us for</h2>
              <ul className="detail-points">
                <li>A first product or a rebuild when the current stack is slowing sales down.</li>
                <li>AI features with a fallback — document extraction, search, review queues.</li>
                <li>The marketing site and the product in the same codebase, so SEO and the app do not drift apart.</li>
              </ul>
              <div className="detail-links">
                <Link href="/services/web-app-eng">Web &amp; app development</Link>
                <Link href="/services/ai-machine-ml">AI systems</Link>
                <Link href="/work">Case studies</Link>
                <Link href="/blog/working-with-us-teams">How the timezone works</Link>
              </div>
            </div>
          </div>

          <div className="detail-panel">
            <h2>Questions US teams ask</h2>
            <ul className="detail-points">
              {faqs.map((item) => (
                <li key={item.question}>
                  <strong>{item.question}</strong> {item.answer}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="US teams"
        title="Tell us what you need built"
        description="A short brief is enough. We reply within one business day with a time for a call."
        buttonLabel="Book a discovery call"
        buttonHref="/contact"
      />
    </main>
  );
}
