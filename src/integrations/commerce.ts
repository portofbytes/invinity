// Commerce adapter — Squarespace-backed.
//
// Squarespace is not headless-first; it owns the product pages, cart, and
// checkout. This adapter therefore operates as a *handoff layer*: our Next.js
// site presents the brand and catalog; when the customer is ready to buy,
// commerce.startCheckout() hands them to the Squarespace-hosted shop — either
// directly to a specific product page (preferred) or to the shop landing.
//
// Product data still lives in content/wines.json so we can render bottles
// beautifully on our side. Each wine may carry an optional
// `squarespace.productUrl` pointing at its Squarespace detail page. When set,
// the PDP "Buy" button deep-links there. If multiple lines are selected, we
// hand off to the shop root with a breadcrumb in the URL.

import { integrations, publicEnv } from "@/lib/env";
import { wines } from "@/data/wines";
import type { Wine } from "@/lib/schemas";

export type CheckoutLine = { sku: string; qty: number };

export type CheckoutResult =
  | { ok: true; url: string; mode: "live" | "stub" }
  | { ok: false; error: string };

export interface CommerceAdapter {
  provider: "squarespace";
  mode: "live" | "stub";
  listProducts(): Promise<Wine[]>;
  getProduct(slug: string): Promise<Wine | null>;
  /** Returns a URL the browser should navigate to in order to complete the sale. */
  startCheckout(lines: CheckoutLine[]): Promise<CheckoutResult>;
}

// -- Stub --------------------------------------------------------------------

const stub: CommerceAdapter = {
  provider: "squarespace",
  mode: "stub",
  async listProducts() {
    return wines;
  },
  async getProduct(slug) {
    return wines.find((w) => w.slug === slug) ?? null;
  },
  async startCheckout(lines) {
    if (lines.length === 0) return { ok: false, error: "Empty selection." };
    return { ok: true, mode: "stub", url: "#squarespace-not-configured" };
  },
};

// -- Live (Squarespace) ------------------------------------------------------
// The pattern here is URL-driven, not API-driven. Squarespace owns the cart.

function productUrlFor(sku: string): string | null {
  const wine = wines.find((w) => w.slug === sku);
  const sqUrl = wine?.squarespace?.productUrl;
  if (sqUrl) return sqUrl;
  // Fall back to a slug-based guess against the shop root, which Squarespace
  // shops typically expose as /shop/{slug}. This can be disabled by setting
  // squarespace.productUrl explicitly on every wine.
  const root = integrations.commerce.storeUrl();
  return root ? `${root.replace(/\/$/, "")}/shop/${wine?.squarespace?.productSlug ?? sku}` : null;
}

const live: CommerceAdapter = {
  provider: "squarespace",
  mode: "live",
  async listProducts() {
    // Catalog still lives in our content files; Squarespace isn't used for
    // read queries in this setup. Swap here if a Commerce API plan is added.
    return wines;
  },
  async getProduct(slug) {
    return wines.find((w) => w.slug === slug) ?? null;
  },
  async startCheckout(lines) {
    if (lines.length === 0) return { ok: false, error: "Empty selection." };
    const root = integrations.commerce.storeUrl();
    if (!root) return { ok: false, error: "Squarespace store URL missing." };

    // One-line selections deep-link to the product page. Multi-line
    // selections can't be atomically added to a Squarespace cart from an
    // external site, so we hand the customer to the shop root with a note
    // about which wines they asked for — they re-add them on the shop side.
    if (lines.length === 1) {
      const [only] = lines;
      const url = productUrlFor(only.sku);
      return url
        ? { ok: true, mode: "live", url }
        : { ok: false, error: "No Squarespace URL for this wine." };
    }

    const remembered = encodeURIComponent(lines.map((l) => `${l.qty}x ${l.sku}`).join(", "));
    return {
      ok: true,
      mode: "live",
      url: `${root.replace(/\/$/, "")}/shop?selection=${remembered}`,
    };
  },
};

export const commerce: CommerceAdapter =
  integrations.commerce.mode() === "live" ? live : stub;

// Back-compat export: callers that still import `shopify` will get a clear
// type error from tsc. No runtime alias — intentionally.
export { commerce as squarespace };
