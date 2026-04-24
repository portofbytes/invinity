import type { Metadata } from "next";
import Link from "next/link";
import { Hero, ChapterIntro, FullBleed } from "@/components/sections";
import { experiences } from "@/data/experiences";
import { site } from "@/data/site";
import { EmptyState } from "@/components/empty-states";
import { ConciergeContact } from "@/components/concierge";
import { FluteMotif } from "@/components/decoratives";

export const metadata: Metadata = { title: "Experiences" };

export default function ExperiencesPage() {
  return (
    <>
      <Hero
        variant="experience"
        eyebrow="Private experiences"
        title="Time at the house, by request."
        sub="We do not keep a tasting room. The house hosts small, private gatherings on the peninsula — by request, confirmed personally, held with care."
      >
        <FluteMotif anchor="top-right" size={420} opacity={0.3} tone="gold" />
      </Hero>

      <ChapterIntro
        eyebrow="Philosophy"
        title="Boutique hospitality, not winery tourism."
        body="Every experience is reserved for one party. We do not mix tables. Invitations are confirmed by email within seventy-two hours, and held on a private calendar."
      />

      <section className="container-page" style={{ paddingBlock: "var(--space-96)" }}>
        {experiences.length === 0 ? (
          <EmptyState
            title="No experiences scheduled just now."
            body="The house opens tastings in small, private windows around each disgorgement. Write to us — we'll place you personally."
            action={{ label: `Write to ${site.email}`, href: `mailto:${site.email}` }}
          />
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {experiences.map((ex) => (
            <article key={ex.slug} className="reveal surface-paper p-10 md:p-12 flex flex-col">
              <p className="eyebrow">{ex.access}</p>
              <h2 className="serif display-l mt-3">{ex.title}</h2>
              <p className="body-l mt-5">{ex.line}</p>
              <dl className="mt-8 grid grid-cols-2 gap-6 border-y rule-hair py-6">
                <div><dt className="eyebrow mb-2">Duration</dt><dd className="body">{ex.duration}</dd></div>
                <div><dt className="eyebrow mb-2">Party</dt><dd className="body">{ex.party}</dd></div>
                <div className="col-span-2"><dt className="eyebrow mb-2">Investment</dt><dd className="body">{ex.priceLine}</dd></div>
              </dl>
              <div className="mt-10">
                <Link href={`/experiences/${ex.slug}`} className="btn">Request this experience</Link>
              </div>
            </article>
          ))}
        </div>
        )}
      </section>

      <FullBleed
        title="If you are not sure which."
        sub="Write to the house. We will help place you in the right experience, at the right tide."
        cta={{ href: `mailto:${site.email}`, label: `Email ${site.email}` }}
      />

      <ConciergeContact />
    </>
  );
}
