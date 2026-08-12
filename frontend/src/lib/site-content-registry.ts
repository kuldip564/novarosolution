/**
 * Single registry for all CMS-managed site content defaults.
 * Frontend fallbacks and backend seed-data should stay in sync with these values.
 */
import { defaultAboutPage } from "./about-content";
import { defaultServicesPage } from "./services-content";
import {
  blogPageDefaults,
  contactPageDefaults,
  homeSectionsDefaults,
} from "./page-content-defaults";
import { teamProfiles } from "./team-profiles";
import {
  aboutStats,
  budgetRanges,
  capabilities,
  contactServices,
  defaultCta,
  defaultHero,
  homeStats,
  marqueeItems,
  navLinks,
  processSteps,
  site,
  whyItems,
} from "./site-data";

export const servicesSectionDefaults = {
  eyebrow: homeSectionsDefaults.services.eyebrow,
  title: "Three core practices.\nOne accountable team.",
  description: homeSectionsDefaults.services.description,
} as const;

export const whySectionDefaults = {
  title: "Senior people. One team. Real ownership.",
} as const;

export const teamSectionDefaults = {
  description:
    "Co-founders Kuldip Chaudhary, Mehul Chaudhary, and Ronak Prajapati built Novaro to ship products with real accountability. Alpesh Prajapati manages operations and delivery. Maulik, Krina, Sonal, and Abhi are the engineers, designers, and marketers who bring every roadmap to life.",
} as const;

/** Team profile count — must match team-data.ts member count */
export const teamProfileCount = Object.keys(teamProfiles).length;

export const contactOptionsDefaults = {
  services: [...contactServices],
  budgetRanges: [...budgetRanges],
} as const;

export const siteContentRegistry = {
  site,
  hero: defaultHero,
  cta: defaultCta,
  navLinks: [...navLinks],
  marqueeItems: [...marqueeItems],
  capabilities: [...capabilities],
  processSteps: [...processSteps],
  homeStats: [...homeStats],
  aboutStats: [...aboutStats],
  aboutPage: defaultAboutPage,
  whyItems: [...whyItems],
  contactOptions: contactOptionsDefaults,
  contactPage: contactPageDefaults,
  blogPage: blogPageDefaults,
  homeSections: homeSectionsDefaults,
  servicesSection: servicesSectionDefaults,
  servicesPage: defaultServicesPage,
  whySection: whySectionDefaults,
  teamSection: teamSectionDefaults,
} as const;

export type SiteContentRegistry = typeof siteContentRegistry;

export const siteContentKeys = Object.keys(siteContentRegistry) as Array<
  keyof SiteContentRegistry
>;

export type SiteContentKey = (typeof siteContentKeys)[number];

export function getSiteContentDefault<K extends keyof SiteContentRegistry>(
  key: K,
): SiteContentRegistry[K] {
  return siteContentRegistry[key];
}

/** Flat record for API bulk fetch fallback */
export function siteContentRegistryRecord(): Record<string, unknown> {
  return { ...siteContentRegistry };
}
