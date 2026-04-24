import Link from "next/link";
import type { Metadata } from "next";
import { Hero } from "@/components/sections";
import { ProductGrid } from "@/components/product";
import { collections, wines } from "@/data/wines";
import { ReleaseList } from "@/components/forms";

export const metadata: Metadata = { title: "Wines" };

export default function WinesPage() {
  return (
    <>
      <Hero
        variant="collection"
        eyebrow="The Cellar"
        title="The cuvées of the house, in order of release."
        sub="Sparkling only. Traditional method. Made in small lots, released when they are ready, and sometimes withheld."
      />

      <section className="container-page" style={{ paddingBlock: "var(--space-96)" }}>
        <nav aria-label="Collections" className="flex flex-wrap gap-x-10 gap-y-4 border-b rule-hair pb-6 mb-16">
          <Link href="/wines" className="nav-link">All</Link>
          {collections.map((c) => (
            <Link key={c.slug} href={`/wines/collection/${c.slug}`} className="nav-link">
              {c.name}
            </Link>
          ))}
        </nav>

        <ProductGrid wines={wines} />
      </section>

      <section className="surface-paper">
        <div className="container-page" style={{ paddingBlock: "var(--space-144)" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="eyebrow mb-4">Sold out, and soon</p>
              <h2 className="serif h1 max-w-[18ch]">Some wines return. Some do not.</h2>
            </div>
            <div>
              <p className="body-l max-w-[52ch]">
                Join the release list to be written to when the next cuvée is disgorged. No discounts, no marketing — only word when a bottle becomes available.
              </p>
              <div className="mt-6 max-w-md"><ReleaseList /></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
