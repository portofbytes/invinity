import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/sections";
import { ImagePlate } from "@/components/sections";
import { articles } from "@/data/journal";
import { EmptyState } from "@/components/empty-states";

export const metadata: Metadata = { title: "Journal" };

export default function JournalPage() {
  if (articles.length === 0) {
    return (
      <>
        <Hero variant="collection" eyebrow="Journal" title="Notes from the house." />
        <section className="container-page" style={{ paddingBlock: "var(--space-96)" }}>
          <EmptyState
            title="Nothing written yet."
            body="The house is letting the season pass through before writing about it. Check back with the next disgorgement."
            action={{ label: "Browse the wines", href: "/wines" }}
          />
        </section>
      </>
    );
  }
  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = articles.filter((a) => a.slug !== featured.slug);

  return (
    <>
      <Hero
        variant="collection"
        eyebrow="Journal"
        title="Notes from the house."
        sub="Short entries on the vintage, the method, and the rhythms of a sparkling-only house on the Pacific."
      />

      <section className="container-page" style={{ paddingBlock: "var(--space-96)" }}>
        <Link href={`/journal/${featured.slug}`} className="reveal grid grid-cols-1 md:grid-cols-12 gap-10 items-end group focus-ring">
          <div className="md:col-span-7">
            <ImagePlate tone="stone" ratio="16 / 10" />
          </div>
          <div className="md:col-span-5">
            <p className="eyebrow mb-4">{featured.eyebrow} · {featured.date}</p>
            <h2 className="serif display-l">{featured.title}</h2>
            <p className="body-l mt-5">{featured.excerpt}</p>
            <p className="meta mt-6 link-quiet inline-block">Read the entry →</p>
          </div>
        </Link>
      </section>

      <section className="container-page" style={{ paddingBlock: "var(--space-96)" }}>
        <hr className="divider-hair mb-16" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
          {rest.map((a) => (
            <Link key={a.slug} href={`/journal/${a.slug}`} className="reveal focus-ring block">
              <p className="eyebrow mb-3">{a.eyebrow} · {a.date}</p>
              <h3 className="serif h2">{a.title}</h3>
              <p className="body-l mt-4 max-w-[52ch]">{a.excerpt}</p>
              <p className="meta mt-5 link-quiet inline-block">Read →</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
