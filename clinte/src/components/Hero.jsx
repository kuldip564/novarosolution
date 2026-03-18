import React from 'react';
import { Link } from 'react-router-dom';

const defaultHighlights = [
  'Enterprise-grade quality',
  'Battle-tested infrastructure',
  'Dedicated product team',
];

const Hero = ({ data }) => {
  const badge = data?.badge || 'Trusted digital partner';
  const titleMain = data?.titleMain || 'NovaRo Solution';
  const titleGradient = data?.titleGradient || 'Building the future of digital products.';
  const description =
    data?.description ||
    'We help modern companies design, build, and scale premium web and mobile experiences that feel as polished as Stripe, Vercel, and Linear.';
  const primaryCta = data?.primaryCta || 'Get Started';
  const secondaryCta = data?.secondaryCta || 'Explore Services';
  const highlights = data?.highlights?.length ? data.highlights : defaultHighlights;

  return (
    <section className="hero-section-root relative w-full min-h-[86vh] flex items-center justify-center px-4 py-24">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="hero-section-bg absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 hero-grid-overlay" />
        <div className="pointer-events-none absolute inset-0">
          <div className="hero-3d-scene absolute inset-0">
            <div className="hero-3d-cube" />
            <div className="hero-3d-ring" />
            <div className="hero-3d-prism" />
          </div>
          <div className="hero-blob-a absolute -top-24 -right-10 h-72 w-72 rounded-full bg-linear-to-tr from-red-500/40 via-pink-500/40 to-purple-500/40 blur-3xl" />
          <div className="hero-blob-b absolute bottom-0 left-10 h-64 w-64 rounded-full bg-linear-to-tr from-indigo-500/30 via-sky-500/30 to-cyan-500/30 blur-3xl" />
        </div>
      </div>

      <div className="hero-content-wrap relative z-10 max-w-6xl mx-auto text-center px-2 md:px-8 py-2 md:py-8 rounded-3xl">
        <p
          data-hero="badge"
          className="hero-badge inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-300"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {badge}
        </p>

        <h1
          data-hero="title"
          className="cursor-hover hero-main-heading mt-6 text-4xl md:text-6xl lg:text-8xl font-extrabold tracking-tight"
        >
          <span className="hero-title-main block bg-clip-text text-transparent">
            {titleMain}
          </span>
          <span className="hero-title-accent mt-2 block bg-clip-text text-transparent animate-gradient bg-size-[200%_auto]">
            {titleGradient}
          </span>
        </h1>

        <p data-hero="description" className="hero-description mt-6 text-base md:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>

        <div data-hero="cta" className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/contact"
            className="group relative inline-flex items-center justify-center rounded-xl bg-linear-to-r from-red-600 via-pink-600 to-purple-600 px-8 py-3 text-sm md:text-base font-semibold text-white shadow-lg shadow-red-500/40 transition-transform duration-200 hover:scale-[1.03]"
          >
            <span className="relative z-10 flex items-center gap-2">
              {primaryCta}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
            <span className="absolute inset-0 rounded-xl bg-linear-to-r from-red-700 via-pink-700 to-purple-700 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>

          <Link
            to="/services"
            className="hero-secondary-btn inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-8 py-3 text-sm md:text-base font-semibold text-slate-100 backdrop-blur-md transition-colors duration-200 hover:bg-white/10 hover:border-white/25"
          >
            {secondaryCta}
          </Link>
        </div>

        <div data-hero="highlights" className="hero-highlights mt-10 flex flex-wrap items-center justify-center gap-6 text-xs md:text-sm text-slate-400">
          {highlights.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
