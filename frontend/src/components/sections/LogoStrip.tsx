import { CloudinaryImage } from "@/components/admin/CloudinaryImage";
import { Reveal } from "@/components/anim/Reveal";
import type { DbClientLogo } from "@/lib/content";
import { parseCloudinaryAsset } from "@/lib/media";

export type LogoView = {
  id: string;
  name: string;
  image: ReturnType<typeof parseCloudinaryAsset>;
};

type LogoStripProps = {
  items?: LogoView[];
};

export function mapDbLogos(items: DbClientLogo[]): LogoView[] {
  return items
    .map((item) => ({
      id: item.id,
      name: item.name,
      image: parseCloudinaryAsset(item.image),
    }))
    .filter((item) => item.image?.secureUrl);
}

export function LogoStrip({ items = [] }: LogoStripProps) {
  if (!items.length) return null;

  return (
    <section className="logo-strip-sec" aria-label="Client logos">
      <div className="wrap">
        <Reveal>
          <p className="logo-strip-label">Trusted by teams building what&apos;s next</p>
        </Reveal>
        <div className="logo-strip">
          {items.map((item, index) => (
            <Reveal key={item.id} delay={(index + 1) * 0.06}>
              <div className="logo-strip-item">
                {item.image && (
                  <CloudinaryImage
                    asset={item.image}
                    alt={item.name}
                    width={120}
                    height={48}
                    transformWidth={240}
                    className="logo-strip-img"
                  />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
