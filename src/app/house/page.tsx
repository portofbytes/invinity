import Link from "next/link";
import type { Metadata } from "next";
import { Hero, SplitEditorial, PullQuote, ChapterIntro, FullBleed } from "@/components/sections";
import { Timeline, FounderProfile } from "@/components/house-blocks";
import { VineSilhouette, DriftingLeaf, OceanWaves } from "@/components/ambient";
import { house, conviction, milestones, founders } from "@/data/house";

export const metadata: Metadata = { title: "House" };

export default function HousePage() {
  const { origin, place, method, family, sustainability } = house.chapters;
  return (
    <>
      <Hero
        variant="house"
        eyebrow="The House"
        title="A house, not a label."
        sub="Founded on the Saanich Peninsula of Vancouver Island. Run by the Sparks family. Small by design, and sparkling only."
        secondary={{ href: "/wines", label: "See the wines" }}
      >
        <VineSilhouette corner="bottom-left" />
        <DriftingLeaf />
      </Hero>

      <ChapterIntro eyebrow={origin.eyebrow} title={origin.title} body={origin.body} />

      <SplitEditorial
        eyebrow={place.eyebrow}
        title={place.title}
        body={place.body}
        tone="paper"
        image={{ src: "/images/house/estate-7545.jpg", alt: "The estate on the Saanich Peninsula, above the Salish Sea." }}
      />
      <span id="place" />

      <SplitEditorial eyebrow={method.eyebrow} title={method.title} body={method.body} reversed tone="chalk" />
      <span id="method" />

      <PullQuote quote={conviction.quote} attribution={conviction.attribution} />

      <Timeline items={milestones} />

      <FounderProfile
        eyebrow={founders.sparks.eyebrow}
        name={founders.sparks.name}
        role={founders.sparks.role}
        body={founders.sparks.body}
      />

      <FounderProfile
        eyebrow={founders.blandin.eyebrow}
        name={founders.blandin.name}
        role={founders.blandin.role}
        body={founders.blandin.body}
        reversed
        portrait={{ src: "/images/people/patrick-blandin.jpg", alt: "Patrick Blandin, consulting oenologist." }}
      />

      <SplitEditorial eyebrow={family.eyebrow} title={family.title} body={family.body} tone="paper" />

      <ChapterIntro eyebrow={sustainability.eyebrow} title={sustainability.title} body={sustainability.body} />

      <FullBleed
        title="The wines the house is ready to release."
        cta={{ href: "/wines", label: "See the current cellar" }}
      />

      <section className="container-page" style={{ paddingBlock: "var(--space-144)" }}>
        <div className="flex flex-wrap gap-8">
          <Link href="/experiences" className="link-quiet">Private experiences →</Link>
          <Link href="/club" className="link-quiet">The house list →</Link>
          <Link href="/contact" className="link-quiet">Contact the house →</Link>
        </div>
      </section>
    </>
  );
}
