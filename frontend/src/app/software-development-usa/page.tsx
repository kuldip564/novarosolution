import type { Metadata } from "next";
import { LocationView } from "@/components/locations/LocationView";
import { usaLocation } from "@/lib/locations";
import { createPageMetadata } from "@/lib/site-metadata";
import "@/styles/locations.css";

const path = "/software-development-usa";

export const metadata: Metadata = createPageMetadata({
  title: usaLocation.seoTitle,
  description: usaLocation.seoDescription,
  path,
  keywords: usaLocation.keywords,
  ogHeadline: usaLocation.ogHeadline,
  ogEyebrow: "United States · Remote delivery",
});

export default function SoftwareDevelopmentUsaPage() {
  return <LocationView location={usaLocation} path={path} />;
}
