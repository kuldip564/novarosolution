import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHead } from "@/components/sections/PageHead";
import { createPageMetadata, siteBaseUrl } from "@/lib/site-metadata";
import { breadcrumbJsonLd, LOCAL_BUSINESS_ID } from "@/lib/structured-data";

const path = "/it-services";

const faqs = [
  {
    question: "What IT services does Novaro Solution offer?",
    answer:
      "Web and mobile apps, AI features, digital marketing, and cloud and DevOps. One team in Gandhinagar does the work for companies in any country.",
  },
  {
    question: "Do you work with companies outside India?",
    answer:
      "Yes. Clients are in the USA, UK, Europe, the Middle East, and India. The studio is in Gandhinagar. There is no other office.",
  },
  {
    question: "How do you start an IT project?",
    answer:
      "Send a short brief. We hold a 30-minute discovery call, then send a written proposal with scope, timeline, and price within 2–3 business days.",
  },
];

export const metadata: Metadata = createPageMetadata({
  title: "IT Services Company for Software, AI & Web Apps",
  description:
    "Novaro Solution is an IT services company. We build web apps, mobile products, AI systems, and digital marketing for companies worldwide. Studio in Gandhinagar, India.",
  path,
  keywords: [
    "IT services company",
    "IT company",
    "software development company",
    "web app development company",
    "AI development company",
    "custom software development",
  ],
});

export default function ItServicesPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "IT services",
      description:
        "Software development, web and mobile apps, AI systems, and digital marketing for companies worldwide.",
      url: `${siteBaseUrl()}${path}`,
      areaServed: "Worldwide",
      provider: { "@id": LOCAL_BUSINESS_ID },
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "IT services", path },
    ]),
  ];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHead
        eyebrow="Worldwide · IT services"
        title="IT services for companies anywhere"
        description="Web apps, AI, and the marketing around them. One team, from the brief to launch."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "IT services" },
        ]}
      />

      <section className="sec detail">
        <div className="wrap">
          <figure className="detail-figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/novaro-it-services.webp"
              alt="Novaro Solution — a product on a laptop in a dark studio"
              width={1280}
              height={720}
            />
          </figure>
          <ul className="detail-metrics">
            <li>
              <strong>4 practices</strong>
              <span>Apps, AI, marketing, cloud</span>
            </li>
            <li>
              <strong>1 team</strong>
              <span>The same people from brief to launch</span>
            </li>
            <li>
              <strong>Worldwide</strong>
              <span>Remote delivery from Gandhinagar</span>
            </li>
          </ul>

          <div className="detail-grid">
            <div className="detail-panel">
              <h2>What companies hire us for</h2>
              <ul className="detail-points">
                <li>A web or mobile product when a spreadsheet or an old site is slowing the business down.</li>
                <li>An AI feature with a fallback, not a demo that only works on stage.</li>
                <li>The marketing site and the product in one codebase, so search and the app stay in step.</li>
                <li>Cloud, deploys, and a design system the next release can use.</li>
              </ul>
            </div>
            <div className="detail-panel">
              <h2>The work, by practice</h2>
              <div className="detail-links">
                <Link href="/services/web-app-eng">Web and app development</Link>
                <Link href="/services/ai-machine-ml">AI and machine learning</Link>
                <Link href="/services/digital-marketing">Digital marketing and SEO</Link>
                <Link href="/services/cloud-devops">Cloud and DevOps</Link>
                <Link href="/work">Case studies</Link>
                <Link href="/software-development-usa">For US teams</Link>
                <Link href="/blog/hire-it-services-company">Before you hire an IT company</Link>
              </div>
            </div>
          </div>

          <div className="detail-panel">
            <h2>Questions people ask</h2>
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
        eyebrow="Any country"
        title="Tell us what you need built"
        description="A short brief is enough. We reply within one business day."
        buttonLabel="Contact the studio"
        buttonHref="/contact"
      />
    </main>
  );
}
