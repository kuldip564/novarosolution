import type { Metadata } from "next";
import { geoMetaTags, homeKeywords } from "./geo-seo";
import { site } from "./site-data";
import {
  LOCAL_BUSINESS_ID,
  ORGANIZATION_ID,
  WEBSITE_ID,
  faqPageJsonLd,
} from "./structured-data";
import { brandIconAbsoluteUrl, siteBaseUrl, siteIcons } from "./site-metadata";

export const homePagePath = "/";

export const homeSeoTitle =
  "Web App Development Company Gandhinagar | AI/ML & Digital Marketing — Novaro Solution";

export const homeSeoDescription =
  "Novaro Solution — IT studio in Gandhinagar, Gujarat. Web & mobile apps, AI/ML, SEO & digital marketing for 32+ clients across Ahmedabad, GIFT City, Vadodara, Surat & India. Next.js experts.";

export const homeOgImage = "/images/webapp-dashboard.webp";

export function homePageMetadata(): Metadata {
  const url = `${siteBaseUrl()}${homePagePath}`;
  const ogTitle = `${site.name} — Gandhinagar, Gujarat IT Studio`;
  const ogImageUrl = `${siteBaseUrl()}${homeOgImage}`;

  return {
    title: homeSeoTitle,
    description: homeSeoDescription,
    keywords: homeKeywords,
    other: geoMetaTags(),
    alternates: {
      canonical: homePagePath,
      languages: { "en-IN": homePagePath },
    },
    icons: siteIcons,
    openGraph: {
      type: "website",
      locale: "en_IN",
      url,
      title: ogTitle,
      description: homeSeoDescription,
      siteName: site.name,
      images: [
        {
          url: homeOgImage,
          width: 2048,
          height: 1529,
          alt: "Novaro Solution — web app development company in Gandhinagar, Gujarat",
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

export function homePageJsonLd(faqs?: Array<{ question: string; answer: string }>) {
  const base = siteBaseUrl();
  const faqSchema = faqs?.length ? faqPageJsonLd(faqs) : null;

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${base}${homePagePath}#webpage`,
      url: `${base}${homePagePath}`,
      name: homeSeoTitle,
      description: homeSeoDescription,
      inLanguage: "en-IN",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": LOCAL_BUSINESS_ID },
      publisher: { "@id": ORGANIZATION_ID },
    },
    ...(faqSchema ? [faqSchema] : []),
  ];

  return schemas;
}
