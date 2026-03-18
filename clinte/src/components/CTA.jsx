import React from 'react';
import { Link } from 'react-router-dom';

const CTA = ({ data }) => {
  const title = data?.title || 'Ready to ship your next product?';
  const description =
    data?.description ||
    'Partner with NovaRo Solution and get a dedicated product squad that helps you move from idea to launch with confidence.';
  const primaryCta = data?.primaryCta || 'Start a Project';
  const secondaryCta = data?.secondaryCta || 'Schedule a Call';

  return (
    <section className="w-full px-4 py-18 md:py-24">
      <div className="mx-auto max-w-5xl relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-red-600/40 via-pink-600/40 to-purple-700/40 p-8 md:p-14 text-center backdrop-blur-2xl shadow-[0_16px_50px_rgba(0,0,0,0.35)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-black/40 blur-3xl" />
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-50 tracking-tight">
            {title}
          </h2>
          <p className="mt-3 text-sm md:text-base text-slate-100/80 max-w-2xl mx-auto">
            {description}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="group relative inline-flex items-center justify-center rounded-xl bg-black/90 px-8 py-3 text-sm md:text-base font-semibold text-white shadow-lg shadow-black/40 transition-all duration-200 hover:scale-[1.03] hover:bg-black"
            >
              <span className="relative z-10 flex items-center gap-2">
                {primaryCta}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-8 py-3 text-sm md:text-base font-semibold text-slate-50 backdrop-blur-md transition-colors duration-200 hover:bg-white/20"
            >
              {secondaryCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;

