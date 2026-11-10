import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { OverlapChart } from "@/components/locations/TimezoneOverlap";
import { computeOverlap, overlapBadge, type MarketEntry } from "@/lib/locations";

/** One market on the /locations hub: overlap chart, data-protection note, and areas. */
export function MarketPanel({ market }: { market: MarketEntry }) {
  const standard = market.timezone ? computeOverlap(market.timezone.offset) : null;
  const summer =
    market.timezone?.dstOffset !== undefined ? computeOverlap(market.timezone.dstOffset) : null;

  return (
    <article id={market.slug} className="loc-card loc-market" aria-labelledby={`${market.slug}-title`}>
      <header className="loc-market__head">
        <div>
          <span className="loc-card__eyebrow">{market.eyebrow}</span>
          <h3 id={`${market.slug}-title`} className="loc-market__name">
            {market.name}
          </h3>
        </div>
        <span className="loc-card__badge">{overlapBadge(market.timezone)}</span>
      </header>
      <p className="loc-card__body">{market.summary}</p>

      {market.timezone && standard ? (
        <div className="loc-market__tz">
          <OverlapChart timezone={market.timezone} />
          <p className="loc-market__hours">
            {standard.window
              ? `${market.timezone.zone}: ${standard.window} your time`
              : `${market.timezone.zone}: studio day runs ${standard.studioLocal} your time`}
            {summer && market.timezone.dstZone
              ? ` · ${market.timezone.dstZone}: ${summer.window ? `${summer.window}` : `studio day ${summer.studioLocal}`}`
              : ""}
          </p>
        </div>
      ) : null}

      <div className="loc-market__data">
        <ShieldCheck size={18} strokeWidth={1.8} aria-hidden />
        <p>
          <strong>{market.data.title}.</strong> {market.data.body}
        </p>
      </div>

      <ul className="loc-pills" aria-label={`Areas we work with in ${market.name}`}>
        {market.areas.map((area) => (
          <li key={area}>{area}</li>
        ))}
      </ul>

      {market.href ? (
        <Link href={market.href} className="loc-card__more">
          How we work with {market.name} teams <ArrowUpRight size={15} aria-hidden />
        </Link>
      ) : (
        <Link href="/contact" className="loc-card__more">
          Book a call in your time zone <ArrowUpRight size={15} aria-hidden />
        </Link>
      )}
    </article>
  );
}
