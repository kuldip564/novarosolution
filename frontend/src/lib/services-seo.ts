import type { Metadata } from "next";
import { servicesKeywords } from "./geo-seo";
import { site } from "./site-data";
import type { ServiceDetailView } from "./services-content";
import { ORGANIZATION_ID, WEBSITE_ID } from "./structured-data";
import { ogImagePath, ogLocales, siteBaseUrl, siteIcons } from "./site-metadata";

export const servicesPagePath = "/services";

export const servicesSeoTitle =
  "Software, AI & Digital Marketing Services — Novaro Solution";

export const servicesSeoDescription =
  "Web and mobile app development, AI/ML, digital marketing and cloud DevOps for companies in the USA, UK, Europe, the Middle East and India.";

export const servicesOgImage = ogImagePath("Web apps, AI, digital marketing & cloud services", "Services · Worldwide");

export function servicesPageMetadata(): Metadata {
  const url = `${siteBaseUrl()}${servicesPagePath}`;
  const ogTitle = servicesSeoTitle;
  const ogImageUrl = `${siteBaseUrl()}${servicesOgImage}`;

  return {
    title: { absolute: ogTitle },
    description: servicesSeoDescription,
    keywords: servicesKeywords,
    alternates: {
      canonical: servicesPagePath,
    },
    icons: siteIcons,
    openGraph: {
      type: "website",
      ...ogLocales,
      url,
      title: ogTitle,
      description: servicesSeoDescription,
      siteName: site.name,
      images: [
        {
          url: servicesOgImage,
          width: 1200,
          height: 630,
          alt: "Novaro Solution web and app engineering services dashboard preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: servicesSeoDescription,
      images: [ogImageUrl],
    },
  };
}

export function servicesPageJsonLd(services: ServiceDetailView[]) {
  const base = siteBaseUrl();
  const pageUrl = `${base}${servicesPagePath}`;

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: base,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: pageUrl,
      },
    ],
  };

  const webPage = {
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: servicesSeoTitle,
    description: servicesSeoDescription,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
  };

  const serviceNodes = services.map((service) => ({
    "@type": "Service",
    "@id": `${pageUrl}#${service.slug}`,
    name: service.title,
    description: service.description,
    serviceType: service.title,
    url: `${base}/services/${service.slug}`,
    provider: { "@id": ORGANIZATION_ID },
    areaServed: "Worldwide",
    ...(service.tools.length > 0
      ? {
          category: service.tools.join(", "),
        }
      : {}),
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [webPage, breadcrumb, ...serviceNodes],
  };
}
