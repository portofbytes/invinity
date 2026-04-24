import "server-only";
import { headers } from "next/headers";

// Pluggable rate-limit store. The in-memory default is fine for a single
// Node process; swap in Redis / Upstash for multi-instance or serverless
// deployments by implementing the same interface.
export interface RateLimitStore {
  hit(key: string, windowMs: number): Promise<{ count: number; resetAt: number }>;
}

type Entry = { count: number; resetAt: number };

class MemoryStore implements RateLimitStore {
  private map = new Map<string, Entry>();
  async hit(key: string, windowMs: number): Promise<Entry> {
    const now = Date.now();
    const existing = this.map.get(key);
    if (!existing || existing.resetAt < now) {
      const entry = { count: 1, resetAt: now + windowMs };
      this.map.set(key, entry);
      return entry;
    }
    existing.count += 1;
    return existing;
  }
}

let store: RateLimitStore = new MemoryStore();

// Allow wiring a different store from an instrumentation file at startup.
export function configureRateLimitStore(impl: RateLimitStore) {
  store = impl;
}

export type RateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; retryAfterSeconds: number };

export type RateLimitPolicy = { limit: number; windowMs: number };

export const policies: Record<"form" | "checkout" | "waitlist", RateLimitPolicy> = {
  form: { limit: 5, windowMs: 60_000 },       // 5 submissions / minute / client
  checkout: { limit: 10, windowMs: 60_000 },  // 10 checkouts / minute / client
  waitlist: { limit: 3, windowMs: 60_000 },   // 3 waitlist joins / minute / client
};

async function clientKey(bucket: string): Promise<string> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    "anon";
  return `${bucket}:${ip}`;
}

export async function rateLimit(bucket: keyof typeof policies): Promise<RateLimitResult> {
  const policy = policies[bucket];
  const key = await clientKey(bucket);
  const entry = await store.hit(key, policy.windowMs);
  if (entry.count <= policy.limit) {
    return { ok: true, remaining: policy.limit - entry.count };
  }
  return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - Date.now()) / 1000)) };
}
