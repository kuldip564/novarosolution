import type { Metadata } from "next";
import { site } from "./site-data";
import { geoMetaTags, defaultKeywords } from "./geo-seo";

export function siteBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.novarosolution.com"
  );
}

export function brandIconAbsoluteUrl(): string {
  return `${siteBaseUrl()}${site.brandIcon}`;
}

export const defaultSiteDescription =
  "Novaro Solution builds custom software, web apps, AI systems, and digital marketing for companies in the USA, UK, Europe, the Middle East, and India.";

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
    default: `${site.name} — Global Software, AI & Growth Studio`,
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
  alternates: {
    canonical: "/",
  },
  other: geoMetaTags(),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.name,
    title: `${site.name} — Software · Intelligence · Growth`,
    description: defaultSiteDescription,
    url: siteBaseUrl(),
    images: [
      {
        url: "/images/webapp-dashboard.webp",
        width: 2048,
        height: 1529,
        alt: `${site.name} — software development company for the USA, UK, Europe, and India`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: defaultSiteDescription,
    images: ["/images/webapp-dashboard.webp"],
  },
};

export function createPageMetadata(input: {
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
  ogImage?: string;
}): Metadata {
  const base = siteBaseUrl();
  const description = input.description ?? defaultSiteDescription;
  const ogTitle = `${input.title} — ${site.name}`;
  const canonical = input.path ? `${base}${input.path}` : undefined;
  const ogImage = input.ogImage ?? "/images/webapp-dashboard.webp";

  return {
    title: input.title,
    description,
    keywords: input.keywords ?? defaultKeywords,
    icons: siteIcons,
    robots: defaultRobots,
    alternates: {
      canonical: input.path ?? undefined,
    },
    other: geoMetaTags(),
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonical,
      title: ogTitle,
      description,
      siteName: site.name,
      images: [
        {
          url: ogImage,
          width: 2048,
          height: 1529,
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [`${base}${ogImage}`],
    },
  };
}
