type FAQItem = {
  question: string;
  answer: string;
};

type FAQSectionProps = {
  title?: string;
  intro?: string;
  items: FAQItem[];
};

export default function FAQSection({ title = 'Frequently Asked Questions', intro = '', items }: FAQSectionProps) {
  if (!items.length) return null;

  return (
    <section className="page-content-card space-y-4" aria-labelledby="faq-title">
      <div className="space-y-2">
        <p className="premium-eyebrow">FAQ</p>
        <h2 id="faq-title" className="text-2xl font-semibold tracking-tight text-slate-100">
          {title}
        </h2>
      </div>
      {intro ? <p className="text-sm leading-relaxed text-slate-300">{intro}</p> : null}
      <div className="space-y-2.5">
        {items.map((item) => (
          <details key={item.question} className="premium-faq-item group p-3.5 md:p-4">
            <summary className="cursor-pointer list-none font-semibold text-slate-100 [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-3">
                <span>{item.question}</span>
                <span
                  className="mt-0.5 shrink-0 text-cyan-400/80 transition-transform group-open:rotate-180"
                  aria-hidden
                >
                  ▾
                </span>
              </span>
            </summary>
            <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-relaxed text-slate-300">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
