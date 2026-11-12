import { Button } from "@/components/Button";
import { site } from "@/lib/site-data";

/** Navy closing call to action shared by /services and /about (same design as the homepage's). */
export function StudioClosing({
  id,
  eyebrow,
  title,
  lede,
  buttonLabel,
  location,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lede: string;
  buttonLabel: string;
  /** GA4 `link_location` for clicks in this section. */
  location: string;
}) {
  return (
    <section className="st-closing" aria-labelledby={id} data-cta-location={location}>
      <span className="st-closing__glow st-closing__glow--a" aria-hidden="true" />
      <span className="st-closing__glow st-closing__glow--b" aria-hidden="true" />
      <div className="wrap" data-st-reveal>
        <p className="st-eyebrow st-eyebrow--light">{eyebrow}</p>
        <h2 id={id} className="st-closing__title">
          {title}
        </h2>
        <span className="st-closing__rule" aria-hidden="true" />
        <p className="st-closing__lede">{lede}</p>
        <div className="st-closing__actions">
          <Button href="/contact">{buttonLabel}</Button>
          <p className="st-closing__talk">
            <span>Contact Novaro:</span> <a href={`mailto:${site.email}`}>{site.email}</a>{" "}
            <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
          </p>
        </div>
        <p className="st-closing__studio">
          Studio in Sargasan, {site.geo.addressLocality} · Mon–Sat, 10:00–19:00 IST · We reply within one business day
        </p>
      </div>
    </section>
  );
}
