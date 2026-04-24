"use client";

import * as Accordion from "@radix-ui/react-accordion";

export function FAQList({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <Accordion.Root type="single" collapsible className="border-y rule-hair">
      {items.map((f, i) => (
        <Accordion.Item key={f.question} value={`q-${i}`} className="acc-item">
          <Accordion.Header>
            <Accordion.Trigger className="acc-trigger focus-ring">
              <span className="serif h3">{f.question}</span>
              <span aria-hidden className="acc-icon">+</span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="acc-content">
            <p className="body-l acc-body">{f.answer}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
