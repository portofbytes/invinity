import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";

// Dynamic imports of the env module take a while to cold-start under the
// full build pipeline; give each test a generous budget to avoid flake.
const IMPORT_TIMEOUT = 20_000;

const originalEnv = { ...process.env };

// Only clear Invinity-owned env so Node/vitest internals keep their own vars.
function clearInvinityEnv() {
  for (const k of Object.keys(process.env)) {
    if (k.startsWith("NEXT_PUBLIC_") || k.startsWith("RESEND_") || k.startsWith("SQUARESPACE_") || k.startsWith("SANITY_")) {
      delete process.env[k];
    }
  }
}

describe("env validation", { timeout: IMPORT_TIMEOUT }, () => {
  beforeEach(() => {
    vi.resetModules();
  });
  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("parses defaults when nothing is set", async () => {
    clearInvinityEnv();
    const mod = await import("./env");
    expect(mod.publicEnv.NEXT_PUBLIC_SITE_URL).toBe("https://invinity.ca");
    expect(mod.publicEnv.NEXT_PUBLIC_CURRENCY).toBe("CAD");
    expect(mod.commerceMode()).toBe("stub");
    expect(mod.sanityMode()).toBe("stub");
  });

  it("defaults RESEND_FROM to house@invinity.ca", async () => {
    clearInvinityEnv();
    const mod = await import("./env");
    expect(mod.serverEnv().RESEND_FROM).toBe("house@invinity.ca");
  });

  it("flips commerce to live when Squarespace URL is set", async () => {
    clearInvinityEnv();
    process.env.NEXT_PUBLIC_SQUARESPACE_STORE_URL = "https://shop.invinity.ca";
    const mod = await import("./env");
    expect(mod.commerceMode()).toBe("live");
    expect(mod.integrations.commerce.storeUrl()).toBe("https://shop.invinity.ca");
    expect(mod.integrations.commerce.provider).toBe("squarespace");
  });

  it("rejects an invalid Squarespace URL", async () => {
    clearInvinityEnv();
    process.env.NEXT_PUBLIC_SQUARESPACE_STORE_URL = "not-a-url";
    await expect(import("./env")).rejects.toThrow();
  });
});
