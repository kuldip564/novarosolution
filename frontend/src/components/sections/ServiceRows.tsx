import { ClipReveal } from "@/components/anim/ClipReveal";
import { Parallax } from "@/components/anim/Parallax";
import { Reveal } from "@/components/anim/Reveal";
import { Button } from "@/components/Button";
import { MediaPlaceholder } from "@/components/sections/MediaPlaceholder";
import { ServiceMediaImage } from "@/components/sections/ServiceMediaImage";
import type { ServiceRowView } from "@/lib/content-mappers";
import { serviceDetails as fallbackServices } from "@/lib/site-data";

type ServiceRowsProps = {
  services?: ServiceRowView[];
};

export function ServiceRows({ services = [...fallbackServices] }: ServiceRowsProps) {
  return (
    <section className="sec service-rows">
      <div className="wrap">
        {services.map((service, index) => (
          <div key={service.no} className="srow">
            <Reveal>
              <span className="no">{service.no}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ul>
                {service.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <div className="srow-cta">
                <Button href="/contact" variant="ghost">
                  Discuss a project
                </Button>
              </div>
            </Reveal>

            <Parallax speed={0.06} className="srow-media">
              <ClipReveal className="srow-media-clip">
                {service.imageAsset || service.media ? (
                  <ServiceMediaImage
                    asset={service.imageAsset}
                    src={service.media?.src}
                    alt={service.imageAlt ?? service.media?.alt ?? service.title}
                    width={service.media?.width ?? 2048}
                    height={service.media?.height ?? 1529}
                    priority={index < 2}
                  />
                ) : (
                  <MediaPlaceholder
                    title={service.mediaTitle}
                    hint={service.mediaHint}
                  />
                )}
              </ClipReveal>
            </Parallax>
          </div>
        ))}
      </div>
    </section>
  );
}
