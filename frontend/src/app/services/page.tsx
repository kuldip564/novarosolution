import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHead } from "@/components/sections/PageHead";
import { Process } from "@/components/sections/Process";
import { ServiceRows } from "@/components/sections/ServiceRows";
import { getPublishedServices, getSiteContent } from "@/lib/content";
import { mapDbServicesToRows } from "@/lib/content-mappers";
import { createPageMetadata } from "@/lib/site-metadata";
import {
  defaultCta,
  pickCta,
  processSteps,
  type CtaContent,
} from "@/lib/site-data";

export const metadata: Metadata = createPageMetadata({
  title: "Services",
  description:
    "Web and app development, AI and ML systems, digital marketing, and cloud engineering from Novaro Solution.",
  path: "/services",
});

export default async function ServicesPage() {
  const [services, cta, steps] = await Promise.all([
    getPublishedServices(),
    getSiteContent<CtaContent>("cta", defaultCta),
    getSiteContent("processSteps", processSteps),
  ]);

  const servicesCta = pickCta(cta, "services");

  return (
    <main>
      <PageHead
        eyebrow="What we do"
        title={"Services built to ship\nand to scale."}
        description="Engineering, intelligence, design, and growth under one roof — so your product gets built right and gets found."
        splitTitle
      />
      <ServiceRows services={mapDbServicesToRows(services)} />
      <Process centered steps={steps} />
      <CtaBand
        title={servicesCta.title}
        description={servicesCta.description}
        buttonLabel="Book a call"
      />
    </main>
  );
}
