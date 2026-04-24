import type { Wine } from "@/data/wines";
import { color } from "@/tokens";

type Style = {
  glass: [string, string, string];
  foil: string;
  label: string;
  labelInk: string;
  labelAccent: string;
};

const STYLES: Record<Wine["collection"], Style> = {
  "grande-cuvee": {
    glass: [color.bottle, color.bottleDark, color.bottleLight],
    foil: color.champagne,
    label: color.paper,
    labelInk: color.graphite,
    labelAccent: color.champagne,
  },
  sparkling: {
    glass: [color.sparklingGlassMid, color.sparklingGlassDark, color.sparklingGlassLight],
    foil: color.sparklingFoil,
    label: color.chalk,
    labelInk: color.graphite,
    labelAccent: color.oxide,
  },
  "ocean-aged": {
    glass: [color.oceanGlassMid, color.oceanGlassDark, color.oceanGlassLight],
    foil: color.stone,
    label: color.stone,
    labelInk: color.bottle,
    labelAccent: color.bottle,
  },
  library: {
    glass: [color.bottle, color.bottleDark, color.bottleLight],
    foil: color.champagne,
    label: color.paper,
    labelInk: color.graphite,
    labelAccent: color.champagne,
  },
  club: {
    glass: [color.clubGlassMid, color.clubGlassDark, color.clubGlassLight],
    foil: color.clubFoil,
    label: color.graphite,
    labelInk: color.paper,
    labelAccent: color.champagne,
  },
};

function roseTint(style: Style, isRose: boolean): Style {
  if (!isRose) return style;
  return {
    ...style,
    glass: [color.roseGlassDark, color.roseGlassMid, color.roseGlassLight],
    foil: color.champagne,
  };
}

export function BottleArt({
  wine,
  width = "72%",
  showLabel = true,
  flat = false,
}: {
  wine: Pick<Wine, "collection" | "cuveeLabel" | "name" | "vintage" | "styleShort">;
  width?: string;
  showLabel?: boolean;
  flat?: boolean;
}) {
  const isRose = (wine.cuveeLabel ?? "").toLowerCase().includes("ros");
  const style = roseTint(STYLES[wine.collection], isRose);
  const [g1, g2, g3] = style.glass;
  const id = `bottle-${wine.collection}-${isRose ? "rose" : "blanc"}`;

  return (
    <svg
      viewBox="0 0 200 520"
      width={width}
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      style={{ display: "block", filter: flat ? "none" : "drop-shadow(0 18px 28px rgba(20,25,22,0.28))" }}
    >
      <defs>
        <linearGradient id={`${id}-body`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={g2} />
          <stop offset="0.25" stopColor={g1} />
          <stop offset="0.5" stopColor={g3} />
          <stop offset="0.75" stopColor={g1} />
          <stop offset="1" stopColor={g2} />
        </linearGradient>
        <linearGradient id={`${id}-foil`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={shade(style.foil, -0.3)} />
          <stop offset="0.5" stopColor={style.foil} />
          <stop offset="1" stopColor={shade(style.foil, -0.25)} />
        </linearGradient>
        <radialGradient id={`${id}-highlight`} cx="0.35" cy="0.25" r="0.5">
          <stop offset="0" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* neck & body */}
      <path
        d="M82 18 Q82 14 86 14 H114 Q118 14 118 18 V66 Q118 76 126 92 Q140 120 140 160 V460 Q140 488 120 492 H80 Q60 488 60 460 V160 Q60 120 74 92 Q82 76 82 66 Z"
        fill={`url(#${id}-body)`}
      />
      {/* highlight */}
      <path
        d="M82 18 Q82 14 86 14 H114 Q118 14 118 18 V66 Q118 76 126 92 Q140 120 140 160 V460 Q140 488 120 492 H80 Q60 488 60 460 V160 Q60 120 74 92 Q82 76 82 66 Z"
        fill={`url(#${id}-highlight)`}
      />
      {/* foil cap */}
      <rect x="82" y="14" width="36" height="72" fill={`url(#${id}-foil)`} />
      <rect x="82" y="82" width="36" height="6" fill={shade(style.foil, -0.4)} />

      {/* label */}
      {showLabel && (
        <g>
          <rect x="64" y="230" width="72" height="160" fill={style.label} />
          <rect x="64" y="230" width="72" height="2" fill={shade(style.label, -0.25)} />
          <rect x="64" y="388" width="72" height="2" fill={shade(style.label, -0.25)} />
          <text
            x="100"
            y="258"
            textAnchor="middle"
            fontFamily="var(--font-display-serif, 'Cormorant Garamond', serif)"
            fontSize="14"
            letterSpacing="3"
            fill={style.labelAccent}
            fontWeight={500}
          >
            INVINITY
          </text>
          <line x1="80" y1="270" x2="120" y2="270" stroke={style.labelAccent} strokeWidth="0.6" />
          <text
            x="100"
            y="295"
            textAnchor="middle"
            fontFamily="var(--font-display-serif, 'Cormorant Garamond', serif)"
            fontSize="12"
            fill={style.labelInk}
          >
            {truncate(wine.name, 16)}
          </text>
          {wine.cuveeLabel && (
            <text
              x="100"
              y="312"
              textAnchor="middle"
              fontFamily="var(--font-display-serif, 'Cormorant Garamond', serif)"
              fontStyle="italic"
              fontSize="11"
              fill={style.labelInk}
              opacity="0.85"
            >
              {wine.cuveeLabel}
            </text>
          )}
          <text
            x="100"
            y="346"
            textAnchor="middle"
            fontFamily="var(--font-text-sans, Inter, sans-serif)"
            fontSize="7"
            letterSpacing="2"
            fill={style.labelInk}
            opacity="0.7"
          >
            {wine.collection === "ocean-aged" ? "OCEAN AGED · SAANICH PENINSULA" : "SAANICH PENINSULA · BC"}
          </text>
          <text
            x="100"
            y="378"
            textAnchor="middle"
            fontFamily="var(--font-display-serif, 'Cormorant Garamond', serif)"
            fontSize="18"
            fill={style.labelAccent}
          >
            {yearOnly(wine.vintage)}
          </text>
        </g>
      )}

      {/* base */}
      <ellipse cx="100" cy="494" rx="40" ry="4" fill="rgba(0,0,0,0.25)" />
    </svg>
  );
}

function truncate(s: string, n: number) {
  return s.length <= n ? s : s.slice(0, n - 1) + "…";
}
function yearOnly(v: string) {
  const m = v.match(/\d{4}/);
  return m ? m[0] : v;
}
function shade(hex: string, amount: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const apply = (c: number) => Math.max(0, Math.min(255, Math.round(c + c * amount)));
  return `#${[apply(r), apply(g), apply(b)].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}
