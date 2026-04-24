import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Hero } from "@/components/sections";
import { ExperienceRequest } from "@/components/forms";
import { experiences } from "@/data/experiences";
import { JsonLd, eventLd, breadcrumbLd } from "@/lib/ld";

export function generateStaticParams() {
  return experiences.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ex = experiences.find((e) => e.slug === slug);
  return { title: ex ? ex.title : "Experience" };
}

export default async function ExperienceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ex = experiences.find((e) => e.slug === slug);
  if (!ex) notFound();

  return (
    <>
      <JsonLd
        data={[
          eventLd(ex),
          breadcrumbLd([
            { label: "House", href: "/" },
            { label: "Experiences", href: "/experiences" },
            { label: ex.title, href: `/experiences/${ex.slug}` },
          ]),
        ]}
      />
      <Hero variant="experience" eyebrow={ex.access} title={ex.title} sub={ex.line} />

      <section className="container-page" style={{ paddingBlock: "var(--space-96)" }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-6 reveal">
            <p className="eyebrow mb-4">The experience</p>
            <p className="body-l">{ex.description}</p>

            <p className="eyebrow mt-12 mb-4">Included</p>
            <ul className="flex flex-col gap-3">
              {ex.includes.map((i) => (
                <li key={i} className="body flex gap-3"><span aria-hidden style={{ color: "var(--champagne)" }}>—</span><span>{i}</span></li>
              ))}
            </ul>

            <p className="eyebrow mt-12 mb-4">Practical</p>
            <ul className="flex flex-col gap-3">
              {ex.practical.map((i) => (
                <li key={i} className="body flex gap-3"><span aria-hidden style={{ color: "var(--champagne)" }}>—</span><span>{i}</span></li>
              ))}
            </ul>

            <dl className="mt-12 grid grid-cols-2 gap-8 border-t rule-hair pt-8">
              <div><dt className="eyebrow mb-2">Duration</dt><dd className="body">{ex.duration}</dd></div>
              <div><dt className="eyebrow mb-2">Party</dt><dd className="body">{ex.party}</dd></div>
              <div className="col-span-2"><dt className="eyebrow mb-2">Investment</dt><dd className="body">{ex.priceLine}</dd></div>
            </dl>
          </div>

          <div className="md:col-span-5 md:col-start-8 reveal surface-paper p-10 md:p-12 self-start">
            <p className="eyebrow mb-4">Request</p>
            <h2 className="serif h1">Write to the house.</h2>
            <p className="body mt-4">
              We reply personally within seventy-two hours with a date and a short confirmation.
            </p>
            <ExperienceRequest />
          </div>
        </div>
      </section>
    </>
  );
}
