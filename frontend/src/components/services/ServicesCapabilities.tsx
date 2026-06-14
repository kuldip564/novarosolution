"use client";

import {
  BarChart3,
  Cloud,
  Database,
  Gauge,
  Palette,
  Plug,
  Shield,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/anim/Reveal";
import { SplitText } from "@/components/anim/SplitText";
import type { CapabilityItem, ServicesPageContent } from "@/lib/services-content";

const capabilityIcons: Record<string, LucideIcon> = {
  cloud: Cloud,
  palette: Palette,
  database: Database,
  plug: Plug,
  shield: Shield,
  gauge: Gauge,
  chart: BarChart3,
  smartphone: Smartphone,
};

function CapabilityCard({ item }: { item: CapabilityItem }) {
  const Icon = capabilityIcons[item.icon] ?? Sparkles;

  return (
    <article className="services-cap-card">
      <div className="services-cap-card__icon" aria-hidden>
        <Icon size={22} strokeWidth={1.65} />
      </div>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </article>
  );
}

function MarqueeRow({
  items,
  reverse = false,
  parallax,
  animated,
}: {
  items: CapabilityItem[];
  reverse?: boolean;
  parallax: MotionValue<string>;
  animated: boolean;
}) {
  const loop = [...items, ...items];

  return (
    <div className="services-capabilities__row">
      <motion.div className="services-capabilities__row-shift" style={{ x: parallax }}>
        <div
          className={`services-capabilities__track ${reverse ? "services-capabilities__track--reverse" : ""} ${animated ? "" : "services-capabilities__track--static"}`}
          role="list"
        >
          {loop.map((item, index) => (
            <div key={`${item.title}-${index}`} role="listitem">
              <CapabilityCard item={item} />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export function ServicesCapabilities({
  content,
  cinematic,
}: {
  content: ServicesPageContent;
  cinematic: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const items = content.capabilities.items;
  const animated = cinematic && !reduced;
  const midpoint = Math.ceil(items.length / 2);
  const rowA = items.slice(0, midpoint);
  const rowB = items.slice(midpoint);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rowParallaxA = useTransform(scrollYProgress, [0, 1], animated ? ["3%", "-8%"] : ["0%", "0%"]);
  const rowParallaxB = useTransform(scrollYProgress, [0, 1], animated ? ["-5%", "6%"] : ["0%", "0%"]);

  return (
    <section
      ref={ref}
      className="services-scene services-capabilities light"
      aria-labelledby="services-capabilities-title"
    >
      <div className="wrap">
        <header className="services-scene__head services-scene__head--center">
          <Reveal>
            <span className="eyebrow center">{content.capabilities.eyebrow}</span>
          </Reveal>
          <SplitText
            text={content.capabilities.title}
            as="h2"
            className="services-scene__title"
          />
          <Reveal delay={0.08}>
            <p id="services-capabilities-title" className="services-capabilities__lede">
              {content.capabilities.lede}
            </p>
          </Reveal>
        </header>
      </div>

      {animated ? (
        <div className="services-capabilities__marquee" aria-label="Supporting capabilities">
          <MarqueeRow items={rowA.length > 0 ? rowA : items} parallax={rowParallaxA} animated />
          {rowB.length > 0 && (
            <MarqueeRow items={rowB} reverse parallax={rowParallaxB} animated />
          )}
        </div>
      ) : (
        <div className="wrap">
          <ul className="services-capabilities__grid">
            {items.map((item) => (
              <li key={item.title}>
                <CapabilityCard item={item} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
