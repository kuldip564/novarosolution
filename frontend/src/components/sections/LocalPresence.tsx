import { Reveal } from "@/components/anim/Reveal";
import { Button } from "@/components/Button";
import { LazyMap } from "@/components/sections/LazyMap";
import Link from "next/link";
import { googleMapsUrl, mapEmbedUrl } from "@/lib/geo-seo";
import { serviceAreaLinks } from "@/lib/locations";
import { site } from "@/lib/site-data";

type LocalPresenceProps = {
  /** Kept for existing callers; the homepage variant was retired with the old homepage. */
  variant?: "contact";
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- callers still pass variant="contact"
export function LocalPresence(_props: LocalPresenceProps) {
  return (
    <section
      className="sec local-presence-sec"
      aria-labelledby="local-presence-title"
      itemScope
      itemType="https://schema.org/LocalBusiness"
    >
      <meta itemProp="name" content={site.name} />
      <meta itemProp="telephone" content={site.phone} />
      <meta itemProp="email" content={site.email} />

      <div className="wrap">
        <header className="local-presence-head">
          <span className="eyebrow">Find us</span>
          <h2 id="local-presence-title">Visit our Gandhinagar studio</h2>
          <p>
            Book a discovery call, or visit the Gandhinagar studio. We build for companies in
            the USA, UK, Europe, the Middle East, and India.
          </p>
        </header>

        <div className="local-grid">
          <Reveal className="local-map-wrap">
            <div className="local-map-card">
              <LazyMap
                title={`${site.name} location — Gandhinagar, Gujarat`}
                className="local-map-iframe"
                src={mapEmbedUrl()}
              />
              <div className="local-map-card__overlay">
                <span className="local-map-card__pin" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 21s-7-5.5-7-11a7 7 0 0114 0c0 5.5-7 11-7 11z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </span>
                <div>
                  <strong>{site.geo.addressLocality}</strong>
                  <span>{site.geo.addressRegion}, India</span>
                </div>
                <a
                  href={googleMapsUrl()}
                  className="local-map-card__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get directions
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="local-details">
            <address
              className="local-address"
              itemProp="address"
              itemScope
              itemType="https://schema.org/PostalAddress"
            >
              <span className="local-address__label">Studio address</span>
              <span itemProp="streetAddress">{site.geo.streetAddress}</span>
              <span>
                <span itemProp="addressLocality">{site.geo.addressLocality}</span>,{" "}
                <span itemProp="addressRegion">{site.geo.addressRegion}</span>{" "}
                <span itemProp="postalCode">{site.geo.postalCode}</span>
              </span>
              <span itemProp="addressCountry">India</span>
            </address>

            <div className="local-meta-grid">
              <div className="local-meta">
                <span className="local-meta__label">Phone</span>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} itemProp="telephone">
                  {site.phone}
                </a>
              </div>
              <div className="local-meta">
                <span className="local-meta__label">Email</span>
                <a href={`mailto:${site.email}`} itemProp="email">
                  {site.email}
                </a>
              </div>
              <div className="local-meta">
                <span className="local-meta__label">Hours</span>
                <span itemProp="openingHours">{site.businessHours}</span>
              </div>
              <div className="local-meta">
                <span className="local-meta__label">Response</span>
                <span>{site.responseTime}</span>
              </div>
            </div>

            <div className="local-areas">
              <span className="local-areas__label">Service areas</span>
              <ul className="local-areas__pills">
                {site.serviceAreas.map((area) => (
                  <li key={area}>
                    {serviceAreaLinks[area] ? (
                      <Link href={serviceAreaLinks[area]} className="local-areas__pill">
                        {area}
                      </Link>
                    ) : (
                      <span className="local-areas__pill">{area}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {site.nearbyCities.length > 0 && (
              <div className="local-nearby">
                <span className="local-nearby__label">Nearby from our studio</span>
                <ul className="local-nearby__list">
                  {site.nearbyCities.map((city) => (
                    <li key={city.name}>
                      {serviceAreaLinks[city.name] ? (
                        <Link href={serviceAreaLinks[city.name]}>
                          <strong>{city.name}</strong>
                        </Link>
                      ) : (
                        <strong>{city.name}</strong>
                      )}
                      <span>{city.distance}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button href={googleMapsUrl()} variant="ghost" className="local-cta-btn">
              Open in Google Maps
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
