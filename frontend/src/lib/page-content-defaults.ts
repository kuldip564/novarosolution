/**
 * Page-level copy defaults — synced with site-content-registry.ts and backend seed.
 */

export const contactPageDefaults = {
  eyebrow: "Contact",
  title: "NOVARO",
  titleAccent: "CONTACT",
  description:
    "Tell us about your project. The more detail you share, the sharper our first response will be.",
} as const;

export const blogPageDefaults = {
  eyebrow: "Insights",
  title: "NOVARO",
  titleAccent: "BLOG",
  description:
    "Product craft, AI in production, and growth — written by the team shipping it every day.",
  ctaEyebrow: "Work with us",
} as const;

export const homeSectionsDefaults = {
  logos: {
    label: "Trusted by teams building what's next",
  },
  services: {
    eyebrow: "What we do",
    practiceSingular: "One core practice.",
    practicePlural: "{count} core practices.",
    titleSuffix: "One accountable team.",
    description:
      "Web and app engineering, AI/ML, and digital marketing under one roof — so nothing falls through the gaps between build and growth.",
  },
  work: {
    eyebrow: "Selected work",
    title: "Products we're proud\nto put our name on.",
    description:
      "Live client launches across logistics, services, and premium D2C — built to perform long after go-live.",
  },
  testimonials: {
    eyebrow: "Client voices",
    title: "Trusted by teams who ship.",
    description:
      "Honest feedback from product leaders we've built with — not filler quotes.",
  },
  process: {
    eyebrow: "How we work",
    title: "A clear path from idea to impact.",
    description: "Four stages, zero black boxes — you always know what's shipping and why.",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions, answered.",
    description: "What founders and product teams ask before we start building together.",
  },
  cta: {
    eyebrow: "Let's talk",
    buttonLabel: "Book a call",
  },
} as const;

export type HomeSectionsContent = typeof homeSectionsDefaults;
