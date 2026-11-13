import type { Metadata } from "next";
import { LocationView, pickTestimonials } from "@/components/locations/LocationView";
import { mapDbTestimonials } from "@/components/sections/TestimonialsSection";
import { getPublishedProjects, getPublishedTestimonials } from "@/lib/content";
import { mapDbProjectsToWork } from "@/lib/content-mappers";
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

export const revalidate = 30;

export default async function SoftwareDevelopmentUsaPage() {
  const [projects, testimonials] = await Promise.all([getPublishedProjects(), getPublishedTestimonials()]);
  return (
    <LocationView
      location={usaLocation}
      path={path}
      projects={mapDbProjectsToWork(projects)}
      testimonials={pickTestimonials(mapDbTestimonials(testimonials), ["USA", "US"])}
    />
  );
}
