'use client';

import Link from 'next/link';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { PUBLIC_CLIENT_SHOWCASE } from '@/lib/clientShowcase';

type Props = {
  variant?: 'home' | 'page';
  id?: string;
};

export default function ClientWorkShowcase({ variant = 'home', id = 'featured-work' }: Props) {
  const isHome = variant === 'home';

  return (
    <section
      id={id}
      className={
        isHome
          ? 'home-section-band home-section-band--tint w-full px-4 py-20 md:py-24'
          : 'mb-12 md:mb-16'
      }
      aria-labelledby={`${id}-heading`}
    >
      <div className={isHome ? 'mx-auto max-w-6xl' : ''}>
        <div className={isHome ? 'home-section-head' : 'mb-2'}>
          <p
            className={
              isHome
                ? 'home-section-kicker'
                : 'text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-400/90'
            }
          >
            Live work
          </p>
        </div>
        <h2
          id={`${id}-heading`}
          className={
            isHome
              ? 'home-section-heading mb-3 text-center text-3xl md:text-5xl'
              : 'section-title mb-3 text-center text-2xl font-extrabold md:text-4xl'
          }
        >
          Sites we engineered
        </h2>
        <p
          className={
            isHome
              ? 'home-section-intro mb-10'
              : 'mx-auto mb-10 max-w-3xl text-center text-slate-400 md:text-lg'
          }
        >
          Explore production launches built end-to-end by NovaRo Solution. Many enterprise and private builds stay
          confidential—we highlight public references you can browse anytime.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {PUBLIC_CLIENT_SHOWCASE.map((item) => (
            <article
              key={item.id}
              className={`client-work-card client-work-card--${item.accent}`}
            >
              <div className="client-work-card__top">
                <span className="client-work-card__sector">{item.sector}</span>
                <h3 className="client-work-card__title">{item.name}</h3>
                <p className="client-work-card__tagline">{item.tagline}</p>
              </div>
              <ul className="client-work-card__highlights">
                {item.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <div className="client-work-card__actions">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm inline-flex items-center gap-2"
                  aria-label={`Open ${item.name} live site (opens in a new tab)`}
                >
                  Visit live site
                  <FaExternalLinkAlt className="text-[0.7rem] opacity-90" aria-hidden />
                </a>
                <Link href="/contact" className="btn btn-sm btn-ghost">
                  Similar project
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p
          className={
            isHome
              ? 'mt-10 text-center text-sm home-text-muted'
              : 'mt-8 text-center text-sm text-slate-500'
          }
        >
          Prefer references under NDA?{' '}
          <Link href="/contact" className="font-medium text-cyan-300/90 underline-offset-2 hover:underline">
            Ask us on contact
          </Link>
          —we share relevant details privately when appropriate.
        </p>
      </div>
    </section>
  );
}
