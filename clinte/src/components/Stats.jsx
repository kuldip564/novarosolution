import React from 'react';

const defaultStats = [
  { label: 'Projects Delivered', value: '500+', icon: '✨' },
  { label: 'Active Clients', value: '200+', icon: '🤝' },
  { label: 'Years Experience', value: '10+', icon: '🎯' },
  { label: 'Experts on Team', value: '50+', icon: '👨‍💻' },
];

const Stats = ({ data }) => {
  const title = data?.title || 'Numbers that tell our story';
  const stats = data?.items?.length ? data.items : defaultStats;

  return (
    <section className="stats-section-bg w-full px-4 py-18 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="section-title text-3xl md:text-4xl font-bold">
            {title}
          </h2>
          <div className="mt-4 h-1 w-20 rounded-full bg-linear-to-r from-red-500 via-pink-500 to-purple-500 mx-auto" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((item) => (
            <div
              key={item.label}
              className="premium-card group relative overflow-hidden rounded-2xl px-4 py-6 text-center"
            >
              <div className="absolute inset-0 bg-linear-to-br from-red-500/10 via-pink-500/10 to-purple-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="text-2xl md:text-3xl mb-1">{item.icon}</div>
                <p className="text-2xl md:text-3xl font-bold text-slate-50">
                  {item.value}
                </p>
                <p className="mt-1 text-xs md:text-sm text-slate-400">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;

