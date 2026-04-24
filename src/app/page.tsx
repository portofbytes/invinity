import Link from "next/link";
import { Hero, ChapterIntro, SplitEditorial, FullBleed, PullQuote, SectionHeading } from "@/components/sections";
import { ProductTile } from "@/components/product";
import { ReleaseList } from "@/components/forms";
import { wines } from "@/data/wines";
import { house, conviction } from "@/data/house";

export default function HomePage() {
  const featured = wines.filter((w) => w.featured);
  const fillers = wines.filter((w) => w.status === "available" && !w.featured).slice(0, 2);
  const homeTiles = [...featured, ...fillers].slice(0, 3);

  return (
    <>
      <Hero
        eyebrow="Invinity · est. Vancouver Island"
        title="A sparkling house on the edge of the Pacific."
        sub="Traditional-method wines, made in micro-lots on the Saanich Peninsula, disgorged by hand, and released only when the house is ready."
        cta={{ href: "/wines", label: "See the wines" }}
        secondary={{ href: "/house", label: "Enter the house" }}
      />

      <ChapterIntro
        eyebrow="The House"
        title="One thing, made patiently."
        body={[
          house.statement,
          "We do not make still wine. We do not chase volume. We follow the vintage — and the sea — at the pace the wine asks for.",
        ]}
        cta={{ href: "/house", label: "Read the house story" }}
      />

      <section className="surface-paper">
        <div className="container-page" style={{ paddingBlock: "var(--space-144)" }}>
          <SectionHeading eyebrow="Current release" title="The cuvées on the table." sub="A short list. The house releases only what it has finished." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-16">
            {homeTiles.map((w) => (
              <ProductTile key={w.slug} wine={w} />
            ))}
          </div>
          <p className="mt-16">
            <Link href="/wines" className="link-quiet">Browse the full cellar →</Link>
          </p>
        </div>
      </section>

      <SplitEditorial
        eyebrow={house.chapters.method.eyebrow}
        title={house.chapters.method.title}
        body={house.chapters.method.body}
        cta={{ href: "/house#method", label: "The method" }}
      />

      <SplitEditorial
        eyebrow={house.chapters.place.eyebrow}
        title={house.chapters.place.title}
        body={house.chapters.place.body}
        reversed
        tone="chalk"
        cta={{ href: "/house#place", label: "The estate" }}
        image={{ src: "/images/house/estate-7545.jpg", alt: "The estate on the Saanich Peninsula." }}
      />

      <PullQuote quote={conviction.quote} attribution={conviction.attribution} />

      <FullBleed
        title="A seat at the winemaker's table."
        sub="Private tastings, by request, at the estate on the peninsula."
        cta={{ href: "/experiences", label: "Request an invitation" }}
      />

      <section className="container-page" style={{ paddingBlock: "var(--space-144)" }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 md:col-start-1 reveal">
            <p className="eyebrow mb-5">An invitation</p>
            <h2 className="serif display-l">The house list.</h2>
            <p className="body-l mt-6 max-w-[52ch]">
              A small, quiet register — first access to sparkling releases, a standing invitation to the winemaker&rsquo;s table, and ten percent on additional purchases, all year.
            </p>
            <p className="mt-8">
              <Link href="/club" className="link-quiet">See the three house-list tiers →</Link>
            </p>
          </div>
          <div className="md:col-span-6 md:col-start-7 reveal surface-paper p-10 md:p-12">
            <p className="eyebrow mb-4">Release notes</p>
            <h3 className="serif h2 mb-6">Receive word when a new cuvée is disgorged.</h3>
            <ReleaseList />
          </div>
        </div>
      </section>
    </>
  );
}
