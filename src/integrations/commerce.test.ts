import { describe, it, expect } from "vitest";
import { commerce } from "./commerce";
import { wines } from "@/data/wines";

describe("commerce adapter (Squarespace, stub mode)", () => {
  it("reports stub mode when no Squarespace URL is set", () => {
    expect(commerce.mode).toBe("stub");
    expect(commerce.provider).toBe("squarespace");
  });

  it("listProducts returns the JSON-backed wines", async () => {
    const list = await commerce.listProducts();
    expect(list).toHaveLength(wines.length);
  });

  it("getProduct returns the wine by slug or null", async () => {
    const w = await commerce.getProduct(wines[0].slug);
    expect(w?.slug).toBe(wines[0].slug);
    expect(await commerce.getProduct("does-not-exist")).toBeNull();
  });

  it("startCheckout fails on empty selection", async () => {
    const r = await commerce.startCheckout([]);
    expect(r.ok).toBe(false);
  });

  it("startCheckout returns a stub URL in stub mode", async () => {
    const r = await commerce.startCheckout([{ sku: wines[0].slug, qty: 1 }]);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.mode).toBe("stub");
      expect(r.url).toMatch(/^#/);
    }
  });
});
