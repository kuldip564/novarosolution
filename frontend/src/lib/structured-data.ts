import { site } from "./site-data";
import { googleMapsUrl } from "./geo-seo";
import { brandIconAbsoluteUrl, siteBaseUrl } from "./site-metadata";

export const ORGANIZATION_ID = `${siteBaseUrl()}#organization`;
export const LOCAL_BUSINESS_ID = `${siteBaseUrl()}#localbusiness`;
export const WEBSITE_ID = `${siteBaseUrl()}#website`;

export function postalAddressJsonLd() {
  return {
    "@type": "PostalAddress",
    streetAddress: site.geo.streetAddress,
    addressLocality: site.geo.addressLocality,
    addressRegion: site.geo.addressRegion,
    postalCode: site.geo.postalCode,
    addressCountry: site.geo.addressCountry,
  };
}

function cityAreaServed(name: string) {
  return { "@type": "City" as const, name };
}

function regionAreaServed(name: string) {
  return { "@type": "AdministrativeArea" as const, name };
}

export function geoCoordinatesJsonLd() {
  return {
    "@type": "GeoCoordinates",
    latitude: site.geo.latitude,
    longitude: site.geo.longitude,
  };
}

export function socialProfiles(): string[] {
  return Object.values(site.social).filter((url) => url.startsWith("http"));
}

export function openingHoursSpecification() {
  return {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    opens: "10:00",
    closes: "19:00",
  };
}

export function organizationJsonLd() {
  const sameAs = socialProfiles();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: site.name,
    legalName: site.name,
    description: site.description,
    url: siteBaseUrl(),
    logo: brandIconAbsoluteUrl(),
    email: site.email,
    telephone: site.phone,
    foundingDate: String(site.founded),
    address: postalAddressJsonLd(),
    areaServed: [
      cityAreaServed("Gandhinagar"),
      cityAreaServed("Ahmedabad"),
      cityAreaServed("Vadodara"),
      cityAreaServed("Surat"),
      cityAreaServed("Rajkot"),
      regionAreaServed("Gujarat"),
      regionAreaServed("India"),
    ],
    knowsAbout: [
      "Web Application Development",
      "Mobile App Development",
      "Artificial Intelligence",
      "Machine Learning",
      "Digital Marketing",
      "Search Engine Optimization",
      "Next.js",
      "Software Product Development",
    ],
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function localBusinessJsonLd() {
  const sameAs = socialProfiles();

  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": LOCAL_BUSINESS_ID,
    name: site.name,
    description: site.description,
    url: siteBaseUrl(),
    image: brandIconAbsoluteUrl(),
    logo: brandIconAbsoluteUrl(),
    email: site.email,
    telephone: site.phone,
    priceRange: "₹₹₹",
    address: postalAddressJsonLd(),
    geo: geoCoordinatesJsonLd(),
    hasMap: googleMapsUrl(),
    openingHoursSpecification: openingHoursSpecification(),
    areaServed: [
      cityAreaServed("Gandhinagar"),
      cityAreaServed("Ahmedabad"),
      cityAreaServed("Vadodara"),
      cityAreaServed("Surat"),
      cityAreaServed("Rajkot"),
      regionAreaServed("Gujarat"),
      regionAreaServed("India"),
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Novaro Solution Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Web & App Engineering",
            areaServed: "Gandhinagar, Gujarat, India",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "AI & Machine Learning",
            areaServed: "Gandhinagar, Gujarat, India",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Digital Marketing & SEO",
            areaServed: "Gandhinagar, Gujarat, India",
          },
        },
      ],
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.name,
    url: siteBaseUrl(),
    description: site.description,
    inLanguage: "en-IN",
    publisher: { "@id": ORGANIZATION_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteBaseUrl()}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function faqPageJsonLd(
  items: Array<{ question: string; answer: string }>,
) {
  if (!items.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  const base = siteBaseUrl();

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${base}${item.path}`,
    })),
  };
}

export function globalSiteJsonLd() {
  return [organizationJsonLd(), localBusinessJsonLd(), webSiteJsonLd()];
}
