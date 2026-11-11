import type { DbFaq, DbTestimonial } from "./content";
import { fallbackFaqs } from "./site-data";

export const defaultFaqs: DbFaq[] = fallbackFaqs.map((item, index) => ({
  id: item.id,
  question: item.question,
  answer: item.answer,
  order: index,
  published: true,
}));

/**
 * No built-in testimonials: only quotes published in the admin (real, attributable clients) are
 * shown. With none published, testimonial sections are hidden.
 */
export const defaultTestimonials: DbTestimonial[] = [];

export function resolvePublishedFaqs(faqs: DbFaq[]): DbFaq[] {
  if (!faqs.length) return defaultFaqs;
  return faqs;
}

export function resolvePublishedTestimonials(testimonials: DbTestimonial[]): DbTestimonial[] {
  return testimonials;
}

/** CMS site content keys — see site-content-registry.ts for defaults */
export { siteContentKeys, type SiteContentKey } from "./site-content-registry";
export { siteContentRegistry, getSiteContentDefault } from "./site-content-registry";
