import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { LocalPresence } from "@/components/sections/LocalPresence";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqSection, mapDbFaqs } from "@/components/sections/FaqSection";
import { PageHead } from "@/components/sections/PageHead";
import { Skeleton } from "@/components/ui/Skeleton";
import { getPublishedFaqs, getSiteContent } from "@/lib/content";
import { createPageMetadata } from "@/lib/site-metadata";
import { contactKeywords } from "@/lib/geo-seo";
import { breadcrumbJsonLd, faqPageJsonLd, LOCAL_BUSINESS_ID } from "@/lib/structured-data";
import { siteBaseUrl } from "@/lib/site-metadata";
import {
  defaultCta,
  pickCta,
  type CtaContent,
} from "@/lib/site-data";
import { contactPageDefaults } from "@/lib/page-content-defaults";

const ContactForm = dynamic(
  () => import("@/components/sections/ContactForm").then((m) => m.ContactForm),
  {
    loading: () => (
      <div className="contact-form-skeleton">
        <Skeleton className="skeleton-field" />
        <Skeleton className="skeleton-field" />
        <Skeleton className="skeleton-field skeleton-field-lg" />
      </div>
    ),
  },
);

export const revalidate = 30;

export const metadata: Metadata = createPageMetadata({
  title: "Contact — Web Development Company Gandhinagar",
  description:
    "Contact Novaro Solution — Gandhinagar, Gujarat IT studio for web apps, AI/ML & SEO. Call +91 96244 98325 or email novaro@novarosolution.com. Serving Ahmedabad & all India.",
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
  const faqItems = mapDbFaqs(faqs);
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
      name: "Contact Novaro Solution — Gandhinagar, Gujarat",
      description:
        "Contact our Gandhinagar IT studio for web development, AI/ML, and digital marketing projects across Gujarat and India.",
      inLanguage: "en-IN",
      about: { "@id": LOCAL_BUSINESS_ID },
    },
    faqPageJsonLd(faqItems),
  ].filter(Boolean);

  return (
    <main className="page-cinema contact-cinema">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd.length === 1 ? jsonLd[0] : jsonLd),
        }}
      />
      <PageHead
        eyebrow={pageCopy.eyebrow}
        title={pageCopy.title}
        titleAccent={pageCopy.titleAccent}
        variant="bigword"
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
