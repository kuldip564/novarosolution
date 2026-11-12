import { RevealScope } from "@/components/anim/RevealScope";
import {
  ServicesCapabilityGrid,
  ServicesHero,
  ServicesPractices,
  ServicesProcessSection,
  ServicesProof,
} from "@/components/services/ServicesSections";
import { StudioClosing } from "@/components/studio/StudioClosing";
import { caseStudyContent } from "@/lib/case-study-content";
import { getPublishedProjects, getPublishedServices, getSiteContent } from "@/lib/content";
import { mapDbProjectsToWork } from "@/lib/content-mappers";
import { jsonLdString } from "@/lib/json-ld";
import {
  buildServiceDetails,
  defaultServicesPage,
  normalizeProcessSteps,
  normalizeServicesPage,
} from "@/lib/services-content";
import { servicesPageJsonLd, servicesPageMetadata } from "@/lib/services-seo";
import { defaultCta, pickCta, processSteps, type CtaContent } from "@/lib/site-data";
import { toWorkProjects } from "@/lib/work-portfolio";
import "@/styles/studio.css";
import "@/styles/services.css";

export const revalidate = 30;

export const metadata = servicesPageMetadata();

export default async function ServicesPage() {
  const [services, pageContent, steps, cta, projects] = await Promise.all([
    getPublishedServices(),
    getSiteContent("servicesPage", defaultServicesPage),
    getSiteContent("processSteps", processSteps),
    getSiteContent<CtaContent>("cta", defaultCta),
    getPublishedProjects(),
  ]);

  const content = normalizeServicesPage(pageContent);
  const serviceDetails = buildServiceDetails(services, content);
  const servicesCta = pickCta(cta, "services");
  const work = toWorkProjects(mapDbProjectsToWork(projects));

  // Proof comes only from case studies that list the practice (each checked against the live product).
  const proofFor = Object.fromEntries(
    serviceDetails.map((service) => [
      service.slug,
      work.filter((project) =>
        caseStudyContent[project.slug]?.services.some((item) => item.href === `/services/${service.slug}`),
      ),
    ]),
  );
  const practicesFor = Object.fromEntries(work.map((project) => [project.slug, project.services]));
  const jsonLd = servicesPageJsonLd(serviceDetails);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <main className="st sv">
        <RevealScope attribute="data-st-reveal">
          <ServicesHero
            services={serviceDetails}
            lede={content.introSubline}
            liveProducts={work.filter((project) => project.liveUrl).length}
          />
          <ServicesPractices services={serviceDetails} proofFor={proofFor} />
          <ServicesCapabilityGrid content={content.capabilities} />
          <ServicesProcessSection content={content.process} steps={normalizeProcessSteps(steps)} />
          <ServicesProof projects={work} practicesFor={practicesFor} />
          <StudioClosing
            id="sv-closing-title"
            eyebrow={content.cta.eyebrow}
            title={servicesCta.title}
            lede={servicesCta.description}
            buttonLabel={content.cta.buttonLabel}
            location="services-cta"
          />
        </RevealScope>
      </main>
    </>
  );
}
