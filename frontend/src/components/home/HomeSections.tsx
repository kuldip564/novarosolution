import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/Button";
import { HomeProcess, type ProcessStage } from "@/components/home/HomeProcess";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import type { FaqItem } from "@/components/sections/FaqSection";
import type { LogoView } from "@/components/sections/LogoStrip";
import type { TestimonialView } from "@/components/sections/TestimonialsSection";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { formatBlogDate, type BlogPost } from "@/lib/blog";
import type { CaseStudyScreenshot } from "@/lib/case-study-content";
import { site } from "@/lib/site-data";
import type { WorkProject } from "@/lib/work-portfolio";

/* ───────────────────────── Shared bits ───────────────────────── */

function SectionHead({
  eyebrow,
  title,
  id,
  lede,
  align = "left",
  action,
}: {
  eyebrow: string;
  title: string;
  id: string;
  lede?: string;
  align?: "left" | "split";
  action?: ReactNode;
}) {
  const lines = title.split("\n");
  return (
    <header className={`hm-head hm-head--${align}`}>
      <div>
        <p className="hm-eyebrow">{eyebrow}</p>
        <h2 id={id} className="hm-h2" data-hm-reveal>
          {lines.map((line, index) => (
            <span key={line} className="hm-mask">
              <span style={{ ["--line" as string]: index }}>{line}</span>
              {index < lines.length - 1 ? " " : null}
            </span>
          ))}
        </h2>
      </div>
      {lede || action ? (
        <div className="hm-head__side" data-hm-reveal style={{ ["--i" as string]: 1 }}>
          {lede ? <p className="hm-lede">{lede}</p> : null}
          {action}
        </div>
      ) : null}
    </header>
  );
}

function Frame({ shot, domain, sizes, priority = false }: { shot: CaseStudyScreenshot; domain: string | null; sizes: string; priority?: boolean }) {
  return (
    <figure className="hm-frame">
      <div className="hm-frame__bar" aria-hidden="true">
        <span />
        <span />
        <span />
        {domain ? <em>{domain}</em> : null}
      </div>
      <div className="hm-frame__media">
        <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes={sizes} priority={priority} />
      </div>
    </figure>
  );
}

/* ───────────────────────── 03 · Trust ───────────────────────── */

export function HomeTrust({
  projects,
  stats,
  logos,
  industries,
}: {
  projects: WorkProject[];
  stats: ReadonlyArray<{ value: number; suffix: string; label: string }>;
  logos: LogoView[];
  industries: string[];
}) {
  return (
    <section id="hm-trust" className="hm-trust" aria-labelledby="hm-trust-title">
      <div className="wrap">
        <div className="hm-trust__clients" data-hm-reveal>
          <h2 id="hm-trust-title" className="hm-trust__label">
            Live client work
          </h2>
          <ul className="hm-trust__names">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link href={project.href}>
                  {project.title}
                  <span>{project.projectType}</span>
                </Link>
              </li>
            ))}
          </ul>
          {logos.length ? (
            <ul className="hm-trust__logos" aria-label="Client logos">
              {logos.map((logo) => (
                <li key={logo.id}>
                  {logo.image ? (
                    <CloudinaryImage asset={logo.image} alt={logo.name} width={120} height={48} transformWidth={240} className="hm-trust__logo" sizes="120px" />
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <dl className="hm-trust__stats">
          {stats.map((stat, index) => (
            <div key={stat.label} data-hm-reveal style={{ ["--i" as string]: index }}>
              <dt>{stat.label}</dt>
              <dd>
                {stat.value}
                {stat.suffix ? <small>{stat.suffix}</small> : null}
              </dd>
            </div>
          ))}
        </dl>
        <p className="hm-trust__note" data-hm-reveal>
          Each product is live, on the client&apos;s own domain or on Google Play, across{" "}
          {industries.join(", ").replace(/, ([^,]*)$/, " and $1")}. Every case study can be checked against the live
          product.
        </p>
      </div>
    </section>
  );
}

/* ───────────────────────── 04 · Introduction ───────────────────────── */

const problems = [
  "Work stuck in spreadsheets and chat threads",
  "A website that looks fine but brings few enquiries",
  "An idea that needs a first release people can use",
  "An AI pilot that never got past the demo",
];

export function HomeIntro() {
  return (
    <section className="hm-section hm-intro" aria-labelledby="hm-intro-title">
      <div className="wrap hm-intro__grid">
        <div>
          <p className="hm-eyebrow">About Novaro</p>
          <h2 id="hm-intro-title" className="hm-display" data-hm-reveal>
            <span className="hm-mask">
              <span style={{ ["--line" as string]: 0 }}>Technology that</span>{" "}
            </span>
            <span className="hm-mask hm-mask--accent">
              <span style={{ ["--line" as string]: 1 }}>creates real impact.</span>
            </span>
          </h2>
        </div>
        <span className="hm-intro__rule" aria-hidden="true" data-hm-reveal />
        <div className="hm-intro__copy" data-hm-reveal style={{ ["--i" as string]: 1 }}>
          <p className="hm-intro__lead">
            {site.name} is a software studio in Gandhinagar, India. We design, build and grow digital products for
            founders and growing businesses in India, the USA, the UK and Europe: customer-facing apps, internal tools,
            AI features and the marketing that brings people to them.
          </p>
          <h3 className="hm-intro__label">Problems we&apos;re usually asked to solve</h3>
          <ul className="hm-intro__problems">
            {problems.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
          <p className="hm-intro__fit">
            Engineering and growth sit in one team, so the product you launch is the one your marketing can sell, and
            it&apos;s measured from day one.
          </p>
          <Link href="/about" className="hm-text-link">
            About the studio <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── 05 · Services ───────────────────────── */

const serviceCopy: Record<string, { description: string; tags: string[]; image: string; alt: string }> = {
  "web-app-eng": {
    description: "Production web and mobile applications built with modern Next.js and Node technologies.",
    tags: ["Web apps", "Mobile apps", "APIs & admin"],
    image: "/images/services/web-app-eng.webp",
    alt: "Illustration of a web dashboard and a mobile app connected by data lines",
  },
  "ai-machine-ml": {
    description: "Models, intelligent pipelines and AI-powered features inside the tools your team already uses.",
    tags: ["Document AI", "Search", "Evaluation"],
    image: "/images/services/ai-machine-ml.webp",
    alt: "Illustration of a glowing neural network sphere wrapped in orbit rings",
  },
  "digital-marketing": {
    description: "SEO, paid campaigns and performance analytics focused on qualified leads.",
    tags: ["Technical SEO", "Google & Meta ads", "Analytics"],
    image: "/images/services/digital-marketing.webp",
    alt: "Illustration of a campaign dashboard with a rising growth chart and funnel",
  },
  "cloud-devops": {
    description: "Cloud architecture, CI/CD workflows and design systems that keep products fast and consistent.",
    tags: ["AWS & GCP", "CI/CD", "Design systems"],
    image: "/images/services/cloud-devops.webp",
    alt: "Illustration of cloud infrastructure linked to servers, screens and deployment blocks",
  },
};

export function HomeServices({ services }: { services: Array<{ slug: string; title: string; description: string }> }) {
  return (
    <section id="services" className="hm-section hm-services" aria-labelledby="hm-services-title" data-cta-location="services">
      <div className="wrap">
        <SectionHead
          eyebrow="What we do"
          id="hm-services-title"
          title={"Four services.\nOne accountable team."}
          align="split"
          lede="Engineering, AI, growth and infrastructure under one roof, so nothing falls between building a product and bringing people to it."
        />
        <ul className="hm-services__grid">
          {services.map((service, index) => {
            const copy = serviceCopy[service.slug];
            return (
              <li key={service.slug} className={`hm-service hm-service--${index + 1}`} data-hm-reveal style={{ ["--i" as string]: index % 2 }}>
                <Link href={`/services/${service.slug}`} className="hm-service__link">
                  <span className="hm-service__media">
                    {copy ? (
                      <Image src={copy.image} alt={copy.alt} width={1200} height={900} sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 560px" />
                    ) : null}
                  </span>
                  <span className="hm-service__body">
                    <span className="hm-service__num">{String(index + 1).padStart(2, "0")}</span>
                    <h3 className="hm-service__title">{service.title}</h3>
                    <span className="hm-service__desc">{copy?.description ?? service.description}</span>
                    {copy ? (
                      <span className="hm-service__tags">
                        {copy.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </span>
                    ) : null}
                    <span className="hm-service__more">
                      Learn more<span className="sr-only"> about {service.title}</span>
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="hm-section__cta">
          <Button href="/services" variant="ghost">
            Explore Our Services
          </Button>
        </p>
      </div>
    </section>
  );
}

/* ───────────────────────── 06 · Featured work ───────────────────────── */

export function HomeWork({ projects }: { projects: WorkProject[] }) {
  const [primary, ...rest] = projects;
  if (!primary) return null;
  const supporting = rest.slice(0, 3);
  return (
    <section id="work-preview" className="hm-section hm-work" aria-labelledby="hm-work-title" data-cta-location="work">
      <div className="wrap">
        <SectionHead
          eyebrow="Selected work"
          id="hm-work-title"
          title={"Live products,\nbuilt end to end."}
          align="split"
          lede="Grocery delivery apps on Google Play, two D2C stores and a service-booking website, each one live today."
          action={
            <Button href="/work" variant="ghost">
              View Case Studies
            </Button>
          }
        />

        <article className="hm-feature" aria-labelledby="hm-feature-title">
          <div className="hm-feature__stage" data-hm-reveal>
            {primary.desktop[0] ? (
              <>
                <Frame shot={primary.desktop[0]} domain={primary.domain} sizes="(max-width: 767px) 100vw, (max-width: 1279px) 66vw, 820px" />
                {primary.mobile ? (
                  <figure className="hm-feature__phone">
                    <Image src={primary.mobile.src} alt={primary.mobile.alt} width={primary.mobile.width} height={primary.mobile.height} sizes="(max-width: 767px) 40vw, 220px" />
                  </figure>
                ) : null}
              </>
            ) : primary.phones.length ? (
              // Apps have no desktop view: show up to three phone screens side by side.
              <div className="hm-phones">
                {primary.phones.slice(0, 3).map((shot) => (
                  <figure key={shot.src} className="hm-phone">
                    <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes="(max-width: 767px) 30vw, 230px" />
                  </figure>
                ))}
              </div>
            ) : null}
          </div>
          <div className="hm-feature__copy" data-hm-reveal style={{ ["--i" as string]: 1 }}>
            <p className="hm-feature__meta">
              <span>{primary.number}</span>
              {primary.projectType} · {primary.industry}
            </p>
            <h3 id="hm-feature-title" className="hm-feature__title">
              <Link href={primary.href}>{primary.title}</Link>
            </h3>
            <p className="hm-feature__summary">{primary.summary}</p>
            {primary.stack.length ? (
              <ul className="hm-tags" aria-label={`${primary.title} technologies`}>
                {primary.stack.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            ) : null}
            <Link href={primary.href} className="hm-arrow-link">
              View project<span className="sr-only">: {primary.title}</span>
              <span className="hm-arrow-link__icon" aria-hidden="true">
                <ArrowUpRight size={18} />
              </span>
            </Link>
          </div>
        </article>

        <ul className="hm-work__more">
          {supporting.map((project, index) => (
            <li key={project.slug} data-hm-reveal style={{ ["--i" as string]: index }}>
              <Link href={project.href} className="hm-card">
                <span className="hm-card__media">
                  {project.desktop[0] ? (
                    <Image src={project.desktop[0].src} alt={project.desktop[0].alt} width={project.desktop[0].width} height={project.desktop[0].height} sizes="(max-width: 767px) 100vw, (max-width: 1199px) 33vw, 380px" />
                  ) : null}
                </span>
                <span className="hm-card__meta">
                  {project.number} · {project.projectType}
                </span>
                <h3 className="hm-card__title">{project.title}</h3>
                <span className="hm-card__desc">{project.industry}</span>
                <span className="hm-card__go" aria-hidden="true">
                  <ArrowUpRight size={18} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────── 07 · Why Novaro ───────────────────────── */

const reasons = [
  {
    title: "One team from product to growth",
    body: "Design, engineering, AI and marketing work together, so nothing is lost in a hand-off between agencies.",
  },
  {
    title: "A working build every week",
    body: "You review real software as it grows, not slides, and can change direction while it's still cheap to.",
  },
  {
    title: "A clear proposal in 2–3 days",
    body: "After a 30-minute discovery call you get the scope, timeline, team and budget in writing.",
  },
  {
    title: "You own what we build",
    body: "Code, designs and documentation are handed over at launch. Support retainers are optional, never a lock-in.",
  },
  {
    title: "Measured from day one",
    body: "Analytics, conversion tracking and technical SEO are part of the build, not an afterthought.",
  },
  {
    title: "Hours that overlap yours",
    body: "Calls are scheduled in the overlap between your working day and our studio hours, 10:00–19:00 IST.",
  },
];

export function HomeWhy() {
  return (
    <section id="why" className="hm-section hm-why" aria-labelledby="hm-why-title">
      <div className="wrap hm-why__grid">
        <div className="hm-why__intro">
          <p className="hm-eyebrow">Why Novaro</p>
          <h2 id="hm-why-title" className="hm-h2" data-hm-reveal>
            <span className="hm-mask">
              <span style={{ ["--line" as string]: 0 }}>What working</span>{" "}
            </span>
            <span className="hm-mask">
              <span style={{ ["--line" as string]: 1 }}>with us is like.</span>
            </span>
          </h2>
          <p className="hm-lede" data-hm-reveal>
            No account managers between you and the people building your product, and no surprises in the invoice.
          </p>
          <a href="#process" className="hm-text-link">
            See how a project runs <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
        <ol className="hm-why__list">
          {reasons.map((reason, index) => (
            <li key={reason.title} data-hm-reveal style={{ ["--i" as string]: index % 2 }}>
              <span className="hm-why__num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{reason.title}</h3>
              <p>{reason.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────────────────── 08 · Process ───────────────────────── */

const stages: ProcessStage[] = [
  { title: "Discover", body: "A 30-minute call about your goals, users and deadline." },
  { title: "Strategize", body: "Scope, architecture and a proposal with timeline and budget, usually within 2–3 days." },
  { title: "Design & build", body: "Designs you can react to, then a working build every week." },
  { title: "Launch", body: "Testing, release, and a handover with documentation and training." },
  { title: "Optimize", body: "Optional retainer for performance, SEO, campaigns and new features." },
];

export function HomeProcessSection() {
  return (
    <section id="process" className="hm-section hm-process-sec" aria-labelledby="hm-process-title">
      <div className="wrap">
        <SectionHead eyebrow="How we work" id="hm-process-title" title={"From the first call\nto launch, and after."} />
        <HomeProcess
          stages={stages}
          note="Typical timelines: marketing sites 3–6 weeks, MVPs and web apps 8–14 weeks, larger platforms 12–20 weeks. You get a week-by-week plan before kickoff."
        />
      </div>
    </section>
  );
}

/* ───────────────────────── 09 · Technologies ───────────────────────── */

const shipped = ["Next.js", "React", "TypeScript", "Node.js", "Express", "MongoDB", "Prisma", "Expo & React Native", "three.js", "Cloudinary", "Vercel"];
const toolkit = ["PostgreSQL", "Python", "OpenAI", "LangChain", "AWS", "Google Cloud", "GA4", "Google Ads", "Meta Ads"];

export function HomeTech() {
  return (
    <section id="technologies" className="hm-section hm-tech" aria-labelledby="hm-tech-title">
      <div className="wrap">
        <SectionHead
          eyebrow="Technologies"
          id="hm-tech-title"
          title={"Tools we ship with."}
          align="split"
          lede="The first row runs in our clients' live products and in this website. The second is what we use for AI, cloud and growth work."
        />
        <div className="hm-tech__rows">
          <div className="hm-tech__row" data-hm-reveal>
            <h3>In production</h3>
            <ul>
              {shipped.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
          <div className="hm-tech__row" data-hm-reveal style={{ ["--i" as string]: 1 }}>
            <h3>Also in our toolkit</h3>
            <ul>
              {toolkit.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── 11 · Testimonials (only real, published quotes) ───────────────────────── */

export function HomeTestimonials({ items }: { items: TestimonialView[] }) {
  if (!items.length) return null;
  return (
    <section className="hm-section hm-quotes" aria-labelledby="hm-quotes-title">
      <div className="wrap">
        <SectionHead eyebrow="Client words" id="hm-quotes-title" title="In our clients' words." />
        <ul className="hm-quotes__grid">
          {items.slice(0, 3).map((item, index) => (
            <li key={item.id} data-hm-reveal style={{ ["--i" as string]: index }}>
              <figure>
                <blockquote>{item.quote}</blockquote>
                <figcaption>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────── 12 · Insights ───────────────────────── */

export function HomeInsights({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null;
  return (
    <section id="insights" className="hm-section hm-insights" aria-labelledby="hm-insights-title" data-cta-location="insights">
      <div className="wrap">
        <SectionHead
          eyebrow="Insights"
          id="hm-insights-title"
          title="Notes from the studio."
          align="split"
          lede="Practical guides on planning, pricing and hiring for a software project."
          action={
            <Link href="/blog" className="hm-text-link">
              All articles <ArrowRight size={16} aria-hidden="true" />
            </Link>
          }
        />
        <ul className="hm-insights__list">
          {posts.slice(0, 3).map((post, index) => (
            <li key={post.id} data-hm-reveal style={{ ["--i" as string]: index }}>
              <Link href={`/blog/${post.slug}`} className="hm-post">
                <span className="hm-post__meta">
                  <span>{post.category}</span>
                  <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
                </span>
                <h3 className="hm-post__title">{post.title}</h3>
                <span className="hm-post__excerpt">{post.excerpt}</span>
                <span className="hm-post__more">
                  Read article · {post.readingTime} min
                  <ArrowRight size={16} aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────── FAQ ───────────────────────── */

export function HomeFaq({ faqs }: { faqs: FaqItem[] }) {
  if (!faqs.length) return null;
  return (
    <section id="faq" className="hm-section hm-faq" aria-labelledby="hm-faq-title">
      <div className="wrap hm-faq__grid">
        <div className="hm-faq__intro">
          <p className="hm-eyebrow">FAQ</p>
          <h2 id="hm-faq-title" className="hm-h2" data-hm-reveal>
            <span className="hm-mask">
              <span style={{ ["--line" as string]: 0 }}>Questions,</span>{" "}
            </span>
            <span className="hm-mask hm-mask--accent">
              <span style={{ ["--line" as string]: 1 }}>answered.</span>
            </span>
          </h2>
          <p className="hm-lede">
            Something else? <Link href="/contact">Ask us directly</Link>; we reply within one business day.
          </p>
        </div>
        <FaqAccordion items={faqs} />
      </div>
    </section>
  );
}

/* ───────────────────────── 13 · Closing CTA ───────────────────────── */

export function HomeClosing() {
  return (
    <section id="start" className="hm-closing" aria-labelledby="hm-closing-title" data-cta-location="home-cta">
      <span className="hm-closing__glow hm-closing__glow--a" aria-hidden="true" />
      <span className="hm-closing__glow hm-closing__glow--b" aria-hidden="true" />
      <div className="wrap hm-closing__inner" data-hm-reveal>
        <p className="hm-eyebrow hm-eyebrow--light">Start a project</p>
        <h2 id="hm-closing-title" className="hm-closing__title">
          Ready to build <br />
          what&apos;s next?
        </h2>
        <span className="hm-closing__rule" aria-hidden="true" />
        <p className="hm-closing__lede">
          Have a business idea, an ambitious product or a digital challenge? Let&apos;s turn it into something meaningful.
        </p>
        <div className="hm-closing__actions">
          <Button href="/contact">Start Your Project</Button>
          <p className="hm-closing__talk">
            <span>Contact Novaro:</span> <a href={`mailto:${site.email}`}>{site.email}</a>{" "}
            <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
          </p>
        </div>
        <p className="hm-closing__studio">
          Studio in Sargasan, {site.geo.addressLocality} · Mon–Sat, 10:00–19:00 IST · We reply within one business day
        </p>
      </div>
    </section>
  );
}
