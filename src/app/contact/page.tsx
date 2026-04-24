import type { Metadata } from "next";
import { Hero } from "@/components/sections";
import { ContactForm } from "@/components/forms";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <Hero
        variant="collection"
        eyebrow="Contact"
        title="Write to the house."
        sub="The house replies personally. For private tastings, please use the Experiences page."
      />

      <section className="container-page" style={{ paddingBlock: "var(--space-96)" }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 reveal">
            <p className="eyebrow mb-4">The house</p>
            <h2 className="serif h1">{site.longName}</h2>
            <address className="not-italic mt-8 flex flex-col gap-2 body">
              <span>{site.address.line1}</span>
              <span>{site.address.city}, {site.address.region}</span>
              <span>{site.address.country}</span>
            </address>
            <div className="mt-10 flex flex-col gap-3 body">
              <a className="link-quiet" href={`mailto:${site.email}`}>{site.email}</a>
              <a className="link-quiet" href={`tel:${site.phone.replace(/[^0-9]/g,"")}`}>{site.phone}</a>
            </div>

            <hr className="divider-hair my-12" />

            <p className="eyebrow mb-3">Pickup</p>
            <p className="body max-w-[48ch]">
              Pickup is offered at the estate. Choose pickup at checkout and we will confirm a window by email within one business day.
            </p>

            <p className="eyebrow mt-10 mb-3">Shipping</p>
            <p className="body max-w-[48ch]">
              Complimentary delivery in Greater Victoria. $30 flat-rate shipping for orders of six bottles or more within British Columbia; twelve bottles or more within Alberta.
            </p>

            <p className="eyebrow mt-10 mb-3">Response</p>
            <p className="body max-w-[48ch]">The house replies within two business days.</p>
          </div>

          <div className="md:col-span-6 md:col-start-7 reveal surface-paper p-10 md:p-12">
            <p className="eyebrow mb-4">A note</p>
            <h2 className="serif h1">Leave word with the house.</h2>
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="container-page" style={{ paddingBottom: "var(--space-144)" }}>
        <div className="reveal w-full" style={{ aspectRatio: "16 / 7", background: "linear-gradient(160deg, var(--stone), var(--paper))" }}>
          <iframe
            title="Map to the estate"
            className="w-full h-full"
            style={{ border: 0 }}
            loading="lazy"
            src={`https://www.google.com/maps?q=${encodeURIComponent(`${site.address.line1}, ${site.address.city}, ${site.address.region}`)}&output=embed`}
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
