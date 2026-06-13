import Link from "next/link";
import { Parallax } from "@/components/anim/Parallax";
import { Reveal } from "@/components/anim/Reveal";
import { Button } from "@/components/Button";
import { NMark } from "@/components/NMark";
import type { HeroContent } from "@/lib/site-data";
import { defaultHero } from "@/lib/site-data";
import { normalizeHeroContent } from "@/lib/hero-content";

type HeroProps = {
  content?: HeroContent;
};

export function Hero({ content = defaultHero }: HeroProps) {
  const copy = normalizeHeroContent(content);

  return (
    <section className="hero">
      <div className="hero-bg">
        <Parallax speed={0.05} className="grid" />
        <Parallax speed={0.12}>
          <div className="glow g1" />
        </Parallax>
        <Parallax speed={0.08}>
          <div className="glow g2" />
        </Parallax>
      </div>

      <div className="wrap hero-inner">
        <div className="hero-copy">
          <Reveal>
            <span className="eyebrow">{copy.eyebrow}</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1>
              {copy.headline}
              <br />
              <span className="accent">{copy.headlineAccent}</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="lede">{copy.lede}</p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="hero-cta">
              <Button href="/work">{copy.ctaPrimary}</Button>
              <Button href="/contact" variant="ghost">
                {copy.ctaSecondary}
              </Button>
              <span className="meta">
                <b>{copy.metaStat}</b> {copy.metaLabel}
              </span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="hero-visual">
          <div className="orbit" />
          <div className="orbit o2" />
          <NMark className="hero-n" size={280} />
        </Reveal>
      </div>

      <Link href="#services" className="scroll-hint" aria-label="Scroll down">
        <span className="mouse" />
        <span>Scroll</span>
      </Link>
    </section>
  );
}
