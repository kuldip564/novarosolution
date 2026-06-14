"use client";

import { useId, useState } from "react";

type FaqAccordionItemProps = {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
};

export function FaqAccordionItem({
  question,
  answer,
  open,
  onToggle,
}: FaqAccordionItemProps) {
  const panelId = useId();
  const buttonId = useId();

  return (
    <article className={`faq-item ${open ? "open" : ""}`}>
      <button
        id={buttonId}
        type="button"
        className="faq-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span>{question}</span>
        <span className="faq-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
      <div id={panelId} role="region" aria-labelledby={buttonId} className={`faq-panel ${open ? "open" : ""}`}>
        <div className="faq-panel-inner">
          <p>{answer}</p>
        </div>
      </div>
    </article>
  );
}

type FaqAccordionProps = {
  items: Array<{ id: string; question: string; answer: string }>;
};

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="faq-list">
      {items.map((item) => (
        <FaqAccordionItem
          key={item.id}
          question={item.question}
          answer={item.answer}
          open={openId === item.id}
          onToggle={() => setOpenId((current) => (current === item.id ? null : item.id))}
        />
      ))}
    </div>
  );
}
