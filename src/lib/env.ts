import { z } from "zod";

// ---------------------------------------------------------------------------
// Public env (safe to expose to the browser). All keys start with NEXT_PUBLIC_.
// ---------------------------------------------------------------------------
const PublicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("https://invinity.ca"),
  NEXT_PUBLIC_SITE_NAME: z.string().default("Invinity"),
  NEXT_PUBLIC_CURRENCY: z.enum(["CAD", "USD"]).default("CAD"),
  NEXT_PUBLIC_AGE_MINIMUM: z.coerce.number().int().min(18).max(25).default(19),

  // Squarespace is our commerce backend. Set this to your Squarespace shop URL
  // (typically https://shop.invinity.ca or https://invinity.squarespace.com).
  // When set, integration mode is "squarespace"; otherwise "stub".
  NEXT_PUBLIC_SQUARESPACE_STORE_URL: z.url().optional(),

  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_SANITY_DATASET: z.string().default("production"),
  NEXT_PUBLIC_SANITY_API_VERSION: z.string().default("2025-01-01"),
});

// ---------------------------------------------------------------------------
// Server-only env. Never reference from the browser — serverEnv() guards that.
// ---------------------------------------------------------------------------
const ServerSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    // Resend for transactional email. RESEND_FROM must be on a verified domain —
    // we default to the house address at invinity.ca.
    RESEND_API_KEY: z.string().optional(),
    RESEND_FROM: z.email().default("house@invinity.ca"),
    // Squarespace Commerce API key (optional; most embeds deep-link to
    // Squarespace-hosted checkout and don't need this). Used only if/when we
    // want to read inventory server-side.
    SQUARESPACE_API_KEY: z.string().optional(),
    SANITY_READ_TOKEN: z.string().optional(),
    SANITY_WRITE_TOKEN: z.string().optional(),
  })
  .superRefine((e, ctx) => {
    if (e.RESEND_API_KEY && !e.RESEND_FROM) {
      ctx.addIssue({
        code: "custom",
        message: "RESEND_API_KEY is set but RESEND_FROM is missing. Set a verified sender address on invinity.ca.",
        path: ["RESEND_FROM"],
      });
    }
  });

export type PublicEnv = z.infer<typeof PublicSchema>;
export type ServerEnv = z.infer<typeof ServerSchema>;

function parseOrFail<T>(schema: z.ZodType<T>, source: Record<string, unknown>, label: string): T {
  const result = schema.safeParse(source);
  if (result.success) return result.data;
  const issues = result.error.issues
    .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("\n");
  throw new Error(`Invalid ${label} environment:\n${issues}\nCheck your .env files.`);
}

export const publicEnv: PublicEnv = parseOrFail(PublicSchema, process.env as Record<string, unknown>, "public");

let _serverEnv: ServerEnv | null = null;
export function serverEnv(): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error("serverEnv() was called in the browser. This leaks secrets — use publicEnv instead.");
  }
  if (!_serverEnv) {
    _serverEnv = parseOrFail(ServerSchema, process.env as Record<string, unknown>, "server");
  }
  return _serverEnv;
}

// ---------------------------------------------------------------------------
// Integration modes — single source of truth for "live or stubbed?"
// ---------------------------------------------------------------------------
export type IntegrationMode = "live" | "stub";

export function commerceMode(): IntegrationMode {
  return publicEnv.NEXT_PUBLIC_SQUARESPACE_STORE_URL ? "live" : "stub";
}

export function sanityMode(): IntegrationMode {
  return publicEnv.NEXT_PUBLIC_SANITY_PROJECT_ID ? "live" : "stub";
}

export function emailMode(): IntegrationMode {
  if (typeof window !== "undefined") return "stub";
  try {
    const s = serverEnv();
    return s.RESEND_API_KEY ? "live" : "stub";
  } catch {
    return "stub";
  }
}

export const integrations = {
  commerce: {
    provider: "squarespace" as const,
    mode: commerceMode,
    storeUrl: () => publicEnv.NEXT_PUBLIC_SQUARESPACE_STORE_URL ?? null,
    timeoutMs: 6000,
  },
  sanity: {
    mode: sanityMode,
    apiUrl: () =>
      publicEnv.NEXT_PUBLIC_SANITY_PROJECT_ID
        ? `https://${publicEnv.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v${publicEnv.NEXT_PUBLIC_SANITY_API_VERSION}/data/query/${publicEnv.NEXT_PUBLIC_SANITY_DATASET}`
        : null,
    timeoutMs: 6000,
  },
  email: {
    mode: emailMode,
    apiUrl: "https://api.resend.com/emails",
    timeoutMs: 5000,
  },
} as const;
