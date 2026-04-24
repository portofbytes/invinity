import { describe, it, expect, vi, beforeEach } from "vitest";

// next/headers is a server-only import. Mock it for unit tests.
vi.mock("next/headers", () => ({
  headers: async () => ({
    get: (k: string) => (k === "x-forwarded-for" ? "203.0.113.7" : null),
  }),
}));

// server-only throws at import if we're not in a server context; stub it out.
vi.mock("server-only", () => ({}));

describe("rateLimit", () => {
  beforeEach(async () => {
    vi.resetModules();
  });

  it("allows up to the policy limit, then rejects", async () => {
    const { rateLimit, policies } = await import("./rate-limit");
    const limit = policies.waitlist.limit;
    for (let i = 0; i < limit; i++) {
      const r = await rateLimit("waitlist");
      expect(r.ok).toBe(true);
    }
    const over = await rateLimit("waitlist");
    expect(over.ok).toBe(false);
    if (!over.ok) expect(over.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("uses separate buckets per bucket name", async () => {
    const { rateLimit, policies } = await import("./rate-limit");
    // Fill the form bucket to its limit
    for (let i = 0; i < policies.form.limit; i++) await rateLimit("form");
    // Checkout bucket is untouched — next call should pass
    const r = await rateLimit("checkout");
    expect(r.ok).toBe(true);
  });
});
