import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { tiers } from "@/data/club";
import { Hero } from "@/components/sections";
import { ExperienceRequest } from "@/components/forms";

export function generateStaticParams() {
  return tiers.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = tiers.find((x) => x.slug === slug);
  return { title: t ? `${t.name} membership` : "Membership" };
}

export default async function TierPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tier = tiers.find((t) => t.slug === slug);
  if (!tier) notFound();

  return (
    <>
      <Hero
        variant="collection"
        eyebrow={`${tier.position} · House list`}
        title={`${tier.name} membership.`}
        sub={tier.statement}
      />

      <section className="container-page" style={{ paddingBlock: "var(--space-96)" }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 reveal">
            <p className="eyebrow mb-4">What you receive</p>
            <ul className="flex flex-col gap-4">
              {tier.privileges.map((p) => (
                <li key={p} className="body-l flex gap-3">
                  <span aria-hidden style={{ color: "var(--champagne)" }}>—</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <p className="meta mt-8">{tier.logistics}</p>
          </div>
          <div className="md:col-span-6 md:col-start-7 reveal surface-paper p-10 md:p-12">
            <p className="eyebrow mb-4">Request membership</p>
            <h2 className="serif h1">Write to the house.</h2>
            <p className="body-l mt-4">
              Tell us a little about how you like to drink sparkling wine, and we will place you as the next allocation allows.
            </p>
            <ExperienceRequest />
          </div>
        </div>
      </section>

      <section className="container-page" style={{ paddingBlock: "var(--space-96)" }}>
        <p>
          <Link href="/club" className="link-quiet">Return to the house list →</Link>
        </p>
      </section>
    </>
  );
}
