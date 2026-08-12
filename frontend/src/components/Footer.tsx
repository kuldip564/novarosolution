import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { googleMapsUrl } from "@/lib/geo-seo";
import { navLinks, site } from "@/lib/site-data";

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookie-policy", label: "Cookies" },
  { href: "/disclaimer", label: "Disclaimer" },
] as const;

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-geo-bar" aria-label="Service areas">
          <div className="foot-geo-bar__main">
            <span className="foot-geo-bar__label">Serving</span>
            <div className="foot-geo-bar__pills">
              {site.serviceAreas.map((area) => (
                <span key={area} className="foot-geo-bar__pill">
                  {area}
                </span>
              ))}
            </div>
          </div>
          <div className="foot-geo-bar__actions">
            <a
              href={googleMapsUrl()}
              className="foot-geo-bar__directions"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 21s-7-5.5-7-11a7 7 0 0114 0c0 5.5-7 11-7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Directions
            </a>
          </div>
        </div>

        <div className="foot-grid">
          <div className="foot-brand">
            <BrandLogo iconSize={30} href="/" />
            <p>
              {site.description} Based in Gandhinagar, we serve clients across India
              and internationally — from D2C brands to logistics platforms and healthcare
              services.
            </p>
            <address className="foot-address" itemScope itemType="https://schema.org/PostalAddress">
              <span itemProp="streetAddress">{site.geo.streetAddress}</span>,{" "}
              <span itemProp="addressLocality">{site.geo.addressLocality}</span>,{" "}
              <span itemProp="addressRegion">{site.geo.addressRegion}</span>{" "}
              <span itemProp="postalCode">{site.geo.postalCode}</span>,{" "}
              <span itemProp="addressCountry">India</span>
            </address>
            <div className="socials">
              <a
                href={site.social.linkedin}
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4.98 3.5A2.5 2.5 0 110 6 2.5 2.5 0 012.5 3.5zM0 8h5v16H0zM7.5 8H12v2.2h.07c.63-1.2 2.17-2.46 4.46-2.46C21.4 7.74 24 10 24 14.6V24h-5v-8.3c0-2-.04-4.55-2.77-4.55s-3.2 2.16-3.2 4.4V24h-5z" />
                </svg>
              </a>
              {site.social.x !== "#" && (
                <a href={site.social.x} aria-label="X" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.9 2H22l-7.1 8.1L23 22h-6.6l-5.2-6.8L5.3 22H2.2l7.6-8.7L1.5 2h6.8l4.7 6.2zm-1.2 18h1.8L7.2 3.9H5.3z" />
                  </svg>
                </a>
              )}
              {site.social.github !== "#" && (
                <a href={site.social.github} aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 .5A11.5 11.5 0 008.4 22.9c.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.4-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0C17.9 5.5 19 5.8 19 5.8c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6A11.5 11.5 0 0012 .5z" />
                  </svg>
                </a>
              )}
              <a
                href={site.social.instagram}
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5a5 5 0 100 10 5 5 0 000-10zm6.5-.9a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0zM12 9a3 3 0 110 6 3 3 0 010-6z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="foot-col">
            <h5>Services</h5>
            <Link href="/services">Web &amp; App Development</Link>
            <Link href="/services">AI &amp; Machine Learning</Link>
            <Link href="/services">Digital Marketing &amp; SEO</Link>
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
            <span>{site.businessHours}</span>
            <span>{site.responseTime}</span>
          </div>
        </div>

        <div className="foot-bot">
          <p>© 2026 Novaro Solution · Gandhinagar, Gujarat, India. All rights reserved.</p>
          <nav className="foot-legal" aria-label="Legal">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
