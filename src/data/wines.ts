import winesJson from "../../content/wines.json";
import collectionsJson from "../../content/collections.json";
import {
  WinesFileSchema,
  CollectionsFileSchema,
  type Wine,
  type Collection,
} from "@/lib/schemas";

export type { Wine } from "@/lib/schemas";
export type WineStatus = Wine["status"];

export const wines: Wine[] = WinesFileSchema.parse(winesJson);
export const collections: Collection[] = CollectionsFileSchema.parse(collectionsJson);

export function wineBySlug(slug: string): Wine | undefined {
  return wines.find((w) => w.slug === slug);
}

export function winesByCollection(slug: string): Wine[] {
  return wines.filter((w) => w.collection === slug);
}

export const statusLabel: Record<WineStatus, string> = {
  available: "Available",
  limited: "Limited release",
  "sold-out": "Sold out",
  "club-only": "Members only",
};
