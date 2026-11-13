import Link from "next/link";
import { Button } from "@/components/Button";
import { HomeHeroVisual } from "@/components/home/HomeHeroVisual";
import type { HeroContent } from "@/lib/site-data";
import { defaultHero } from "@/lib/site-data";

/** Button labels are editable in the admin; route them by meaning. */
function ctaHref(label: string): string {
  if (/work|portfolio|case stud/i.test(label)) return "/work";
  if (/service/i.test(label)) return "/services";
  return "/contact";
}

type HomeHeroProps = {
  content?: HeroContent;
  services: Array<{ slug: string; title: string }>;
};

/**
 * Homepage hero. Server-rendered: the headline, text and buttons are in the HTML and visible on
 * the first frame. The line reveals are CSS only (no JavaScript gate), and the 3D sculpture is a
 * separate client island that loads after the page is idle.
 */
export function HomeHero({ content = defaultHero, services }: HomeHeroProps) {
  const lines = content.headline.split(/\\n|\n/).filter(Boolean);
  const accentLines = content.headlineAccent.split(/\\n|\n/).filter(Boolean);

  return (
    <section className="hm-hero" aria-labelledby="hm-hero-title" data-cta-location="home-hero">
      <HomeHeroVisual />
      <div className="wrap hm-hero__inner">
        <p className="hm-eyebrow hm-hero__eyebrow">{content.eyebrow}</p>
        <h1 id="hm-hero-title" className="hm-hero__title">
          {lines.map((line, index) => (
            <span key={`l-${line}`} className="hm-mask">
              <span style={{ ["--line" as string]: index }}>{line}</span>{" "}
            </span>
          ))}
          {accentLines.map((line, index) => (
            <span key={`a-${line}`} className="hm-mask hm-mask--accent">
              <span style={{ ["--line" as string]: lines.length + index }}>{line}</span>
            </span>
          ))}
        </h1>
        <p className="hm-hero__lede">{content.lede}</p>
        <div className="hm-hero__actions">
          <Button href={ctaHref(content.ctaPrimary)}>{content.ctaPrimary}</Button>
          <Button href={ctaHref(content.ctaSecondary)} variant="ghost">
            {content.ctaSecondary}
          </Button>
        </div>
        <div className="hm-hero__foot">
          <nav className="hm-hero__services" aria-label="Services">
            {services.map((service, index) => (
              <Link key={service.slug} href={`/services/${service.slug}`}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                {service.title}
              </Link>
            ))}
          </nav>
          {content.metaStat ? (
            <p className="hm-hero__stat">
              <strong>{content.metaStat}</strong>
              <span>{content.metaLabel}</span>
            </p>
          ) : null}
        </div>
        <a href="#hm-trust" className="hm-scroll">
          <span className="hm-scroll__line" aria-hidden="true" />
          <span>Scroll</span>
        </a>
      </div>
    </section>
  );
}
