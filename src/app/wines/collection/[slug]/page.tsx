import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Hero } from "@/components/sections";
import { ProductGrid } from "@/components/product";
import { CollectionMotif } from "@/components/decoratives";
import { collections, winesByCollection } from "@/data/wines";
import type { Wine } from "@/lib/schemas";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = collections.find((x) => x.slug === slug);
  return { title: c ? c.name : "Collection" };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) notFound();
  const list = winesByCollection(slug);

  return (
    <>
      <Hero
        variant="collection"
        eyebrow={collection.tagline}
        title={collection.name}
        sub={collection.description}
      >
        <CollectionMotif
          collection={slug as Wine["collection"]}
          anchor="top-right"
          size={420}
          opacity={0.3}
          tone={slug === "club" ? "bottle" : "gold"}
        />
      </Hero>
      <section className="container-page" style={{ paddingBlock: "var(--space-96)" }}>
        <nav aria-label="Collections" className="flex flex-wrap gap-x-10 gap-y-4 border-b rule-hair pb-6 mb-16">
          <Link href="/wines" className="nav-link">All</Link>
          {collections.map((c) => (
            <Link key={c.slug} href={`/wines/collection/${c.slug}`} className="nav-link" aria-current={c.slug === slug ? "page" : undefined} style={{ opacity: c.slug === slug ? 1 : 0.55 }}>
              {c.name}
            </Link>
          ))}
        </nav>
        <ProductGrid wines={list} />
      </section>
    </>
  );
}
