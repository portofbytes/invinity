import Image from "next/image";
import { ImagePlate } from "./sections";
import type { MediaAsset } from "@/lib/schemas";

export function Timeline({
  items,
}: {
  items: { year: string; title: string; body: string }[];
}) {
  return (
    <section className="surface-chalk">
      <div className="container-page" style={{ paddingBlock: "var(--space-144)" }}>
        <div className="mb-16 reveal max-w-[48ch]">
          <p className="eyebrow mb-4">House milestones</p>
          <h2 className="serif h1">The years, briefly.</h2>
        </div>
        <ol className="grid grid-cols-1 md:grid-cols-12 gap-y-16 gap-x-10">
          {items.map((it, i) => (
            <li
              key={it.year}
              className={`reveal ${i % 2 === 0 ? "md:col-span-6" : "md:col-span-6 md:col-start-7"}`}
            >
              <div className="flex items-baseline gap-6 border-b rule-hair pb-3 mb-4">
                <span className="serif" style={{ fontSize: "clamp(32px, 4vw, 48px)", color: "var(--champagne)", letterSpacing: "-0.02em" }}>
                  {it.year}
                </span>
                <h3 className="serif h3">{it.title}</h3>
              </div>
              <p className="body-l max-w-[52ch]">{it.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function FounderProfile({
  eyebrow,
  name,
  role,
  body,
  reversed,
  portrait,
}: {
  eyebrow: string;
  name: string;
  role: string;
  body: string[];
  reversed?: boolean;
  portrait?: MediaAsset;
}) {
  return (
    <section className="surface-paper">
      <div className="container-page" style={{ paddingBlock: "var(--space-144)" }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className={`md:col-span-5 reveal ${reversed ? "md:col-start-8 md:order-2" : ""}`}>
            <div className="relative" style={{ aspectRatio: "4 / 5", background: "var(--stone)", overflow: "hidden" }}>
              {portrait ? (
                <Image
                  src={portrait.src}
                  alt={portrait.alt}
                  fill
                  sizes="(min-width: 1200px) 42vw, 100vw"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <>
                  <div className="grain absolute inset-0" />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{ background: "radial-gradient(ellipse at 50% 45%, color-mix(in oklab, var(--paper) 55%, transparent) 0%, transparent 50%)" }}
                  />
                  <div
                    aria-hidden
                    className="absolute"
                    style={{
                      left: "50%",
                      top: "36%",
                      transform: "translate(-50%, -50%)",
                      width: "42%",
                      aspectRatio: "1 / 1",
                      borderRadius: "50%",
                      background: "radial-gradient(circle at 40% 30%, color-mix(in oklab, var(--paper) 80%, var(--chalk)) 0%, var(--stone) 60%, var(--slate) 100%)",
                      boxShadow: "inset -8px -10px 14px rgba(0,0,0,0.12)",
                    }}
                  />
                </>
              )}
            </div>
          </div>
          <div className={`md:col-span-6 ${reversed ? "md:col-start-1 md:row-start-1" : "md:col-start-7"} reveal`}>
            <p className="eyebrow mb-4">{eyebrow}</p>
            <h2 className="serif h1">{name}</h2>
            <p className="meta mt-2">{role}</p>
            {body.map((p, i) => (
              <p key={i} className="body-l mt-6">{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function AnnouncementStrip({ message, href }: { message: string; href?: string }) {
  return (
    <div
      role="region"
      aria-label="Announcement"
      style={{
        background: "var(--graphite)",
        color: "var(--chalk)",
        padding: "10px 0",
        fontSize: 12,
        letterSpacing: "0.18em",
        textAlign: "center",
        textTransform: "uppercase",
      }}
    >
      <div className="container-page">
        {href ? (
          <a href={href} className="link-quiet" style={{ color: "var(--chalk)", borderColor: "color-mix(in oklab, var(--chalk) 40%, transparent)" }}>
            {message}
          </a>
        ) : (
          <span>{message}</span>
        )}
      </div>
    </div>
  );
}
