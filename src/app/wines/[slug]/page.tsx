import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ProductPurchase, ProductTile } from "@/components/product";
import { ProductGallery } from "@/components/gallery";
import { JsonLd, productLd, breadcrumbLd } from "@/lib/ld";
import { wines, wineBySlug } from "@/data/wines";

export function generateStaticParams() {
  return wines.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const w = wineBySlug(slug);
  return {
    title: w ? `${w.name}${w.cuveeLabel ? ` — ${w.cuveeLabel}` : ""} ${w.vintage}` : "Wine",
    description: w?.descriptor,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const wine = wineBySlug(slug);
  if (!wine) notFound();

  const related = wines.filter((w) => w.slug !== wine.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          productLd(wine),
          breadcrumbLd([
            { label: "House", href: "/" },
            { label: "Wines", href: "/wines" },
            { label: wine.name, href: `/wines/${wine.slug}` },
          ]),
        ]}
      />

      <section className="surface-chalk">
        <div className="container-page grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20" style={{ paddingBlock: "var(--space-96)" }}>
          <div className="lg:col-span-7 reveal">
            <nav className="meta mb-10">
              <Link href="/wines" className="link-quiet">Wines</Link>
              <span aria-hidden> / </span>
              <span>{wine.name}</span>
            </nav>
            <ProductGallery wine={wine} />
          </div>
          <div className="lg:col-span-5 reveal">
            <div className="lg:sticky" style={{ top: "calc(var(--space-96) + 32px)" }}>
              <ProductPurchase wine={wine} />
            </div>
          </div>
        </div>
      </section>

      <section className="surface-paper">
        <div className="container-page grid grid-cols-1 md:grid-cols-12 gap-12" style={{ paddingBlock: "var(--space-144)" }}>
          <div className="md:col-span-5 reveal">
            <p className="eyebrow mb-4">Tasting</p>
            <h2 className="serif h1">The wine in the glass.</h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 reveal">
            <p className="body-l">{wine.tastingNote}</p>
            <p className="body mt-6">
              <strong className="serif" style={{ fontSize: 18 }}>Serve.</strong> {wine.serving}
            </p>
            <p className="body mt-4">
              <strong className="serif" style={{ fontSize: 18 }}>Pair.</strong> {wine.pairings.join(" · ")}
            </p>
          </div>
        </div>
      </section>

      <section className="container-page" style={{ paddingBlock: "var(--space-144)" }}>
        <div className="reveal grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <p className="eyebrow mb-4">Technical</p>
            <h2 className="serif h2 max-w-[16ch]">The method, openly.</h2>
          </div>
          <dl className="md:col-span-7 md:col-start-6 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
            <Row label="Varietal">{wine.varietals}</Row>
            <Row label="Method">{wine.method}</Row>
            {wine.dosage && <Row label="Dosage">{wine.dosage}</Row>}
            <Row label="Volume">{wine.volume}</Row>
            {wine.disgorged && <Row label="Disgorged">{wine.disgorged}</Row>}
            <Row label="Style">{wine.style}</Row>
          </dl>
        </div>
      </section>

      <section className="surface-chalk">
        <div className="container-page" style={{ paddingBlock: "var(--space-144)" }}>
          <div className="flex items-end justify-between mb-12 reveal">
            <h2 className="serif h1">Other bottles from the house.</h2>
            <Link href="/wines" className="link-quiet">See all wines →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-16">
            {related.map((w) => (
              <ProductTile key={w.slug} wine={w} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="eyebrow mb-2">{label}</dt>
      <dd className="body">{children}</dd>
    </div>
  );
}
