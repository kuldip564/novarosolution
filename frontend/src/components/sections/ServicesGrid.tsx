import { Reveal } from "@/components/anim/Reveal";
import { Button } from "@/components/Button";
import { CloudinaryImage } from "@/components/admin/CloudinaryImage";
import { capabilities, services as fallbackServices } from "@/lib/site-data";
import type { ServiceGridView } from "@/lib/content-mappers";

type ServicesGridProps = {
  services?: ServiceGridView[];
};

function ServiceIcon({ type }: { type: string }) {
  if (type === "monitor") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M3 5h18v12H3z" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    );
  }
  if (type === "ai") {
    return (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" />
      </svg>
    );
  }
  if (type === "cloud") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M7 18h11a4 4 0 000-8 5 5 0 00-9.9-1.1A3.5 3.5 0 007 18z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24">
      <path d="M3 17l5-5 4 4 8-9" />
      <path d="M21 7v5h-5" />
    </svg>
  );
}

export function ServicesGrid({
  services = fallbackServices.map((service) => ({
    id: service.id,
    title: service.title,
    description: service.description,
    tags: service.tags,
    icon: service.icon,
    imageAsset: null,
  })),
}: ServicesGridProps) {
  return (
    <section className="sec" id="services">
      <div className="wrap">
        <div className="sec-head">
          <Reveal>
            <span className="eyebrow">What we do</span>
            <h2>
              Three core practices,
              <br />
              one accountable team.
            </h2>
            <p>
              From first line of code to the campaign that brings users in, we
              own the whole stack so nothing falls through the gaps.
            </p>
          </Reveal>
        </div>

        <div className="svc-grid">
          {services.map((service, index) => (
            <Reveal key={service.id} delay={(index + 1) * 0.1}>
              <article className="svc">
                {service.imageAsset ? (
                  <div className="svc-cover">
                    <CloudinaryImage
                      asset={service.imageAsset}
                      alt={service.title}
                      width={640}
                      height={360}
                      transformWidth={640}
                      className="svc-cover-img"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ) : null}
                <div className="top">
                  <div className="ic">
                    <ServiceIcon type={service.icon} />
                  </div>
                  <span className="no">{service.id}</span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="tags">
                  {service.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="caps">
          {capabilities.map((cap, index) => (
            <Reveal key={cap} delay={(index + 1) * 0.1}>
              <div className="cap">
                <b />
                {cap}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="center-foot">
          <Button href="/services" variant="ghost">
            Explore services
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
