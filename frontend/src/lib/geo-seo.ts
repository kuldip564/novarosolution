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
  "web development company Gandhinagar",
  "software development company Gujarat",
  "IT company Gandhinagar",
  "web app development Ahmedabad",
  "AI machine learning company India",
  "digital marketing agency Gandhinagar",
  "SEO company Gujarat",
  "Next.js development studio India",
  "mobile app development Gandhinagar",
  "software company near me Gujarat",
  "IT company GIFT City Gujarat",
  "web development Vadodara Surat Rajkot",
  "software studio Ahmedabad Gandhinagar",
  "Novaro Solution",
];

export const homeKeywords = [
  ...defaultKeywords,
  "best web development company Gandhinagar",
  "custom software development Gujarat",
  "IT studio Ahmedabad Gandhinagar",
];

export const servicesKeywords = [
  ...defaultKeywords,
  "web app development services India",
  "AI ML development company Gujarat",
  "digital marketing services Gandhinagar",
  "cloud DevOps company India",
];

export const aboutKeywords = [
  "about Novaro Solution",
  "IT studio Gandhinagar team",
  "software company Gujarat founders",
  ...defaultKeywords.slice(0, 6),
];

export const contactKeywords = [
  "contact web development company Gandhinagar",
  "hire software developers Gujarat",
  "IT company contact Gandhinagar",
  ...defaultKeywords.slice(0, 6),
];

export const workKeywords = [
  "Novaro Solution portfolio",
  "web development projects India",
  "software case studies Gujarat",
  ...defaultKeywords.slice(0, 4),
];

export const blogKeywords = [
  "web development blog India",
  "AI production blog",
  "digital marketing insights Gujarat",
  "Novaro Solution blog",
];
