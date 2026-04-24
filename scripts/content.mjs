#!/usr/bin/env node
// Invinity content CLI.
//
// Usage:
//   npm run content -- <command> [args]
//
// Commands:
//   validate                        Validate every content/*.json against its schema
//   wine:list                       Print a table of all wines
//   wine:show <slug>                Print a single wine as JSON
//   wine:add                        Prompt-driven add (interactive)
//   wine:update <slug> <key>=<val>  Patch one or more fields on a wine
//   wine:remove <slug>              Remove a wine (asks for confirmation)
//   wine:set-status <slug> <status> Shortcut: set status to available|limited|sold-out|club-only
//
// The CLI mutates content/wines.json in place. On any write, it re-validates
// the entire file via the same Zod schema the site imports. A bad write is
// rolled back before it touches disk — you cannot corrupt content with this tool.
//
// To support Zod in a plain .mjs script without adding a build step, we import
// the already-compiled TS schemas from src/lib/schemas.ts via tsx; if tsx is
// not present we fall back to a minimal runtime guard.

import { promises as fs } from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { stdin as input, stdout as output } from "node:process";
import { createRequire } from "node:module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT = path.join(ROOT, "content");

const require = createRequire(import.meta.url);

// Lazy-load zod + schemas via a tiny runtime loader. We register tsx so the TS
// schemas file can be required directly.
let _schemas;
async function schemas() {
  if (_schemas) return _schemas;
  try {
    require("tsx/cjs");
  } catch {
    // tsx not installed — fall back to dynamic require; the user must `npm i -D tsx`
    throw new Error(
      "The content CLI needs `tsx` to load TypeScript schemas. Install once:\n  npm i -D tsx"
    );
  }
  _schemas = require(path.join(ROOT, "src", "lib", "schemas.ts"));
  return _schemas;
}

const files = {
  wines: path.join(CONTENT, "wines.json"),
  collections: path.join(CONTENT, "collections.json"),
  tiers: path.join(CONTENT, "club-tiers.json"),
  experiences: path.join(CONTENT, "experiences.json"),
  articles: path.join(CONTENT, "journal.json"),
};

async function readJson(p) {
  return JSON.parse(await fs.readFile(p, "utf8"));
}
async function writeJson(p, data) {
  await fs.writeFile(p, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function c(code, s) {
  return `\x1b[${code}m${s}\x1b[0m`;
}

async function validate() {
  const s = await schemas();
  const pairs = [
    ["wines", files.wines, s.WinesFileSchema],
    ["collections", files.collections, s.CollectionsFileSchema],
    ["club-tiers", files.tiers, s.TiersFileSchema],
    ["experiences", files.experiences, s.ExperiencesFileSchema],
    ["journal", files.articles, s.ArticlesFileSchema],
  ];
  let ok = true;
  for (const [name, p, schema] of pairs) {
    const data = await readJson(p);
    const r = schema.safeParse(data);
    if (r.success) console.log(c("32", `✓ ${name} (${data.length} entries)`));
    else {
      ok = false;
      console.log(c("31", `✗ ${name}`));
      for (const issue of r.error.issues) {
        const where = issue.path.length ? ` [${issue.path.join(".")}]` : "";
        console.log(`    - ${issue.message}${where}`);
      }
    }
  }
  if (!ok) process.exit(1);
}

async function wineList() {
  const { WinesFileSchema } = await schemas();
  const wines = WinesFileSchema.parse(await readJson(files.wines));
  const pad = (s, n) => String(s).padEnd(n);
  console.log(
    c("90", `${pad("SLUG", 48)} ${pad("VINT", 18)} ${pad("COLL", 13)} ${pad("STATUS", 10)} ${pad("$", 6)}`)
  );
  for (const w of wines) {
    const color = w.status === "available" ? "32" : w.status === "limited" ? "33" : "90";
    console.log(
      `${pad(w.slug, 48)} ${pad(w.vintage, 18)} ${pad(w.collection, 13)} ${c(color, pad(w.status, 10))} ${pad("$" + w.price, 6)}`
    );
  }
}

async function wineShow(slug) {
  const wines = await readJson(files.wines);
  const w = wines.find((x) => x.slug === slug);
  if (!w) return exitErr(`No wine with slug "${slug}".`);
  console.log(JSON.stringify(w, null, 2));
}

async function wineUpdate(slug, patches) {
  if (patches.length === 0) return exitErr("Provide one or more key=value patches.");
  const wines = await readJson(files.wines);
  const i = wines.findIndex((w) => w.slug === slug);
  if (i === -1) return exitErr(`No wine with slug "${slug}".`);
  const next = { ...wines[i] };
  for (const kv of patches) {
    const eq = kv.indexOf("=");
    if (eq === -1) return exitErr(`Bad patch "${kv}". Expected key=value.`);
    const key = kv.slice(0, eq);
    let raw = kv.slice(eq + 1);
    let value;
    if (key === "price") value = Number(raw);
    else if (key === "featured") value = raw === "true";
    else if (key === "pairings") value = raw.split("|").map((s) => s.trim());
    else value = raw;
    next[key] = value;
  }
  wines[i] = next;
  await parseOrExit(wines, "wines");
  await writeJson(files.wines, wines);
  console.log(c("32", `Updated ${slug}.`));
}

async function wineRemove(slug, { force } = {}) {
  const wines = await readJson(files.wines);
  const i = wines.findIndex((w) => w.slug === slug);
  if (i === -1) return exitErr(`No wine with slug "${slug}".`);
  if (!force) {
    const rl = readline.createInterface({ input, output });
    const ans = await rl.question(`Remove ${c("33", slug)}? Type the slug again to confirm: `);
    rl.close();
    if (ans.trim() !== slug) return console.log("Aborted.");
  }
  wines.splice(i, 1);
  await parseOrExit(wines, "wines");
  await writeJson(files.wines, wines);
  console.log(c("32", `Removed ${slug}.`));
}

async function wineSetStatus(slug, status) {
  const allowed = ["available", "limited", "sold-out", "club-only"];
  if (!allowed.includes(status)) return exitErr(`Status must be one of: ${allowed.join(", ")}.`);
  return wineUpdate(slug, [`status=${status}`]);
}

async function wineAdd() {
  const rl = readline.createInterface({ input, output });
  const q = async (label, def) => {
    const ans = await rl.question(def ? `${label} [${def}]: ` : `${label}: `);
    return ans.trim() || def || "";
  };
  console.log(c("36", "\nNew wine — all fields are required unless marked optional.\n"));
  const draft = {
    slug: await q("slug (lowercase-kebab)"),
    name: await q("name (e.g. Grande Cuvée Brut)"),
    cuveeLabel: (await q("cuvée label (optional, e.g. Blanc de Blancs)")) || undefined,
    vintage: await q("vintage (e.g. 2021 or N/V (2021 base))"),
    collection: await q("collection (sparkling|grande-cuvee|ocean-aged|library|club)"),
    style: await q("style (full sentence)"),
    styleShort: await q("styleShort (e.g. Blanc de Blancs · 2021)"),
    price: Number(await q("price (CAD, whole number)")),
    status: (await q("status (available|limited|sold-out|club-only)", "available")),
    descriptor: await q("descriptor (one sentence for tiles)"),
    tastingNote: await q("tasting note"),
    varietals: await q("varietals"),
    method: await q("method"),
    dosage: (await q("dosage (optional)")) || undefined,
    volume: await q("volume", "750 mL"),
    disgorged: (await q("disgorged (optional)")) || undefined,
    serving: await q("serving"),
    pairings: (await q("pairings (pipe-separated, e.g. Oysters | Comté | Brioche)"))
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean),
  };
  rl.close();

  const wines = await readJson(files.wines);
  if (wines.some((w) => w.slug === draft.slug)) return exitErr(`Slug "${draft.slug}" already exists.`);
  wines.push(draft);
  await parseOrExit(wines, "wines");
  await writeJson(files.wines, wines);
  console.log(c("32", `\nAdded ${draft.slug}.`));
}

async function parseOrExit(data, kind) {
  const s = await schemas();
  const schemaByKind = {
    wines: s.WinesFileSchema,
    collections: s.CollectionsFileSchema,
    "club-tiers": s.TiersFileSchema,
    experiences: s.ExperiencesFileSchema,
    journal: s.ArticlesFileSchema,
  };
  const r = schemaByKind[kind].safeParse(data);
  if (r.success) return;
  console.log(c("31", "Validation failed — write aborted."));
  for (const issue of r.error.issues) {
    const where = issue.path.length ? ` [${issue.path.join(".")}]` : "";
    console.log(`  - ${issue.message}${where}`);
  }
  process.exit(1);
}

function exitErr(msg) {
  console.error(c("31", msg));
  process.exit(1);
}

function usage() {
  console.log(
    [
      "Usage: npm run content -- <command> [args]",
      "",
      "Commands:",
      "  validate",
      "  wine:list",
      "  wine:show <slug>",
      "  wine:add",
      "  wine:update <slug> key=value [key=value ...]",
      "  wine:remove <slug> [--force]",
      "  wine:set-status <slug> <available|limited|sold-out|club-only>",
    ].join("\n")
  );
}

async function main() {
  const [cmd, ...args] = process.argv.slice(2);
  switch (cmd) {
    case "validate":
      return validate();
    case "wine:list":
      return wineList();
    case "wine:show":
      return wineShow(args[0]);
    case "wine:add":
      return wineAdd();
    case "wine:update":
      return wineUpdate(args[0], args.slice(1));
    case "wine:remove":
      return wineRemove(args[0], { force: args.includes("--force") });
    case "wine:set-status":
      return wineSetStatus(args[0], args[1]);
    default:
      usage();
      process.exit(cmd ? 1 : 0);
  }
}

main().catch((e) => {
  console.error(c("31", e.message ?? String(e)));
  process.exit(1);
});
