import type { BlogPost } from "./blog";
import { team } from "./team-data";

/**
 * Topic clusters for the blog (see docs/content-strategy.md). An article joins a cluster
 * through its category, set in the admin. Each cluster has one pillar article, one service
 * page it supports, and one call to action.
 */
export type ContentCluster = {
  id: string;
  name: string;
  /** Categories (as typed in the admin) that belong to this cluster. */
  categories: string[];
  /** Slug of the pillar article, once it is published. */
  pillarSlug: string;
  service: { href: string; label: string };
  /** buttonLabel is one of the site's standard CTA labels; href pre-selects the service on the form. */
  cta: { text: string; buttonLabel: string; href: string };
};

export const contentClusters: ContentCluster[] = [
  {
    id: "web-development",
    name: "Web development",
    categories: ["Web Development", "Product"],
    pillarSlug: "website-development-process",
    service: { href: "/services/web-app-eng", label: "Web & mobile app development services" },
    cta: {
      text: "Planning a website or web app? Send a short brief and we'll reply within one business day with questions, a suggested first release and a timeline.",
      buttonLabel: "Start Your Project",
      href: "/contact?service=web-app-eng",
    },
  },
  {
    id: "mobile-apps",
    name: "Mobile apps",
    categories: ["Mobile Apps"],
    pillarSlug: "mobile-app-development-process",
    service: { href: "/services/web-app-eng", label: "Web & mobile app development services" },
    cta: {
      text: "Not sure whether you need a store app or a web app first? Tell us what the product has to do and we'll recommend a starting point.",
      buttonLabel: "Discuss Your Requirements",
      href: "/contact?service=web-app-eng",
    },
  },
  {
    id: "ai-automation",
    name: "AI & automation",
    categories: ["AI & Automation", "AI / ML"],
    pillarSlug: "ai-applications-in-business",
    service: { href: "/services/ai-machine-ml", label: "AI & machine learning development services" },
    cta: {
      text: "Have a task you'd like AI to take on? Describe it and the documents or data involved, and we'll suggest a small pilot.",
      buttonLabel: "Discuss Your Requirements",
      href: "/contact?service=ai-machine-ml",
    },
  },
  {
    id: "digital-marketing",
    name: "Digital marketing & SEO",
    categories: ["Digital Marketing", "Growth"],
    pillarSlug: "seo-for-indian-businesses",
    service: { href: "/services/digital-marketing", label: "Digital marketing & SEO services" },
    cta: {
      text: "Want more enquiries from search and ads? Send us your website and what you sell, and we'll tell you what we would check first.",
      buttonLabel: "Book a Consultation",
      href: "/contact?service=digital-marketing",
    },
  },
  {
    id: "gujarat-business",
    name: "Gujarat business guides",
    categories: ["Gujarat Business"],
    pillarSlug: "website-strategy-gujarat-smes",
    service: { href: "/locations/gandhinagar", label: "Software & website development in Gandhinagar" },
    cta: {
      text: "Based in Gandhinagar or Ahmedabad? Visit the studio in Sargasan or book a call, and we'll talk through what your business needs first.",
      buttonLabel: "Book a Consultation",
      href: "/contact",
    },
  },
  {
    id: "cloud-design",
    name: "Cloud, DevOps & design",
    categories: ["Cloud & DevOps", "Design"],
    pillarSlug: "cloud-setup-for-growing-products",
    service: { href: "/services/cloud-devops", label: "Cloud, DevOps & design system services" },
    cta: {
      text: "Want safer releases and a clearer cloud bill? Tell us where the app is hosted and what is causing trouble.",
      buttonLabel: "Book a Consultation",
      href: "/contact?service=cloud-devops",
    },
  },
];

export function clusterForPost(post: Pick<BlogPost, "category">): ContentCluster | null {
  const category = post.category.trim().toLowerCase();
  return (
    contentClusters.find((cluster) => cluster.categories.some((name) => name.toLowerCase() === category)) ?? null
  );
}

export type ArticleAuthor =
  | { kind: "person"; name: string; role: string }
  | { kind: "organization"; name: string };

/**
 * A byline counts as a person only when it matches someone on the team page. Anything else
 * ("Novaro Team", "Novaro Solution") is credited to the company, never to an invented person.
 */
export function resolveArticleAuthor(name: string): ArticleAuthor {
  const member = team.find((item) => item.name.toLowerCase() === name.trim().toLowerCase());
  return member
    ? { kind: "person", name: member.name, role: member.role }
    : { kind: "organization", name: name.trim() || "Novaro Team" };
}
