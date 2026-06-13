import Link from "next/link";
import { Parallax } from "@/components/anim/Parallax";
import { Reveal } from "@/components/anim/Reveal";
import { Button } from "@/components/Button";
import { NMark } from "@/components/NMark";

export function Hero() {
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
            <span className="eyebrow">Digital product studio</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1>
              Software, intelligence
              <br />
              and growth, <span className="accent">engineered as one.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="lede">
              Novaro Solution builds production-grade web apps, AI systems, and
              digital marketing engines for companies that want to move fast and
              look the part.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="hero-cta">
              <Button href="/work">See our work</Button>
              <Button href="/contact" variant="ghost">
                Book a call
              </Button>
              <span className="meta">
                <b>50+</b> products shipped
              </span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="hero-visual">
          <div className="orbit" />
          <div className="orbit o2" />
          <NMark className="hero-n" size={340} />
        </Reveal>
      </div>

      <Link href="#services" className="scroll-hint" aria-label="Scroll down">
        <span className="mouse" />
        <span>Scroll</span>
      </Link>
    </section>
  );
}
