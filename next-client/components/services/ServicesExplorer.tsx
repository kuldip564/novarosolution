'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FaChartLine, FaCode, FaMobileAlt, FaPalette, FaRocket } from 'react-icons/fa';

type ServiceItem = {
  title: string;
  description: string;
  badge: string;
  deliveryTime: string;
  pricing: string;
  iconKey: string;
  details: string[];
  features: string[];
};

const ICON_BY_KEY: Record<string, any> = {
  'web-development': FaCode,
  'ui-ux-design': FaPalette,
  'app-development': FaMobileAlt,
  'seo-growth': FaChartLine
};

export default function ServicesExplorer({ services }: { services: ServiceItem[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter((service) => {
      const haystack = [
        service.title,
        service.description,
        service.badge,
        service.deliveryTime,
        service.pricing,
        ...service.details,
        ...service.features
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, services]);

  return (
    <>
      <section className="page-content-card mt-6 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Service Finder</p>
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by service, feature, SEO, mobile, design..."
            aria-label="Search services"
          />
          <p className="text-sm text-slate-300 md:text-right">
            Showing <span className="font-semibold text-slate-100">{filtered.length}</span> of{' '}
            <span className="font-semibold text-slate-100">{services.length}</span> services
          </p>
        </div>
      </section>

      <section className="mt-5 grid gap-5 md:grid-cols-2">
        {filtered.map((service) => {
          const Icon = ICON_BY_KEY[service.iconKey] || FaRocket;
          return (
            <article key={service.title} className="page-content-card space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-pink-200">
                  <Icon />
                </div>
                <span className="rounded-full border border-pink-400/30 bg-pink-500/15 px-3 py-1 text-xs">
                  {service.badge}
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">{service.title}</h2>
                <p className="mt-2 text-slate-300">{service.description}</p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-white/15 bg-white/8 px-3 py-1">{service.deliveryTime}</span>
                <span className="rounded-full border border-white/15 bg-white/8 px-3 py-1">{service.pricing}</span>
              </div>

              <details className="group rounded-2xl border border-white/10 bg-black/10 p-3">
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-100">
                  Open and read full service details
                </summary>
                <div className="mt-3 space-y-3 text-sm text-slate-300">
                  {service.details.length ? (
                    <ul className="space-y-1">
                      {service.details.map((point) => (
                        <li key={`${service.title}-${point}`}>- {point}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Custom scope based on your business goals.</p>
                  )}
                  {service.features.length ? (
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature) => (
                        <span
                          key={`${service.title}-${feature}`}
                          className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </details>

              <Link className="btn inline-block px-5 py-2.5 text-sm" href="/#contact-form">
                Contact Us
              </Link>
            </article>
          );
        })}
      </section>

      {!filtered.length ? (
        <section className="page-content-card mt-5">
          <p className="text-slate-300">No service found for this keyword. Try a broader search.</p>
        </section>
      ) : null}
    </>
  );
}

