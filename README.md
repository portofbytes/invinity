# Invinity

Digital sparkling maison. Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4.

## Run

```bash
cd site
npm run dev                # http://localhost:3000
npm run build              # production build (runs standards + content gates first)
npm start                  # serve production build
```

## Editing content

All product, tier, experience, and journal content lives as **validated JSON** in `content/`.
A CLI mutates those files safely — every write is re-validated by the same Zod schemas the
site imports, so you cannot leave the repo in a broken state.

```bash
npm run content:validate              # validate every content/*.json
npm run wine:list                     # table of all wines
npm run content -- wine:show <slug>   # print a wine
npm run wine:add                      # interactive prompts
npm run content -- wine:update <slug> price=49 status=available
npm run content -- wine:set-status <slug> sold-out
npm run content -- wine:remove <slug>            # asks to confirm
npm run content -- wine:remove <slug> --force
```

To extend the CLI to other entities (tiers, experiences, articles), copy the `wine:*`
pattern in `scripts/content.mjs`. All schemas are in `src/lib/schemas.ts`.

## Configuration

Environment variables are validated by Zod at startup via `src/lib/env.ts`. An invalid or
missing required value fails loudly instead of silently producing wrong URLs/links.

Copy `.env.example` to `.env.local` and fill in as needed. `NEXT_PUBLIC_*` vars are exposed
to the browser; unprefixed ones are server-only and must be read via `serverEnv()`.

## Build-time gates

Running `npm run build` runs three gates before `next build`:

### 1. Standards checker (`scripts/check-standards.mjs`)

Scans `src/` and **fails the build** on:

- hex colors outside `src/tokens.ts` / `globals.css` (or inline SVG attrs)
- hardcoded email / phone / street address (must come from `data/site.ts`)
- absolute `https://invinity.ca` URLs (must derive from `NEXT_PUBLIC_SITE_URL`)
- `console.log` / `console.debug`
- `@ts-ignore`
- raw `data:` URLs in TSX
- direct imports of integration SDKs outside `src/integrations/**`
- direct `process.env.*` reads outside `src/lib/env.ts`
- missing `metadata` export on page files (warning)

Add new rules at the bottom of the `RULES` array. ESLint mirrors the key bans via
`no-restricted-syntax` so violations also surface in the IDE.

### 2. Content validator (`scripts/content.mjs validate`)

Parses every `content/*.json` against its Zod schema. Missing required fields, wrong
types, duplicate slugs, and invalid enum values all block the build with a specific message.

### 3. Unit tests (`vitest run`)

Schema, env, rate-limit, and integration adapters each have tests. A failing test
blocks the build.

## Reliability

- **Error boundaries**: `src/app/global-error.tsx` and `src/app/error.tsx` catch render
  failures; `src/app/loading.tsx` covers async data fetches.
- **Rate limiting**: every server action goes through `src/lib/rate-limit.ts`. The
  default is an in-memory limiter keyed by client IP; swap in Redis/Upstash by
  implementing `RateLimitStore` and calling `configureRateLimitStore()` from an
  instrumentation file.
- **Dev-time a11y**: `@axe-core/react` runs only in development and logs WCAG
  violations to the browser console. Zero cost in production.

## Integration model

### Commerce — Squarespace (handoff pattern)

Squarespace is the commerce backend (products, inventory, cart, checkout, payments,
tax, shipping, order emails). Our Next.js site presents the brand and catalog; when
a customer is ready to buy, **commerce.startCheckout()** hands them to the
Squarespace-hosted shop.

Each wine in `content/wines.json` may carry:

```json
"squarespace": {
  "productSlug": "grande-cuvee-blanc-de-blancs-2018",
  "productUrl": "https://shop.invinity.ca/shop/..."
}
```

`productUrl` wins when set; otherwise the adapter builds
`${NEXT_PUBLIC_SQUARESPACE_STORE_URL}/shop/${productSlug ?? slug}`.

To go live: set `NEXT_PUBLIC_SQUARESPACE_STORE_URL=https://shop.invinity.ca` and
make sure every wine has either a `productSlug` that matches the Squarespace URL
or an explicit `productUrl`. Run `npm run config:inspect` to confirm `[live]`.

### Email — Resend via invinity.ca

All transactional email is sent via Resend. The default sender is
`house@invinity.ca`, configurable via `RESEND_FROM`. Set `RESEND_API_KEY` and
verify the domain in Resend before going live.

### CMS — Sanity (v2)

Content schemas in `src/lib/schemas.ts` map 1:1 to Sanity schema types. Replace
the JSON loaders in `src/data/*.ts` with Sanity client fetches; the Zod validation
stays as the contract boundary and the site renders unchanged.

### Imagery

Every image surface renders a tonal composition until commissioned photography
arrives. Add `media.bottle` (etc.) to a wine in JSON and the site uses `next/image`
automatically — no code change.

## Migration path (v1 → CMS)

```
v1 (now)                    v1.5                           v2
JSON file in content/  →    Sanity Studio @ /studio  →     Sanity + Shopify
Edit via CLI                Edit via Sanity UI             Wines from Shopify,
Zod validates on save       Zod validates on publish       editorial from Sanity
```

The Zod schemas in `src/lib/schemas.ts` stay constant through all three phases; they
are the contract. Swap data sources without touching components or pages.

## Structure

```
content/                # editable JSON — wines, collections, tiers, experiences, journal
src/
  app/                  # routes (App Router)
    actions/            # server actions (forms, checkout)
    global-error.tsx    # top-level error boundary
    error.tsx           # per-segment error boundary
    loading.tsx         # per-segment loading state
  components/           # shell + editorial + commerce + forms
    house-image.tsx     # next/image swap seam — photo or token-backed placeholder
  data/                 # thin loaders: read JSON, validate with Zod, export typed arrays
  integrations/         # shopify, sanity, email — the only place SDKs are imported
  lib/
    schemas.ts          # Zod schemas — the content contract
    env.ts              # typed env + integration modes
    ld.tsx              # JSON-LD helpers (Product, Event, Article, LocalBusiness…)
    rate-limit.ts       # pluggable rate limiter
  tokens.ts             # design tokens (colors, durations, easings)
  app/globals.css       # token-backed CSS custom properties + base element styles
scripts/
  check-standards.mjs   # prebuild standards gate
  content.mjs           # CRUD CLI for content
  config-inspect.mjs    # prints resolved config + integration modes
tests/                  # vitest tests live alongside source as *.test.ts
```

## All scripts

```
npm run dev            # start dev server
npm run build          # standards → content validation → tests → next build
npm start              # serve production build
npm test               # vitest run
npm run test:watch     # vitest watch mode
npm run standards      # run standards checker only
npm run content:validate
npm run wine:list
npm run wine:add
npm run content -- wine:update <slug> key=value
npm run content -- wine:set-status <slug> <status>
npm run content -- wine:remove <slug>
npm run config:inspect              # resolved env + mode per integration
```
