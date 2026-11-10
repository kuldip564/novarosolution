import { site, team } from "./site-data";
import { googleMapsUrl } from "./geo-seo";
import { siteBaseUrl } from "./site-metadata";

export const ORGANIZATION_ID = `${siteBaseUrl()}#organization`;
export const LOCAL_BUSINESS_ID = `${siteBaseUrl()}#localbusiness`;
export const WEBSITE_ID = `${siteBaseUrl()}#website`;

const LANGUAGES = ["English", "Hindi", "Gujarati"];

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

const gujarat = { "@type": "State" as const, name: "Gujarat", containedInPlace: { "@type": "Country", name: "India" } };

function city(name: string) {
  return { "@type": "City" as const, name, containedInPlace: gujarat };
}

function country(name: string, identifier: string) {
  return { "@type": "Country" as const, name, identifier };
}

/** Every place the studio serves — local cities first, then countries and regions. */
export const areasServed = [
  city("Gandhinagar"),
  city("Ahmedabad"),
  city("GIFT City"),
  city("Vadodara"),
  city("Surat"),
  gujarat,
  country("India", "IN"),
  country("United States", "US"),
  country("United Kingdom", "GB"),
  country("Canada", "CA"),
  country("Australia", "AU"),
  country("United Arab Emirates", "AE"),
  { "@type": "Place" as const, name: "Europe" },
];

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
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "10:00",
    closes: "19:00",
  };
}

function logoJsonLd() {
  return {
    "@type": "ImageObject",
    "@id": `${siteBaseUrl()}#logo`,
    url: `${siteBaseUrl()}/brand/novaro-icon.png`,
    contentUrl: `${siteBaseUrl()}/brand/novaro-icon.png`,
    width: 631,
    height: 822,
    caption: site.name,
  };
}

function contactPoints() {
  return [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: site.phone.replace(/\s/g, ""),
      email: site.email,
      areaServed: ["IN", "US", "GB", "CA", "AU", "AE", "EU"],
      availableLanguage: LANGUAGES,
      hoursAvailable: openingHoursSpecification(),
    },
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: site.email,
      telephone: site.phone.replace(/\s/g, ""),
      availableLanguage: LANGUAGES,
    },
  ];
}

const serviceCatalog = [
  { name: "Web & App Development", path: "/services/web-app-eng" },
  { name: "AI & Machine Learning", path: "/services/ai-machine-ml" },
  { name: "Digital Marketing & SEO", path: "/services/digital-marketing" },
  { name: "Cloud, DevOps & Design", path: "/services/cloud-devops" },
];

export function organizationJsonLd() {
  const sameAs = socialProfiles();
  const founders = team.filter((member) => member.tier === "founder");

  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: site.name,
    legalName: site.name,
    alternateName: "Novaro",
    slogan: site.tagline,
    description: site.description,
    url: siteBaseUrl(),
    logo: logoJsonLd(),
    image: { "@id": `${siteBaseUrl()}#logo` },
    email: site.email,
    telephone: site.phone.replace(/\s/g, ""),
    foundingDate: String(site.founded),
    foundingLocation: { "@type": "Place", name: "Gandhinagar, Gujarat, India" },
    founder: founders.map((member) => ({
      "@type": "Person",
      name: member.name,
      jobTitle: member.role.replace(" · ", ", "),
    })),
    numberOfEmployees: { "@type": "QuantitativeValue", value: team.length },
    address: postalAddressJsonLd(),
    location: { "@id": LOCAL_BUSINESS_ID },
    areaServed: areasServed,
    contactPoint: contactPoints(),
    knowsLanguage: LANGUAGES,
    knowsAbout: [
      "Custom Software Development",
      "Web Application Development",
      "Mobile App Development",
      "Artificial Intelligence",
      "Machine Learning",
      "Digital Marketing",
      "Search Engine Optimization",
      "Cloud Computing",
      "DevOps",
      "Next.js",
      "React",
      "Node.js",
    ],
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function localBusinessJsonLd() {
  const sameAs = socialProfiles();
  const base = siteBaseUrl();

  return {
    "@type": ["ProfessionalService", "LocalBusiness"],
    "@id": LOCAL_BUSINESS_ID,
    name: site.name,
    description: `${site.description} Studio in Sargasan, Gandhinagar, serving Gujarat, India, and clients worldwide.`,
    url: base,
    logo: { "@id": `${base}#logo` },
    image: [`${base}/brand/novaro-icon.png`, `${base}/images/novaro-it-services.webp`],
    email: site.email,
    telephone: site.phone.replace(/\s/g, ""),
    priceRange: "₹₹₹",
    address: postalAddressJsonLd(),
    geo: geoCoordinatesJsonLd(),
    hasMap: googleMapsUrl(),
    openingHoursSpecification: openingHoursSpecification(),
    areaServed: areasServed,
    knowsLanguage: LANGUAGES,
    parentOrganization: { "@id": ORGANIZATION_ID },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${site.name} services`,
      itemListElement: serviceCatalog.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          url: `${base}${service.path}`,
          provider: { "@id": ORGANIZATION_ID },
          areaServed: "Worldwide",
        },
      })),
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function webSiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.name,
    alternateName: "Novaro",
    url: siteBaseUrl(),
    description: site.description,
    inLanguage: "en",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
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

export function webPageJsonLd(input: {
  path: string;
  name: string;
  description: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  about?: string;
}) {
  const url = `${siteBaseUrl()}${input.path}`;
  return {
    "@context": "https://schema.org",
    "@type": input.type ?? "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: input.name,
    description: input.description,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": input.about ?? ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/** Site-wide entities as one connected graph (Organization ↔ LocalBusiness ↔ WebSite). */
export function globalSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationJsonLd(), localBusinessJsonLd(), webSiteJsonLd()],
  };
}
