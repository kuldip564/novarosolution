import type { DbService } from "./content";
import type { CloudinaryAsset } from "./media";
import { cloudinaryTransformUrl, parseCloudinaryAsset, resolveAssetUrl } from "./media";
import { serviceDetails as fallbackServiceDetails } from "./site-data";

export type ServiceLink = {
  label: string;
  href: string;
};

export type ServiceExtra = {
  outcomes: string[];
  relatedLinks: ServiceLink[];
};

export type CapabilityItem = {
  icon: string;
  title: string;
  description: string;
};

export type ServicesPageContent = {
  introTitle: string;
  introAccent: string;
  introLine: string;
  introSubline: string;
  introStats: Array<{ value: number; suffix: string; label: string }>;
  capabilities: {
    eyebrow: string;
    title: string;
    lede: string;
    items: CapabilityItem[];
  };
  process: {
    eyebrow: string;
    title: string;
    lede: string;
  };
  cta: {
    eyebrow: string;
    buttonLabel: string;
  };
  serviceExtras: Record<string, ServiceExtra>;
};

export type ServiceDetailView = {
  slug: string;
  no: string;
  title: string;
  description: string;
  bullets: string[];
  tools: string[];
  outcomes: string[];
  relatedLinks: ServiceLink[];
  imageAlt?: string;
  imageAsset?: CloudinaryAsset | null;
  media?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

export type ProcessStepView = {
  num: string;
  title: string;
  description: string;
};

const defaultServiceExtras: Record<string, ServiceExtra> = {
  "web-app-eng": {
    outcomes: [
      "Ship faster with production-ready architecture from sprint one",
      "Core Web Vitals and accessibility baked in before launch",
      "A codebase your team can extend without rewriting",
    ],
    relatedLinks: [
      { label: "FinFlow fintech case study", href: "/work" },
      { label: "How we ship with Next.js", href: "/blog/ship-fast-stack" },
    ],
  },
  "ai-machine-ml": {
    outcomes: [
      "Models evaluated against real metrics, not demo accuracy",
      "Pipelines that survive scale, drift, and compliance reviews",
      "Human-in-the-loop workflows clinicians and ops teams trust",
    ],
    relatedLinks: [
      { label: "MediSense healthcare AI project", href: "/work" },
      { label: "Shipping AI to production", href: "/blog/ai-prod-apps" },
    ],
  },
  "digital-marketing": {
    outcomes: [
      "Qualified traffic that converts — not vanity clicks",
      "Spend tied to revenue with clean attribution",
      "Brand and performance working from the same playbook",
    ],
    relatedLinks: [
      { label: "Aurora Commerce growth story", href: "/work" },
      { label: "Technical SEO that ranks", href: "/blog/tech-seo-tips" },
    ],
  },
  "cloud-devops": {
    outcomes: [
      "Infrastructure that scales without fire drills",
      "Design systems that keep UX consistent as you ship",
      "Security and observability built in, not bolted on",
    ],
    relatedLinks: [
      { label: "Helio CRM platform build", href: "/work" },
      { label: "Talk to us about your stack", href: "/contact" },
    ],
  },
};

export const defaultServicesPage: ServicesPageContent = {
  introTitle: "NOVARO",
  introAccent: "SERVICES",
  introLine: "Engineering, intelligence, and growth — built to ship.",
  introSubline:
    "Four practices. One accountable team. Production software, AI that holds up, and marketing that moves the numbers.",
  introStats: [
    { value: 4, suffix: "", label: "Core practices" },
    { value: 2, suffix: " yrs", label: "Years of experience" },
    { value: 32, suffix: "+", label: "Happy clients" },
  ],
  capabilities: {
    eyebrow: "Capabilities",
    title: "Everything that supports a product at scale.",
    lede:
      "Beyond our four core practices, we bring the surrounding craft — infrastructure, design systems, data, and growth instrumentation — so your product holds up after launch.",
    items: [
      {
        icon: "cloud",
        title: "Cloud & DevOps",
        description:
          "CI/CD, infra as code, and observability stacks that survive launch-day traffic spikes.",
      },
      {
        icon: "palette",
        title: "UI / UX Design",
        description:
          "Design systems, prototypes, and interfaces that feel fast before they are fast.",
      },
      {
        icon: "database",
        title: "Data Engineering",
        description:
          "Pipelines, warehouses, and analytics layers your product team can trust.",
      },
      {
        icon: "plug",
        title: "API & Integrations",
        description:
          "REST, GraphQL, webhooks, and third-party connections built for change.",
      },
      {
        icon: "shield",
        title: "Security & Compliance",
        description:
          "Auth, encryption, audit trails, and policies aligned to your industry.",
      },
      {
        icon: "gauge",
        title: "Performance & SEO",
        description:
          "Core Web Vitals, caching, and technical SEO baked into every release.",
      },
      {
        icon: "chart",
        title: "Analytics & Growth",
        description:
          "Event tracking, funnels, and dashboards tied to revenue — not vanity metrics.",
      },
      {
        icon: "smartphone",
        title: "Mobile Engineering",
        description:
          "Responsive and cross-platform builds that ship on schedule and feel native.",
      },
    ],
  },
  process: {
    eyebrow: "How we work",
    title: "A clear path from idea to impact.",
    lede:
      "No black boxes. Every engagement runs through the same four stages so you always know what's happening and why.",
  },
  cta: {
    eyebrow: "Let's talk",
    buttonLabel: "Book a call",
  },
  serviceExtras: defaultServiceExtras,
};

function pickString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizeLinks(value: unknown, fallback: ServiceLink[]): ServiceLink[] {
  if (!Array.isArray(value) || value.length === 0) return fallback;

  return value.map((item, index) => {
    const raw = item as Record<string, unknown>;
    const fb = fallback[index] ?? fallback[fallback.length - 1];
    return {
      label: pickString(raw.label, fb.label),
      href: pickString(raw.href, fb.href),
    };
  });
}

function normalizeStringList(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value) || value.length === 0) return fallback;
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function normalizeServiceExtras(value: unknown): Record<string, ServiceExtra> {
  if (!value || typeof value !== "object") return { ...defaultServiceExtras };

  const raw = value as Record<string, unknown>;
  const merged: Record<string, ServiceExtra> = { ...defaultServiceExtras };

  for (const slug of Object.keys(defaultServiceExtras)) {
    const entry = raw[slug];
    if (!entry || typeof entry !== "object") continue;
    const item = entry as Record<string, unknown>;
    merged[slug] = {
      outcomes: normalizeStringList(item.outcomes, defaultServiceExtras[slug].outcomes),
      relatedLinks: normalizeLinks(item.relatedLinks, defaultServiceExtras[slug].relatedLinks),
    };
  }

  return merged;
}

function normalizeCapabilityItems(value: unknown): CapabilityItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    return defaultServicesPage.capabilities.items.map((item) => ({ ...item }));
  }

  return value.map((entry, index) => {
    const raw = entry as Record<string, unknown>;
    const fb =
      defaultServicesPage.capabilities.items[index] ??
      defaultServicesPage.capabilities.items[
        index % defaultServicesPage.capabilities.items.length
      ];

    return {
      icon: pickString(raw.icon, fb.icon),
      title: pickString(raw.title, fb.title),
      description: pickString(raw.description, fb.description),
    };
  });
}

export function normalizeServicesPage(value: unknown): ServicesPageContent {
  if (!value || typeof value !== "object") {
    return { ...defaultServicesPage, serviceExtras: { ...defaultServiceExtras } };
  }

  const raw = value as Record<string, unknown>;
  const capabilities = (raw.capabilities ?? {}) as Record<string, unknown>;
  const process = (raw.process ?? {}) as Record<string, unknown>;
  const cta = (raw.cta ?? {}) as Record<string, unknown>;

  const introStatsRaw = Array.isArray(raw.introStats) ? raw.introStats : defaultServicesPage.introStats;
  const introStats = introStatsRaw.map((item, index) => {
    const stat = item as Record<string, unknown>;
    const fb = defaultServicesPage.introStats[index] ?? defaultServicesPage.introStats[0];
    return {
      value: typeof stat.value === "number" ? stat.value : fb.value,
      suffix: pickString(stat.suffix, fb.suffix),
      label: pickString(stat.label, fb.label),
    };
  });

  return {
    introTitle: pickString(raw.introTitle, defaultServicesPage.introTitle),
    introAccent: pickString(raw.introAccent, defaultServicesPage.introAccent),
    introLine: pickString(raw.introLine, defaultServicesPage.introLine),
    introSubline: pickString(raw.introSubline, defaultServicesPage.introSubline),
    introStats,
    capabilities: {
      eyebrow: pickString(capabilities.eyebrow, defaultServicesPage.capabilities.eyebrow),
      title: pickString(capabilities.title, defaultServicesPage.capabilities.title),
      lede: pickString(capabilities.lede, defaultServicesPage.capabilities.lede),
      items: normalizeCapabilityItems(capabilities.items),
    },
    process: {
      eyebrow: pickString(process.eyebrow, defaultServicesPage.process.eyebrow),
      title: pickString(process.title, defaultServicesPage.process.title),
      lede: pickString(process.lede, defaultServicesPage.process.lede),
    },
    cta: {
      eyebrow: pickString(cta.eyebrow, defaultServicesPage.cta.eyebrow),
      buttonLabel: pickString(cta.buttonLabel, defaultServicesPage.cta.buttonLabel),
    },
    serviceExtras: normalizeServiceExtras(raw.serviceExtras),
  };
}

export function normalizeProcessSteps(value: unknown): ProcessStepView[] {
  const fallback = [
    {
      num: "01",
      title: "Discover",
      description:
        "We map goals, users, and constraints — then define success in metrics you can track, not buzzwords.",
    },
    {
      num: "02",
      title: "Design",
      description:
        "Architecture, UX, and a clickable direction you can react to before we commit to the build.",
    },
    {
      num: "03",
      title: "Build",
      description:
        "Tight delivery sprints with working software in your hands every week — typed, tested, and reviewable.",
    },
    {
      num: "04",
      title: "Launch & Scale",
      description:
        "We ship, measure, and keep optimizing performance, infrastructure, and growth loops.",
    },
  ];

  if (!Array.isArray(value) || value.length === 0) return fallback;

  return value.map((item, index) => {
    const raw = item as Record<string, unknown>;
    const fb = fallback[index] ?? fallback[fallback.length - 1];
    return {
      num: pickString(raw.num, fb.num),
      title: pickString(raw.title, fb.title),
      description: pickString(raw.description, fb.description),
    };
  });
}

function slugFromFallback(index: number): string {
  const slugs = ["web-app-eng", "ai-machine-ml", "digital-marketing", "cloud-devops"];
  return slugs[index] ?? `service-${index + 1}`;
}

export function buildServiceDetails(
  services: DbService[],
  pageContent: ServicesPageContent,
): ServiceDetailView[] {
  if (!services.length) {
    return fallbackServiceDetails.map((service, index) => {
      const slug = slugFromFallback(index);
      const extra = pageContent.serviceExtras[slug] ?? defaultServiceExtras[slug];
      return {
        slug,
        no: service.no,
        title: service.title,
        description: service.description,
        bullets: [...service.bullets],
        tools: [],
        outcomes: extra?.outcomes ?? [],
        relatedLinks: extra?.relatedLinks ?? [],
        imageAlt: "media" in service ? service.media?.alt : undefined,
        media: "media" in service ? service.media : undefined,
      };
    });
  }

  return services.map((service, index) => {
    const imageAsset = parseCloudinaryAsset(service.image);
    const url = resolveAssetUrl(service.image);
    const extra =
      pageContent.serviceExtras[service.slug] ??
      defaultServiceExtras[service.slug] ??
      defaultServiceExtras["web-app-eng"];

    return {
      slug: service.slug,
      no: String(index + 1).padStart(2, "0"),
      title: service.title,
      description: service.description,
      bullets: service.bullets ?? [],
      tools: service.tags ?? [],
      outcomes: extra.outcomes,
      relatedLinks: extra.relatedLinks,
      imageAlt: service.imageAlt ?? service.title,
      imageAsset,
      media: url
        ? {
            src:
              cloudinaryTransformUrl(imageAsset ?? service.image, {
                width: 1200,
                crop: "fill",
              }) ?? url,
            alt: service.imageAlt ?? service.title,
            width: 2048,
            height: 1529,
          }
        : undefined,
    };
  });
}
