import { ServicesExperience } from "@/components/services/ServicesExperience";
import { getPublishedServices, getSiteContent } from "@/lib/content";
import {
  buildServiceDetails,
  defaultServicesPage,
  normalizeProcessSteps,
  normalizeServicesPage,
} from "@/lib/services-content";
import {
  servicesPageJsonLd,
  servicesPageMetadata,
} from "@/lib/services-seo";
import {
  defaultCta,
  pickCta,
  processSteps,
  type CtaContent,
} from "@/lib/site-data";
import "@/styles/services.css";

export const revalidate = 30;

export const metadata = servicesPageMetadata();

export default async function ServicesPage() {
  const [services, pageContent, steps, cta] = await Promise.all([
    getPublishedServices(),
    getSiteContent("servicesPage", defaultServicesPage),
    getSiteContent("processSteps", processSteps),
    getSiteContent<CtaContent>("cta", defaultCta),
  ]);

  const content = normalizeServicesPage(pageContent);
  const serviceDetails = buildServiceDetails(services, content);
  const servicesCta = pickCta(cta, "services");
  const jsonLd = servicesPageJsonLd(serviceDetails);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServicesExperience
        content={content}
        services={serviceDetails}
        processSteps={normalizeProcessSteps(steps)}
        ctaTitle={servicesCta.title}
        ctaDescription={servicesCta.description}
      />
    </>
  );
}
