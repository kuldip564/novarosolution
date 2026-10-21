import { site } from "./site-data";

const { latitude, longitude } = site.geo;

/** Google Maps link for directions (no API key required). */
export function googleMapsUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}

/** Embeddable map iframe src for contact / local presence UI. */
export function mapEmbedUrl(): string {
  return `https://maps.google.com/maps?q=${latitude},${longitude}&z=13&output=embed`;
}

export function formattedAddress(): string {
  return `${site.geo.streetAddress}, ${site.geo.addressRegion} ${site.geo.postalCode}, India`;
}

/** Geo meta tags for local SEO (ICBM, geo.region, etc.) */
export function geoMetaTags(): Record<string, string> {
  return {
    "geo.region": site.geo.region,
    "geo.placename": site.geo.placename,
    "geo.position": `${latitude};${longitude}`,
    ICBM: `${latitude}, ${longitude}`,
    "business:contact_data:street_address": site.geo.streetAddress,
    "business:contact_data:locality": site.geo.addressLocality,
    "business:contact_data:region": site.geo.addressRegion,
    "business:contact_data:postal_code": site.geo.postalCode,
    "business:contact_data:country_name": "India",
    "business:contact_data:email": site.email,
    "business:contact_data:phone_number": site.phone,
    "business:contact_data:website": "https://www.novarosolution.com",
  };
}

export const defaultKeywords = [
  "IT services company",
  "software development company",
  "custom software development USA",
  "software development company for USA",
  "web app development company",
  "offshore software development company",
  "AI development company",
  "mobile app development company",
  "Next.js development company",
  "digital marketing agency",
  "hire software developers",
  "software company UK Europe UAE",
  "web development company Gandhinagar",
  "Novaro Solution",
];

export const homeKeywords = [
  ...defaultKeywords,
  "custom software development company",
  "software development company USA",
  "AI software company",
];

export const servicesKeywords = [
  ...defaultKeywords,
  "web app development services",
  "AI ML development company",
  "digital marketing services",
  "cloud DevOps company",
];

export const aboutKeywords = [
  "about Novaro Solution",
  "global software development company",
  "software company for USA and Europe",
  ...defaultKeywords.slice(0, 6),
];

export const contactKeywords = [
  "hire software developers",
  "contact software development company",
  "software development company USA contact",
  ...defaultKeywords.slice(0, 6),
];

export const workKeywords = [
  "Novaro Solution portfolio",
  "software development case studies",
  "web app case studies",
  ...defaultKeywords.slice(0, 4),
];

export const blogKeywords = [
  "software development blog",
  "AI production blog",
  "digital marketing insights",
  "Novaro Solution blog",
];
