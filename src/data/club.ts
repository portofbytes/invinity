import tiersJson from "../../content/club-tiers.json";
import { TiersFileSchema, type Tier } from "@/lib/schemas";

export type { Tier } from "@/lib/schemas";

export const tiers: Tier[] = TiersFileSchema.parse(tiersJson);

export const clubCopy = {
  invitation: "An invitation, not a subscription.",
  lede:
    "The Invinity house list is a small, quiet register. Members receive the wines we make in the order they are made, in the quantities the vintage allows. There is no signup fee, and no promotional language — only first access, private tastings, and the assurance that the house will reach you before the shelf does.",
  philosophy:
    "We do not overproduce. Some years are generous. Some are not. Membership is an acceptance of that rhythm.",
};
