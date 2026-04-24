import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ImagePlate } from "@/components/sections";
import { articleBySlug, articles } from "@/data/journal";
import { JsonLd, articleLd, breadcrumbLd } from "@/lib/ld";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = articleBySlug(slug);
  return { title: a ? a.title : "Journal" };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articleBySlug(slug);
  if (!a) notFound();

  const related = articles.filter((x) => x.slug !== a.slug).slice(0, 2);

  return (
    <>
      <JsonLd
        data={[
          articleLd(a),
          breadcrumbLd([
            { label: "House", href: "/" },
            { label: "Journal", href: "/journal" },
            { label: a.title, href: `/journal/${a.slug}` },
          ]),
        ]}
      />
      <section className="container-page" style={{ paddingBlock: "var(--space-96)" }}>
        <nav className="meta mb-12"><Link href="/journal" className="link-quiet">← Journal</Link></nav>
        <header className="reveal max-w-[760px]">
          <p className="eyebrow mb-4">{a.eyebrow} · {a.date}{a.author ? ` · ${a.author}` : ""}</p>
          <h1 className="serif display-l">{a.title}</h1>
          <p className="body-l mt-6 max-w-[60ch]">{a.excerpt}</p>
        </header>
        <div className="mt-16 reveal">
          <ImagePlate tone="stone" ratio="16 / 9" />
        </div>
      </section>

      <article className="container-page" style={{ paddingBlock: "var(--space-64)" }}>
        <div className="reading-column mx-auto">
          {a.body.map((p, i) => (
            <p key={i} className="body-l mb-6">{p}</p>
          ))}
          {a.pullQuote && (
            <blockquote className="my-16 border-l-2 rule-hair pl-8">
              <p className="serif" style={{ fontSize: "clamp(28px, 3vw, 40px)", lineHeight: 1.18 }}>
                &ldquo;{a.pullQuote}&rdquo;
              </p>
            </blockquote>
          )}
        </div>
      </article>

      <section className="surface-paper">
        <div className="container-page" style={{ paddingBlock: "var(--space-144)" }}>
          <p className="eyebrow mb-10">Also in the journal</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
            {related.map((r) => (
              <Link key={r.slug} href={`/journal/${r.slug}`} className="reveal focus-ring block">
                <p className="meta mb-3">{r.eyebrow} · {r.date}</p>
                <h3 className="serif h2">{r.title}</h3>
                <p className="body mt-3">{r.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
