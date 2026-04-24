# Invinity — Tech Stack & Key Features

## Tech stack

### Framework & language
- **Next.js 16.2** — App Router, Turbopack, server components + server actions
- **React 19**
- **TypeScript 5** — strict mode, no `@ts-ignore` permitted
- **Node 20.9+**

### Styling & UI
- **Tailwind CSS v4** — utility delivery layer only
- **CSS custom properties** — the design system lives in tokens, not utilities
- **Cormorant Garamond + Inter** — via `next/font/google` (self-hosted, zero-layout-shift)
- **Radix UI** — `@radix-ui/react-dialog`, `@radix-ui/react-accordion` for a11y-correct primitives
- **Motion (Framer)** — page transitions, cinematic reveals

### Data & validation
- **Zod v4** — single contract for content schemas, env vars, form payloads, API boundaries
- **JSON content files** in `/content` — editable without TypeScript knowledge

### Commerce / CMS / Email (adapter-backed)
- **Squarespace — URL-handoff commerce.** No SDK, no storefront API; the Next.js catalog links each "Buy" button to the wine's Squarespace product URL. Adapter returns a URL, the browser navigates. Path exists for a future migration to real on-site checkout (Stripe/Snipcart).
- **Sanity Content Lake** — HTTP query seam
- **Resend** — transactional email
- All three run in stub mode when env vars are absent; flipping one switch moves them to live.

### Deployment & runtime
- **Cloudflare Workers** — production runtime; full Next.js server rendering (not static export)
- **OpenNext for Cloudflare** (`@opennextjs/cloudflare`) — build adapter that bundles the Next.js server into a Worker with static assets on the Workers assets binding
- **GitHub Actions** — CI/CD pipeline; every push to `main` runs the four-gate build then `wrangler deploy`
- **Live at:** `https://invinity.sparkling-wine.workers.dev/` (custom `invinity.ca` planned)

### Tooling
- **ESLint 9** with `eslint-config-next` + custom `no-restricted-syntax` rules
- **Vitest 4** + `@vitest/coverage-v8`
- **tsx** — runs TS directly from Node scripts (no build step for CLIs)
- **Wrangler** — Cloudflare Workers CLI; also used locally for `wrangler dev` previews
- **@axe-core/react** — dev-time a11y scanner (zero prod cost)
- **server-only** — prevents server-only modules leaking to the client bundle

### Auxiliary
- `motion`, `zod`, custom CLI scripts in `.mjs`, `scripts/deploy.{sh,ps1}` and `scripts/bootstrap.ps1` for one-shot deploys

---

## Key features

### Site surface
- **40+ routes**, all pre-rendered except `/search`
- Full design system: chalk/paper/stone/bottle/champagne palette, restrained type scale, square corners, hairline rules, tonal surfaces, grain texture
- Global shell: fixed-height sticky header with scroll compaction, full-screen nav panel, age gate, cart drawer, dismissible announcement strip, cookie banner
- Editorial: `Hero` (4 variants), `ChapterIntro`, `SplitEditorial`, `FullBleed`, `PullQuote`, `Timeline`, `FounderProfile`, `ConciergeContact`
- Commerce: `ProductTile`, `ProductGrid`, `ProductPurchase` (sticky on desktop), `Gallery` with 4-view lightbox + paisley-framed bottle portrait, `WaitlistPanel` (two-step Radix dialog), `FulfillmentSelector` (pickup vs ship)
- Forms: Release list, Experience request, Contact, Waitlist — all via React transitions + server actions
- Motion: page crossfade + stagger, per-element reveal via IntersectionObserver, reduced-motion respected throughout
- Decorative category motifs (`SparklingMotif`, `GrandeCuveeMotif`, `OceanAgedMotif`, `ClubMotif`, `FluteMotif`, `PaisleyFrame`) — stroke-based gold line-art drawn from reference imagery, rendered via SVG, tokens-driven

### Content model
- Wines, collections, club tiers (Dungeness/Chinook/Orca), experiences, journal articles live as validated JSON in `/content`
- Each has a Zod schema in `src/lib/schemas.ts` — the single contract as data migrates to Sanity
- CLI for CRUD: `npm run wine:list | wine:add | wine:update | wine:set-status | wine:remove`
- Every write re-validates before touching disk — bad edits cannot corrupt the repo
- `media` field on `Wine` is optional: add a photo in JSON → site uses it; leave empty → token-backed SVG bottle art renders

### Configuration
- Typed env via Zod in `src/lib/env.ts`; all `process.env` reads forbidden outside this file
- Cross-field validation: half-configured states (e.g. Resend key without sender) fail at startup
- Integration mode is **derived**, not set — `commerceMode()`, `sanityMode()`, `emailMode()` return `"live" | "stub"` based on what env provides
- `npm run config:inspect` prints resolved config per integration with secrets redacted

### Integration layer
- `src/integrations/{commerce,sanity,email}.ts` — only place SDKs may be imported
- Each exports a typed adapter with identical surface in stub and live mode
- Endpoints, API versions, and timeouts all read from `integrations` config — never hardcoded
- Standards rule fails the build if anyone imports `@sanity/*` or `resend` outside `src/integrations/**`

### Server actions (server-side by design)
- `src/app/actions/forms.ts` — subscribe, experience request, contact, waitlist
- `src/app/actions/checkout.ts` — cart → Squarespace URL handoff
- Every action: Zod-validates input, passes through the rate limiter, delegates to an adapter, returns a discriminated result type
- Run on Cloudflare Workers at request time (not statically exported)

### Reliability
- Rate limiting on every server action — in-memory default, Redis-ready `RateLimitStore` interface; will move to Cloudflare KV when traffic warrants
- Three error boundaries: `global-error.tsx`, route `error.tsx`, `loading.tsx`
- 19 unit tests covering schemas, env validation, rate limit, and adapter contracts
- **Build gates** — standards → content validation → tests → `next build` → OpenNext Cloudflare bundle. Any one failing blocks deploy.

### Accessibility (WCAG 2.2 AA baseline)
- Radix primitives for every dialog, accordion, focus trap
- Skip link, visible `focus-visible` rings, landmark roles, proper heading hierarchy
- `prefers-reduced-motion` disables all reveal animations and Radix animations
- `@axe-core/react` runs only in dev, logs violations to console as you build

### SEO / machine readability
- `Organization` + `Winery` (LocalBusiness) emitted site-wide
- `Product` + `Offer` on every PDP with correct availability mapping
- `Event` on every experience detail
- `Article` on every journal post
- `BreadcrumbList` on deep pages
- `sitemap.xml`, `robots.txt`, generated OG image — all from single-source config
- `metadataBase` driven by env

### Standards enforcement (prebuild)
Build is blocked on:
- hex colors outside `tokens.ts` (inline SVG attrs too)
- hardcoded email / phone / address / `invinity.ca` URLs
- `console.log`, `@ts-ignore`, raw `data:` URLs
- direct `process.env.*` reads outside `src/lib/env.ts`
- direct integration SDK imports outside `src/integrations/**`
- invalid content JSON
- failing tests

### Developer ergonomics
- Hot reload via Turbopack
- Dev-server binds `-H 0.0.0.0` for LAN testing
- `tsx` lets CLIs import TS schemas directly, no compilation step
- `wrangler dev` gives a local Worker preview that mirrors production
- One-shot deploy from any machine: `bash scripts/deploy.sh` (Unix/WSL) or `powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1` (Windows)
- Bootstrap URL for a fresh machine: `iwr https://raw.githubusercontent.com/portofbytes/invinity/main/scripts/bootstrap.ps1 | iex`
- Clear migration path: JSON → Sanity (content), URL handoff → Stripe/Snipcart (commerce). The Zod contract stays constant through all phases.

---

## One-sentence summary

A Next.js 16 + React 19 + TypeScript maison-grade storefront with Zod-validated content, Radix-backed a11y primitives, adapter-isolated Squarespace/Sanity/Resend integrations, rate-limited server actions, and a five-gate build pipeline (standards → content → tests → `next build` → OpenNext Cloudflare bundle) running in production on Cloudflare Workers with GitHub Actions CI/CD.

---

## Scripts — full reference

### Day-to-day development

| Command | What it does |
|---|---|
| `npm run dev` | Next.js dev server on `http://localhost:3000` with Turbopack. Binds `0.0.0.0` for LAN testing. Hot reload, full server actions. |
| `npm run build` | Production Next.js build (runs prebuild gates first). Output in `.next/`. Doesn't include the OpenNext Cloudflare bundle — use `cf:build` for that. |
| `npm run start` | Serve the `.next/` build locally on port 3000. Used for smoke-testing a prod build on your machine. |
| `npm run lint` | ESLint 9 over all source files. |
| `npm run test` | Vitest 4, run-once. |
| `npm run test:watch` | Vitest 4, watch mode. Use while iterating on logic. |

### Build gates (prebuild — run automatically before `npm run build`)

These run in order; any failure blocks the build.

| Command | What it does |
|---|---|
| `npm run standards` | Custom source linter (`scripts/check-standards.mjs`). Rejects hex colors outside `tokens.ts`, hardcoded emails/URLs, `console.log`, `@ts-ignore`, direct `process.env.*` reads, integration SDK imports outside `src/integrations/**`. |
| `npm run content:validate` | Validates every JSON file in `/content/` against its Zod schema in `src/lib/schemas.ts`. |
| `npm run test` | The 19-test unit suite (schemas, env, rate limit, adapter contracts). |

The actual `prebuild` target chains all three: `npm run standards && npm run content:validate && npm test`. Running any of them standalone is useful while iterating.

### Content CRUD (wines and friends)

These read/write `content/*.json` files with Zod validation on every write.

| Command | What it does |
|---|---|
| `npm run wine:list` | Prints all wines as a table (slug, vintage, status, price). |
| `npm run wine:add` | Interactive prompt to add a new wine. Validates before saving. |
| `npm run content` | Generic content CLI — `wine:update`, `wine:set-status`, `wine:remove`, `validate`, etc. Run it with no args to see subcommands. |
| `npm run content:validate` | Alias of `node scripts/content.mjs validate`. |

### Configuration inspection

| Command | What it does |
|---|---|
| `npm run config:inspect` | Prints resolved env + integration config with **secrets redacted**. Shows which adapters are in `live` vs `stub` mode and why. Safe to share output. |

### Cloudflare deploy — OpenNext

| Command | What it does |
|---|---|
| `npm run cf:build` | Runs `next build` then `opennextjs-cloudflare build`. Produces `.open-next/worker.js` and `.open-next/assets/` — ready to deploy. |
| `npm run cf:preview` | Build + run the Worker locally via Wrangler. Gives you a production-equivalent preview on `http://localhost:8787`. Use before pushing if you touched anything server-side. |
| `npm run cf:deploy` | Build + `wrangler deploy`. Pushes the Worker to Cloudflare directly from your machine, bypassing GitHub Actions. Useful for hotfixes; normal path is `git push`. |

### One-shot deploy (sync repo secrets + push + watch CI)

| Script | Use from |
|---|---|
| `bash scripts/deploy.sh` | Linux, macOS, WSL. |
| `powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1` | Windows (cmd or PowerShell). |
| `iwr https://raw.githubusercontent.com/portofbytes/invinity/main/scripts/bootstrap.ps1 \| iex` | Any fresh Windows machine — clones the repo, copies `deploy.env.example`, opens Notepad to fill it in, then runs `deploy.ps1`. |

What they do (identical behavior in all three):

1. Verify `git`, `gh`, `node` are installed; `gh auth status` must be OK.
2. Init git repo if missing; commit any pending changes.
3. Create the GitHub repo (if it doesn't exist) and push.
4. Sync every key from `scripts/deploy.env` into GitHub Actions **secrets** (sensitive: tokens, API keys) and **variables** (public: site URL, analytics ID, email addresses).
5. `git push origin main` → GitHub Actions takes over.

`scripts/deploy.env` is **gitignored**. It never gets committed. Secrets flow from local env → encrypted GitHub secrets → Actions job at runtime; they never sit in a file that leaves your machine.

### CI/CD — what runs on push

`.github/workflows/deploy.yml` is triggered on every push to `main`:

1. **Checkout** + **setup Node 20** + `npm ci`.
2. **Build (OpenNext for Cloudflare)** — runs `npm run cf:build`, which runs the full prebuild gate chain (`standards → content:validate → vitest → next build`) plus `opennextjs-cloudflare build`. Any failure stops the deploy.
3. **Deploy to Cloudflare Workers** — `npx wrangler deploy`, authenticated by `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` from repo secrets.

### Deploy — from any machine

**First time on a new machine:**

```bash
# one-time:
#   - install git, gh, node 20+
#   - gh auth login

git clone https://github.com/portofbytes/invinity.git
cd invinity
cp scripts/deploy.env.example scripts/deploy.env
# edit scripts/deploy.env — GITHUB_REPO, CLOUDFLARE_ACCOUNT_ID,
# CLOUDFLARE_API_TOKEN at minimum

bash scripts/deploy.sh   # or: powershell -File scripts\deploy.ps1
```

**Every day after:**

```bash
git push          # Actions builds + deploys automatically
```

**Watching a deploy:**

```bash
gh run watch --repo portofbytes/invinity
gh run view --log-failed --repo portofbytes/invinity   # on failure
```

**Hotfix without CI (skip Actions, deploy direct):**

```bash
npm run cf:deploy
```

---

## Configuration — what's set and what's missing

### ✅ Currently live
- Cloudflare Workers deploy pipeline (GitHub → Actions → wrangler)
- Account ID + API token as repo secrets
- All 40+ routes rendering on `invinity.sparkling-wine.workers.dev`
- Squarespace "Buy" handoff (no shop configured yet, so links fall through to the shop root)

### ⚠ Still in stub mode — needs setup to "really work"

| Feature | What to do | Where |
|---|---|---|
| **Real email delivery** | Sign up at [resend.com](https://resend.com) (free: 3000/mo). Verify `invinity.ca` domain (SPF/DKIM records at your DNS). Create an API key. | Add `RESEND_API_KEY` as a **secret**, plus `EMAIL_FROM=house@invinity.ca` + `EMAIL_TO_HOUSE=...` as **variables** at https://github.com/portofbytes/invinity/settings/secrets/actions |
| **Squarespace product links** | Create your Squarespace shop. For each wine, paste its product URL into `content/wines.json` under `squarespace.productUrl`. | `content/wines.json` |
| **Sanity CMS** (when JSON becomes limiting) | Create a Sanity project at [sanity.io](https://www.sanity.io). Copy project ID + read token. | Repo secrets: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_READ_TOKEN` |
| **Custom domain `invinity.ca`** | Add the domain in Cloudflare → Workers & Pages → invinity → Settings → Domains & Routes. Point nameservers at Cloudflare (easiest) or add A records. | Cloudflare dashboard |
| **Analytics** | Pick a provider (Plausible, Fathom, or GA4). Add the script ID. | Repo variable: `NEXT_PUBLIC_ANALYTICS_ID` |

### 📦 Content still to fill

- **Bottle photos** — each wine in `content/wines.json` can have a `media.bottle` object pointing at an image URL. Without it, procedural SVG bottle art renders.
- **Journal articles** — seed posts are in place; replace with real editorial when ready.
- **Experience copy** — drafts populated, review for voice before launch.

---

## Roadmap — near-term

1. **Resend live.** Single secret + domain verification. Forms start delivering real email. Biggest single unlock.
2. **Custom domain `invinity.ca` on Cloudflare.** DNS cutover + SSL (automatic). Replaces the workers.dev URL.
3. **Squarespace product URLs** filled in across `content/wines.json`. "Buy" buttons become real handoffs.
4. **Bottle photography** added to `content/wines.json` for the 8 wines.
5. **Analytics** — privacy-respecting (Plausible/Fathom), one script line.
6. **Rate limit store → Cloudflare KV.** In-memory default loses state on Worker cold start; a KV binding makes rate limits durable. Needed before any real traffic.

## Roadmap — medium-term (Phase C: real on-site checkout)

When Squarespace handoff feels limiting:

1. **Stripe (or Snipcart).** Replace the commerce adapter's `startCheckout()` to return a Stripe Checkout Session URL. No page changes needed.
2. **BC DTC-alcohol compliance** — age verification at checkout, delivery jurisdiction rules, carrier integration.
3. **Sanity as content backend.** Swap the `wines` read from JSON files to Sanity queries. The Zod schema is shared — content shape stays identical.
4. **Observability** — Cloudflare Workers Analytics Engine or external (Sentry, Axiom) for error tracking and latency.

---

## Structure

```
site/
├── .github/workflows/deploy.yml   # CI/CD: build + Cloudflare deploy on push
├── content/                        # JSON content (wines, tiers, experiences, etc.)
├── open-next.config.ts             # OpenNext adapter config
├── wrangler.jsonc                  # Cloudflare Worker config
├── public/                         # static assets
├── scripts/
│   ├── deploy.sh / deploy.ps1      # one-shot deploy (sync secrets + push)
│   ├── bootstrap.ps1               # curlable first-time-machine deploy
│   ├── check-standards.mjs         # prebuild gate: source linting beyond ESLint
│   ├── content.mjs                 # content CRUD + validation CLI
│   └── deploy.env.example          # template for per-machine config
└── src/
    ├── app/
    │   ├── actions/                # server actions (forms, checkout)
    │   ├── globals.css             # CSS custom properties + base styles
    │   ├── [routes]/               # 40+ page routes
    │   ├── layout.tsx, page.tsx
    │   ├── sitemap.ts, robots.ts, opengraph-image.tsx
    │   └── error.tsx, global-error.tsx, loading.tsx, not-found.tsx
    ├── components/                 # UI: sections, product, gallery, decoratives, etc.
    ├── data/                       # typed loaders that read /content
    ├── integrations/               # adapters: commerce, sanity, email
    ├── lib/                        # env, schemas, rate limit, LD-JSON helpers
    └── tokens.ts                   # design-system color palette (only hex source)
```
