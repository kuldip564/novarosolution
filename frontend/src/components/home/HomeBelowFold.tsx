import { mapDbFaqs, type FaqItem } from "@/components/sections/FaqSection";
import { HomeSections } from "@/components/home/HomeSections";
import type { DbClientLogo, DbFaq, DbProject, DbService, DbTestimonial } from "@/lib/content";
import { homeStats, processSteps } from "@/lib/site-data";

type HomeBelowFoldProps = {
  projects: DbProject[];
  services: DbService[];
  stats: typeof homeStats;
  cta: { title: string; description: string };
  marquee: readonly string[];
  steps: typeof processSteps;
  testimonials: DbTestimonial[];
  logos: DbClientLogo[];
  faqs: DbFaq[];
};

export function HomeBelowFold(props: HomeBelowFoldProps) {
  const faqItems: FaqItem[] = mapDbFaqs(props.faqs);

  return <HomeSections {...props} faqs={faqItems} />;
}
