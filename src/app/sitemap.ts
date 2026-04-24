import type { MetadataRoute } from "next";
import { wines, collections } from "@/data/wines";
import { tiers } from "@/data/club";
import { experiences } from "@/data/experiences";
import { articles } from "@/data/journal";

import { publicEnv } from "@/lib/env";
const BASE = publicEnv.NEXT_PUBLIC_SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = [
    "",
    "/house",
    "/wines",
    "/club",
    "/experiences",
    "/journal",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
    "/shipping",
    "/accessibility",
    "/search",
  ];
  const urls: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${BASE}${p}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : 0.7,
  }));

  collections.forEach((c) => urls.push({ url: `${BASE}/wines/collection/${c.slug}`, lastModified: now, priority: 0.7 }));
  wines.forEach((w) => urls.push({ url: `${BASE}/wines/${w.slug}`, lastModified: now, priority: 0.9 }));
  tiers.forEach((t) => urls.push({ url: `${BASE}/club/${t.slug}`, lastModified: now, priority: 0.7 }));
  experiences.forEach((e) => urls.push({ url: `${BASE}/experiences/${e.slug}`, lastModified: now, priority: 0.6 }));
  articles.forEach((a) => urls.push({ url: `${BASE}/journal/${a.slug}`, lastModified: now, priority: 0.5 }));

  return urls;
}
