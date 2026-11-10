import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { marketHref, overlapBadge, type MarketEntry } from "@/lib/locations";

/** Compact link card for a market (hub section or dedicated page). */
export function MarketCard({ market }: { market: MarketEntry }) {
  return (
    <Link href={marketHref(market)} className="loc-card loc-card--link">
      <span className="loc-card__eyebrow">{market.eyebrow}</span>
      <strong className="loc-card__name">{market.name}</strong>
      <span className="loc-card__summary">{market.summary}</span>
      <span className="loc-card__badge">{overlapBadge(market.timezone)}</span>
      <span className="loc-card__go" aria-hidden>
        <ArrowUpRight size={18} />
      </span>
    </Link>
  );
}
