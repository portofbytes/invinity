// Sanity adapter — future home of long-form content.
//
// In stub mode returns the existing JSON-backed content. In live mode it
// hits the Sanity HTTP API. Swap by setting NEXT_PUBLIC_SANITY_PROJECT_ID.

import { integrations } from "@/lib/env";
import { articles } from "@/data/journal";
import { tiers } from "@/data/club";
import { experiences } from "@/data/experiences";
import type { Article, Experience, Tier } from "@/lib/schemas";

export interface SanityAdapter {
  mode: "live" | "stub";
  listArticles(): Promise<Article[]>;
  getArticle(slug: string): Promise<Article | null>;
  listExperiences(): Promise<Experience[]>;
  listTiers(): Promise<Tier[]>;
}

const stub: SanityAdapter = {
  mode: "stub",
  async listArticles() {
    return articles;
  },
  async getArticle(slug) {
    return articles.find((a) => a.slug === slug) ?? null;
  },
  async listExperiences() {
    return experiences;
  },
  async listTiers() {
    return tiers;
  },
};

async function query<T>(groq: string, params: Record<string, unknown> = {}): Promise<T> {
  const url = integrations.sanity.apiUrl();
  if (!url) throw new Error("Sanity is not configured.");
  const qs = new URLSearchParams({ query: groq });
  for (const [k, v] of Object.entries(params)) qs.set(`$${k}`, JSON.stringify(v));
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), integrations.sanity.timeoutMs);
  try {
    const res = await fetch(`${url}?${qs.toString()}`, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`Sanity HTTP ${res.status}`);
    const json = (await res.json()) as { result: T };
    return json.result;
  } finally {
    clearTimeout(timer);
  }
}

const live: SanityAdapter = {
  mode: "live",
  async listArticles() {
    return query<Article[]>(`*[_type == "article"] | order(date desc)`);
  },
  async getArticle(slug) {
    return query<Article | null>(`*[_type == "article" && slug.current == $slug][0]`, { slug });
  },
  async listExperiences() {
    return query<Experience[]>(`*[_type == "experience"]`);
  },
  async listTiers() {
    return query<Tier[]>(`*[_type == "tier"]`);
  },
};

export const sanity: SanityAdapter = integrations.sanity.mode() === "live" ? live : stub;
