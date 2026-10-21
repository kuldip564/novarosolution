import type { Metadata } from "next";
import { geoMetaTags, homeKeywords } from "./geo-seo";
import { site } from "./site-data";
import { LOCAL_BUSINESS_ID, ORGANIZATION_ID, WEBSITE_ID } from "./structured-data";
import { brandIconAbsoluteUrl, siteBaseUrl, siteIcons } from "./site-metadata";

export const homePagePath = "/";

export const homeSeoTitle =
  "Software Development Company | Web Apps, AI & Digital Marketing — Novaro Solution";

export const homeSeoDescription =
  "Novaro Solution builds custom software, web and mobile apps, AI systems, and digital marketing for companies in the USA, UK, Europe, the Middle East, and India. Studio in Gandhinagar.";

export const homeOgImage = "/images/webapp-dashboard.webp";

export function homePageMetadata(): Metadata {
  const url = `${siteBaseUrl()}${homePagePath}`;
  const ogTitle = `${site.name} — Global Software, AI & Growth`;
  const ogImageUrl = `${siteBaseUrl()}${homeOgImage}`;

  return {
    title: homeSeoTitle,
    description: homeSeoDescription,
    keywords: homeKeywords,
    other: geoMetaTags(),
    alternates: {
      canonical: homePagePath,
    },
    icons: siteIcons,
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      title: ogTitle,
      description: homeSeoDescription,
      siteName: site.name,
      images: [
        {
          url: homeOgImage,
          width: 2048,
          height: 1529,
          alt: "Novaro Solution — software development company for the USA, UK, Europe, and India",
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
      "@type": "WebPage",
      "@id": `${base}${homePagePath}#webpage`,
      url: `${base}${homePagePath}`,
      name: homeSeoTitle,
      description: homeSeoDescription,
      inLanguage: "en",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": LOCAL_BUSINESS_ID },
      publisher: { "@id": ORGANIZATION_ID },
    },
  ];
}
