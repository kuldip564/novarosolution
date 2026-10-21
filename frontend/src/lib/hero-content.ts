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
  const legacyHeadline =
    headline === "We engineer products" || headline === "Web app development";
  const legacyAccent =
    headlineAccent === "that earn trust." || headlineAccent === "in Gandhinagar.";
  if (legacyHeadline || legacyAccent) {
    headline = defaultHero.headline;
    headlineAccent = defaultHero.headlineAccent;
  }
  if (
    eyebrow === "Digital product studio · Gandhinagar, Gujarat" ||
    eyebrow === "Digital product studio · Gandhinagar"
  ) {
    eyebrow = defaultHero.eyebrow;
  }
  if (
    lede.startsWith("Novaro builds production-grade web and mobile apps") ||
    lede.includes("USA, UK, Europe")
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
    ctaPrimary: pick("ctaPrimary"),
    ctaSecondary: pick("ctaSecondary"),
    metaStat: pick("metaStat"),
    metaLabel: pick("metaLabel"),
  };
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
      hint: "Main title before the blue accent phrase",
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
