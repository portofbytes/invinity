#!/usr/bin/env node
// Build-time standards checker for Invinity.
// Scans src/ for violations of the design/content standards. Exits non-zero
// with a readable report so `next build` (via `prebuild`) fails before shipping.
//
// Each rule has: id, severity ("error" | "warn"), description, scope (globs of
// files it applies to), allowlist (files exempted because they are the
// source-of-truth for the pattern), and a test function. Add rules at the
// bottom of the RULES array.

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");

const RULES = [
  {
    id: "no-hex-outside-tokens",
    severity: "error",
    description:
      "Hex colors must live in src/tokens.ts or globals.css. Import from @/tokens.",
    scope: /\.(tsx?|jsx?)$/,
    allowlist: [
      path.join(SRC, "tokens.ts"),
      // global-error must be self-contained — if tokens crash, this renders.
      path.join(SRC, "app", "global-error.tsx"),
    ],
    pattern: /#[0-9A-Fa-f]{3}(?:[0-9A-Fa-f]{3})?(?:[0-9A-Fa-f]{2})?\b/,
    exemptLine: (line) =>
      // Hex-like tokens inside strings that are obviously not colors
      /id="[^"]*#/.test(line) || /fragment|anchor/i.test(line),
  },
  {
    id: "no-hardcoded-email",
    severity: "error",
    description:
      "Contact emails must come from data/site.ts (site.email) or be the default sender in src/lib/env.ts. Do not inline an @-address elsewhere.",
    scope: /\.(tsx?|jsx?)$/,
    allowlist: [
      path.join(SRC, "data", "site.ts"),
      path.join(SRC, "lib", "env.ts"), // RESEND_FROM default
    ],
    pattern: /[A-Za-z0-9._%+-]+@invinity\.(ca|com)\b/,
    exemptLine: (_line, file) => /\.test\.tsx?$/.test(file),
  },
  {
    id: "no-hardcoded-phone",
    severity: "error",
    description:
      "Phone numbers must come from data/site.ts (site.phone). Do not inline them.",
    scope: /\.(tsx?|jsx?)$/,
    allowlist: [path.join(SRC, "data", "site.ts")],
    // Canadian-style xxx-xxx-xxxx or (xxx) xxx-xxxx
    pattern: /\b(?:\(?\d{3}\)?[-. ]?)\d{3}[-. ]\d{4}\b/,
  },
  {
    id: "no-hardcoded-address",
    severity: "error",
    description:
      "Street addresses must come from data/site.ts (site.address). Do not inline them.",
    scope: /\.(tsx?|jsx?)$/,
    allowlist: [path.join(SRC, "data", "site.ts")],
    pattern: /\b10755\s+Madrona\b/i,
  },
  {
    id: "no-absolute-site-url",
    severity: "error",
    description:
      "Absolute https://invinity.ca URLs must be derived from NEXT_PUBLIC_SITE_URL env. Do not inline the domain in components/pages.",
    scope: /\.(tsx?|jsx?)$/,
    allowlist: [
      path.join(SRC, "lib", "env.ts"),
    ],
    pattern: /https?:\/\/(?:www\.)?invinity\.(ca|com)\b/,
    exemptLine: (_line, file) => /\.test\.tsx?$/.test(file),
  },
  {
    id: "no-console-log",
    severity: "error",
    description: "Remove console.log / console.debug before shipping.",
    scope: /\.(tsx?|jsx?)$/,
    allowlist: [],
    pattern: /\bconsole\.(log|debug)\s*\(/,
  },
  {
    id: "no-ts-ignore",
    severity: "error",
    description:
      "Do not suppress TypeScript with @ts-ignore. Use a typed cast or fix the type.",
    scope: /\.(tsx?)$/,
    allowlist: [],
    pattern: /@ts-ignore/,
  },
  {
    id: "no-px-in-hero-serif",
    severity: "warn",
    description:
      "Type scale should be fluid (clamp/rem) rather than fixed px on major headings. Consider using clamp().",
    scope: /\.(tsx?)$/,
    allowlist: [path.join(SRC, "app", "globals.css")],
    pattern: /<h[12][^>]*fontSize:\s*\d+px/,
  },
  {
    id: "no-raw-data-urls",
    severity: "error",
    description:
      "Data URLs embedded in TSX bloat bundles and hide assets. Save the file and import it.",
    scope: /\.(tsx?|jsx?)$/,
    allowlist: [],
    pattern: /data:(image|font)\/[a-z0-9+.-]+;base64,/i,
  },
  {
    id: "no-inline-hex-in-svg-attrs",
    severity: "error",
    description:
      "SVG fill/stroke/stopColor attributes must reference color tokens via @/tokens.",
    scope: /\.(tsx?)$/,
    allowlist: [path.join(SRC, "tokens.ts")],
    pattern: /(?:fill|stroke|stopColor)\s*=\s*["']#[0-9A-Fa-f]{3,8}["']/,
  },
  {
    id: "integrations-through-adapters",
    severity: "error",
    description:
      "Integration SDKs must only be imported inside src/integrations/**. Everywhere else goes through the adapter (e.g. `import { shopify } from '@/integrations/shopify'`).",
    scope: /\.(tsx?|jsx?)$/,
    allowlist: [],
    pattern: /from\s+["'](?:resend|@sanity\/[^"']+|@shopify\/[^"']+|shopify-buy|@squarespace\/[^"']+|squarespace-commerce)["']/,
    exemptLine: (line, file) => file.includes(path.join("src", "integrations")),
  },
  {
    id: "no-direct-process-env",
    severity: "error",
    description:
      "Do not read process.env directly outside src/lib/env.ts. Use publicEnv / serverEnv() so values are Zod-validated. (process.env.NODE_ENV is exempt — Next.js inlines it at build time.)",
    scope: /\.(tsx?|jsx?)$/,
    allowlist: [path.join(SRC, "lib", "env.ts")],
    pattern: /\bprocess\.env\./,
    exemptLine: (line, file) => {
      if (/\.test\.tsx?$/.test(file)) return true;
      return /process\.env\.NODE_ENV\b/.test(line) && !/process\.env\.[A-Z_]+(?<!NODE_ENV)/.test(line.replace(/process\.env\.NODE_ENV/g, ""));
    },
  },
  {
    id: "require-metadata-title",
    severity: "warn",
    description:
      "Every page under app/ should export `metadata` (so the tab title is meaningful). Suppress by adding the allowlist if intentional.",
    scope: /src\/app\/.*\/page\.tsx$/,
    allowlist: [
      path.join(SRC, "app", "page.tsx"), // root page uses default title
      path.join(SRC, "app", "cart", "page.tsx"), // client page
    ],
    custom: (content) => !/export\s+(?:const|async\s+function)\s+(?:metadata|generateMetadata)\b/.test(content),
    message: "Missing `export const metadata` or `export async function generateMetadata`.",
  },
];

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

function scopeMatches(rule, file) {
  if (rule.scope instanceof RegExp) return rule.scope.test(file);
  return rule.scope.some((g) => file.includes(g));
}

function isAllowed(rule, file) {
  return rule.allowlist?.some((a) => path.resolve(a) === path.resolve(file));
}

async function run() {
  const files = (await walk(SRC)).filter((f) => /\.(tsx?|jsx?)$/.test(f));
  const violations = [];

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    const content = await fs.readFile(file, "utf8");
    for (const rule of RULES) {
      if (!scopeMatches(rule, file)) continue;
      if (isAllowed(rule, file)) continue;

      if (rule.custom) {
        if (rule.custom(content)) {
          violations.push({
            rule,
            file: rel,
            line: 1,
            snippet: rule.message ?? rule.description,
          });
        }
        continue;
      }

      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!rule.pattern.test(line)) continue;
        if (rule.exemptLine && rule.exemptLine(line, file)) continue;
        violations.push({ rule, file: rel, line: i + 1, snippet: line.trim().slice(0, 120) });
      }
    }
  }

  const errors = violations.filter((v) => v.rule.severity === "error");
  const warnings = violations.filter((v) => v.rule.severity === "warn");

  const pad = (s, n) => s + " ".repeat(Math.max(0, n - s.length));

  if (violations.length === 0) {
    console.log("\x1b[32m✓ Standards check passed.\x1b[0m");
    process.exit(0);
  }

  console.log(
    `\nInvinity standards check — \x1b[31m${errors.length} error(s)\x1b[0m, \x1b[33m${warnings.length} warning(s)\x1b[0m\n`
  );
  const grouped = new Map();
  for (const v of violations) {
    const key = v.rule.id;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(v);
  }
  for (const [id, vs] of grouped) {
    const rule = vs[0].rule;
    const tag = rule.severity === "error" ? "\x1b[31merror\x1b[0m" : "\x1b[33mwarn\x1b[0m";
    console.log(`${tag}  ${id}`);
    console.log(`       ${rule.description}`);
    for (const v of vs) console.log(`       ${pad(v.file, 52)} :${v.line}  ${v.snippet}`);
    console.log("");
  }

  if (errors.length > 0) {
    console.log(
      "\x1b[31mBuild blocked.\x1b[0m Move the flagged values into tokens (src/tokens.ts), data files (src/data/), or env vars, then re-run."
    );
    process.exit(1);
  }
  console.log("\x1b[33mBuild allowed, but please address warnings.\x1b[0m");
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(2);
});
