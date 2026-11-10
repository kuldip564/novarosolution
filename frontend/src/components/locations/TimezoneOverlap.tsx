import { Clock } from "lucide-react";
import {
  computeOverlap,
  formatHour,
  type LocationTimezone,
} from "@/lib/locations";

type Segment = { left: number; width: number };

/** Splits an hour range (local, may run past midnight) into 0–24 segments as % of the day. */
function toSegments(start: number, end: number): Segment[] {
  const length = end - start;
  if (length <= 0) return [];
  const s = ((start % 24) + 24) % 24;
  const pct = (h: number) => (h / 24) * 100;
  if (s + length <= 24) return [{ left: pct(s), width: pct(length) }];
  return [
    { left: pct(s), width: pct(24 - s) },
    { left: 0, width: pct(s + length - 24) },
  ];
}

export function formatHours(hours: number): string {
  if (hours === 0) return "No live overlap";
  const rounded = Math.round(hours * 2) / 2;
  return `≈${rounded % 1 === 0 ? rounded : rounded.toFixed(1)} h overlap`;
}

/** Two 24-hour bars (client day vs studio day) with the overlap highlighted. */
export function OverlapChart({ timezone }: { timezone: LocationTimezone }) {
  const standard = computeOverlap(timezone.offset);
  const clientDay = toSegments(9, 18);
  const studioDay = toSegments(standard.studioStartLocal, standard.studioEndLocal);
  const overlap = standard.hours > 0 ? toSegments(standard.startLocal, standard.endLocal) : [];
  const ticks = [0, 6, 12, 18, 24];

  return (
    <div className="loc-tz__chart" role="img" aria-label={`Overlap between ${timezone.city} working hours and studio hours: ${formatHours(standard.hours)}${standard.window ? `, ${standard.window} ${timezone.zone}` : ""}.`}>
      <div className="loc-tz__row">
        <span className="loc-tz__label">{timezone.city}</span>
        <div className="loc-tz__track">
          {clientDay.map((seg, i) => (
            <span key={i} className="loc-tz__band loc-tz__band--client" style={{ left: `${seg.left}%`, width: `${seg.width}%` }} />
          ))}
          {overlap.map((seg, i) => (
            <span key={`o${i}`} className="loc-tz__band loc-tz__band--overlap" style={{ left: `${seg.left}%`, width: `${seg.width}%` }} />
          ))}
        </div>
      </div>
      <div className="loc-tz__row">
        <span className="loc-tz__label">Our studio</span>
        <div className="loc-tz__track">
          {studioDay.map((seg, i) => (
            <span key={i} className="loc-tz__band loc-tz__band--studio" style={{ left: `${seg.left}%`, width: `${seg.width}%` }} />
          ))}
          {overlap.map((seg, i) => (
            <span key={`o${i}`} className="loc-tz__band loc-tz__band--overlap" style={{ left: `${seg.left}%`, width: `${seg.width}%` }} />
          ))}
        </div>
      </div>
      <div className="loc-tz__ticks" aria-hidden>
        <span className="loc-tz__label" />
        <div className="loc-tz__ticks-track">
          {ticks.map((tick) => (
            <span key={tick} style={{ left: `${(tick / 24) * 100}%` }}>
              {formatHour(tick === 24 ? 0 : tick)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

type TimezoneOverlapProps = {
  timezone: LocationTimezone;
};

export function TimezoneOverlap({ timezone }: TimezoneOverlapProps) {
  const standard = computeOverlap(timezone.offset);
  const summer = timezone.dstOffset !== undefined ? computeOverlap(timezone.dstOffset) : null;

  return (
    <article className="loc-card loc-tz" aria-labelledby="loc-tz-title">
      <header className="loc-card__head">
        <span className="loc-card__icon" aria-hidden>
          <Clock size={20} strokeWidth={1.8} />
        </span>
        <div>
          <h2 id="loc-tz-title" className="loc-card__title">
            Working hours with {timezone.city}
          </h2>
          <p className="loc-card__sub">
            Studio hours are 10:00–19:00 IST, Monday to Saturday. Shown in {timezone.zone} against a
            09:00–18:00 day in {timezone.city}.
          </p>
        </div>
      </header>

      <OverlapChart timezone={timezone} />

      <dl className="loc-tz__summary">
        <div>
          <dt>{timezone.zone}</dt>
          <dd>
            <strong>{formatHours(standard.hours)}</strong>
            <span>{standard.window ? `${standard.window} your time` : `Studio day is ${standard.studioLocal} your time`}</span>
          </dd>
        </div>
        {summer && timezone.dstZone ? (
          <div>
            <dt>{timezone.dstZone}</dt>
            <dd>
              <strong>{formatHours(summer.hours)}</strong>
              <span>{summer.window ? `${summer.window} your time` : `Studio day is ${summer.studioLocal} your time`}</span>
            </dd>
          </div>
        ) : null}
        <div>
          <dt>Async</dt>
          <dd>
            <strong>Daily updates</strong>
            <span>Written progress in your shared channel</span>
          </dd>
        </div>
      </dl>
    </article>
  );
}
