import type { Metadata } from "next";
import { LocalPresence } from "@/components/sections/LocalPresence";
import { CtaBand } from "@/components/sections/CtaBand";
import { ContactForm } from "@/components/sections/ContactForm";
import { FaqSection, mapDbFaqs } from "@/components/sections/FaqSection";
import { PageHead } from "@/components/sections/PageHead";
import { getPublishedFaqs, getSiteContent } from "@/lib/content";
import { createPageMetadata } from "@/lib/site-metadata";
import { contactKeywords } from "@/lib/geo-seo";
import { breadcrumbJsonLd, LOCAL_BUSINESS_ID } from "@/lib/structured-data";
import { siteBaseUrl } from "@/lib/site-metadata";
import {
  defaultCta,
  pickCta,
  type CtaContent,
} from "@/lib/site-data";
import { contactPageDefaults } from "@/lib/page-content-defaults";
import { jsonLdString } from "@/lib/json-ld";


export const revalidate = 30;

export const metadata: Metadata = createPageMetadata({
  title: "Contact Us to Start a Software Project",
  description:
    "Tell us what you need built: a web app, an AI feature or marketing. We reply within one business day. Call +91 96244 98325 or visit our Gandhinagar studio.",
  path: "/contact",
  keywords: contactKeywords,
});

export default async function ContactPage() {
  const [faqs, cta, pageCopy] = await Promise.all([
    getPublishedFaqs(),
    getSiteContent<CtaContent>("cta", defaultCta),
    getSiteContent("contactPage", contactPageDefaults),
  ]);

  const contactCta = pickCta(cta, "contact");
  const base = siteBaseUrl();

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Contact", path: "/contact" },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "@id": `${base}/contact#contactpage`,
      url: `${base}/contact`,
      name: "Contact Novaro Solution",
      description:
        "Contact Novaro Solution about a software, AI, or marketing project.",
      inLanguage: "en",
      about: { "@id": LOCAL_BUSINESS_ID },
    },
  ];

  return (
    <main className="page-cinema contact-cinema">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(jsonLd.length === 1 ? jsonLd[0] : jsonLd),
        }}
      />
      <PageHead
        eyebrow={pageCopy.eyebrow}
        title={pageCopy.title}
        titleAccent={pageCopy.titleAccent}
        variant="bigword"
        heading="Contact our software studio in Gandhinagar"
        description={pageCopy.description}
        className="blog-head"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <ContactForm />
      <LocalPresence variant="contact" />
      <FaqSection items={mapDbFaqs(faqs)} />
      <CtaBand title={contactCta.title} description={contactCta.description} />
    </main>
  );
}
