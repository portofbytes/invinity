import articlesJson from "../../content/journal.json";
import { ArticlesFileSchema, type Article } from "@/lib/schemas";

export type { Article } from "@/lib/schemas";

export const articles: Article[] = ArticlesFileSchema.parse(articlesJson);

export function articleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
