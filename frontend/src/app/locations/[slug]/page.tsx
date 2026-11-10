import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocationView } from "@/components/locations/LocationView";
import { getLocation, locationPath, locations } from "@/lib/locations";
import { createPageMetadata } from "@/lib/site-metadata";
import "@/styles/locations.css";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locations.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) return {};

  return createPageMetadata({
    title: location.seoTitle,
    description: location.seoDescription,
    path: locationPath(location.slug),
    keywords: location.keywords,
    ogHeadline: location.ogHeadline,
    ogEyebrow: location.eyebrow.split(" · ").slice(0, 2).join(" · "),
  });
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) notFound();

  return <LocationView location={location} path={locationPath(location.slug)} />;
}
