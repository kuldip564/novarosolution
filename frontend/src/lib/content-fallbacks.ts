import type { DbFaq, DbTestimonial } from "./content";
import { fallbackFaqs, fallbackTestimonials } from "./site-data";

export const defaultFaqs: DbFaq[] = fallbackFaqs.map((item, index) => ({
  id: item.id,
  question: item.question,
  answer: item.answer,
  order: index,
  published: true,
}));

export const defaultTestimonials: DbTestimonial[] = fallbackTestimonials.map(
  (item, index) => ({
    id: item.id,
    quote: item.quote,
    name: item.name,
    role: item.role,
    rating: item.rating,
    avatar: item.avatar,
    order: index,
    published: true,
  }),
);

export function resolvePublishedFaqs(faqs: DbFaq[]): DbFaq[] {
  if (!faqs.length) return defaultFaqs;
  return faqs;
}

export function resolvePublishedTestimonials(
  testimonials: DbTestimonial[],
): DbTestimonial[] {
  if (!testimonials.length) return defaultTestimonials;
  return testimonials;
}

/** CMS site content keys — see site-content-registry.ts for defaults */
export { siteContentKeys, type SiteContentKey } from "./site-content-registry";
export { siteContentRegistry, getSiteContentDefault } from "./site-content-registry";
