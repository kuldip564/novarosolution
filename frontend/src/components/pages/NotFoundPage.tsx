import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/Button";

const destinations = [
  { href: "/services", title: "Services", body: "Web and mobile apps, AI, marketing and cloud" },
  { href: "/work", title: "Work", body: "Case studies of live client products" },
  { href: "/blog", title: "Blog", body: "Guides on planning, pricing and building" },
];

/** 404 in the studio design: a clear message, the two main actions and three useful destinations. */
export function NotFoundPage() {
  return (
    <main className="st nf">
      <section className="st-hero nf-hero" aria-labelledby="nf-title">
        <div className="wrap st-hero__inner">
          <p className="nf-code" aria-hidden="true">
            404
          </p>
          <p className="st-eyebrow st-hero__eyebrow">Page not found</p>
          <h1 id="nf-title" className="st-hero__title nf-title">
            <span className="st-mask">
              <span style={{ ["--line" as string]: 0 }}>This page took</span>{" "}
            </span>
            <span className="st-mask st-mask--accent">
              <span style={{ ["--line" as string]: 1 }}>a different route.</span>
            </span>
          </h1>
          <p className="st-hero__lede">It may have moved, or it never existed. One of these is a good place to start.</p>
          <div className="st-hero__actions">
            <Button href="/">Back to home</Button>
            <Button href="/contact" variant="ghost">
              Contact us
            </Button>
          </div>
          <ul className="nf-links">
            {destinations.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="nf-link">
                  <strong>{item.title}</strong>
                  <span>{item.body}</span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
