import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Reveal } from "@/components/anim/Reveal";
import { MarketPanel } from "@/components/locations/MarketPanel";
import { CtaBand } from "@/components/sections/CtaBand";
import { LocalPresence } from "@/components/sections/LocalPresence";
import { PageHead } from "@/components/sections/PageHead";
import { locationPath, locations, marketHref, markets } from "@/lib/locations";
import { createPageMetadata, siteBaseUrl } from "@/lib/site-metadata";
import { breadcrumbJsonLd, LOCAL_BUSINESS_ID, webPageJsonLd } from "@/lib/structured-data";
import "@/styles/locations.css";

const path = "/locations";
const title = "Where We Work — Gandhinagar, India & Worldwide";
const description =
  "Novaro Solution builds software from Gandhinagar for Gujarat, India, the USA, UK, Europe, UAE, Canada and Australia — with honest overlap hours for each time zone.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path,
  ogHeadline: "One studio in Gandhinagar, clients worldwide",
  ogEyebrow: "Where we work",
  keywords: [
    "software development company Gandhinagar",
    "software company Ahmedabad",
    "software development company India",
    "offshore software development UK",
    "software development company UAE",
    "remote software development team India",
  ],
});

export default function LocationsPage() {
  const local = locations[0];
  const india = markets.filter((market) => market.slug === "india");
  const international = markets.filter((market) => market.slug !== "india");

  const jsonLd = [
    webPageJsonLd({ path, name: title, description, type: "CollectionPage", about: LOCAL_BUSINESS_ID }),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Markets served by Novaro Solution",
      itemListElement: [
        { name: local.name, path: locationPath(local.slug) },
        ...markets.map((market) => ({ name: market.name, path: marketHref(market) })),
      ].map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: `${siteBaseUrl()}${item.path}`,
      })),
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Where we work", path },
    ]),
  ];

  return (
    <main className="loc-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHead
        eyebrow="Where we work"
        title="One studio in Gandhinagar, clients worldwide"
        description="We build software from Sargasan, Gandhinagar. Gujarat teams can visit the studio; teams across India and abroad work with us remotely. Here is how the working day lines up for each market."
        className="loc-head"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Where we work" }]}
      />

      <section className="sec loc-sec" aria-labelledby="loc-gujarat-title">
        <div className="wrap">
          <header className="loc-section-head loc-section-head--left">
            <span className="eyebrow">Gujarat</span>
            <h2 id="loc-gujarat-title">Gandhinagar &amp; Ahmedabad</h2>
          </header>

          <Reveal>
            <Link href={locationPath(local.slug)} className="loc-card loc-card--link loc-feature">
              <span className="loc-feature__icon" aria-hidden>
                <MapPin size={22} strokeWidth={1.8} />
              </span>
              <span className="loc-card__eyebrow">{local.eyebrow}</span>
              <strong className="loc-card__name">{local.h1}</strong>
              <span className="loc-card__summary">{local.lede}</span>
              <span className="loc-feature__facts">
                {local.facts.map((fact) => (
                  <span key={fact.label}>
                    <strong>{fact.value}</strong> {fact.label}
                  </span>
                ))}
              </span>
              <span className="loc-card__go" aria-hidden>
                <ArrowUpRight size={18} />
              </span>
            </Link>
          </Reveal>

          <div className="loc-markets loc-markets--single">
            {india.map((market) => (
              <Reveal key={market.slug}>
                <MarketPanel market={market} />
              </Reveal>
            ))}
          </div>

          <header className="loc-section-head loc-section-head--left loc-section-head--spaced">
            <span className="eyebrow">International</span>
            <h2 id="loc-intl-title">USA, UK, Europe, UAE, Canada &amp; Australia</h2>
            <p>
              No offices abroad — one remote team in Gandhinagar. Each chart compares our studio hours
              (10:00–19:00 IST) with a 09:00–18:00 working day in your city.
            </p>
          </header>
          <div className="loc-markets">
            {international.map((market, index) => (
              <Reveal key={market.slug} delay={0.04 * (index % 2)}>
                <MarketPanel market={market} />
              </Reveal>
            ))}
          </div>
          <p className="loc-related__all">
            Somewhere else? <Link href="/it-services">We work with companies in any country</Link>
          </p>
        </div>
      </section>

      <LocalPresence variant="contact" />

      <CtaBand
        eyebrow="Any time zone"
        title="Tell us where you are and what you need built"
        description="We reply within one business day with a call time that suits your working hours."
        buttonLabel="Book a discovery call"
        buttonHref="/contact"
      />
    </main>
  );
}
