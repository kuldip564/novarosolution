import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqSection, mapDbFaqs } from "@/components/sections/FaqSection";
import { PageHead } from "@/components/sections/PageHead";
import { Skeleton } from "@/components/ui/Skeleton";
import { getPublishedFaqs, getSiteContent } from "@/lib/content";
import { createPageMetadata } from "@/lib/site-metadata";
import { defaultCta, pickCta, type CtaContent } from "@/lib/site-data";

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
  title: "Contact",
  description:
    "Start a project with Novaro Solution — web apps, AI systems, and digital marketing.",
  path: "/contact",
});

export default async function ContactPage() {
  const [faqs, cta] = await Promise.all([
    getPublishedFaqs(),
    getSiteContent<CtaContent>("cta", defaultCta),
  ]);

  const contactCta = pickCta(cta, "contact");

  return (
    <main>
      <PageHead
        eyebrow="Contact"
        title="NOVARO"
        titleAccent="CONTACT"
        variant="bigword"
        description="Tell us about your project. The more detail you share, the sharper our first response will be."
        className="blog-head"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <ContactForm />
      <FaqSection items={mapDbFaqs(faqs)} />
      <CtaBand title={contactCta.title} description={contactCta.description} />
    </main>
  );
}
