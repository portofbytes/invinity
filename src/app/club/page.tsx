import type { Metadata } from "next";
import Link from "next/link";
import { Hero, ChapterIntro, PullQuote, FullBleed } from "@/components/sections";
import { FAQList } from "@/components/faq";
import { ClubMotif } from "@/components/decoratives";
import { tiers, clubCopy } from "@/data/club";

export const metadata: Metadata = { title: "The House List" };

export default function ClubPage() {
  return (
    <>
      <Hero
        variant="collection"
        eyebrow="The House List"
        title={clubCopy.invitation}
        sub={clubCopy.lede}
        cta={{ href: "#tiers", label: "See the tiers" }}
      >
        <ClubMotif anchor="bottom-right" size={420} opacity={0.3} tone="bottle" />
      </Hero>

      <ChapterIntro
        eyebrow="Philosophy"
        title={clubCopy.philosophy}
        body="Membership is, in practice, a standing reservation — the wines reach you before the shelf does, in the quantities the vintage allows. There is no signup fee. Members may pause between releases, and may leave at any time."
      />

      <section id="tiers" className="surface-paper">
        <div className="container-page" style={{ paddingBlock: "var(--space-144)" }}>
          <div className="mb-16 reveal">
            <p className="eyebrow mb-4">Three tiers</p>
            <h2 className="serif display-l max-w-[22ch]">Dungeness, Chinook, Orca.</h2>
            <p className="body-l mt-6 max-w-[58ch]">
              Three ways to live with the house. Each offers first access, private tasting invitations, and ten percent on additional purchases; the depth of the allocation &mdash; five bottles, a case, or two cases &mdash; is what separates them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tiers.map((t) => (
              <article key={t.slug} className="reveal surface-chalk p-10 md:p-12 flex flex-col">
                <div className="flex items-baseline justify-between">
                  <p className="eyebrow">{t.position}</p>
                  <p className="meta">{t.status === "open" ? "Accepting members" : "Waitlist"}</p>
                </div>
                <h3 className="serif display-l mt-4">{t.name}</h3>
                <p className="body-l mt-5">{t.statement}</p>

                <dl className="mt-8 grid grid-cols-1 gap-4 border-y rule-hair py-6">
                  <Row label="Cadence">{t.cadence}</Row>
                  <Row label="Quantity">{t.quantity}</Row>
                </dl>

                <ul className="mt-6 flex flex-col gap-3">
                  {t.privileges.map((p) => (
                    <li key={p} className="body flex gap-3">
                      <span aria-hidden style={{ color: "var(--champagne)" }}>—</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                <p className="meta mt-6">{t.logistics}</p>

                <div className="mt-10">
                  <Link href={`/club/${t.slug}`} className="btn">{t.status === "open" ? `Request ${t.name} membership` : `Join the ${t.name} waitlist`}</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PullQuote
        quote="Some vintages are generous. Some are not. Membership is an acceptance of that rhythm."
        attribution="Invinity house doctrine"
      />

      <FullBleed title="A quiet register." sub="No signup fee. No newsletter. No noise." cta={{ href: "/club/orca", label: "Begin" }} />

      <section className="container-page" style={{ paddingBlock: "var(--space-144)" }}>
        <div className="mb-10 reveal">
          <p className="eyebrow mb-4">Frequently asked</p>
          <h2 className="serif h1 max-w-[20ch]">The small matters.</h2>
        </div>
        <FAQList
          items={[
            { question: "Is there a signup fee?", answer: "No. Membership is offered without a signup fee. You are charged only for the wines you receive." },
            { question: "Can I pause between releases?", answer: "Yes. Any member may skip a release or defer an allocation — write to the house and we will adjust." },
            { question: "Who ships the wine?", answer: "We do — from the estate in North Saanich, either by courier (complimentary in BC for Orca; BC and Alberta for Chinook) or by pickup at the house." },
            { question: "How do I become a member?", answer: "Write to the house — we place new members as allocations allow. Chinook currently operates a short waitlist." },
          ]}
        />
      </section>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-4 items-baseline">
      <dt className="eyebrow">{label}</dt>
      <dd className="body">{children}</dd>
    </div>
  );
}
