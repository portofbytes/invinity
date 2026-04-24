import type { Metadata } from "next";
import { Hero } from "@/components/sections";
import { FAQList } from "@/components/faq";
import { faq } from "@/data/faq";

export const metadata: Metadata = { title: "Frequently asked" };

export default function FAQPage() {
  return (
    <>
      <Hero variant="collection" eyebrow="Frequently asked" title="The small matters." sub="The questions that come up most often — answered plainly." />
      <section className="container-page" style={{ paddingBlock: "var(--space-96)" }}>
        <FAQList items={faq} />
      </section>
    </>
  );
}
