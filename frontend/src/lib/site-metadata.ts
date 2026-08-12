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
  "Novaro Solution — Gandhinagar, Gujarat IT studio for web app development, AI/ML, and digital marketing. Serving Ahmedabad, Gujarat & India. Production software from MVP to scale.";

export const siteIcons: NonNullable<Metadata["icons"]> = {
  icon: [{ url: site.brandIcon, type: "image/png" }],
  apple: [{ url: site.brandIcon, type: "image/png" }],
  shortcut: site.brandIcon,
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
    default: `${site.name} — Web App & AI Studio | Gandhinagar, Gujarat`,
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
    languages: { "en-IN": "/" },
  },
  other: geoMetaTags(),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    title: `${site.name} — Software · Intelligence · Growth`,
    description: defaultSiteDescription,
    url: siteBaseUrl(),
    images: [
      {
        url: "/images/webapp-dashboard.webp",
        width: 2048,
        height: 1529,
        alt: `${site.name} — web app development studio in Gandhinagar, Gujarat`,
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
      languages: input.path ? { "en-IN": input.path } : undefined,
    },
    other: geoMetaTags(),
    openGraph: {
      type: "website",
      locale: "en_IN",
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
