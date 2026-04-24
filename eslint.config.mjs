import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const BAN = [
  {
    selector: "Literal[value=/#[0-9A-Fa-f]{3,8}/]",
    message: "Hex colors must come from src/tokens.ts. Import { color } from '@/tokens'.",
  },
  {
    selector: "Literal[value=/sparks@invinity\\./]",
    message: "Use site.email from @/data/site instead of inlining the email.",
  },
  {
    selector: "Literal[value=/10755 Madrona/i]",
    message: "Use site.address from @/data/site instead of inlining the address.",
  },
  {
    selector: "Literal[value=/https?:\\/\\/(?:www\\.)?invinity\\./]",
    message: "Derive absolute URLs from NEXT_PUBLIC_SITE_URL — do not inline invinity.ca.",
  },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/tokens.ts", "src/data/site.ts", "src/app/sitemap.ts", "src/app/robots.ts"],
    rules: {
      "no-restricted-syntax": ["error", ...BAN],
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "scripts/**",
  ]),
]);

export default eslintConfig;
