"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Boxes,
  BrainCircuit,
  CalendarCheck,
  Cloud,
  Code2,
  Database,
  FileCheck2,
  GraduationCap,
  HeartPulse,
  KeyRound,
  LineChart,
  ServerCog,
  ShoppingBag,
  Truck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/anim/Reveal";
import { SplitText } from "@/components/anim/SplitText";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Button } from "@/components/Button";
import type { BlogPost } from "@/lib/blog";
import type { HomeProjectView } from "@/lib/content-mappers";

/* Everything below restates facts already published on the site (FAQ, process, case studies). */

const whyItems: Array<{ icon: LucideIcon; title: string; body: string }> = [
  {
    icon: Users,
    title: "One senior team, sketch to launch",
    body: "Design, engineering, AI, and SEO sit in one team — no hand-offs between vendors, no blame ping-pong.",
  },
  {
    icon: CalendarCheck,
    title: "A working build every week",
    body: "Weekly demos of real software on staging, so you review progress you can click, not slide decks.",
  },
  {
    icon: FileCheck2,
    title: "A clear proposal in 2–3 days",
    body: "After a 30-minute discovery call you get scope, timeline, and price in writing — changes are priced before they are built.",
  },
  {
    icon: KeyRound,
    title: "You own what we build",
    body: "Code, designs, and documentation are handed over at launch. Support retainers are optional, never a lock-in.",
  },
];

const stackGroups: Array<{ icon: LucideIcon; label: string; items: string[] }> = [
  { icon: Code2, label: "Frontend", items: ["Next.js", "React", "TypeScript"] },
  { icon: ServerCog, label: "Backend & APIs", items: ["Node.js", "Express", "Prisma", "REST & GraphQL"] },
  { icon: Database, label: "Data", items: ["MongoDB", "PostgreSQL"] },
  { icon: BrainCircuit, label: "AI & ML", items: ["OpenAI", "LangChain", "Custom ML pipelines"] },
  { icon: Cloud, label: "Cloud & DevOps", items: ["AWS", "GCP", "Cloudinary", "CI/CD"] },
  { icon: LineChart, label: "Growth", items: ["Technical SEO", "GA4", "Paid search", "Meta ads"] },
];

const industries: Array<{
  icon: LucideIcon;
  name: string;
  body: string;
  links: Array<{ label: string; href: string }>;
}> = [
  {
    icon: ShoppingBag,
    name: "D2C & E-commerce",
    body: "Storefronts with product storytelling, fast mobile checkout, and the SEO and ads that bring buyers in.",
    links: [
      { label: "Zeevan", href: "/work/zeevan" },
      { label: "KankreG", href: "/work/kankreg" },
    ],
  },
  {
    icon: Truck,
    name: "Logistics & Supply Chain",
    body: "Booking, live tracking, and dispatch flows that operations teams use every day.",
    links: [{ label: "Quadrato Cargo", href: "/work/quadrato-cargo" }],
  },
  {
    icon: HeartPulse,
    name: "Healthcare & Services",
    body: "Service booking, pricing tiers, and back-office tools for businesses that run on appointments.",
    links: [{ label: "Mr Antidot", href: "/work/mr-antidot" }],
  },
  {
    icon: Wallet,
    name: "Fintech & SaaS",
    body: "Dashboards, admin panels, and AI features for SaaS teams — built to pass a security review.",
    links: [{ label: "Web & app development", href: "/services/web-app-eng" }],
  },
  {
    icon: GraduationCap,
    name: "Education & EdTech",
    body: "Learning platforms and student portals on the same tested web-app stack.",
    links: [{ label: "Web & app development", href: "/services/web-app-eng" }],
  },
];

export function HomeProjectStrip({ projects }: { projects: HomeProjectView[] }) {
  if (projects.length === 0) return null;
  return (
    <Reveal className="home-shipped">
      <span className="home-shipped__label">Products we&apos;ve shipped</span>
      <ul className="home-shipped__list">
        {projects.map((project) => (
          <li key={project.title}>
            <Link href={project.href} className="home-shipped__item">
              <strong>{project.title}</strong>
              <span>{project.category}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export function HomeWhy() {
  return (
    <section className="home-scene home-why light" aria-labelledby="home-why-title">
      <div className="wrap">
        <header className="home-section-head home-section-head--center">
          <Reveal>
            <span className="eyebrow center">Why Novaro</span>
          </Reveal>
          <SplitText text={"Why teams choose\nto build with us."} as="h2" id="home-why-title" className="home-section-head__title" />
        </header>
        <ul className="home-why__grid">
          {whyItems.map((item, index) => (
            <Reveal as="li" key={item.title} delay={0.06 * index} className="home-why__card">
              <span className="home-why__icon" aria-hidden>
                <item.icon size={22} strokeWidth={1.8} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function HomeStack() {
  return (
    <section className="home-scene home-stack" aria-labelledby="home-stack-title">
      <div className="wrap">
        <header className="home-section-head">
          <Reveal>
            <span className="eyebrow">Technology</span>
          </Reveal>
          <SplitText text={"A modern stack,\nchosen to last."} as="h2" id="home-stack-title" className="home-section-head__title" />
          <Reveal delay={0.08}>
            <p className="home-section-head__lede">
              We pick tools for longevity and for your team&apos;s ability to maintain them after handover.
            </p>
          </Reveal>
        </header>
        <ul className="home-stack__grid">
          {stackGroups.map((group, index) => (
            <Reveal as="li" key={group.label} delay={0.05 * index} className="home-stack__group">
              <span className="home-stack__head">
                <span className="home-stack__icon" aria-hidden>
                  <group.icon size={18} strokeWidth={1.8} />
                </span>
                <h3>{group.label}</h3>
              </span>
              <ul className="home-stack__items">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function HomeIndustries() {
  return (
    <section className="home-scene home-industries light" aria-labelledby="home-industries-title">
      <div className="wrap">
        <header className="home-section-head home-section-head--center">
          <Reveal>
            <span className="eyebrow center">Industries</span>
          </Reveal>
          <SplitText text={"Solutions for the industries\nwe know best."} as="h2" id="home-industries-title" className="home-section-head__title" />
        </header>
        <ul className="home-industries__grid">
          {industries.map((industry, index) => (
            <Reveal as="li" key={industry.name} delay={0.05 * index} className="home-industries__card">
              <span className="home-industries__icon" aria-hidden>
                <industry.icon size={22} strokeWidth={1.8} />
              </span>
              <h3>{industry.name}</h3>
              <p>{industry.body}</p>
              <span className="home-industries__links">
                {industry.links.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                    <ArrowUpRight size={14} aria-hidden />
                  </Link>
                ))}
              </span>
            </Reveal>
          ))}
          <Reveal as="li" delay={0.3} className="home-industries__card home-industries__card--cta">
            <span className="home-industries__icon" aria-hidden>
              <Boxes size={22} strokeWidth={1.8} />
            </span>
            <h3>Something else?</h3>
            <p>Tell us how your business runs today. We&apos;ll say honestly whether we&apos;re the right team.</p>
            <span className="home-industries__links">
              <Link href="/contact">
                Start your project
                <ArrowUpRight size={14} aria-hidden />
              </Link>
            </span>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}

export function HomeInsights({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;
  return (
    <section className="home-scene home-insights" aria-labelledby="home-insights-title">
      <div className="wrap">
        <header className="home-section-head home-insights__head">
          <div>
            <Reveal>
              <span className="eyebrow">Insights</span>
            </Reveal>
            <SplitText text={"Notes from\nthe studio."} as="h2" id="home-insights-title" className="home-section-head__title" />
          </div>
          <Reveal delay={0.08}>
            <Button href="/blog" variant="ghost">
              Read the blog
            </Button>
          </Reveal>
        </header>
        <div className="blog-grid compact home-insights__grid">
          {posts.slice(0, 3).map((post, index) => (
            <BlogPostCard key={post.id} post={post} delay={index * 0.06} />
          ))}
        </div>
      </div>
    </section>
  );
}
