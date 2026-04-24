import { Hero } from "./sections";

export function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <>
      <Hero variant="collection" eyebrow="Legal" title={title} sub={`Last updated ${updated}.`} />
      <section className="container-page" style={{ paddingBlock: "var(--space-96)" }}>
        <div className="reading-column">
          {sections.map((s) => (
            <div key={s.heading} className="mb-14">
              <h2 className="serif h2 mb-5">{s.heading}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="body-l mb-4">{p}</p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
