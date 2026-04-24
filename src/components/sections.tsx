import Link from "next/link";
import type { ReactNode } from "react";
import Image from "next/image";
import type { MediaAsset } from "@/lib/schemas";

export function Hero({
  eyebrow,
  title,
  sub,
  cta,
  secondary,
  variant = "house",
  children,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  cta?: { href: string; label: string };
  secondary?: { href: string; label: string };
  variant?: "house" | "collection" | "product" | "experience";
  children?: ReactNode;
}) {
  return (
    <section
      className="relative overflow-hidden grain"
      style={{
        minHeight: variant === "house" ? "88vh" : variant === "collection" ? "64vh" : "56vh",
        background:
          variant === "house"
            ? "linear-gradient(180deg, var(--chalk) 0%, var(--paper) 60%, var(--stone) 100%)"
            : "linear-gradient(180deg, var(--paper) 0%, var(--chalk) 100%)",
      }}
    >
      {children}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 20%, color-mix(in oklab, var(--champagne) 16%, transparent) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, color-mix(in oklab, var(--bottle) 18%, transparent) 0%, transparent 60%)",
        }}
      />
      <div className="container-page relative flex items-end" style={{ minHeight: "inherit", paddingTop: 120, paddingBottom: 72 }}>
        <div className="max-w-[720px] reveal">
          {eyebrow && <p className="eyebrow mb-6">{eyebrow}</p>}
          <h1 className="serif hero-line" style={{ maxWidth: "16ch" }}>
            {title}
          </h1>
          {sub && <p className="body-l mt-6 max-w-[46ch]">{sub}</p>}
          {(cta || secondary) && (
            <div className="mt-10 flex flex-wrap items-center gap-6">
              {cta && (
                <Link href={cta.href} className="btn btn-solid">
                  {cta.label}
                </Link>
              )}
              {secondary && (
                <Link href={secondary.href} className="link-quiet">
                  {secondary.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function ChapterIntro({
  eyebrow,
  title,
  body,
  cta,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  body?: string | string[];
  cta?: { href: string; label: string };
  align?: "left" | "center";
}) {
  const paragraphs = Array.isArray(body) ? body : body ? [body] : [];
  return (
    <section className="container-page" style={{ paddingBlock: "var(--space-144)" }}>
      <div
        className={`reveal max-w-[760px] ${align === "center" ? "mx-auto text-center" : "md:ml-[8%]"}`}
      >
        {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
        <h2 className="serif display-l">{title}</h2>
        {paragraphs.map((p, i) => (
          <p key={i} className="body-l mt-6 max-w-[58ch]">
            {p}
          </p>
        ))}
        {cta && (
          <p className="mt-10">
            <Link href={cta.href} className="link-quiet">
              {cta.label} →
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}

export function SplitEditorial({
  eyebrow,
  title,
  body,
  cta,
  reversed = false,
  tone = "paper",
  image,
}: {
  eyebrow?: string;
  title: string;
  body: string[];
  cta?: { href: string; label: string };
  reversed?: boolean;
  tone?: "paper" | "chalk" | "stone";
  image?: MediaAsset;
}) {
  return (
    <section className={`surface-${tone}`}>
      <div className="container-page" style={{ paddingBlock: "var(--space-144)" }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className={`md:col-span-6 reveal ${reversed ? "md:order-2" : ""}`}>
            {image ? (
              <figure className="relative w-full overflow-hidden" style={{ aspectRatio: "4 / 5" }}>
                <div className="absolute inset-0 invinity-ken-burns">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1200px) 50vw, 100vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="grain absolute inset-0" />
              </figure>
            ) : (
              <ImagePlate tone={reversed ? "bottle" : "stone"} />
            )}
          </div>
          <div className={`md:col-span-5 ${reversed ? "md:col-start-1 md:row-start-1" : "md:col-start-8"} reveal`}>
            {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
            <h2 className="serif h1">{title}</h2>
            {body.map((p, i) => (
              <p key={i} className="body-l mt-6">
                {p}
              </p>
            ))}
            {cta && (
              <p className="mt-8">
                <Link href={cta.href} className="link-quiet">
                  {cta.label} →
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ImagePlate({ tone = "stone", ratio = "4 / 5" }: { tone?: "stone" | "bottle" | "paper"; ratio?: string }) {
  const bg =
    tone === "bottle"
      ? "linear-gradient(145deg, color-mix(in oklab, var(--bottle) 92%, black) 0%, var(--bottle) 50%, color-mix(in oklab, var(--bottle) 78%, var(--graphite)) 100%)"
      : tone === "paper"
      ? "linear-gradient(170deg, var(--paper) 0%, var(--stone) 100%)"
      : "linear-gradient(160deg, color-mix(in oklab, var(--stone) 94%, var(--paper)) 0%, color-mix(in oklab, var(--stone) 80%, var(--slate)) 100%)";
  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: ratio, background: bg }}>
      <div className="grain absolute inset-0" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            tone === "bottle"
              ? "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.12) 0%, transparent 55%)"
              : "radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.18) 0%, transparent 60%)",
        }}
      />
      {tone === "bottle" && <span className="bottle-silhouette" />}
    </div>
  );
}

export function FullBleed({
  title,
  sub,
  cta,
  tone = "bottle",
}: {
  title: string;
  sub?: string;
  cta?: { href: string; label: string };
  tone?: "bottle" | "graphite" | "stone";
}) {
  return (
    <section
      className={`surface-${tone} relative grain`}
      style={{ minHeight: "78vh", display: "grid", placeItems: "center" }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 80%, color-mix(in oklab, var(--champagne) 10%, transparent) 0%, transparent 60%)",
        }}
      />
      <div className="container-page relative text-center reveal">
        <h2 className="serif" style={{ fontSize: "clamp(40px, 6vw, 80px)", lineHeight: 1.04, letterSpacing: "-0.02em", maxWidth: "18ch", marginInline: "auto" }}>
          {title}
        </h2>
        {sub && <p className="body-l mt-6 max-w-[52ch] mx-auto" style={{ color: "color-mix(in oklab, var(--chalk) 72%, transparent)" }}>{sub}</p>}
        {cta && (
          <div className="mt-10">
            <Link href={cta.href} className="btn btn-invert">{cta.label}</Link>
          </div>
        )}
      </div>
    </section>
  );
}

export function PullQuote({ quote, attribution }: { quote: string; attribution?: string }) {
  return (
    <section className="surface-paper">
      <div className="container-page" style={{ paddingBlock: "var(--space-192)" }}>
        <blockquote className="reveal max-w-[28ch] mx-auto text-center">
          <p className="serif" style={{ fontSize: "clamp(34px, 4.8vw, 64px)", lineHeight: 1.12, letterSpacing: "-0.012em" }}>
            &ldquo;{quote}&rdquo;
          </p>
          {attribution && <footer className="meta mt-10">— {attribution}</footer>}
        </blockquote>
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`mb-16 reveal ${align === "center" ? "text-center mx-auto max-w-[60ch]" : "max-w-[60ch]"}`}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 className="serif h1">{title}</h2>
      {sub && <p className="body-l mt-5">{sub}</p>}
    </div>
  );
}
