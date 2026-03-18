import React from 'react';

const defaultFeatures = [
  {
    title: 'Fast & Performant',
    description: 'Optimized experiences with edge delivery, caching, and first-class performance budgets.',
    icon: '⚡',
  },
  {
    title: 'Secure by Design',
    description: 'Security woven into every layer, from auth to infrastructure and compliance.',
    icon: '🔒',
  },
  {
    title: 'Dedicated Support',
    description: 'Hands-on collaboration from a team that feels like an extension of your own.',
    icon: '💬',
  },
  {
    title: 'Cost Effective',
    description: 'Flexible engagement models that scale with your product, not against it.',
    icon: '💰',
  },
];

const Features = ({ data }) => {
  const title = data?.title || 'Why teams choose NovaRo Solution';
  const description =
    data?.description ||
    'We combine product thinking, engineering excellence, and beautiful design into a single partner.';
  const features = data?.items?.length ? data.items : defaultFeatures;

  return (
    <section className="features-section-bg w-full px-4 py-18 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="section-title text-3xl md:text-5xl font-bold">
            {title}
          </h2>
          <p className="features-section-description mt-3 text-sm md:text-base text-slate-400 max-w-2xl mx-auto">
            {description}
          </p>
          <div className="mt-5 h-1 w-24 rounded-full bg-linear-to-r from-red-500 via-pink-500 to-purple-500 mx-auto" />
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="premium-card features-card group relative overflow-hidden rounded-3xl p-6"
            >
              <div className="features-card-overlay absolute inset-0 bg-gradient-to-br from-red-500/10 via-pink-500/10 to-purple-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-3xl">{feature.icon}</div>
                  <div className="features-icon-chip h-8 w-8 rounded-xl bg-gradient-to-tr from-emerald-400/30 to-sky-400/30" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-50">
                  {feature.title}
                </h3>
                <p className="features-card-description mt-2 text-xs md:text-sm text-slate-300">
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

