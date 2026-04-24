"use server";

import { z } from "zod";
import { commerce } from "@/integrations/commerce";
import { rateLimit } from "@/lib/rate-limit";

const LinesInput = z.array(
  z.object({
    sku: z.string().min(1),
    qty: z.number().int().positive(),
  })
);

export async function startCheckout(raw: unknown) {
  const limit = await rateLimit("checkout");
  if (!limit.ok) {
    return {
      ok: false as const,
      error: `Too many attempts. Please try again in ${limit.retryAfterSeconds}s.`,
    };
  }
  const parsed = LinesInput.safeParse(raw);
  if (!parsed.success) return { ok: false as const, error: "Invalid cart." };
  return commerce.startCheckout(parsed.data);
}
