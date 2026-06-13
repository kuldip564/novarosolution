import { CloudinaryImage } from "@/components/admin/CloudinaryImage";
import { Reveal } from "@/components/anim/Reveal";
import type { DbTestimonial } from "@/lib/content";
import { parseCloudinaryAsset } from "@/lib/media";
import { fallbackTestimonials } from "@/lib/site-data";

export type TestimonialView = {
  id: string;
  quote: string;
  name: string;
  role: string;
  rating: number;
  avatar: ReturnType<typeof parseCloudinaryAsset>;
};

type TestimonialsSectionProps = {
  items?: TestimonialView[];
};

export function mapDbTestimonials(items: DbTestimonial[]): TestimonialView[] {
  if (!items.length) {
    return fallbackTestimonials.map((item) => ({
      ...item,
      avatar: null,
    }));
  }

  return items.map((item) => ({
    id: item.id,
    quote: item.quote,
    name: item.name,
    role: item.role,
    rating: item.rating,
    avatar: parseCloudinaryAsset(item.avatar),
  }));
}

export function TestimonialsSection({
  items = fallbackTestimonials.map((item) => ({ ...item, avatar: null })),
}: TestimonialsSectionProps) {
  return (
    <section className="sec testimonials-sec">
      <div className="wrap">
        <div className="sec-head center">
          <Reveal>
            <span className="eyebrow center">Client voices</span>
            <h2>Trusted by teams who ship.</h2>
            <p>Real feedback from product leaders we&apos;ve built with.</p>
          </Reveal>
        </div>

        <div className="testimonials-grid">
          {items.map((item, index) => (
            <Reveal key={item.id} delay={(index + 1) * 0.1}>
              <article className="testimonial-card">
                <div className="testimonial-stars" aria-hidden>
                  {"★".repeat(Math.min(5, Math.max(1, item.rating)))}
                </div>
                <blockquote>{item.quote}</blockquote>
                <footer>
                  {item.avatar?.secureUrl ? (
                    <CloudinaryImage
                      asset={item.avatar}
                      alt=""
                      width={44}
                      height={44}
                      transformWidth={88}
                      className="testimonial-avatar"
                    />
                  ) : (
                    <span className="testimonial-avatar-fallback">
                      {item.name.charAt(0)}
                    </span>
                  )}
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.role}</span>
                  </div>
                </footer>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
