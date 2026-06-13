import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { navLinks, site } from "@/lib/site-data";

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
          <BrandLogo iconSize={30} href="/" />
            <p>
              A digital product studio building web apps, AI systems, and growth
              engines for ambitious companies.
            </p>
            <div className="socials">
              <a href={site.social.linkedin} aria-label="LinkedIn">
                <svg viewBox="0 0 24 24">
                  <path d="M4.98 3.5A2.5 2.5 0 110 6 2.5 2.5 0 012.5 3.5zM0 8h5v16H0zM7.5 8H12v2.2h.07c.63-1.2 2.17-2.46 4.46-2.46C21.4 7.74 24 10 24 14.6V24h-5v-8.3c0-2-.04-4.55-2.77-4.55s-3.2 2.16-3.2 4.4V24h-5z" />
                </svg>
              </a>
              <a href={site.social.x} aria-label="X">
                <svg viewBox="0 0 24 24">
                  <path d="M18.9 2H22l-7.1 8.1L23 22h-6.6l-5.2-6.8L5.3 22H2.2l7.6-8.7L1.5 2h6.8l4.7 6.2zm-1.2 18h1.8L7.2 3.9H5.3z" />
                </svg>
              </a>
              <a href={site.social.github} aria-label="GitHub">
                <svg viewBox="0 0 24 24">
                  <path d="M12 .5A11.5 11.5 0 008.4 22.9c.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.4-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0C17.9 5.5 19 5.8 19 5.8c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6A11.5 11.5 0 0012 .5z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="foot-col">
            <h5>Services</h5>
            <Link href="/services">Web &amp; App</Link>
            <Link href="/services">AI &amp; ML</Link>
            <Link href="/services">Digital Marketing</Link>
            <Link href="/services">Cloud &amp; DevOps</Link>
          </div>

          <div className="foot-col">
            <h5>Company</h5>
            {navLinks.slice(1).map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="foot-col">
            <h5>Get in touch</h5>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
            <span>{site.location}</span>
          </div>
        </div>

        <div className="foot-bot">
          <p>© 2026 Novaro Solution. All rights reserved.</p>
          <p>Built with intent · Privacy · Terms</p>
        </div>
      </div>
    </footer>
  );
}
