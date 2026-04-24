import { site } from "@/data/site";

export function ConciergeContact({
  eyebrow = "Concierge",
  title = "Speak to the house directly.",
  body = "For bespoke requests, gifts at scale, or experiences outside our published formats, write or call. We reply within two business days.",
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
}) {
  return (
    <section className="surface-paper">
      <div className="container-page" style={{ paddingBlock: "var(--space-144)" }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-5 reveal">
            <p className="eyebrow mb-4">{eyebrow}</p>
            <h2 className="serif h1 max-w-[18ch]">{title}</h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 reveal">
            <p className="body-l max-w-[52ch]">{body}</p>
            <ul className="mt-10 flex flex-col gap-3">
              <li className="body">
                <span className="eyebrow mr-4">Email</span>
                <a className="link-quiet" href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li className="body">
                <span className="eyebrow mr-4">Phone</span>
                <a className="link-quiet" href={`tel:${site.phone.replace(/[^0-9]/g, "")}`}>{site.phone}</a>
              </li>
              <li className="body">
                <span className="eyebrow mr-4">Address</span>
                <span>{site.address.line1}, {site.address.city}, {site.address.region}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
