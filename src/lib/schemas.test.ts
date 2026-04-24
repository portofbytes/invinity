import { describe, it, expect } from "vitest";
import { WinesFileSchema, WineSchema, TiersFileSchema } from "./schemas";

const validWine = {
  slug: "test-wine",
  name: "Test Cuvée",
  vintage: "2020",
  collection: "sparkling" as const,
  style: "Test style",
  styleShort: "Test · 2020",
  price: 40,
  status: "available" as const,
  descriptor: "A descriptor.",
  tastingNote: "A note.",
  varietals: "Chardonnay",
  method: "Traditional method.",
  volume: "750 mL",
  serving: "8°C.",
  pairings: ["Oysters"],
};

describe("WineSchema", () => {
  it("accepts a well-formed wine", () => {
    expect(WineSchema.parse(validWine)).toMatchObject({ slug: "test-wine" });
  });

  it("rejects slugs that aren't kebab-case", () => {
    expect(() => WineSchema.parse({ ...validWine, slug: "Test Wine" })).toThrow();
  });

  it("rejects negative prices", () => {
    expect(() => WineSchema.parse({ ...validWine, price: -10 })).toThrow();
  });

  it("rejects unknown status", () => {
    expect(() => WineSchema.parse({ ...validWine, status: "preorder" })).toThrow();
  });

  it("requires at least one pairing", () => {
    expect(() => WineSchema.parse({ ...validWine, pairings: [] })).toThrow();
  });
});

describe("WinesFileSchema", () => {
  it("rejects duplicate slugs", () => {
    const data = [validWine, { ...validWine }];
    expect(() => WinesFileSchema.parse(data)).toThrow(/duplicate slug/);
  });

  it("accepts unique entries", () => {
    const data = [validWine, { ...validWine, slug: "another-wine" }];
    expect(WinesFileSchema.parse(data)).toHaveLength(2);
  });
});

describe("TiersFileSchema", () => {
  it("rejects unknown tier slug", () => {
    expect(() =>
      TiersFileSchema.parse([
        {
          slug: "platinum",
          name: "Platinum",
          position: "Top",
          cadence: "x",
          quantity: "x",
          statement: "x",
          privileges: ["x"],
          logistics: "x",
          status: "open",
        },
      ])
    ).toThrow();
  });
});
