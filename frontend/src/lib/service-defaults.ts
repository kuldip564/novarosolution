import type { DbService } from "./content";
import { serviceDetails } from "./site-data";

const serviceSlugs = ["web-app-eng", "ai-machine-ml", "digital-marketing", "cloud-devops"] as const;

const serviceIcons = ["monitor", "ai", "chart", "cloud"] as const;

const serviceTags: readonly (readonly string[])[] = [
  ["Next.js", "Express", "SaaS", "Mobile"],
  ["LLM apps", "Computer vision", "Pipelines"],
  ["SEO", "Paid ads", "Analytics", "Brand"],
  ["AWS", "GCP", "CI/CD", "Design systems"],
];

export const defaultServices: DbService[] = serviceDetails.map((service, index) => ({
  id: `default-service-${index}`,
  slug: serviceSlugs[index] ?? `service-${index + 1}`,
  order: index,
  name: service.title,
  title: service.title,
  description: service.description,
  shortDescription: service.description,
  bullets: [...service.bullets],
  tags: [...(serviceTags[index] ?? [])],
  icon: serviceIcons[index] ?? "monitor",
  image: null,
  imageAlt: "media" in service && service.media ? service.media.alt : service.title,
  published: true,
}));

export function resolvePublishedServices(services: DbService[]): DbService[] {
  if (!services.length) return defaultServices;
  return services;
}
