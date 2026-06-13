import type { DbFaq } from "@/lib/content";
import { fallbackFaqs } from "@/lib/site-data";
import { Reveal } from "@/components/anim/Reveal";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

type FaqSectionProps = {
  items?: FaqItem[];
  eyebrow?: string;
  title?: string;
  description?: string;
};

export function mapDbFaqs(faqs: DbFaq[]): FaqItem[] {
  if (!faqs.length) {
    return fallbackFaqs.map((item) => ({ ...item }));
  }
  return faqs.map((item) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
  }));
}

export function FaqSection({
  items = fallbackFaqs.map((item) => ({ ...item })),
  eyebrow = "FAQ",
  title = "Questions, answered.",
  description = "Everything you need to know before we start building together.",
}: FaqSectionProps) {
  return (
    <section className="sec faq-sec">
      <div className="wrap">
        <div className="sec-head center">
          <Reveal>
            <span className="eyebrow center">{eyebrow}</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </Reveal>
        </div>

        <div className="faq-list">
          {items.map((item, index) => (
            <Reveal key={item.id} delay={(index + 1) * 0.08}>
              <details className="faq-item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
