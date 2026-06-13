import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHead } from "@/components/sections/PageHead";
import { Process } from "@/components/sections/Process";
import { ServiceRows } from "@/components/sections/ServiceRows";
import { getPublishedServices } from "@/lib/content";
import { mapDbServicesToRows } from "@/lib/content-mappers";

export const metadata: Metadata = {
  title: "Services",
};

export default async function ServicesPage() {
  const services = await getPublishedServices();

  return (
    <main>
      <PageHead
        eyebrow="What we do"
        title={"Services built to ship\nand to scale."}
        description="Engineering, intelligence, design, and growth under one roof — so your product gets built right and gets found."
        splitTitle
      />
      <ServiceRows services={mapDbServicesToRows(services)} />
      <Process centered />
      <CtaBand
        title="Not sure where to start?"
        description="Tell us the problem and we'll tell you the shortest path to a result."
        buttonLabel="Book a call"
      />
    </main>
  );
}
