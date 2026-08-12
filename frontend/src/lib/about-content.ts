import { teamCount } from "./team-data";

export type AboutMilestone = {
  year: string;
  title: string;
  text: string;
};

export type AboutValue = {
  icon: string;
  title: string;
  description: string;
};

export type AboutWhyItem = {
  key: string;
  title: string;
  description: string;
};

export type AboutStat = {
  value: number;
  suffix: string;
  label: string;
};

export type AboutPageContent = {
  introTitle: string;
  introAccent: string;
  introLine: string;
  whoWeAre: {
    eyebrow: string;
    title: string;
    body: string;
  };
  missionVision: {
    eyebrow: string;
    missionLabel: string;
    mission: string;
    visionLabel: string;
    vision: string;
  };
  timeline: {
    eyebrow: string;
    title: string;
    milestones: AboutMilestone[];
  };
  values: {
    eyebrow: string;
    title: string;
    items: AboutValue[];
  };
  stats: {
    eyebrow: string;
    title: string;
  };
  team: {
    eyebrow: string;
    title: string;
    description: string;
  };
  whyUs: {
    eyebrow: string;
    title: string;
  };
  cta: {
    eyebrow: string;
    buttonLabel: string;
  };
};

export const defaultAboutPage: AboutPageContent = {
  introTitle: "NOVARO",
  introAccent: "ABOUT",
  introLine: "We build digital products that earn trust — and keep earning it after launch.",
  whoWeAre: {
    eyebrow: "Who we are",
    title: "A senior studio that ships\nwith you, not around you.",
    body:
      "Novaro Solution is an IT studio headquartered in Gandhinagar, Gujarat. We specialise in web and app engineering, AI/ML, and digital marketing — helping founders and brands ship products that perform in production, not just in pitch decks. In two years we've delivered 50+ platforms for clients in D2C, logistics, healthcare, and services — with one accountable team from first wireframe to post-launch growth.",
  },
  missionVision: {
    eyebrow: "Mission & vision",
    missionLabel: "Mission",
    mission:
      "Ship software, intelligence, and growth programs that move real business metrics — with craftsmanship you can see in the details.",
    visionLabel: "Vision",
    vision:
      "To be the team founders call when the stakes are high and the roadmap has to ship — known for depth across engineering, AI, and growth under one roof.",
  },
  timeline: {
    eyebrow: "Our story",
    title: "From a small studio\nto a trusted partner.",
    milestones: [
      {
        year: "2024",
        title: "Founded",
        text:
          "Kuldip Chaudhary, Mehul Chaudhary, and Ronak Prajapati founded Novaro in Gandhinagar — one focused studio shipping web, app, and AI products without the agency hand-off cycle.",
      },
      {
        year: "2025",
        title: "AI in production",
        text:
          "We brought AI/ML and digital marketing in-house so intelligent features and growth campaigns share the same strategy and codebase.",
      },
      {
        year: "Today",
        title: "Two years in",
        text:
          "Two years of shipping production software for clients across fintech, healthcare, and D2C — still small by choice, still hands-on.",
      },
    ],
  },
  values: {
    eyebrow: "Core values",
    title: "What we won't compromise on.",
    items: [
      {
        icon: "spark",
        title: "Craft over hype",
        description:
          "We polish the details users feel — performance, accessibility, and code you can extend without fear.",
      },
      {
        icon: "shield",
        title: "Ownership end-to-end",
        description:
          "One accountable team from architecture to analytics. No mystery vendors, no blame ping-pong.",
      },
      {
        icon: "compass",
        title: "Clarity in complexity",
        description:
          "We translate hard technical choices into plain language so you can decide with confidence.",
      },
      {
        icon: "chart",
        title: "Measure what matters",
        description:
          "We tie our work to outcomes — retention, conversion, latency, revenue — not slide decks.",
      },
    ],
  },
  stats: {
    eyebrow: "By the numbers",
    title: "Proof in the work.",
  },
  team: {
    eyebrow: "Our people",
    title: "Founders, leaders & the team.",
    description:
      "Co-founders Kuldip Chaudhary, Mehul Chaudhary, and Ronak Prajapati built Novaro to ship products with real accountability. Alpesh Prajapati manages operations and delivery. Maulik, Krina, Sonal, and Abhi are the engineers, designers, and marketers who bring every roadmap to life.",
  },
  whyUs: {
    eyebrow: "Why Novaro",
    title: "What sets us apart.",
  },
  cta: {
    eyebrow: "Let's build something",
    buttonLabel: "Start a project",
  },
};

export const defaultAboutWhyItems: AboutWhyItem[] = [
  {
    key: "01",
    title: "Full-stack under one roof",
    description:
      "Engineering, AI, design, and marketing in the same room — no hand-offs, no finger-pointing.",
  },
  {
    key: "02",
    title: "Built to scale, not to demo",
    description:
      "Production code from day one, with architecture that grows when you do — not a prototype dressed up for pitch day.",
  },
  {
    key: "03",
    title: "Outcomes, not hours",
    description:
      "We measure ourselves on the metrics that matter to your business, then move them.",
  },
  {
    key: "04",
    title: "Transparent delivery",
    description:
      "Weekly working software, clear milestones, and honest updates — you always know where things stand.",
  },
];

function pickString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizeMilestones(value: unknown): AboutMilestone[] {
  if (!Array.isArray(value) || value.length === 0) {
    return defaultAboutPage.timeline.milestones;
  }

  return value.map((item, index) => {
    const raw = item as Record<string, unknown>;
    const fallback = defaultAboutPage.timeline.milestones[index] ??
      defaultAboutPage.timeline.milestones[defaultAboutPage.timeline.milestones.length - 1];
    return {
      year: pickString(raw.year, fallback.year),
      title: pickString(raw.title, fallback.title),
      text: pickString(raw.text, fallback.text),
    };
  });
}

function normalizeValues(value: unknown): AboutValue[] {
  if (!Array.isArray(value) || value.length === 0) {
    return defaultAboutPage.values.items;
  }

  return value.map((item, index) => {
    const raw = item as Record<string, unknown>;
    const fallback = defaultAboutPage.values.items[index] ??
      defaultAboutPage.values.items[defaultAboutPage.values.items.length - 1];
    return {
      icon: pickString(raw.icon, fallback.icon),
      title: pickString(raw.title, fallback.title),
      description: pickString(raw.description, fallback.description),
    };
  });
}

export function normalizeAboutPage(value: unknown): AboutPageContent {
  if (!value || typeof value !== "object") {
    return { ...defaultAboutPage };
  }

  const raw = value as Record<string, unknown>;
  const who = (raw.whoWeAre ?? {}) as Record<string, unknown>;
  const mv = (raw.missionVision ?? {}) as Record<string, unknown>;
  const timeline = (raw.timeline ?? {}) as Record<string, unknown>;
  const values = (raw.values ?? {}) as Record<string, unknown>;
  const stats = (raw.stats ?? {}) as Record<string, unknown>;
  const team = (raw.team ?? {}) as Record<string, unknown>;
  const whyUs = (raw.whyUs ?? {}) as Record<string, unknown>;
  const cta = (raw.cta ?? {}) as Record<string, unknown>;

  return {
    introTitle: pickString(raw.introTitle, defaultAboutPage.introTitle),
    introAccent: pickString(raw.introAccent, defaultAboutPage.introAccent),
    introLine: pickString(raw.introLine, defaultAboutPage.introLine),
    whoWeAre: {
      eyebrow: pickString(who.eyebrow, defaultAboutPage.whoWeAre.eyebrow),
      title: pickString(who.title, defaultAboutPage.whoWeAre.title),
      body: pickString(who.body, defaultAboutPage.whoWeAre.body),
    },
    missionVision: {
      eyebrow: pickString(mv.eyebrow, defaultAboutPage.missionVision.eyebrow),
      missionLabel: pickString(mv.missionLabel, defaultAboutPage.missionVision.missionLabel),
      mission: pickString(mv.mission, defaultAboutPage.missionVision.mission),
      visionLabel: pickString(mv.visionLabel, defaultAboutPage.missionVision.visionLabel),
      vision: pickString(mv.vision, defaultAboutPage.missionVision.vision),
    },
    timeline: {
      eyebrow: pickString(timeline.eyebrow, defaultAboutPage.timeline.eyebrow),
      title: pickString(timeline.title, defaultAboutPage.timeline.title),
      milestones: normalizeMilestones(timeline.milestones),
    },
    values: {
      eyebrow: pickString(values.eyebrow, defaultAboutPage.values.eyebrow),
      title: pickString(values.title, defaultAboutPage.values.title),
      items: normalizeValues(values.items),
    },
    stats: {
      eyebrow: pickString(stats.eyebrow, defaultAboutPage.stats.eyebrow),
      title: pickString(stats.title, defaultAboutPage.stats.title),
    },
    team: {
      eyebrow: pickString(team.eyebrow, defaultAboutPage.team.eyebrow),
      title: pickString(team.title, defaultAboutPage.team.title),
      description: pickString(team.description, defaultAboutPage.team.description),
    },
    whyUs: {
      eyebrow: pickString(whyUs.eyebrow, defaultAboutPage.whyUs.eyebrow),
      title: pickString(whyUs.title, defaultAboutPage.whyUs.title),
    },
    cta: {
      eyebrow: pickString(cta.eyebrow, defaultAboutPage.cta.eyebrow),
      buttonLabel: pickString(cta.buttonLabel, defaultAboutPage.cta.buttonLabel),
    },
  };
}

export function normalizeAboutWhyItems(value: unknown): AboutWhyItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    return defaultAboutWhyItems;
  }

  return value.map((item, index) => {
    const raw = item as Record<string, unknown>;
    const fallback = defaultAboutWhyItems[index] ?? defaultAboutWhyItems[defaultAboutWhyItems.length - 1];
    return {
      key: pickString(raw.key, fallback.key),
      title: pickString(raw.title, fallback.title),
      description: pickString(raw.description, fallback.description),
    };
  });
}

export function normalizeAboutStats(value: unknown): AboutStat[] {
  const fallback = [
    { value: 2, suffix: " yrs", label: "Shipping production software" },
    { value: 32, suffix: "+", label: "Clients across India & abroad" },
    { value: teamCount, suffix: "", label: "People on the team" },
    { value: 98, suffix: "%", label: "Clients who return for phase two" },
  ];

  if (!Array.isArray(value) || value.length === 0) {
    return fallback;
  }

  return value.map((item, index) => {
    const raw = item as Record<string, unknown>;
    const fb = fallback[index] ?? fallback[fallback.length - 1];
    return {
      value: typeof raw.value === "number" ? raw.value : fb.value,
      suffix: pickString(raw.suffix, fb.suffix),
      label: pickString(raw.label, fb.label),
    };
  });
}
