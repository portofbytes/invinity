#!/usr/bin/env node
// Config inspector — prints resolved config for each integration, redacts
// secrets, and exits non-zero if validation fails.
//
// Usage:
//   npm run config:inspect                 # resolve using current process env
//   npm run config:inspect -- .env.local   # or resolve from a specific file

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);

try {
  require("tsx/cjs");
} catch {
  console.error("tsx missing — run: npm i -D tsx");
  process.exit(2);
}

async function loadEnvFile(p) {
  const abs = path.resolve(ROOT, p);
  const text = await fs.readFile(abs, "utf8");
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const k = line.slice(0, eq).trim();
    let v = line.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (process.env[k] == null || process.env[k] === "") process.env[k] = v;
  }
}

function redact(value) {
  if (!value) return "∅";
  if (value.length <= 6) return "•".repeat(value.length);
  return value.slice(0, 3) + "…" + value.slice(-3);
}

function line(label, value, secret = false) {
  const v = value == null || value === "" ? "∅" : secret ? redact(String(value)) : String(value);
  const colored = v === "∅" ? `\x1b[90m${v}\x1b[0m` : `\x1b[37m${v}\x1b[0m`;
  return `  ${label.padEnd(42)} ${colored}`;
}

async function main() {
  const fileArg = process.argv[2];
  if (fileArg) await loadEnvFile(fileArg);

  const envMod = require(path.join(ROOT, "src", "lib", "env.ts"));
  let publicEnv, commerceMode, sanityMode, emailMode, integrations;
  try {
    publicEnv = envMod.publicEnv;
    commerceMode = envMod.commerceMode;
    sanityMode = envMod.sanityMode;
    emailMode = envMod.emailMode;
    integrations = envMod.integrations;
  } catch (e) {
    console.error("\x1b[31menv validation failed\x1b[0m");
    console.error(e.message);
    process.exit(1);
  }

  const serverEnv = envMod.serverEnv();

  const ok = (s) => `\x1b[32m${s}\x1b[0m`;
  const sub = (s) => `\x1b[33m${s}\x1b[0m`;

  console.log(`\nInvinity — resolved configuration\n`);
  console.log("Core");
  console.log(line("NEXT_PUBLIC_SITE_URL", publicEnv.NEXT_PUBLIC_SITE_URL));
  console.log(line("NEXT_PUBLIC_SITE_NAME", publicEnv.NEXT_PUBLIC_SITE_NAME));
  console.log(line("NEXT_PUBLIC_CURRENCY", publicEnv.NEXT_PUBLIC_CURRENCY));
  console.log(line("NEXT_PUBLIC_AGE_MINIMUM", publicEnv.NEXT_PUBLIC_AGE_MINIMUM));
  console.log(line("NODE_ENV", serverEnv.NODE_ENV));

  console.log(`\nCommerce (Squarespace)  ${commerceMode() === "live" ? ok("[live]") : sub("[stub]")}`);
  console.log(line("NEXT_PUBLIC_SQUARESPACE_STORE_URL", publicEnv.NEXT_PUBLIC_SQUARESPACE_STORE_URL));
  console.log(line("SQUARESPACE_API_KEY", serverEnv.SQUARESPACE_API_KEY, true));
  console.log(line("resolved store url", integrations.commerce.storeUrl()));
  console.log(line("timeout (ms)", integrations.commerce.timeoutMs));

  console.log(`\nSanity  ${sanityMode() === "live" ? ok("[live]") : sub("[stub]")}`);
  console.log(line("NEXT_PUBLIC_SANITY_PROJECT_ID", publicEnv.NEXT_PUBLIC_SANITY_PROJECT_ID));
  console.log(line("NEXT_PUBLIC_SANITY_DATASET", publicEnv.NEXT_PUBLIC_SANITY_DATASET));
  console.log(line("NEXT_PUBLIC_SANITY_API_VERSION", publicEnv.NEXT_PUBLIC_SANITY_API_VERSION));
  console.log(line("SANITY_READ_TOKEN", serverEnv.SANITY_READ_TOKEN, true));
  console.log(line("SANITY_WRITE_TOKEN", serverEnv.SANITY_WRITE_TOKEN, true));
  console.log(line("api url", integrations.sanity.apiUrl()));
  console.log(line("timeout (ms)", integrations.sanity.timeoutMs));

  console.log(`\nEmail  ${emailMode() === "live" ? ok("[live]") : sub("[stub]")}`);
  console.log(line("RESEND_API_KEY", serverEnv.RESEND_API_KEY, true));
  console.log(line("RESEND_FROM", serverEnv.RESEND_FROM));
  console.log(line("api url", integrations.email.apiUrl));
  console.log(line("timeout (ms)", integrations.email.timeoutMs));

  console.log("");
}

main().catch((e) => {
  console.error(`\x1b[31m${e.message ?? e}\x1b[0m`);
  process.exit(1);
});
