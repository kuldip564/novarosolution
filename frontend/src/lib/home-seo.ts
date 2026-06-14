import type { Metadata } from "next";
import { site } from "./site-data";
import { brandIconAbsoluteUrl, siteBaseUrl, siteIcons } from "./site-metadata";

export const homePagePath = "/";

export const homeSeoTitle =
  "Web App, AI/ML & Digital Marketing Studio | Novaro Solution India";

export const homeSeoDescription =
  "Novaro Solution is a Gandhinagar IT studio shipping production web apps, AI/ML systems, and digital marketing — one team from architecture to launch.";

export const homeKeywords = [
  "web app development company India",
  "AI machine learning studio Gujarat",
  "digital marketing agency Gandhinagar",
  "Next.js development studio",
  "software product studio",
  "Novaro Solution",
];

export const homeOgImage = "/images/webapp-dashboard.webp";

export function homePageMetadata(): Metadata {
  const url = `${siteBaseUrl()}${homePagePath}`;
  const ogTitle = `${site.name} — Software · Intelligence · Growth`;
  const ogImageUrl = `${siteBaseUrl()}${homeOgImage}`;

  return {
    title: homeSeoTitle,
    description: homeSeoDescription,
    keywords: homeKeywords,
    alternates: {
      canonical: homePagePath,
    },
    icons: siteIcons,
    openGraph: {
      type: "website",
      url,
      title: ogTitle,
      description: homeSeoDescription,
      siteName: site.name,
      images: [
        {
          url: homeOgImage,
          width: 2048,
          height: 1529,
          alt: "Novaro Solution web and app engineering studio preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: homeSeoDescription,
      images: [ogImageUrl],
    },
  };
}

export function homePageJsonLd() {
  const base = siteBaseUrl();

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: site.name,
      url: base,
      description: homeSeoDescription,
      inLanguage: "en-IN",
      publisher: {
        "@type": "Organization",
        name: site.name,
        url: base,
        logo: brandIconAbsoluteUrl(),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${base}${homePagePath}#webpage`,
      url: `${base}${homePagePath}`,
      name: homeSeoTitle,
      description: homeSeoDescription,
      isPartOf: { "@id": base },
      about: {
        "@type": "Organization",
        name: site.name,
      },
    },
  ];
}
