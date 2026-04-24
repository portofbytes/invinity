import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/env";

const BASE = publicEnv.NEXT_PUBLIC_SITE_URL;

// Required for static export.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/cart", "/search"] }],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
