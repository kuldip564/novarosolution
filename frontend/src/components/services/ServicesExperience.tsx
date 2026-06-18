"use client";

import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Link from "next/link";
import { ClipReveal } from "@/components/anim/ClipReveal";
import { Counter } from "@/components/anim/Counter";
import { Parallax } from "@/components/anim/Parallax";
import { Reveal } from "@/components/anim/Reveal";
import { SplitText } from "@/components/anim/SplitText";
import { Button } from "@/components/Button";
import { CinemaBigword } from "@/components/sections/CinemaBigword";
import { ServiceMediaImage } from "@/components/sections/ServiceMediaImage";
import { ServicesCapabilities } from "@/components/services/ServicesCapabilities";
import { MediaPlaceholder } from "@/components/sections/MediaPlaceholder";
import type {
  ProcessStepView,
  ServiceDetailView,
  ServicesPageContent,
} from "@/lib/services-content";
import { useMotionSettings } from "@/lib/motion-provider";
import {
  usePinnedSceneOpacity,
  usePinnedSceneVisibility,
  usePinnedSceneZIndex,
} from "@/lib/pinned-scene-motion";
import { useHydratedScroll } from "@/lib/use-hydrated-scroll";

type ServicesExperienceProps = {
  content: ServicesPageContent;
  services: ServiceDetailView[];
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
  const opacity = usePinnedSceneOpacity(progress, index, total);
  const visibility = usePinnedSceneVisibility(opacity);
  const zIndex = usePinnedSceneZIndex(progress, index, total);
  const y = useTransform(opacity, [0, 1], [36, 0]);

  return (
    <motion.article
      className="services-process__scene"
      style={{ opacity, visibility, zIndex, y, willChange: "transform, opacity" }}
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
  const reduced = useReducedMotion();
  const usePin = cinematic && !reduced;

  const { ref: containerRef, scrollYProgress } = useHydratedScroll({
    offset: ["start start", "end end"],
    enabled: usePin,
  });

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
  const reduced = useReducedMotion();
  const reverse = index % 2 === 1;
  const parallax = cinematic;
  const scrollEnabled = cinematic && !reduced;

  const { ref, scrollYProgress } = useHydratedScroll({
    offset: ["start end", "center center"],
    enabled: scrollEnabled,
  });

  const copyY = useTransform(scrollYProgress, [0, 0.55], cinematic && !reduced ? [28, 0] : [0, 0]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.35], cinematic && !reduced ? [0.65, 1] : [1, 1]);

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
  const reduced = useReducedMotion();
  const scrollEnabled = cinematic && !reduced;

  const { ref, scrollYProgress } = useHydratedScroll({
    offset: ["start start", "end start"],
    enabled: scrollEnabled,
  });

  const headOpacity = useTransform(scrollYProgress, [0, 0.5, 0.88], [1, 1, 0.15]);
  const headY = useTransform(scrollYProgress, [0, 0.88], cinematic ? [0, -36] : [0, 0]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.55], [0.45, 0.8]);

  const headline = (
    <>
      <CinemaBigword
        title={content.introTitle}
        accent={content.introAccent}
        className="services-intro__bigword"
      />
      <p className="services-intro__tagline">{content.introLine}</p>
    </>
  );

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
            className="services-intro__head"
            style={{ opacity: headOpacity, y: headY, willChange: "transform, opacity" }}
          >
            {headline}
          </motion.div>
        ) : (
          <Reveal className="services-intro__head">{headline}</Reveal>
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

      <ServicesCapabilities content={content} cinematic={cinematic} />

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
