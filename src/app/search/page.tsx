import Link from "next/link";
import type { Metadata } from "next";
import { wines } from "@/data/wines";
import { articles } from "@/data/journal";
import { experiences } from "@/data/experiences";
import { Hero } from "@/components/sections";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();

  const wineResults = query
    ? wines.filter((w) =>
        [w.name, w.cuveeLabel, w.vintage, w.style, w.descriptor].join(" ").toLowerCase().includes(query)
      )
    : [];
  const articleResults = query
    ? articles.filter((a) =>
        [a.title, a.eyebrow, a.excerpt, ...a.body].join(" ").toLowerCase().includes(query)
      )
    : [];
  const experienceResults = query
    ? experiences.filter((e) => [e.title, e.line, e.description].join(" ").toLowerCase().includes(query))
    : [];
  const total = wineResults.length + articleResults.length + experienceResults.length;

  return (
    <>
      <Hero variant="collection" eyebrow="Search" title={query ? `Results for “${q}”.` : "Search the house."} sub={query ? `${total} result${total === 1 ? "" : "s"}.` : "A quiet search across wines, stories, and experiences."} />

      <section className="container-page" style={{ paddingBlock: "var(--space-96)" }}>
        <form role="search" action="/search" className="flex items-end gap-4 mb-16 max-w-2xl">
          <div className="flex-1">
            <label htmlFor="q">Search</label>
            <input id="q" name="q" defaultValue={q} placeholder="A wine, a word, a vintage" />
          </div>
          <button className="btn">Search</button>
        </form>

        {!query && <p className="body">Try a vintage (2018), a style (rosé), or the name of a story.</p>}

        {query && total === 0 && (
          <div className="py-16">
            <p className="serif display-l">Nothing today.</p>
            <p className="body-l mt-4 max-w-[52ch]">
              We couldn&rsquo;t find a match. <Link href="/wines" className="link-quiet">Browse the wines</Link> or <Link href="/journal" className="link-quiet">read the journal</Link>.
            </p>
          </div>
        )}

        {wineResults.length > 0 && (
          <Group title="Wines">
            {wineResults.map((w) => (
              <Link key={w.slug} href={`/wines/${w.slug}`} className="py-6 border-b rule-hair flex items-baseline justify-between gap-6 block focus-ring">
                <div>
                  <h3 className="serif h3">{w.name}{w.cuveeLabel ? ` — ${w.cuveeLabel}` : ""}</h3>
                  <p className="meta mt-1">{w.styleShort}</p>
                </div>
                <span className="meta">${w.price}</span>
              </Link>
            ))}
          </Group>
        )}

        {articleResults.length > 0 && (
          <Group title="Journal">
            {articleResults.map((a) => (
              <Link key={a.slug} href={`/journal/${a.slug}`} className="py-6 border-b rule-hair block focus-ring">
                <h3 className="serif h3">{a.title}</h3>
                <p className="meta mt-1">{a.eyebrow} · {a.date}</p>
              </Link>
            ))}
          </Group>
        )}

        {experienceResults.length > 0 && (
          <Group title="Experiences">
            {experienceResults.map((e) => (
              <Link key={e.slug} href={`/experiences/${e.slug}`} className="py-6 border-b rule-hair block focus-ring">
                <h3 className="serif h3">{e.title}</h3>
                <p className="meta mt-1">{e.line}</p>
              </Link>
            ))}
          </Group>
        )}
      </section>
    </>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <p className="eyebrow mb-6">{title}</p>
      <div>{children}</div>
    </section>
  );
}
