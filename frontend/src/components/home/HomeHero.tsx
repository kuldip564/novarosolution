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
import { useEffect, useState } from "react";
import { Reveal } from "@/components/anim/Reveal";
import { SplitText } from "@/components/anim/SplitText";
import { Button } from "@/components/Button";
import { NMark } from "@/components/NMark";
import type { HeroContent } from "@/lib/site-data";
import { defaultHero } from "@/lib/site-data";
import { normalizeHeroContent } from "@/lib/hero-content";
import { useMotionSettings } from "@/lib/motion-provider";
import { scrollStore } from "@/lib/scroll-store";
import { useHydratedScroll } from "@/lib/use-hydrated-scroll";

const HomeHero3D = dynamic(
  () => import("./HomeHero3D").then((mod) => mod.HomeHero3D),
  { ssr: false },
);

type HomeHeroProps = {
  content?: HeroContent;
};

export function HomeHero({ content = defaultHero }: HomeHeroProps) {
  const copy = normalizeHeroContent(content);
  const reduced = useReducedMotion();
  const { performanceTier, effectsEnabled } = useMotionSettings();
  const cinematic = !reduced && performanceTier === "high";
  const [isMobile, setIsMobile] = useState(false);
  const heroParallax = cinematic && effectsEnabled && !isMobile;

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

    const onMove = () => {
      mouseX.set(scrollStore.mx * 28);
      mouseY.set(scrollStore.my * 22);
    };

    onMove();
    const id = window.setInterval(onMove, 32);
    return () => window.clearInterval(id);
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
        {cinematic ? (
          <motion.div
            className="home-hero__copy"
            style={{ opacity: copyOpacity, y: copyY, willChange: "transform, opacity" }}
          >
            <span className="eyebrow">{copy.eyebrow}</span>
            <SplitText text={headline} as="h1" className="home-hero__title" />
            <p className="home-hero__lede">{copy.lede}</p>
            <div className="home-hero__actions">
              <Button href="/work">{copy.ctaPrimary}</Button>
              <Button href="/contact" variant="ghost">
                {copy.ctaSecondary}
              </Button>
            </div>
            <div className="home-hero__stat" aria-label={`${copy.metaStat} ${copy.metaLabel}`}>
              <strong>{copy.metaStat}</strong>
              <span>{copy.metaLabel}</span>
            </div>
          </motion.div>
        ) : (
          <Reveal className="home-hero__copy">
            <span className="eyebrow">{copy.eyebrow}</span>
            <SplitText text={headline} as="h1" className="home-hero__title" />
            <p className="home-hero__lede">{copy.lede}</p>
            <div className="home-hero__actions">
              <Button href="/work">{copy.ctaPrimary}</Button>
              <Button href="/contact" variant="ghost">
                {copy.ctaSecondary}
              </Button>
            </div>
            <div className="home-hero__stat" aria-label={`${copy.metaStat} ${copy.metaLabel}`}>
              <strong>{copy.metaStat}</strong>
              <span>{copy.metaLabel}</span>
            </div>
          </Reveal>
        )}

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
              {effectsEnabled ? <HomeHero3D /> : null}
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
              {effectsEnabled ? <HomeHero3D /> : null}
              <div className="home-hero__orbit" />
              <div className="home-hero__orbit home-hero__orbit--inner" />
              <NMark className="home-hero__mark" size={240} />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
