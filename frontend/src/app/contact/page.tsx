import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqSection, mapDbFaqs } from "@/components/sections/FaqSection";
import { PageHead } from "@/components/sections/PageHead";
import { ContactForm } from "@/components/sections/ContactForm";
import { getPublishedFaqs, getSiteContent } from "@/lib/content";
import { createPageMetadata } from "@/lib/site-metadata";
import { defaultCta, pickCta, type CtaContent } from "@/lib/site-data";

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
        title={"Let's start a\nconversation."}
        description="Tell us about your project. The more detail you share, the sharper our first response will be."
        splitTitle
      />
      <ContactForm />
      <FaqSection items={mapDbFaqs(faqs)} />
      <CtaBand title={contactCta.title} description={contactCta.description} />
    </main>
  );
}
