"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { Reveal } from "@/components/anim/Reveal";
import { SplitText } from "@/components/anim/SplitText";
import { Button } from "@/components/Button";
import { NMark } from "@/components/NMark";
import type { HeroContent } from "@/lib/site-data";
import { defaultHero, site } from "@/lib/site-data";
import { normalizeHeroContent } from "@/lib/hero-content";
import { useMotionSettings } from "@/lib/motion-provider";
import { useAfterLoad } from "@/lib/use-after-load";
import { useHydratedScroll } from "@/lib/use-hydrated-scroll";
import { serviceAreaLinks } from "@/lib/locations";

const HomeHero3D = dynamic(
  () => import("./HomeHero3D").then((mod) => mod.HomeHero3D),
  { ssr: false },
);

/**
 * Button labels are editable in the admin. "Case studies / work / portfolio" labels go to /work,
 * "services" labels to /services, everything else (start, book, discuss) to /contact.
 */
function ctaHref(label: string): string {
  if (/work|portfolio|case stud/i.test(label)) return "/work";
  if (/service/i.test(label)) return "/services";
  return "/contact";
}

type HomeHeroProps = {
  content?: HeroContent;
  /** Real, published client projects shown as proof under the CTAs (links to case studies). */
  proof?: Array<{ title: string; href: string }>;
};

function HeroPlace() {
  return (
    <>
      <div className="home-hero__loc">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21s-7-5.5-7-11a7 7 0 0114 0c0 5.5-7 11-7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
        <span>
          <strong>Worldwide</strong> · USA, UK, Europe, Middle East &amp; India
        </span>
      </div>
      <ul className="home-hero__markets" aria-label="Countries we build for">
        {site.serviceAreas.map((area) => (
          <li key={area} className={serviceAreaLinks[area] ? "is-link" : undefined}>
            {serviceAreaLinks[area] ? <Link href={serviceAreaLinks[area]}>{area}</Link> : area}
          </li>
        ))}
      </ul>
    </>
  );
}

export function HomeHero({ content = defaultHero, proof = [] }: HomeHeroProps) {
  const copy = normalizeHeroContent(content);
  const reduced = useReducedMotion();
  const { performanceTier, effectsEnabled, ready } = useMotionSettings();
  const cinematic = ready && !reduced && performanceTier === "high";
  const [isMobile, setIsMobile] = useState(false);
  const heroParallax = cinematic && effectsEnabled && !isMobile;
  // The 3D mark is decorative: load three.js only after the page has loaded and gone idle.
  const hero3d = useAfterLoad(effectsEnabled, 600);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { ref, scrollYProgress } = useHydratedScroll({
    offset: ["start start", "end start"],
    enabled: cinematic,
  });

  const copyOpacity = useTransform(scrollYProgress, [0, 0.55, 0.92], [1, 1, 0.12]);
  const copyY = useTransform(scrollYProgress, [0, 0.92], cinematic ? [0, -48] : [0, 0]);
  const visualOpacity = useTransform(scrollYProgress, [0, 0.5, 0.9], [1, 1, 0.2]);
  const visualScale = useTransform(scrollYProgress, [0, 0.92], [1, 0.88]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.45], [0.55, 0.9]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 18, mass: 0.35 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 18, mass: 0.35 });
  const visualTransform = useMotionTemplate`translate3d(${springX}px, ${springY}px, 0)`;

  useEffect(() => {
    if (!heroParallax) return;

    let frame = 0;
    const onMove = (event: MouseEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        mouseX.set((event.clientX / window.innerWidth - 0.5) * 28);
        mouseY.set((event.clientY / window.innerHeight - 0.5) * 22);
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [heroParallax, mouseX, mouseY]);

  const headline = `${copy.headline}\n${copy.headlineAccent}`;

  return (
    <section ref={ref} className="home-scene home-hero" aria-label="Novaro Solution home">
      <div className="home-hero__backdrop" aria-hidden>
        <div className="home-hero__grid" />
        {cinematic ? (
          <motion.div className="home-hero__glow home-hero__glow--primary" style={{ opacity: glowOpacity }} />
        ) : (
          <div className="home-hero__glow home-hero__glow--primary" />
        )}
        <div className="home-hero__glow home-hero__glow--secondary" />
        <div className="home-hero__aurora" />
      </div>

      <div className="wrap home-hero__inner">
        {/* One wrapper in every mode: the copy holds the largest paint, so it must not be
            remounted when scroll effects switch on after hydration. */}
        <motion.div
          className="home-hero__copy"
          style={cinematic ? { opacity: copyOpacity, y: copyY, willChange: "transform, opacity" } : undefined}
        >
          <HeroPlace />
          <span className="eyebrow">{copy.eyebrow}</span>
          <SplitText text={headline} as="h1" className="home-hero__title" />
          <p className="home-hero__lede">{copy.lede}</p>
          <div className="home-hero__actions">
            <Button href={ctaHref(copy.ctaPrimary)}>{copy.ctaPrimary}</Button>
            <Button href={ctaHref(copy.ctaSecondary)} variant="ghost">
              {copy.ctaSecondary}
            </Button>
          </div>
          {proof.length > 0 ? (
            <p className="home-hero__proof">
              <span className="home-hero__proof-label">Live client work:</span>{" "}
              {proof.map((item, index) => (
                <Fragment key={item.href}>
                  {index > 0 ? <span aria-hidden="true"> · </span> : null}
                  <Link href={item.href}>{item.title}</Link>
                </Fragment>
              ))}
            </p>
          ) : null}
          <div className="home-hero__stat" aria-label={`${copy.metaStat} ${copy.metaLabel}`}>
            <strong>{copy.metaStat}</strong>
            <span>{copy.metaLabel}</span>
          </div>
        </motion.div>

        {cinematic ? (
          <motion.div
            className="home-hero__visual"
            style={{
              opacity: visualOpacity,
              scale: visualScale,
              willChange: "transform, opacity",
            }}
          >
            <motion.div
              className={`home-hero__visual-float${effectsEnabled ? " home-hero__visual-float--3d" : ""}`}
              style={{
                transform: heroParallax ? visualTransform : undefined,
                willChange: heroParallax ? "transform" : undefined,
              }}
            >
              {hero3d ? <HomeHero3D /> : null}
              <div className="home-hero__orbit" />
              <div className="home-hero__orbit home-hero__orbit--inner" />
              <NMark className="home-hero__mark" size={280} />
            </motion.div>
          </motion.div>
        ) : (
          <Reveal delay={0.12} className="home-hero__visual">
            <div
              className={`home-hero__visual-float${effectsEnabled ? " home-hero__visual-float--3d" : ""}`}
            >
              {hero3d ? <HomeHero3D /> : null}
              <div className="home-hero__orbit" />
              <div className="home-hero__orbit home-hero__orbit--inner" />
              <NMark className="home-hero__mark" size={96} />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
