import React from 'react';

const defaultTestimonials = [
  {
    name: 'Sarah Johnson',
    role: 'CEO, TechStart',
    avatar: '👩‍💼',
    content:
      'NovaRo Solution felt like an internal product team. From strategy to launch, the quality bar stayed incredibly high.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Founder, Pixel Labs',
    avatar: '👨‍💻',
    content:
      'They shipped our new platform in record time without compromising on design or performance.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Head of Product, Flowly',
    avatar: '👩‍💻',
    content:
      'Our customers keep telling us how “premium” everything feels. That is entirely NovaRo’s fingerprint.',
    rating: 5,
  },
];

const Testimonials = ({ data }) => {
  const title = data?.title || 'Teams that ship with confidence';
  const description =
    data?.description ||
    'Product leaders across industries trust NovaRo Solution to bring their most important initiatives to life.';
  const testimonials = data?.items?.length ? data.items : defaultTestimonials;

  return (
    <section className="w-full px-4 py-18 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="section-title text-3xl md:text-5xl font-bold">
            {title}
          </h2>
          <p className="mt-3 text-sm md:text-base text-slate-400 max-w-2xl mx-auto">
            {description}
          </p>
          <div className="mt-5 h-1 w-24 rounded-full bg-linear-to-r from-red-500 via-pink-500 to-purple-500 mx-auto" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <article
              key={t.name}
              className="premium-card group relative h-full overflow-hidden rounded-3xl p-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-pink-500/10 to-purple-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-3xl">{t.avatar}</div>
                  <div className="flex gap-1 text-amber-400">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <span key={idx}>★</span>
                    ))}
                  </div>
                </div>
                <p className="flex-1 text-sm md:text-base text-slate-200 leading-relaxed">
                  “{t.content}”
                </p>
                <div className="mt-5 border-t border-white/10 pt-4">
                  <p className="text-sm font-semibold text-slate-50">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

