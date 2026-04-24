"use client";

import Link from "next/link";
import type { Wine } from "@/data/wines";
import { statusLabel } from "@/data/wines";
import { useCart } from "./cart";
import { MagicalBottle } from "./magical-bottle";
import { WaitlistPanel } from "./waitlist-panel";
import { integrations } from "@/lib/env";

export function ProductTile({ wine }: { wine: Wine }) {
  return (
    <Link href={`/wines/${wine.slug}`} className="tile group focus-ring block reveal">
      <div className="tile-image relative flex items-end justify-center">
        <div className="grain absolute inset-0" />
        <div className="relative z-[1] w-full h-full flex items-end justify-center">
          <MagicalBottle wine={wine} size="full" calm bubbles fit="cover" />
        </div>
      </div>
      <div className="pt-6">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="serif" style={{ fontSize: 22, lineHeight: 1.18 }}>
            {wine.name}
            {wine.cuveeLabel && <span className="opacity-70"> — {wine.cuveeLabel}</span>}
          </h3>
          <span className="serif" style={{ fontSize: 18 }}>
            ${wine.price}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="meta">{wine.styleShort}</p>
          <p className="meta" style={{ color: wine.status === "sold-out" ? "var(--oxide)" : "var(--graphite)" }}>
            {statusLabel[wine.status]}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function ProductGrid({ wines }: { wines: Wine[] }) {
  if (wines.length === 0) {
    return (
      <div className="py-24 text-center reveal">
        <p className="serif display-l">The cellar is rested.</p>
        <p className="body-l mt-4 max-w-[46ch] mx-auto">
          No bottles in this collection are available today. Join the house list to be notified when the next release is disgorged.
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
      {wines.map((w) => (
        <ProductTile key={w.slug} wine={w} />
      ))}
    </div>
  );
}

function shopUrlFor(wine: Wine): string | null {
  if (wine.squarespace?.productUrl) return wine.squarespace.productUrl;
  const root = integrations.commerce.storeUrl();
  if (!root) return null;
  const slug = wine.squarespace?.productSlug ?? wine.slug;
  return `${root.replace(/\/$/, "")}/shop/${slug}`;
}

export function ProductPurchase({ wine }: { wine: Wine }) {
  const { add } = useCart();
  const available = wine.status === "available" || wine.status === "limited";
  return (
    <div className="commerce-column">
      <p className="eyebrow">{statusLabel[wine.status]}</p>
      <h1 className="serif h1 mt-3">
        {wine.name}
        {wine.cuveeLabel && (
          <>
            <br />
            <span className="opacity-70">— {wine.cuveeLabel}</span>
          </>
        )}
      </h1>
      <p className="meta mt-4">Vintage {wine.vintage} · {wine.volume}</p>
      <p className="body-l mt-8">{wine.descriptor}</p>
      <div className="mt-12 flex items-end justify-between border-b rule-hair pb-6">
        <span className="serif" style={{ fontSize: 40, letterSpacing: "-0.02em" }}>
          ${wine.price}
        </span>
        <span className="meta">CAD · per 750 mL</span>
      </div>
      <div className="mt-8 flex flex-col gap-3">
        {available ? (
          <>
            <button className="btn btn-solid w-full" onClick={() => add(wine)}>
              Add to selection
            </button>
            {shopUrlFor(wine) && (
              <a className="btn w-full" href={shopUrlFor(wine) as string} rel="noopener">
                Buy at the house shop
              </a>
            )}
          </>
        ) : wine.status === "club-only" ? (
          <Link href="/club" className="btn w-full">Join the house to access</Link>
        ) : (
          <WaitlistPanel wine={wine} trigger={<button className="btn w-full">Notify me when disgorged</button>} />
        )}
      </div>
      <p className="meta mt-6">
        Shipped within British Columbia and Alberta. Complimentary pickup from the estate.
      </p>
    </div>
  );
}

