import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { LocalPresence } from "@/components/sections/LocalPresence";
import { ContactForm } from "@/components/sections/ContactForm";
import { FaqSection, mapDbFaqs } from "@/components/sections/FaqSection";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getPublishedFaqs, getSiteContent } from "@/lib/content";
import { googleMapsUrl } from "@/lib/geo-seo";
import { createPageMetadata } from "@/lib/site-metadata";
import { contactKeywords } from "@/lib/geo-seo";
import { breadcrumbJsonLd, LOCAL_BUSINESS_ID } from "@/lib/structured-data";
import { siteBaseUrl } from "@/lib/site-metadata";
import { site } from "@/lib/site-data";
import { contactPageDefaults } from "@/lib/page-content-defaults";
import { jsonLdString } from "@/lib/json-ld";
import "@/styles/studio.css";
import "@/styles/contact.css";


export const revalidate = 30;

export const metadata: Metadata = createPageMetadata({
  title: "Contact Novaro Solution | IT Company in Gandhinagar",
  description:
    "Contact our Gandhinagar team for website, web app, mobile app, AI, and SEO projects. Call +91 96244 98325 or send a project enquiry online.",
  path: "/contact",
  keywords: contactKeywords,
});

export default async function ContactPage() {
  const [faqs, pageCopy] = await Promise.all([
    getPublishedFaqs(),
    getSiteContent("contactPage", contactPageDefaults),
  ]);

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
      <section className="st st-hero ct-hero" aria-labelledby="ct-hero-title" data-cta-location="contact-hero">
        <div className="wrap st-hero__inner">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} className="st-hero__crumbs" />
          <p className="st-eyebrow st-hero__eyebrow">{pageCopy.eyebrow} · Studio in Gandhinagar</p>
          <h1 id="ct-hero-title" className="st-hero__title ct-hero__title">
            <span className="st-mask">
              <span style={{ ["--line" as string]: 0 }}>Talk to our</span>{" "}
            </span>
            <span className="st-mask st-mask--accent">
              <span style={{ ["--line" as string]: 1 }}>Gandhinagar studio.</span>
            </span>
          </h1>
          <p className="st-hero__lede">{pageCopy.description}</p>
          <ul className="ct-quick" aria-label="Other ways to reach us">
            <li>
              <a href={`mailto:${site.email}`} className="ct-quick__btn">
                <Mail size={18} aria-hidden="true" />
                Email us
              </a>
            </li>
            <li>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="ct-quick__btn">
                <Phone size={18} aria-hidden="true" />
                Call {site.phone}
              </a>
            </li>
            <li>
              <a href={googleMapsUrl()} className="ct-quick__btn" target="_blank" rel="noopener noreferrer">
                <MapPin size={18} aria-hidden="true" />
                Directions<span className="sr-only"> (opens Google Maps)</span>
              </a>
            </li>
          </ul>
        </div>
      </section>
      <ContactForm />
      <LocalPresence variant="contact" />
      <FaqSection items={mapDbFaqs(faqs)} />
    </main>
  );
}
