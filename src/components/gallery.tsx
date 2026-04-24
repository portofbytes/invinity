"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import type { Wine } from "@/data/wines";
import { BottleArt } from "./bottle";
import { MagicalBottle, type RotationMode } from "./magical-bottle";
import { PaisleyFrame } from "./decoratives";
import { color } from "@/tokens";

type View = "bottle" | "label" | "foil" | "still";

const VIEWS: { id: View; caption: string }[] = [
  { id: "bottle", caption: "Bottle, full height" },
  { id: "label", caption: "Label detail" },
  { id: "foil", caption: "Foil &amp; crown" },
  { id: "still", caption: "In the cellar" },
];

export function ProductGallery({ wine }: { wine: Wine }) {
  const [active, setActive] = useState<View>("bottle");
  const [lightbox, setLightbox] = useState(false);

  return (
    <>
      <button
        type="button"
        className="block w-full focus-ring"
        onClick={() => setLightbox(true)}
        aria-label="Open full-size gallery"
      >
        <div className="relative overflow-hidden" style={{ aspectRatio: "4 / 5", background: galleryBg(wine, active) }}>
          <div className="grain absolute inset-0" />
          <GalleryCanvas wine={wine} view={active} />
        </div>
      </button>

      <div className="mt-4 grid grid-cols-4 gap-3">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setActive(v.id)}
            className="relative focus-ring"
            aria-label={v.caption}
            aria-current={active === v.id ? "true" : undefined}
            style={{
              aspectRatio: "1 / 1",
              background: galleryBg(wine, v.id),
              outline: active === v.id ? "1px solid var(--graphite)" : "1px solid transparent",
              outlineOffset: 2,
              opacity: active === v.id ? 1 : 0.7,
              transition: "opacity 220ms var(--ease-out-quiet)",
            }}
          >
            <div className="grain absolute inset-0" />
            <div className="absolute inset-0 flex items-end justify-center" style={{ paddingBottom: "6%" }}>
              <ThumbGlyph wine={wine} view={v.id} />
            </div>
          </button>
        ))}
      </div>

      {lightbox && (
        <Lightbox wine={wine} initial={active} onClose={() => setLightbox(false)} />
      )}
    </>
  );
}

function galleryBg(wine: Wine, view: View) {
  if (view === "still") {
    return wine.collection === "ocean-aged"
      ? `linear-gradient(170deg, ${color.oceanGlassMid} 0%, ${color.oceanGlassDark} 100%)`
      : "linear-gradient(170deg, var(--stone) 0%, color-mix(in oklab, var(--stone) 70%, var(--slate)) 100%)";
  }
  if (view === "label" || view === "foil") {
    return "linear-gradient(160deg, var(--paper) 0%, var(--stone) 100%)";
  }
  // Bottle view sits on a deep field so the paisley frame and the bottle
  // read as a library portrait rather than a clipping on white paper.
  return `radial-gradient(ellipse at 50% 60%, color-mix(in oklab, ${color.bottle} 92%, ${color.graphite}) 0%, ${color.graphite} 70%)`;
}

function GalleryCanvas({ wine, view, rotation = "idle" }: { wine: Wine; view: View; rotation?: RotationMode }) {
  if (view === "bottle") {
    const safeInset = 12 + 56 + 12; // frame inset + band thickness + breathing room
    return (
      <>
        <PaisleyFrame tone="gold" opacity={0.7} inset={12} bandWidth={56} />
        <div className="absolute" style={{ inset: safeInset }}>
          <MagicalBottle
            wine={wine}
            size="full"
            rotation={rotation}
            fit="contain"
            calm={rotation !== "continuous"}
            parallax
            shine={false}
            bubbles
          />
        </div>
        {/* Full-frame diagonal shine — sweeps the entire grid cell, not
            just the bottle silhouette. The outer container clips it. */}
        <span
          aria-hidden
          className="invinity-bottle-shine"
          style={{ borderRadius: 0 }}
        />
      </>
    );
  }
  if (view === "label") {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="surface-chalk"
          style={{
            width: "58%",
            aspectRatio: "3 / 4",
            boxShadow: "0 20px 40px rgba(20,25,22,0.25)",
            padding: "10% 6%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid color-mix(in oklab, var(--graphite) 14%, transparent)",
          }}
        >
          <div className="text-center">
            <p className="serif" style={{ letterSpacing: "0.32em", fontSize: "clamp(14px, 1.6vw, 22px)", color: "var(--champagne)" }}>
              INVINITY
            </p>
            <div style={{ height: 1, background: "var(--champagne)", margin: "10% 18% 0" }} />
          </div>
          <div className="text-center">
            <p className="serif" style={{ fontSize: "clamp(18px, 2.4vw, 32px)", lineHeight: 1.12 }}>
              {wine.name}
            </p>
            {wine.cuveeLabel && (
              <p className="serif" style={{ fontStyle: "italic", fontSize: "clamp(14px, 1.8vw, 22px)", color: "var(--slate)" }}>
                {wine.cuveeLabel}
              </p>
            )}
          </div>
          <div className="text-center">
            <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--oxide)" }}>
              {wine.collection === "ocean-aged" ? "OCEAN AGED · SAANICH PENINSULA" : "SAANICH PENINSULA · BRITISH COLUMBIA"}
            </p>
            <p className="serif" style={{ fontSize: "clamp(22px, 3vw, 36px)", color: "var(--champagne)", marginTop: 6 }}>
              {wine.vintage.match(/\d{4}/)?.[0] ?? wine.vintage}
            </p>
          </div>
        </div>
      </div>
    );
  }
  if (view === "foil") {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div style={{ width: "42%" }}>
          <BottleArtCrown wine={wine} />
        </div>
      </div>
    );
  }
  return (
    <div className="absolute inset-0 flex items-end justify-center">
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 120%, color-mix(in oklab, var(--champagne) 18%, transparent) 0%, transparent 55%)",
        }}
      />
      <div style={{ width: "30%", paddingBottom: "10%" }}>
        <BottleArt wine={wine} width="100%" />
      </div>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(180deg, rgba(0,0,0,0.06) 0 2px, transparent 2px 8px)",
          mixBlendMode: "multiply",
          opacity: 0.5,
        }}
      />
    </div>
  );
}

function BottleArtCrown({ wine }: { wine: Wine }) {
  return (
    <svg viewBox="0 0 200 260" width="100%" aria-hidden="true">
      <defs>
        <linearGradient id="crown-foil" x1="0" x2="1">
          <stop offset="0" stopColor={color.champagneDark} />
          <stop offset="0.5" stopColor={color.champagne} />
          <stop offset="1" stopColor={color.champagneDark} />
        </linearGradient>
      </defs>
      <rect x="50" y="10" width="100" height="170" fill="url(#crown-foil)" />
      <rect x="50" y="170" width="100" height="6" fill={color.champagneDark} />
      <path d="M50 176 Q100 196 150 176 L150 200 Q100 216 50 200 Z" fill={color.bottleDark} />
      <text
        x="100"
        y="96"
        textAnchor="middle"
        fontFamily="var(--font-display-serif, 'Cormorant Garamond', serif)"
        fontSize="22"
        letterSpacing="6"
        fill={color.paper}
      >
        I
      </text>
      <text
        x="100"
        y="140"
        textAnchor="middle"
        fontSize="8"
        letterSpacing="4"
        fill={color.paper}
        fontFamily="var(--font-text-sans, Inter, sans-serif)"
      >
        {wine.cuveeLabel?.toUpperCase() ?? "CUVÉE"}
      </text>
    </svg>
  );
}

function ThumbGlyph({ wine, view }: { wine: Wine; view: View }) {
  if (view === "label")
    return (
      <div
        style={{
          width: "62%",
          aspectRatio: "3 / 4",
          background: "var(--chalk)",
          border: "1px solid color-mix(in oklab, var(--graphite) 14%, transparent)",
          marginBottom: "8%",
        }}
      />
    );
  if (view === "foil")
    return (
      <div
        style={{ width: "22%", height: "64%", background: `linear-gradient(180deg, ${color.champagne}, ${color.champagneDark})`, marginBottom: "8%" }}
      />
    );
  if (view === "still") return <div style={{ width: "18%" }}><BottleArt wine={wine} width="100%" flat /></div>;
  return <div style={{ width: "30%" }}><BottleArt wine={wine} width="100%" flat /></div>;
}

function Lightbox({ wine, initial, onClose }: { wine: Wine; initial: View; onClose: () => void }) {
  const [view, setView] = useState<View>(initial);
  const [spinning, setSpinning] = useState(false);
  const rotation: RotationMode = view === "bottle" ? (spinning ? "continuous" : "idle") : "off";

  const idx = VIEWS.findIndex((v) => v.id === view);
  const move = (dir: 1 | -1) => {
    const next = (idx + dir + VIEWS.length) % VIEWS.length;
    setView(VIEWS[next].id);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <Dialog.Root open onOpenChange={(o) => !o && onClose()} modal>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] surface-graphite grain" style={{ animation: "invinity-fade-in 380ms var(--ease-out-quiet)" }} />
        <Dialog.Content aria-label="Product gallery" className="fixed inset-0 z-[91] flex flex-col surface-graphite grain">
          <div className="flex items-center justify-between px-6 md:px-10 h-16">
            <Dialog.Title className="eyebrow" style={{ color: "color-mix(in oklab, var(--chalk) 70%, transparent)" }}>
              {wine.name}{wine.cuveeLabel ? ` — ${wine.cuveeLabel}` : ""} · {VIEWS[idx]?.caption}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="nav-link focus-ring" style={{ color: "var(--chalk)" }}>
                Close ×
              </button>
            </Dialog.Close>
          </div>
      <div className="flex-1 relative">
        <div
          className="absolute inset-0"
          style={{ background: galleryBg(wine, view) }}
        />
        <div className="grain absolute inset-0" />
        <GalleryCanvas wine={wine} view={view} rotation={rotation} />

        <button
          onClick={() => move(-1)}
          aria-label="Previous view"
          className="focus-ring absolute left-4 md:left-8 top-1/2 -translate-y-1/2 nav-link"
          style={{ color: "var(--chalk)" }}
        >
          ← Prev
        </button>
        <button
          onClick={() => move(1)}
          aria-label="Next view"
          className="focus-ring absolute right-4 md:right-8 top-1/2 -translate-y-1/2 nav-link"
          style={{ color: "var(--chalk)" }}
        >
          Next →
        </button>

        {view === "bottle" && (
          <button
            onClick={() => setSpinning((s) => !s)}
            aria-pressed={spinning}
            aria-label={spinning ? "Stop 360° rotation" : "Begin 360° rotation"}
            className="focus-ring absolute bottom-6 left-1/2 -translate-x-1/2 nav-link"
            style={{
              color: "var(--chalk)",
              borderColor: "color-mix(in oklab, var(--chalk) 40%, transparent)",
              padding: "10px 20px",
              border: "1px solid color-mix(in oklab, var(--chalk) 40%, transparent)",
            }}
          >
            {spinning ? "Pause 360°" : "View in 360°"}
          </button>
        )}
      </div>
      <div className="flex items-center justify-center gap-2 h-12" style={{ color: "color-mix(in oklab, var(--chalk) 60%, transparent)" }}>
        {VIEWS.map((v, i) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            aria-label={`Go to ${v.caption}`}
            className="focus-ring"
            style={{
              width: 24, height: 2, background: i === idx ? "var(--chalk)" : "color-mix(in oklab, var(--chalk) 30%, transparent)",
              transition: "background 280ms var(--ease-out-quiet)", border: 0,
            }}
          />
        ))}
      </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
