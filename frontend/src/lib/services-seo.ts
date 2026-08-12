import type { Metadata } from "next";
import { servicesKeywords } from "./geo-seo";
import { site } from "./site-data";
import type { ServiceDetailView } from "./services-content";
import { ORGANIZATION_ID } from "./structured-data";
import { brandIconAbsoluteUrl, siteBaseUrl, siteIcons } from "./site-metadata";

export const servicesPagePath = "/services";

export const servicesSeoTitle =
  "Web App, AI/ML & SEO Services | IT Company Gandhinagar, Gujarat";

export const servicesSeoDescription =
  "Novaro Solution — web & app development, AI/ML, digital marketing & SEO in Gandhinagar, Gujarat. Serving Ahmedabad & India. Production-grade software that ships and scales.";

export const servicesOgImage = "/images/webapp-dashboard.webp";

export function servicesPageMetadata(): Metadata {
  const url = `${siteBaseUrl()}${servicesPagePath}`;
  const ogTitle = `${servicesSeoTitle} — ${site.name}`;
  const ogImageUrl = `${siteBaseUrl()}${servicesOgImage}`;

  return {
    title: servicesSeoTitle,
    description: servicesSeoDescription,
    keywords: servicesKeywords,
    alternates: {
      canonical: servicesPagePath,
    },
    icons: siteIcons,
    openGraph: {
      type: "website",
      locale: "en_IN",
      url,
      title: ogTitle,
      description: servicesSeoDescription,
      siteName: site.name,
      images: [
        {
          url: servicesOgImage,
          width: 2048,
          height: 1529,
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
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: servicesSeoTitle,
    description: servicesSeoDescription,
    isPartOf: {
      "@type": "WebSite",
      name: site.name,
      url: base,
    },
    about: {
      "@type": "Organization",
      name: site.name,
      url: base,
    },
  };

  const provider = {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: site.name,
    url: base,
    logo: brandIconAbsoluteUrl(),
    email: site.email,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Gandhinagar",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
  };

  const serviceNodes = services.map((service) => ({
    "@type": "Service",
    "@id": `${pageUrl}#${service.slug}`,
    name: service.title,
    description: service.description,
    serviceType: service.title,
    url: `${pageUrl}#service-${service.slug}`,
    provider: { "@id": ORGANIZATION_ID },
    areaServed: [
      { "@type": "City", name: "Gandhinagar" },
      { "@type": "City", name: "Ahmedabad" },
      { "@type": "AdministrativeArea", name: "Gujarat" },
      { "@type": "Country", name: "India" },
    ],
    ...(service.tools.length > 0
      ? {
          category: service.tools.join(", "),
        }
      : {}),
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [provider, webPage, breadcrumb, ...serviceNodes],
  };
}
