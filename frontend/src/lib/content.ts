import { cache } from "react";
import { siteContentRegistryRecord } from "./site-content-registry";
import {
  defaultFaqs,
  defaultTestimonials,
  resolvePublishedFaqs,
  resolvePublishedTestimonials,
} from "./content-fallbacks";
import type { CloudinaryAsset } from "./media";
import { defaultProjects, resolvePublishedProjects } from "./project-defaults";
import { defaultServices, resolvePublishedServices } from "./service-defaults";
import { resolvePublishedTeam, teamAsDbMembers } from "./team-defaults";

const API_ORIGIN =
  process.env.API_PROXY_TARGET ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:5001";

const FETCH_TIMEOUT_MS = 800;

const fetchContentRaw = cache(async <T,>(path: string, fallback: T): Promise<T> => {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const res = await fetch(`${API_ORIGIN}${path}`, {
      next: { revalidate: 30 },
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) return fallback;
    const json = (await res.json()) as { ok?: boolean; data?: T };
    return json.ok && json.data !== undefined ? json.data : fallback;
  } catch {
    return fallback;
  }
});

export type DbProject = {
  id: string;
  slug: string;
  order: number;
  title: string;
  category: string;
  hook: string;
  body: string;
  heroTitle: string | null;
  heroImage: CloudinaryAsset | null;
  coverClass: string | null;
  screens: CloudinaryAsset[];
  results: unknown[];
  tags: string[];
  externalUrl?: string | null;
  published: boolean;
};

export type DbService = {
  id: string;
  slug: string;
  order: number;
  name: string;
  title: string;
  description: string;
  shortDescription: string | null;
  bullets: string[];
  tags: string[];
  icon: string | null;
  image: CloudinaryAsset | null;
  imageAlt: string | null;
  published: boolean;
};

export type DbTeamMember = {
  id: string;
  name: string;
  role: string;
  photo: CloudinaryAsset | null;
  order: number;
  published: boolean;
};

export type DbTestimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar: CloudinaryAsset | null;
  rating: number;
  order: number;
  published: boolean;
};

export type DbClientLogo = {
  id: string;
  name: string;
  image: CloudinaryAsset | null;
  order: number;
  published: boolean;
};

export type DbFaq = {
  id: string;
  question: string;
  answer: string;
  order: number;
  published: boolean;
};

export async function getPublishedProjects(fallback: DbProject[] = defaultProjects) {
  const projects = await fetchContentRaw<DbProject[]>("/api/content/projects", fallback);
  return resolvePublishedProjects(projects, fallback);
}

export async function getPublishedServices(fallback: DbService[] = defaultServices) {
  const services = await fetchContentRaw<DbService[]>("/api/content/services", fallback);
  return resolvePublishedServices(services);
}

export async function getPublishedTeam(fallback: DbTeamMember[] = teamAsDbMembers()) {
  const members = await fetchContentRaw<DbTeamMember[]>("/api/content/team", fallback);
  return resolvePublishedTeam(members);
}

export async function getPublishedTestimonials(
  fallback: DbTestimonial[] = defaultTestimonials,
) {
  const testimonials = await fetchContentRaw<DbTestimonial[]>(
    "/api/content/testimonials",
    fallback,
  );
  return resolvePublishedTestimonials(testimonials);
}

export async function getPublishedLogos(fallback: DbClientLogo[] = []) {
  return fetchContentRaw<DbClientLogo[]>("/api/content/logos", fallback);
}

export async function getPublishedFaqs(fallback: DbFaq[] = defaultFaqs) {
  const faqs = await fetchContentRaw<DbFaq[]>("/api/content/faq", fallback);
  return resolvePublishedFaqs(faqs);
}

export async function getSiteContent<T>(key: string, fallback: T): Promise<T> {
  return fetchContentRaw<T>(`/api/content/site/${key}`, fallback);
}

export async function getAllSiteContent(
  fallback: Record<string, unknown> = siteContentRegistryRecord(),
): Promise<Record<string, unknown>> {
  return fetchContentRaw<Record<string, unknown>>("/api/content/site", fallback);
}

export function mediaUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http") || path.startsWith("/images/")) return path;
  if (path.startsWith("/uploads/")) return path;
  return path;
}
