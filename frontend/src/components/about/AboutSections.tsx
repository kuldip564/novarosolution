import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BarChart3, Compass, MapPin, Shield, Sparkles, type LucideIcon } from "lucide-react";
import { Button } from "@/components/Button";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { StudioProcess } from "@/components/studio/StudioProcess";
import { StudioSectionHead } from "@/components/studio/StudioSectionHead";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import type { AboutPageContent, AboutStat, AboutWhyItem } from "@/lib/about-content";
import type { TeamMemberView } from "@/lib/content-mappers";
import type { WorkProject } from "@/lib/work-portfolio";

/* ───────────────────────── 01 · Hero ───────────────────────── */

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** The real team, in the order of the team page. Decorative here: the team section below names everyone. */
function TeamMosaic({ team }: { team: TeamMemberView[] }) {
  return (
    <ul className="ab-mosaic" aria-hidden="true">
      {team.slice(0, 8).map((member, index) => (
        <li key={member.name} className="ab-tile" style={{ ["--i" as string]: index }}>
          {member.photo ? (
            <Image src={member.photo} alt="" width={240} height={320} sizes="(max-width: 1023px) 24vw, 150px" loading="eager" />
          ) : (
            <span className="ab-tile__initials">{initials(member.name)}</span>
          )}
          <span className="ab-tile__name">{member.name.split(" ")[0]}</span>
        </li>
      ))}
    </ul>
  );
}

export function AboutHero({ team, stats }: { team: TeamMemberView[]; stats: AboutStat[] }) {
  const lines = ["We build", "digital products", "that earn trust."];
  return (
    <section className="st-hero ab-hero" aria-labelledby="ab-hero-title" data-cta-location="about-hero">
      <div className="wrap st-hero__inner ab-hero__inner">
        <div className="ab-hero__copy">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} className="st-hero__crumbs" />
          <p className="st-eyebrow st-hero__eyebrow">About Novaro Solution</p>
          <h1 id="ab-hero-title" className="st-hero__title ab-hero__title">
            {lines.map((line, index) => (
              <span key={line} className={`st-mask${index === lines.length - 1 ? " st-mask--accent" : ""}`}>
                <span style={{ ["--line" as string]: index }}>{line}</span>
                {index < lines.length - 1 ? " " : null}
              </span>
            ))}
          </h1>
          <p className="st-hero__lede">
            A software studio in Gandhinagar, India, working with companies worldwide since 2024. One team for
            engineering, AI and growth, from the first wireframe to the release after launch.
          </p>
          <div className="st-hero__actions">
            <Button href="/contact">Start Your Project</Button>
            <Button href="#team" variant="ghost">
              Meet the Team
            </Button>
          </div>
        </div>
        <TeamMosaic team={team} />
        <div className="st-hero__foot ab-hero__foot">
          <p className="ab-hero__place">
            <MapPin size={16} strokeWidth={2} aria-hidden="true" />
            Studio in Sargasan, Gandhinagar · working worldwide
          </p>
          {stats.length ? (
            <dl className="st-stats ab-hero__stats">
              {stats.slice(0, 4).map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>
                    {stat.value}
                    {stat.suffix ? <small>{stat.suffix}</small> : null}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── 02 · Who we are ───────────────────────── */

export function AboutStory({ who, missionVision }: { who: AboutPageContent["whoWeAre"]; missionVision: AboutPageContent["missionVision"] }) {
  return (
    <section className="st-section ab-story" aria-labelledby="ab-story-title">
      <div className="wrap">
        <StudioSectionHead eyebrow={who.eyebrow} id="ab-story-title" title={who.title} align="split" lede={who.body} />
        <div className="ab-mv">
          <div className="ab-mv__card" data-st-reveal>
            <h3>{missionVision.missionLabel}</h3>
            <p>{missionVision.mission}</p>
          </div>
          <div className="ab-mv__card ab-mv__card--dark" data-st-reveal style={{ ["--i" as string]: 1 }}>
            <h3>{missionVision.visionLabel}</h3>
            <p>{missionVision.vision}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── 03 · Timeline ───────────────────────── */

export function AboutTimeline({ timeline }: { timeline: AboutPageContent["timeline"] }) {
  return (
    <section className="st-section st-section--alt ab-timeline" aria-labelledby="ab-timeline-title">
      <div className="wrap">
        <StudioSectionHead eyebrow={timeline.eyebrow} id="ab-timeline-title" title={timeline.title} align="split" />
        <StudioProcess
          stages={timeline.milestones.map((milestone) => ({
            marker: milestone.year,
            title: milestone.title,
            body: milestone.text,
          }))}
        />
      </div>
    </section>
  );
}

/* ───────────────────────── 04 · Values ───────────────────────── */

const valueIcons: Record<string, LucideIcon> = {
  spark: Sparkles,
  shield: Shield,
  compass: Compass,
  chart: BarChart3,
};

export function AboutValues({ values }: { values: AboutPageContent["values"] }) {
  return (
    <section className="st-section ab-values" aria-labelledby="ab-values-title">
      <div className="wrap">
        <StudioSectionHead eyebrow={values.eyebrow} id="ab-values-title" title={values.title} />
        <ul className="ab-values__grid">
          {values.items.map((value, index) => {
            const Icon = valueIcons[value.icon] ?? Sparkles;
            return (
              <li key={value.title} className="ab-value" data-st-reveal style={{ ["--i" as string]: index }}>
                <span className="ab-value__top">
                  <span className="ab-value__icon" aria-hidden="true">
                    <Icon size={20} strokeWidth={1.7} />
                  </span>
                  <span className="ab-value__num" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </span>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────── 05 · Team ───────────────────────── */

export function AboutTeam({ content, team }: { content: AboutPageContent["team"]; team: TeamMemberView[] }) {
  const founders = team.filter((member) => member.tier === "founder").length;
  return (
    <section id="team" className="st-section st-section--alt ab-team" aria-labelledby="ab-team-title">
      <div className="wrap">
        <StudioSectionHead eyebrow={content.eyebrow} id="ab-team-title" title={content.title} align="split" lede={content.description} />
        <div className="ab-team__bar" data-st-reveal>
          <dl className="st-stats ab-team__facts">
            <div>
              <dt>People on the team</dt>
              <dd>{team.length}</dd>
            </div>
            <div>
              <dt>Co-founders</dt>
              <dd>{founders}</dd>
            </div>
            <div>
              <dt>Studio · Gujarat, India</dt>
              <dd className="ab-team__place">Gandhinagar</dd>
            </div>
          </dl>
          <p className="ab-team__hint">Select anyone to open their profile: role, skills and education.</p>
        </div>
        <TeamGrid members={team} variant="about" />
      </div>
    </section>
  );
}

/* ───────────────────────── 06 · What we do ───────────────────────── */

const practices = [
  {
    title: "Web & app development",
    body: "Websites, web apps, SaaS dashboards and mobile apps on Next.js, Node and Flutter.",
    href: "/services/web-app-eng",
  },
  {
    title: "AI & machine learning",
    body: "Document extraction, search over your own content, and review queues with a person in the loop.",
    href: "/services/ai-machine-ml",
  },
  {
    title: "Digital marketing & SEO",
    body: "Technical SEO, paid search and social campaigns, and analytics tied to revenue.",
    href: "/services/digital-marketing",
  },
  {
    title: "Cloud, DevOps & design",
    body: "AWS or GCP, CI/CD, monitoring, and design systems your team can ship with.",
    href: "/services/cloud-devops",
  },
];

export function AboutPractices() {
  return (
    <section className="st-section ab-practices" aria-labelledby="ab-practices-title" data-cta-location="about-services">
      <div className="wrap">
        <StudioSectionHead
          eyebrow="What we do"
          id="ab-practices-title"
          title={"Four practices,\none accountable team."}
          align="split"
          lede="Engineering, AI, growth and infrastructure under one roof, so nothing falls between building a product and bringing people to it."
          action={
            <Link href="/services" className="st-text-link">
              All services
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          }
        />
        <ol className="ab-rows">
          {practices.map((practice, index) => (
            <li key={practice.href} data-st-reveal style={{ ["--i" as string]: index }}>
              <Link href={practice.href} className="ab-row">
                <span className="ab-row__num">{String(index + 1).padStart(2, "0")}</span>
                <span className="ab-row__title">{practice.title}</span>
                <span className="ab-row__body">{practice.body}</span>
                <ArrowUpRight className="ab-row__go" size={20} strokeWidth={1.8} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────────────────── 07 · Why Novaro ───────────────────────── */

export function AboutWhy({ content, items }: { content: AboutPageContent["whyUs"]; items: AboutWhyItem[] }) {
  return (
    <section className="st-section st-section--alt ab-why" aria-labelledby="ab-why-title">
      <div className="wrap st-split">
        <div className="st-split__intro">
          <p className="st-eyebrow">{content.eyebrow}</p>
          <h2 id="ab-why-title" className="st-h2" data-st-reveal>
            <span className="st-mask">
              <span>{content.title}</span>
            </span>
          </h2>
        </div>
        <ol className="st-list st-list--two">
          {items.map((item, index) => (
            <li key={item.key} data-st-reveal style={{ ["--i" as string]: index }}>
              <span className="st-list__num" aria-hidden="true">
                {item.key}
              </span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────────────────── 08 · Live client work ───────────────────────── */

export function AboutWork({ projects }: { projects: WorkProject[] }) {
  if (!projects.length) return null;
  return (
    <section className="st-section ab-work" aria-labelledby="ab-work-title" data-cta-location="about-work">
      <div className="wrap">
        <StudioSectionHead
          eyebrow="Live client work"
          id="ab-work-title"
          title={"What we've\nshipped."}
          align="split"
          lede="Every product below is live today. Each case study can be checked against the live site or app."
          action={
            <Link href="/work" className="st-text-link">
              All case studies
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          }
        />
        <ol className="ab-rows">
          {projects.map((project, index) => (
            <li key={project.slug} data-st-reveal style={{ ["--i" as string]: index }}>
              <Link href={project.href} className="ab-row">
                <span className="ab-row__num">{project.number}</span>
                <span className="ab-row__title">{project.title}</span>
                <span className="ab-row__body">
                  {project.projectType} · {project.industry}
                </span>
                <ArrowUpRight className="ab-row__go" size={20} strokeWidth={1.8} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
