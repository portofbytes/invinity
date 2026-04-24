import Link from "next/link";
import { nav, site } from "@/data/site";
import { notices } from "@/data/notices";
import { ReleaseList } from "./forms";

export function Footer() {
  return (
    <footer className="surface-graphite">
      <div className="container-page py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-6">
            <p className="eyebrow" style={{ color: "var(--champagne)" }}>
              {notices.releaseList.eyebrow}
            </p>
            <h2 className="serif display-l mt-4 max-w-[18ch]">{notices.releaseList.headline}</h2>
            <p className="body-l mt-5 max-w-[52ch]" style={{ color: "color-mix(in oklab, var(--chalk) 72%, transparent)" }}>
              {notices.releaseList.body}
            </p>
            <div className="mt-8 max-w-md">
              <ReleaseList invert />
            </div>
          </div>
          <div className="md:col-span-3">
            <p className="eyebrow" style={{ color: "var(--champagne)" }}>
              The House
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {nav.primary.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className="nav-link">{i.label}</Link>
                </li>
              ))}
              {nav.secondary.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className="nav-link">{i.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-3">
            <p className="eyebrow" style={{ color: "var(--champagne)" }}>
              Contact
            </p>
            <address className="mt-5 not-italic meta flex flex-col gap-2" style={{ color: "color-mix(in oklab, var(--chalk) 72%, transparent)" }}>
              <span>{site.address.line1}</span>
              <span>{site.address.city}, {site.address.region}</span>
              <a className="link-quiet" href={`mailto:${site.email}`}>{site.email}</a>
              <a className="link-quiet" href={`tel:${site.phone.replace(/[^0-9]/g,"")}`}>{site.phone}</a>
            </address>
          </div>
        </div>
        <hr className="divider-hair mt-20" style={{ background: "color-mix(in oklab, var(--chalk) 14%, transparent)" }} />
        <div className="mt-8 flex flex-col md:flex-row justify-between gap-4">
          <p className="meta" style={{ color: "color-mix(in oklab, var(--chalk) 55%, transparent)" }}>
            © {new Date().getFullYear()} {site.longName}. Made in small quantities.
          </p>
          <p className="meta" style={{ color: "color-mix(in oklab, var(--chalk) 55%, transparent)" }}>
            Please enjoy responsibly. Minimum drinking age {site.legal.minimumAge}+.
          </p>
        </div>
      </div>
    </footer>
  );
}
