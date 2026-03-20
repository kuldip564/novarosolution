import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Services | Novaro Solution',
  description: 'UI/UX design, web development, and mobile app development services by Novaro Solution.',
  keywords: ['ui ux services', 'web development services', 'mobile app development services'],
  path: '/services'
});

export default function ServicesPage() {
  return (
    <section className="card space-y-4">
      <h1 className="text-3xl font-extrabold md:text-5xl">Services</h1>
      <p className="text-slate-300">
        We design and build modern digital products with a focus on usability, speed, and business outcomes.
      </p>
      <ul className="space-y-2 text-slate-300">
        <li>UI/UX product design and design systems</li>
        <li>Next.js and MERN web development</li>
        <li>Mobile app development and API integration</li>
      </ul>
      <Link className="btn mt-2 inline-block" href="/#contact-form">
        Start your project
      </Link>
    </section>
  );
}

