"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { BarChart3, Compass, Shield, Sparkles, type LucideIcon } from "lucide-react";
import { useRef } from "react";
import { ClipReveal } from "@/components/anim/ClipReveal";
import { Counter } from "@/components/anim/Counter";
import { Parallax } from "@/components/anim/Parallax";
import { Reveal } from "@/components/anim/Reveal";
import { SplitText } from "@/components/anim/SplitText";
import { Tilt } from "@/components/anim/Tilt";
import { CloudinaryImage } from "@/components/admin/CloudinaryImage";
import { Button } from "@/components/Button";
import { NMark } from "@/components/NMark";
import { MediaPlaceholder } from "@/components/sections/MediaPlaceholder";
import type {
  AboutMilestone,
  AboutPageContent,
  AboutStat,
  AboutValue,
  AboutWhyItem,
} from "@/lib/about-content";
import type { TeamMemberView } from "@/lib/content-mappers";
import { useMotionSettings } from "@/lib/motion-provider";

const valueIcons: Record<string, LucideIcon> = {
  spark: Sparkles,
  shield: Shield,
  compass: Compass,
  chart: BarChart3,
};

type AboutExperienceProps = {
  content: AboutPageContent;
  stats: AboutStat[];
  whyItems: AboutWhyItem[];
  team: TeamMemberView[];
  ctaTitle: string;
  ctaDescription: string;
};

function MilestoneScene({
  milestone,
  index,
  total,
  progress,
}: {
  milestone: AboutMilestone;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const segment = 1 / total;
  const start = index * segment;
  const mid = start + segment * 0.38;
  const end = start + segment;

  const opacity = useTransform(
    progress,
    [start, mid, Math.max(mid, end - segment * 0.12), end],
    [index === 0 ? 1 : 0, 1, 1, 0],
  );
  const y = useTransform(progress, [start, mid], [index === 0 ? 0 : 56, 0]);
  const scale = useTransform(progress, [start, mid], [index === 0 ? 1 : 0.94, 1]);

  return (
    <motion.article
      className="about-timeline__scene"
      style={{ opacity, y, scale, willChange: "transform, opacity" }}
      aria-label={`${milestone.year}: ${milestone.title}`}
    >
      <span className="about-timeline__year">{milestone.year}</span>
      <h3>{milestone.title}</h3>
      <p>{milestone.text}</p>
    </motion.article>
  );
}

function AboutTimeline({
  eyebrow,
  title,
  milestones,
  cinematic,
}: {
  eyebrow: string;
  title: string;
  milestones: AboutMilestone[];
  cinematic: boolean;
}) {
  const containerRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const usePin = cinematic && !reduced;

  if (!usePin) {
    return (
      <section
        className="about-scene about-timeline about-timeline--static"
        aria-labelledby="about-timeline-title"
      >
        <div className="wrap">
          <header className="about-scene__head">
            <span className="eyebrow">{eyebrow}</span>
            <SplitText
              text={title}
              as="h2"
              className="about-scene__title"
            />
          </header>
          <ol className="about-timeline__list">
            {milestones.map((m) => (
              <li key={`${m.year}-${m.title}`} className="about-timeline__item">
                <span className="about-timeline__year">{m.year}</span>
                <div>
                  <h3>{m.title}</h3>
                  <p>{m.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  const sceneHeight = milestones.length * 95;

  return (
    <section
      ref={containerRef}
      className="about-scene about-timeline about-timeline--pinned"
      style={{ height: `${sceneHeight}vh` }}
      aria-labelledby="about-timeline-title"
    >
      <div className="about-timeline__pin">
        <div className="wrap about-timeline__inner">
          <header className="about-scene__head about-timeline__head">
            <span className="eyebrow">{eyebrow}</span>
            <h2 id="about-timeline-title" className="about-scene__title about-scene__title--plain">
              {title.split("\n").map((line, index) => (
                <span key={line}>
                  {line}
                  {index < title.split("\n").length - 1 ? <br /> : null}
                </span>
              ))}
            </h2>
          </header>
          <div className="about-timeline__stage">
            <motion.div
              className="about-timeline__line"
              style={{ scaleY: lineScale, transformOrigin: "top center" }}
              aria-hidden
            />
            {milestones.map((m, i) => (
              <MilestoneScene
                key={`${m.year}-${m.title}`}
                milestone={m}
                index={i}
                total={milestones.length}
                progress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutIntro({ line, cinematic }: { line: string; cinematic: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const lineOpacity = useTransform(scrollYProgress, [0, 0.5, 0.88], [1, 1, 0.15]);
  const lineY = useTransform(scrollYProgress, [0, 0.88], cinematic ? [0, -40] : [0, 0]);
  const markOpacity = useTransform(scrollYProgress, [0, 0.55, 0.88], [1, 1, 0.3]);
  const markScale = useTransform(scrollYProgress, [0, 0.88], [1, 0.92]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.55], [0.5, 0.85]);

  return (
    <section ref={ref} className="about-scene about-intro" aria-label="About Novaro Solution">
      <div className="about-intro__backdrop" aria-hidden>
        <div className="about-intro__grid" />
        {cinematic && !reduced ? (
          <motion.div className="about-intro__glow" style={{ opacity: glowOpacity }} />
        ) : (
          <div className="about-intro__glow" />
        )}
      </div>

      <div className="wrap about-intro__content">
        {cinematic && !reduced ? (
          <motion.div style={{ opacity: markOpacity, scale: markScale, willChange: "transform, opacity" }}>
            <NMark className="about-intro__mark" size={120} />
          </motion.div>
        ) : (
          <Reveal>
            <NMark className="about-intro__mark" size={120} />
          </Reveal>
        )}

        {cinematic && !reduced ? (
          <motion.div
            className="about-intro__line-wrap"
            style={{ opacity: lineOpacity, y: lineY, willChange: "transform, opacity" }}
          >
            <SplitText text={line} as="h1" className="about-intro__line" />
          </motion.div>
        ) : (
          <Reveal delay={0.08}>
            <SplitText text={line} as="h1" className="about-intro__line" />
          </Reveal>
        )}

        <p className="about-intro__scroll-hint" aria-hidden>
          Scroll to explore
        </p>
      </div>
    </section>
  );
}

function ValueCard({ value, index }: { value: AboutValue; index: number }) {
  const Icon = valueIcons[value.icon] ?? Sparkles;

  return (
    <Reveal delay={index * 0.08} className="about-value">
      <div className="about-value__icon" aria-hidden>
        <Icon size={22} strokeWidth={1.6} />
      </div>
      <h3>{value.title}</h3>
      <p>{value.description}</p>
    </Reveal>
  );
}

export function AboutExperience({
  content,
  stats,
  whyItems,
  team,
  ctaTitle,
  ctaDescription,
}: AboutExperienceProps) {
  const { reducedMotion, performanceTier } = useMotionSettings();
  const cinematic = !reducedMotion && performanceTier === "high";
  const parallax = cinematic;

  return (
    <main className="about-cinema">
      <AboutIntro line={content.introLine} cinematic={cinematic} />

      <section className="about-scene about-who" aria-labelledby="about-who-title">
        <div className="wrap about-who__grid">
          <Reveal className="about-who__copy">
            <span className="eyebrow">{content.whoWeAre.eyebrow}</span>
            <SplitText
              text={content.whoWeAre.title}
              as="h2"
              className="about-scene__title"
            />
            <p className="about-who__body">{content.whoWeAre.body}</p>
          </Reveal>

          {parallax ? (
            <Parallax speed={0.08} className="about-who__visual">
              <div className="about-who__glass">
                <div className="about-who__glass-glow" aria-hidden />
                <NMark size={180} />
              </div>
            </Parallax>
          ) : (
            <Reveal delay={0.1} className="about-who__visual">
              <div className="about-who__glass">
                <div className="about-who__glass-glow" aria-hidden />
                <NMark size={180} />
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <section className="about-scene about-mv" aria-labelledby="about-mv-title">
        <div className="wrap">
          <header className="about-scene__head about-scene__head--center">
            <span className="eyebrow">{content.missionVision.eyebrow}</span>
          </header>
          <div className="about-mv__grid">
            <Reveal className="about-mv__card">
              <span className="about-mv__label">{content.missionVision.missionLabel}</span>
              <p id="about-mv-title">{content.missionVision.mission}</p>
            </Reveal>
            <Reveal delay={0.1} className="about-mv__card">
              <span className="about-mv__label">{content.missionVision.visionLabel}</span>
              <p>{content.missionVision.vision}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <AboutTimeline
        eyebrow={content.timeline.eyebrow}
        title={content.timeline.title}
        milestones={content.timeline.milestones}
        cinematic={cinematic}
      />

      <section className="about-scene about-values" aria-labelledby="about-values-title">
        <div className="wrap">
          <header className="about-scene__head">
            <span className="eyebrow">{content.values.eyebrow}</span>
            <SplitText
              text={content.values.title}
              as="h2"
              className="about-scene__title"
            />
          </header>
          <div className="about-values__grid">
            {content.values.items.map((value, index) => (
              <ValueCard key={value.title} value={value} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="about-scene about-stats" aria-labelledby="about-stats-title">
        <div className="wrap">
          <header className="about-scene__head about-scene__head--center">
            <span className="eyebrow">{content.stats.eyebrow}</span>
            <SplitText
              text={content.stats.title}
              as="h2"
              className="about-scene__title"
            />
          </header>
          <div className="about-stats__grid">
            {stats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 0.08} className="about-stats__item">
                <Counter value={stat.value} suffix={stat.suffix} className="about-stats__value" />
                <span className="about-stats__label">{stat.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="about-scene about-team" aria-labelledby="about-team-title">
        <div className="wrap">
          <header className="about-scene__head">
            <span className="eyebrow">{content.team.eyebrow}</span>
            <SplitText
              text={content.team.title}
              as="h2"
              className="about-scene__title"
            />
            <p className="about-scene__lede">{content.team.description}</p>
          </header>

          <div className="about-team__grid">
            {team.map((member, index) => (
              <Reveal key={`${member.name}-${member.role}`} delay={index * 0.06}>
                <Tilt className="about-team__member">
                  <ClipReveal>
                    {member.photoAsset ? (
                      <CloudinaryImage
                        asset={member.photoAsset}
                        alt={`Portrait of ${member.name}`}
                        width={600}
                        height={800}
                        transformWidth={480}
                        className="about-team__photo"
                        sizes="(max-width: 768px) 50vw, 280px"
                      />
                    ) : member.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={member.photo}
                        alt={`Portrait of ${member.name}`}
                        className="about-team__photo"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <MediaPlaceholder
                        title="Photo"
                        hint="3:4 portrait"
                        className="about-team__photo about-team__photo--placeholder"
                      />
                    )}
                  </ClipReveal>
                  <div className="about-team__meta">
                    <h3>{member.name}</h3>
                    <span>{member.role}</span>
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="about-scene about-why" aria-labelledby="about-why-title">
        <div className="wrap about-why__grid">
          <Reveal className="about-why__intro">
            <span className="eyebrow">{content.whyUs.eyebrow}</span>
            <SplitText
              text={content.whyUs.title}
              as="h2"
              className="about-scene__title"
            />
          </Reveal>

          <ol className="about-why__list">
            {whyItems.map((item, index) => (
              <Reveal key={item.key} delay={index * 0.07} as="li" className="about-why__item">
                <span className="about-why__key" aria-hidden>
                  {item.key}
                </span>
                <div>
                  <h3 id={index === 0 ? "about-why-title" : undefined}>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="about-scene about-cta" aria-labelledby="about-cta-title">
        <div className="wrap">
          <Reveal>
            <div className="about-cta__band">
              <div className="about-cta__mesh" aria-hidden />
              <div className="about-cta__grid" aria-hidden />
              <div className="about-cta__inner">
                <span className="eyebrow center">{content.cta.eyebrow}</span>
                <SplitText text={ctaTitle} as="h2" className="about-cta__title" />
                <p id="about-cta-title">{ctaDescription}</p>
                <Button href="/contact">{content.cta.buttonLabel}</Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
