import { defaultHero, type HeroContent } from "./site-data";

export function normalizeHeroContent(value: unknown): HeroContent {
  if (!value || typeof value !== "object") {
    return { ...defaultHero };
  }

  const raw = value as Record<string, unknown>;
  const pick = (key: keyof HeroContent): string => {
    const fallback = defaultHero[key];
    return typeof raw[key] === "string" && raw[key].trim()
      ? (raw[key] as string).trim()
      : fallback;
  };

  let headline = pick("headline");
  let headlineAccent = pick("headlineAccent");
  let eyebrow = pick("eyebrow");
  let lede = pick("lede");
  // ponytail: CMS still stores the India-only hero; rewrite those exact strings so the global headline ships without a migration
  // Earlier built-in defaults (never hand-written by an editor) are upgraded to the current ones.
  const legacyHeadline = [
    "We engineer products",
    "Web app development",
    "We build software",
    "Custom software",
  ].includes(headline);
  const legacyAccent = [
    "that earn trust.",
    "in Gandhinagar.",
    "worldwide.",
    "for growing businesses.",
  ].includes(headlineAccent);
  if (legacyHeadline || legacyAccent) {
    headline = defaultHero.headline;
    headlineAccent = defaultHero.headlineAccent;
  }
  if (
    eyebrow === "Digital product studio · Gandhinagar, Gujarat" ||
    eyebrow === "Digital product studio · Gandhinagar" ||
    eyebrow === "Software · AI · Growth · Worldwide"
  ) {
    eyebrow = defaultHero.eyebrow;
  }
  if (
    lede.startsWith("Novaro builds production-grade web and mobile apps") ||
    lede.includes("USA, UK, Europe") ||
    lede.startsWith("Web apps, mobile products, AI, and the marketing around them") ||
    lede.startsWith("Web apps, mobile apps, AI features and the marketing around them")
  ) {
    lede = defaultHero.lede;
  }

  // Legacy seed stored the full sentence in headline — split cleanly for display.
  if (
    headlineAccent &&
    headline.toLowerCase().includes(headlineAccent.toLowerCase()) &&
    headline.length > headlineAccent.length
  ) {
    headline = headline
      .replace(new RegExp(headlineAccent.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), "")
      .replace(/,\s*$/, "")
      .trim();
    if (headline && !headline.endsWith(",")) {
      headline = `${headline},`;
    }
  }

  return {
    eyebrow,
    headline: headline || defaultHero.headline,
    headlineAccent: headlineAccent || defaultHero.headlineAccent,
    lede,
    ...upgradeLegacyActions(pick("ctaPrimary"), pick("ctaSecondary")),
    ...upgradeLegacyStat(pick("metaStat"), pick("metaLabel")),
  };
}

/** Earlier default button labels → the site's standard labels (conversion tracking relies on them). */
function upgradeLegacyActions(primary: string, secondary: string) {
  const map: Record<string, string> = {
    "Start your project": "Start Your Project",
    "Book a call": "Start Your Project",
    "Explore our work": "View Case Studies",
    "See our work": "View Case Studies",
  };
  return { ctaPrimary: map[primary] ?? primary, ctaSecondary: map[secondary] ?? secondary };
}

/** The old "32 clients served" default can't be verified anywhere on the site: show the reply-time fact instead. */
function upgradeLegacyStat(metaStat: string, metaLabel: string) {
  if (metaStat === "32" && /clients served/i.test(metaLabel)) {
    return { metaStat: defaultHero.metaStat, metaLabel: defaultHero.metaLabel };
  }
  return { metaStat, metaLabel };
}

export function heroContentFields(): Array<{
  key: keyof HeroContent;
  label: string;
  hint?: string;
  multiline?: boolean;
}> {
  return [
    { key: "eyebrow", label: "Eyebrow", hint: "Small label above the headline" },
    {
      key: "headline",
      label: "Headline (line 1)",
      hint: "Main title before the blue accent phrase. Type \\n to start a new line.",
    },
    {
      key: "headlineAccent",
      label: "Accent phrase (line 2)",
      hint: "Shown in gradient blue on the second line",
    },
    {
      key: "lede",
      label: "Description",
      hint: "Short paragraph under the headline",
      multiline: true,
    },
    { key: "ctaPrimary", label: "Primary button", hint: "Main call-to-action" },
    { key: "ctaSecondary", label: "Secondary button", hint: "Ghost button next to primary" },
    { key: "metaStat", label: "Stat value", hint: "e.g. 2" },
    { key: "metaLabel", label: "Stat label", hint: "e.g. Years of experience" },
  ];
}
