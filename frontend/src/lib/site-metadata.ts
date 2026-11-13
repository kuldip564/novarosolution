import type { Metadata } from "next";
import { site } from "./site-data";
import { geoMetaTags, defaultKeywords } from "./geo-seo";

export function siteBaseUrl(): string {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.novarosolution.com";

  try {
    const url = new URL(configuredUrl);
    if (url.hostname.toLowerCase() === "novarosolution.com") {
      url.hostname = "www.novarosolution.com";
    }
    return url.origin;
  } catch {
    return "https://www.novarosolution.com";
  }
}

export function brandIconAbsoluteUrl(): string {
  return `${siteBaseUrl()}${site.brandIcon}`;
}

export const defaultSiteDescription =
  "Novaro Solution is a Gandhinagar IT company building custom software, web and mobile apps, AI solutions, and digital marketing for businesses across Ahmedabad, Gujarat, and worldwide.";

export const ogLocales = { locale: "en_US", alternateLocale: ["en_GB", "en_IN", "en_CA", "en_AU"] };

export const siteIcons: NonNullable<Metadata["icons"]> = {
  icon: [{ url: "/brand/novaro-icon-192.png", type: "image/png", sizes: "192x192" }],
  apple: [{ url: "/brand/novaro-icon-192.png", type: "image/png", sizes: "192x192" }],
  shortcut: "/brand/novaro-icon-192.png",
};

const defaultRobots: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteBaseUrl()),
  title: {
    default: `${site.name} | IT & Web App Studio in Gandhinagar`,
    template: `%s — ${site.name}`,
  },
  description: defaultSiteDescription,
  keywords: defaultKeywords,
  applicationName: site.name,
  authors: [{ name: site.name, url: siteBaseUrl() }],
  creator: site.name,
  publisher: site.name,
  category: "Technology",
  icons: siteIcons,
  manifest: "/site.webmanifest",
  robots: defaultRobots,
  // No canonical here: a layout-level canonical would make any page without its own point at "/".
  // Each page sets its own (home included) via createPageMetadata / generateMetadata.
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    other: {
      "probely-verification": "3426b8c7-9cb8-4662-8dc2-9707715bc2f6",
      ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
        ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
        : {}),
    },
  },
  other: geoMetaTags(),
  openGraph: {
    type: "website",
    ...ogLocales,
    siteName: site.name,
    title: `${site.name} — Software · Intelligence · Growth`,
    description: defaultSiteDescription,
    url: siteBaseUrl(),
    images: [
      {
        url: ogImagePath("Software, AI & growth for companies worldwide", "Novaro Solution"),
        width: 1200,
        height: 630,
        alt: `${site.name} — software development company for the USA, UK, Europe, and India`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: defaultSiteDescription,
    images: [ogImagePath("Software, AI & growth for companies worldwide", "Novaro Solution")],
  },
};

/** Branded 1200×630 share image rendered by app/og/route.tsx. */
export function ogImagePath(title: string, eyebrow?: string): string {
  const params = new URLSearchParams({ title });
  if (eyebrow) params.set("eyebrow", eyebrow);
  return `/og?${params.toString()}`;
}

export function createPageMetadata(input: {
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
  /** Photo to use as the share image; defaults to a branded card with the page title. */
  ogImage?: string;
  /** Short label shown above the title on the branded share card. */
  ogEyebrow?: string;
  /** Headline for the branded share card (defaults to the page title without the brand). */
  ogHeadline?: string;
  noIndex?: boolean;
}): Metadata {
  const base = siteBaseUrl();
  const description = input.description ?? defaultSiteDescription;
  const pageTitle = input.title.includes(site.name)
    ? input.title
    : `${input.title} — ${site.name}`;
  const canonical = input.path ? `${base}${input.path}` : undefined;
  const headline = input.ogHeadline ?? input.title.replace(` — ${site.name}`, "");
  const image = input.ogImage
    ? { url: input.ogImage, width: 2048, height: 1529, alt: pageTitle }
    : { url: ogImagePath(headline, input.ogEyebrow), width: 1200, height: 630, alt: pageTitle };
  const imageUrl = image.url.startsWith("http") ? image.url : `${base}${image.url}`;

  return {
    title: { absolute: pageTitle },
    description,
    keywords: input.keywords ?? defaultKeywords,
    icons: siteIcons,
    robots: input.noIndex ? { index: false, follow: true } : defaultRobots,
    alternates: {
      canonical: input.path ?? undefined,
    },
    other: geoMetaTags(),
    openGraph: {
      type: "website",
      ...ogLocales,
      url: canonical,
      title: pageTitle,
      description,
      siteName: site.name,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [{ url: imageUrl, alt: pageTitle }],
    },
  };
}
