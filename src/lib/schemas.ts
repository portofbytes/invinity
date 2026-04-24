import { z } from "zod";

export const MediaAssetSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});
export type MediaAsset = z.infer<typeof MediaAssetSchema>;

export const WineStatusSchema = z.enum(["available", "limited", "sold-out", "club-only"]);
export const CollectionSlugSchema = z.enum(["sparkling", "grande-cuvee", "ocean-aged", "library", "club"]);

export const WineSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, "slug must be lowercase kebab-case"),
  name: z.string().min(1),
  vintage: z.string().min(1),
  collection: CollectionSlugSchema,
  style: z.string().min(1),
  styleShort: z.string().min(1),
  price: z.number().positive().int(),
  status: WineStatusSchema,
  cuveeLabel: z.string().optional(),
  descriptor: z.string().min(1),
  tastingNote: z.string().min(1),
  varietals: z.string().min(1),
  method: z.string().min(1),
  dosage: z.string().optional(),
  volume: z.string().min(1),
  disgorged: z.string().optional(),
  serving: z.string().min(1),
  pairings: z.array(z.string()).min(1),
  featured: z.boolean().optional(),
  // Optional commissioned photography. When present, ProductTile / PDP gallery
  // render next/image; when absent, the token-backed BottleArt fallback renders.
  media: z
    .object({
      bottle: MediaAssetSchema.optional(),
      label: MediaAssetSchema.optional(),
      foil: MediaAssetSchema.optional(),
      still: MediaAssetSchema.optional(),
    })
    .optional(),
  // Squarespace commerce handoff. Set productUrl for an exact link; leave
  // empty to fall back to `${SQUARESPACE_STORE_URL}/shop/${productSlug ?? slug}`.
  squarespace: z
    .object({
      productSlug: z.string().min(1).optional(),
      productUrl: z.url().optional(),
    })
    .optional(),
});
export type Wine = z.infer<typeof WineSchema>;

export const CollectionSchema = z.object({
  slug: CollectionSlugSchema,
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
});
export type Collection = z.infer<typeof CollectionSchema>;

export const TierSchema = z.object({
  slug: z.enum(["dungeness", "chinook", "orca"]),
  name: z.string(),
  position: z.string(),
  cadence: z.string(),
  quantity: z.string(),
  statement: z.string(),
  privileges: z.array(z.string()).min(1),
  logistics: z.string(),
  status: z.enum(["open", "waitlist"]),
});
export type Tier = z.infer<typeof TierSchema>;

export const ExperienceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  line: z.string(),
  duration: z.string(),
  party: z.string(),
  access: z.enum(["Private", "By request"]),
  priceLine: z.string(),
  description: z.string(),
  includes: z.array(z.string()).min(1),
  practical: z.array(z.string()).min(1),
});
export type Experience = z.infer<typeof ExperienceSchema>;

export const ArticleSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  eyebrow: z.string(),
  date: z.string(),
  excerpt: z.string(),
  author: z.string().optional(),
  body: z.array(z.string()).min(1),
  pullQuote: z.string().optional(),
  featured: z.boolean().optional(),
});
export type Article = z.infer<typeof ArticleSchema>;

export const ContentFiles = {
  wines: "content/wines.json",
  collections: "content/collections.json",
  tiers: "content/club-tiers.json",
  experiences: "content/experiences.json",
  articles: "content/journal.json",
} as const;

export const WinesFileSchema = z.array(WineSchema).superRefine((arr, ctx) => {
  const seen = new Set<string>();
  arr.forEach((w, i) => {
    if (seen.has(w.slug)) ctx.addIssue({ code: "custom", message: `duplicate slug: ${w.slug}`, path: [i, "slug"] });
    seen.add(w.slug);
  });
});
export const CollectionsFileSchema = z.array(CollectionSchema);
export const TiersFileSchema = z.array(TierSchema);
export const ExperiencesFileSchema = z.array(ExperienceSchema);
export const ArticlesFileSchema = z.array(ArticleSchema);
