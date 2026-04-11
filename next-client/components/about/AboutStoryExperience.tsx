'use client';

import dynamic from 'next/dynamic';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import SafeImage from '@/components/ui/SafeImage';

const AboutNebulaScene = dynamic(() => import('@/components/about/AboutNebulaScene'), {
  ssr: false
});

type Owner = {
  name?: string;
  role?: string;
  bio?: string;
  email?: string;
  experience?: string;
  avatar?: string;
};

type AboutStoryExperienceProps = {
  about: any;
  team: any;
  statsItems: any[];
  services: any[];
  workPoints: string[];
  owners: Owner[];
};

function normalizeAvatarValue(avatar: unknown) {
  return String(avatar || '').trim();
}

function getInitials(name: unknown) {
  const safe = String(name || '').trim();
  if (!safe) return 'ON';
  const parts = safe.split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() || '').join('') || 'ON';
}

function isImageAvatar(avatar: unknown) {
  const value = normalizeAvatarValue(avatar).toLowerCase();
  return (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('data:image/') ||
    value.startsWith('blob:') ||
    value.startsWith('/')
  );
}

export default function AboutStoryExperience({
  about,
  team,
  statsItems,
  services,
  workPoints,
  owners
}: AboutStoryExperienceProps) {
  const reduceMotion = useReducedMotion();
  const [activeChapter, setActiveChapter] = useState(0);
  const [autoStory, setAutoStory] = useState(true);

  const chapters = useMemo(
    () => [
      {
        title: 'Chapter 01 - The Vision',
        summary:
          about?.paragraphs?.[0] ||
          'Novaro Solution helps businesses turn ideas into real products with clear planning and focused execution.',
        bullets: [
          'Understand business goals and user outcomes',
          'Define the right scope before writing code',
          'Build product direction with a strong UX foundation'
        ]
      },
      {
        title: 'Chapter 02 - The Build',
        summary:
          about?.paragraphs?.[1] ||
          'We blend design and engineering in one fast loop to reduce delays and deliver quality.',
        bullets: workPoints.slice(0, 3).length
          ? workPoints.slice(0, 3)
          : [
              'Design sprints and rapid prototypes',
              'Full-stack development and integrations',
              'QA and launch readiness with performance checks'
            ]
      },
      {
        title: 'Chapter 03 - The Scale',
        summary:
          about?.workDescription ||
          'After launch, we keep improving product quality, speed, and growth impact with your team.',
        bullets: workPoints.slice(3).length
          ? workPoints.slice(3)
          : [
              'Long-term support and iteration planning',
              'Feature roadmap execution',
              'Continuous optimization and growth tracking'
            ]
      }
    ],
    [about, workPoints]
  );

  const visibleOwners = owners.slice(0, 2);
  const active = chapters[activeChapter] || chapters[0];

  useEffect(() => {
    if (!autoStory) return;
    const timer = window.setInterval(() => {
      setActiveChapter((prev) => (prev + 1) % chapters.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [autoStory, chapters.length]);

  const heroItemMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 10 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.35 }
      };

  return (
    <motion.main
      className="app-page-shell about-3d-shell space-y-6"
      initial={reduceMotion ? undefined : { opacity: 0, y: 6 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <section className="premium-page-hero about-3d-hero">
        <motion.div
          className="about-3d-copy"
          initial={reduceMotion ? undefined : 'hidden'}
          whileInView={reduceMotion ? undefined : 'show'}
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } }
          }}
        >
          <motion.p
            className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
          >
            {about?.eyebrow || 'About NovaRo Solution'}
          </motion.p>
          <motion.h1
            className="section-title text-3xl font-extrabold md:text-5xl"
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          >
            {about?.title || 'A simple and reliable digital product team.'}
          </motion.h1>
          <motion.p
            className="text-slate-300"
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          >
            We design your story, engineer your product, and scale your growth using a premium digital workflow.
          </motion.p>
          <motion.div
            className="mt-4 flex flex-wrap gap-2 text-xs"
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
          >
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">Story Driven Strategy</span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">3D Product Experience</span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">Scale Ready Engineering</span>
          </motion.div>
        </motion.div>
        <div className="about-3d-visual">
          <AboutNebulaScene intensity="bold" />
        </div>
      </section>

      <section className="page-content-card space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(statsItems.length
            ? statsItems
            : [
                { label: 'Projects Delivered', value: '30+' },
                { label: 'Active Clients', value: '20+' },
                { label: 'Years Experience', value: '2+' },
                { label: 'Experts on Team', value: '5+' }
              ]
          ).map((stat: any, index: number) => (
            <motion.article
              key={`${stat.label || 'stat'}-${index}`}
              className="about-stat-3d"
              {...heroItemMotion}
              transition={{ duration: 0.35, delay: reduceMotion ? 0 : index * 0.05 }}
              whileHover={reduceMotion ? undefined : { y: -3, scale: 1.01 }}
            >
              <p className="text-2xl font-bold">{stat.value || '0'}</p>
              <p className="text-xs uppercase tracking-[0.08em] text-slate-400">{stat.label || 'Metric'}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="page-content-card about-story-grid">
        <div className="about-chapter-nav">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Our Story Journey</p>
          <div className="about-story-actions">
            <motion.button
              type="button"
              className="about-chapter-btn"
              onClick={() => setAutoStory((prev) => !prev)}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              {autoStory ? 'Auto Story: On' : 'Auto Story: Off'}
            </motion.button>
            <motion.button
              type="button"
              className="about-chapter-btn"
              onClick={() => setActiveChapter((prev) => (prev === 0 ? chapters.length - 1 : prev - 1))}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              Previous
            </motion.button>
            <motion.button
              type="button"
              className="about-chapter-btn"
              onClick={() => setActiveChapter((prev) => (prev + 1) % chapters.length)}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              Next
            </motion.button>
            <div className="about-chapter-progress-track">
              <motion.span
                key={`${activeChapter}-${autoStory ? 'auto' : 'manual'}`}
                className="about-chapter-progress-fill"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: autoStory ? 5.1 : 0.5, ease: 'linear' }}
              />
            </div>
          </div>
          {chapters.map((chapter, index) => (
            <motion.button
              key={chapter.title}
              type="button"
              className={`about-chapter-btn ${activeChapter === index ? 'is-active' : ''}`}
              onClick={() => setActiveChapter(index)}
              whileHover={reduceMotion ? undefined : { x: 2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.99 }}
            >
              {chapter.title}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            key={active.title}
            className="about-chapter-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            <h2 className="text-2xl font-semibold">{active.title}</h2>
            <p className="mt-2 text-slate-300">{active.summary}</p>
            <div className="mt-4 grid gap-2">
              {active.bullets.map((point, index) => (
                <motion.article
                  key={`${active.title}-${point}`}
                  className="about-point-item"
                  initial={reduceMotion ? undefined : { opacity: 0, x: 8 }}
                  animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.26, delay: reduceMotion ? 0 : index * 0.05 }}
                >
                  <p className="text-sm text-slate-200">{point}</p>
                </motion.article>
              ))}
            </div>
            <div className="mt-4">
              <AboutNebulaScene intensity="soft" />
            </div>
          </motion.article>
        </AnimatePresence>
      </section>

      <section className="page-content-card space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">Capabilities</p>
        <h2 className="section-title text-2xl font-bold md:text-4xl">
          {about?.workTitle || 'How we create value for your business'}
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {(services.length
            ? services
            : [
                { title: 'Web Development', description: 'Scalable, secure web platforms tailored to your goals.' },
                { title: 'UI / UX Design', description: 'Clear user experiences with strong visual hierarchy.' },
                { title: 'App Development', description: 'High-performance mobile apps for iOS and Android.' },
                { title: 'SEO & Growth', description: 'Technical and content growth strategy for visibility.' }
              ]
          ).map((service: any, index: number) => (
            <motion.article
              key={`${service.title || 'service'}-${index}`}
              className="about-service-3d"
              {...heroItemMotion}
              transition={{ duration: 0.32, delay: reduceMotion ? 0 : index * 0.05 }}
              whileHover={reduceMotion ? undefined : { y: -3 }}
            >
              <h3 className="text-lg font-semibold">{service.title || 'Service'}</h3>
              <p className="mt-2 text-sm text-slate-300">
                {service.description || 'Custom execution based on your roadmap and growth stage.'}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="page-content-card space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">
          {team?.eyebrow || 'Our Team'}
        </p>
        <h2 className="section-title text-2xl font-bold md:text-4xl">
          {team?.title || 'Owners behind NovaRo Solution'}
        </h2>
        <p className="text-slate-300">
          {team?.description ||
            'Leadership focused on product quality, delivery speed, and long-term client success.'}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {visibleOwners.map((item: Owner, index: number) => (
            <motion.article
              key={`${item.name || 'owner'}-${index}`}
              className="about-owner-3d"
              {...heroItemMotion}
              transition={{ duration: 0.33, delay: reduceMotion ? 0 : index * 0.06 }}
              whileHover={reduceMotion ? undefined : { y: -3 }}
            >
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Owner Details</p>
              <div className="mt-3 flex items-start gap-3">
                <div className="h-14 w-14 overflow-hidden rounded-2xl border border-white/15 bg-white/10 text-sm font-bold flex items-center justify-center">
                  {isImageAvatar(item.avatar) ? (
                    <SafeImage
                      src={normalizeAvatarValue(item.avatar)}
                      alt={item.name ? `Photo of ${item.name}` : 'Team member photo'}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    getInitials(item.name)
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{item.name || 'Owner'}</h3>
                  <p className="text-sm text-pink-300 uppercase tracking-[0.08em]">{item.role || 'Team Owner'}</p>
                  <p className="mt-2 text-sm text-slate-300">{item.bio}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    {item.experience ? <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1">{item.experience}</span> : null}
                    {item.email ? <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1">{item.email}</span> : null}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </motion.main>
  );
}

