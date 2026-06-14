"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { ClipReveal } from "@/components/anim/ClipReveal";
import { Counter } from "@/components/anim/Counter";
import { Parallax } from "@/components/anim/Parallax";
import { Reveal } from "@/components/anim/Reveal";
import { SplitText } from "@/components/anim/SplitText";
import { Button } from "@/components/Button";
import { ServiceMediaImage } from "@/components/sections/ServiceMediaImage";
import { MediaPlaceholder } from "@/components/sections/MediaPlaceholder";
import type {
  ProcessStepView,
  ServiceDetailView,
  ServicesPageContent,
} from "@/lib/services-content";
import { useMotionSettings } from "@/lib/motion-provider";

type ServicesExperienceProps = {
  content: ServicesPageContent;
  services: ServiceDetailView[];
  capabilities: readonly string[] | string[];
  processSteps: ProcessStepView[];
  ctaTitle: string;
  ctaDescription: string;
};

function ProcessScene({
  step,
  index,
  total,
  progress,
}: {
  step: ProcessStepView;
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
    [0, 1, 1, 0],
  );
  const y = useTransform(progress, [start, mid], [48, 0]);

  return (
    <motion.article
      className="services-process__scene"
      style={{ opacity, y, willChange: "transform, opacity" }}
      aria-label={`${step.num} ${step.title}`}
    >
      <span className="services-process__num">{step.num}</span>
      <h3>{step.title}</h3>
      <p>{step.description}</p>
    </motion.article>
  );
}

function ServicesProcess({
  content,
  steps,
  cinematic,
}: {
  content: ServicesPageContent;
  steps: ProcessStepView[];
  cinematic: boolean;
}) {
  const containerRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const usePin = cinematic && !reduced;

  if (!usePin) {
    return (
      <section
        className="services-scene services-process services-process--static light"
        aria-labelledby="services-process-title"
      >
        <div className="wrap">
          <header className="services-scene__head services-scene__head--center">
            <span className="eyebrow center">{content.process.eyebrow}</span>
            <SplitText
              text={content.process.title}
              as="h2"
              className="services-scene__title"
            />
            <p className="services-scene__lede">{content.process.lede}</p>
          </header>
          <ol className="services-process__list">
            {steps.map((step) => (
              <li key={step.num} className="services-process__item">
                <span className="services-process__num">{step.num}</span>
                <div>
                  <h3 id={step.num === "01" ? "services-process-title" : undefined}>
                    {step.title}
                  </h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  const sceneHeight = steps.length * 88;

  return (
    <section
      ref={containerRef}
      className="services-scene services-process services-process--pinned light"
      style={{ height: `${sceneHeight}vh` }}
      aria-labelledby="services-process-title"
    >
      <div className="services-process__pin">
        <div className="wrap services-process__inner">
          <header className="services-scene__head services-process__head">
            <span className="eyebrow">{content.process.eyebrow}</span>
            <h2 id="services-process-title" className="services-scene__title services-scene__title--plain">
              {content.process.title}
            </h2>
            <p className="services-scene__lede">{content.process.lede}</p>
          </header>
          <div className="services-process__stage">
            {steps.map((step, i) => (
              <ProcessScene
                key={step.num}
                step={step}
                index={i}
                total={steps.length}
                progress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceDetailSection({
  service,
  index,
  cinematic,
}: {
  service: ServiceDetailView;
  index: number;
  cinematic: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const reverse = index % 2 === 1;
  const parallax = cinematic;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const copyY = useTransform(scrollYProgress, [0, 0.55], cinematic && !reduced ? [36, 0] : [0, 0]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.45], cinematic && !reduced ? [0.4, 1] : [1, 1]);

  const media = (
    <ClipReveal className="services-detail__media-clip">
      {service.imageAsset || service.media ? (
        <ServiceMediaImage
          asset={service.imageAsset}
          src={service.media?.src}
          alt={service.imageAlt ?? service.media?.alt ?? service.title}
          width={service.media?.width ?? 2048}
          height={service.media?.height ?? 1529}
          priority={index < 1}
        />
      ) : (
        <MediaPlaceholder
          title={`${service.title} preview`}
          hint="Add image / video · 4:3"
          className="services-detail__placeholder"
        />
      )}
    </ClipReveal>
  );

  const copy = (
    <>
      <span className="services-detail__no" aria-hidden>
        {service.no}
      </span>
      <h2 id={`service-title-${service.slug}`} className="services-detail__title">{service.title}</h2>
      <p className="services-detail__desc">{service.description}</p>

      <div className="services-detail__cols">
        <div className="services-detail__block">
          <h3 className="services-detail__label">What&apos;s included</h3>
          <ul>
            {service.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>

        {service.tools.length > 0 && (
          <div className="services-detail__block">
            <h3 className="services-detail__label">Tools &amp; stack</h3>
            <div className="services-detail__tags" role="list">
              {service.tools.map((tool) => (
                <span key={tool} className="services-detail__tag" role="listitem">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {service.outcomes.length > 0 && (
        <div className="services-detail__block services-detail__block--outcomes">
          <h3 className="services-detail__label">Outcomes you can expect</h3>
          <ul className="services-detail__outcomes">
            {service.outcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        </div>
      )}

      {service.relatedLinks.length > 0 && (
        <nav className="services-detail__links" aria-label={`Related links for ${service.title}`}>
          {service.relatedLinks.map((link) => (
            <Link key={link.href} href={link.href} className="services-detail__link">
              {link.label}
            </Link>
          ))}
        </nav>
      )}

      <div className="services-detail__cta">
        <Button href="/contact" variant="ghost">
          Discuss this service
        </Button>
      </div>
    </>
  );

  return (
    <section
      ref={ref}
      id={`service-${service.slug}`}
      className={`services-scene services-detail ${reverse ? "services-detail--reverse" : ""}`}
      aria-labelledby={`service-title-${service.slug}`}
    >
      <div className="wrap">
        <div className="services-detail__grid">
          {cinematic && !reduced ? (
            <motion.div
              className="services-detail__copy"
              style={{ y: copyY, opacity: copyOpacity, willChange: "transform, opacity" }}
            >
              <span className="services-detail__no" aria-hidden>
                {service.no}
              </span>
              <h2 id={`service-title-${service.slug}`} className="services-detail__title">
                {service.title}
              </h2>
              <p className="services-detail__desc">{service.description}</p>

              <div className="services-detail__cols">
                <div className="services-detail__block">
                  <h3 className="services-detail__label">What&apos;s included</h3>
                  <ul>
                    {service.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>

                {service.tools.length > 0 && (
                  <div className="services-detail__block">
                    <h3 className="services-detail__label">Tools &amp; stack</h3>
                    <div className="services-detail__tags" role="list">
                      {service.tools.map((tool) => (
                        <span key={tool} className="services-detail__tag" role="listitem">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {service.outcomes.length > 0 && (
                <div className="services-detail__block services-detail__block--outcomes">
                  <h3 className="services-detail__label">Outcomes you can expect</h3>
                  <ul className="services-detail__outcomes">
                    {service.outcomes.map((outcome) => (
                      <li key={outcome}>{outcome}</li>
                    ))}
                  </ul>
                </div>
              )}

              {service.relatedLinks.length > 0 && (
                <nav
                  className="services-detail__links"
                  aria-label={`Related links for ${service.title}`}
                >
                  {service.relatedLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="services-detail__link">
                      {link.label}
                    </Link>
                  ))}
                </nav>
              )}

              <div className="services-detail__cta">
                <Button href="/contact" variant="ghost">
                  Discuss this service
                </Button>
              </div>
            </motion.div>
          ) : (
            <Reveal className="services-detail__copy">{copy}</Reveal>
          )}

          {parallax ? (
            <Parallax speed={0.07} className="services-detail__media">
              {media}
            </Parallax>
          ) : (
            <Reveal delay={0.08} className="services-detail__media">
              {media}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

function ServicesIntro({
  content,
  cinematic,
}: {
  content: ServicesPageContent;
  cinematic: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const lineOpacity = useTransform(scrollYProgress, [0, 0.32, 0.72], [0.15, 1, 0.3]);
  const lineY = useTransform(scrollYProgress, [0, 0.45], cinematic ? [64, 0] : [0, 0]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 0.75]);

  return (
    <section ref={ref} className="services-scene services-intro" aria-label="Services overview">
      <div className="services-intro__backdrop" aria-hidden>
        <div className="services-intro__grid" />
        {cinematic && !reduced ? (
          <motion.div className="services-intro__glow" style={{ opacity: glowOpacity }} />
        ) : (
          <div className="services-intro__glow" />
        )}
        <div className="services-intro__aurora" aria-hidden />
      </div>

      <div className="wrap services-intro__content">
        {cinematic && !reduced ? (
          <motion.div
            className="services-intro__line-wrap"
            style={{ opacity: lineOpacity, y: lineY, willChange: "transform, opacity" }}
          >
            <SplitText text={content.introLine} as="h1" className="services-intro__line" />
          </motion.div>
        ) : (
          <Reveal>
            <SplitText text={content.introLine} as="h1" className="services-intro__line" />
          </Reveal>
        )}

        <Reveal delay={0.08}>
          <p className="services-intro__subline">{content.introSubline}</p>
        </Reveal>

        <div className="services-intro__stats">
          {content.introStats.map((stat, index) => (
            <Reveal key={stat.label} delay={0.12 + index * 0.06} className="services-intro__stat">
              <Counter value={stat.value} suffix={stat.suffix} className="services-intro__stat-value" />
              <span className="services-intro__stat-label">{stat.label}</span>
            </Reveal>
          ))}
        </div>

        <p className="services-intro__scroll-hint" aria-hidden>
          Scroll to explore
        </p>
      </div>
    </section>
  );
}

export function ServicesExperience({
  content,
  services,
  capabilities,
  processSteps,
  ctaTitle,
  ctaDescription,
}: ServicesExperienceProps) {
  const { reducedMotion, performanceTier } = useMotionSettings();
  const cinematic = !reducedMotion && performanceTier === "high";

  return (
    <main className="services-cinema">
      <ServicesIntro content={content} cinematic={cinematic} />

      {services.map((service, index) => (
        <ServiceDetailSection
          key={service.slug}
          service={service}
          index={index}
          cinematic={cinematic}
        />
      ))}

      <section
        className="services-scene services-capabilities light"
        aria-label={content.capabilities.title}
      >
        <div className="wrap">
          <header className="services-scene__head services-scene__head--center">
            <span className="eyebrow center">{content.capabilities.eyebrow}</span>
            <SplitText
              text={content.capabilities.title}
              as="h2"
              className="services-scene__title"
            />
          </header>
        </div>
        <div className="services-capabilities__strip" role="list" aria-label="Additional capabilities">
          <div className={`services-capabilities__track ${cinematic ? "" : "services-capabilities__track--static"}`}>
            {[...capabilities, ...capabilities].map((cap, index) => (
              <span
                key={`${cap}-${index}`}
                className="services-capabilities__pill"
                role="listitem"
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
      </section>

      <ServicesProcess content={content} steps={processSteps} cinematic={cinematic} />

      <section className="services-scene services-cta" aria-labelledby="services-cta-title">
        <div className="wrap">
          <Reveal>
            <div className="services-cta__band">
              <div className="services-cta__mesh" aria-hidden />
              <div className="services-cta__grid" aria-hidden />
              <div className="services-cta__inner">
                <span className="eyebrow center">{content.cta.eyebrow}</span>
                <SplitText text={ctaTitle} as="h2" className="services-cta__title" />
                <p id="services-cta-title">{ctaDescription}</p>
                <Button href="/contact">{content.cta.buttonLabel}</Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
