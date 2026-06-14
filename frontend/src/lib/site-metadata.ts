import type { Metadata } from "next";
import { site } from "./site-data";

export function siteBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

export function brandIconAbsoluteUrl(): string {
  return `${siteBaseUrl()}${site.brandIcon}`;
}

export const defaultSiteDescription =
  "Novaro Solution builds production-grade web apps, AI systems, and digital marketing engines for ambitious companies.";

export const siteIcons: NonNullable<Metadata["icons"]> = {
  icon: [{ url: site.brandIcon, type: "image/png" }],
  apple: [{ url: site.brandIcon, type: "image/png" }],
  shortcut: site.brandIcon,
};

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteBaseUrl()),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: defaultSiteDescription,
  applicationName: site.name,
  icons: siteIcons,
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description: defaultSiteDescription,
    images: [
      {
        url: site.brandIcon,
        width: 1024,
        height: 1024,
        alt: site.name,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: site.name,
    description: defaultSiteDescription,
    images: [site.brandIcon],
  },
};

export function createPageMetadata(input: {
  title: string;
  description?: string;
  path?: string;
}): Metadata {
  const description = input.description ?? defaultSiteDescription;
  const ogTitle = `${input.title} — ${site.name}`;

  return {
    title: input.title,
    description,
    icons: siteIcons,
    openGraph: {
      title: ogTitle,
      description,
      url: input.path ? input.path : undefined,
      images: [{ url: site.brandIcon, alt: site.name }],
    },
    twitter: {
      title: ogTitle,
      description,
      images: [site.brandIcon],
    },
  };
}

export function organizationJsonLd() {
  const socialProfiles = Object.values(site.social).filter(
    (url) => url.startsWith("http"),
  );

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: siteBaseUrl(),
    logo: brandIconAbsoluteUrl(),
    email: site.email,
    telephone: site.phone,
    ...(socialProfiles.length > 0 ? { sameAs: socialProfiles } : {}),
  };
}
