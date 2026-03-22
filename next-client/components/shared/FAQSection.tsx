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
    <section className="page-content-card space-y-3" aria-labelledby="faq-title">
      <h2 id="faq-title" className="text-2xl font-semibold">
        {title}
      </h2>
      {intro ? <p className="text-slate-300">{intro}</p> : null}
      <div className="space-y-2">
        {items.map((item) => (
          <details key={item.question} className="rounded-xl border border-white/15 bg-white/5 p-3">
            <summary className="cursor-pointer font-semibold">{item.question}</summary>
            <p className="mt-2 text-slate-300">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
