import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero">
      <div>
        <h1>SEO-first MERN + Next.js architecture</h1>
        <p>
          Fast, crawlable pages with App Router, SSR/SSG, dynamic metadata, and a
          scalable backend API.
        </p>
        <Link href="/products/apple" className="btn">
          Explore Product Example
        </Link>
      </div>
      <div>
        <Image
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200"
          alt="Novaro Solution logo"
          width={420}
          height={260}
          priority
        />
      </div>
    </section>
  );
}
