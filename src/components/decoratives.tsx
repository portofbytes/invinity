// Decorative motifs — four category flourishes in an engraved, line-art
// style drawn to match the provided reference imagery (gold linework on
// cream, organic paisley/vine shapes, fine parallel strokes).
//
// Each motif is stroke-only, anchored to a corner, and renders at a warm
// gold tone by default. Opacity stays subtle (user-tuned); density has been
// increased so the motif reads as a flourish rather than a faint trace.

import type { Wine } from "@/lib/schemas";
import { color } from "@/tokens";

type Anchor = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type MotifProps = {
  anchor?: Anchor;
  size?: number;
  opacity?: number;
  tone?: "gold" | "champagne" | "bottle" | "graphite" | "chalk";
  className?: string;
  style?: React.CSSProperties;
};

function anchorStyle(anchor: Anchor, size: number): React.CSSProperties {
  const base: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    pointerEvents: "none",
    maxWidth: "38vw",
  };
  switch (anchor) {
    case "top-left":     return { ...base, top: 0, left: 0 };
    case "top-right":    return { ...base, top: 0, right: 0, transform: "scale(-1, 1)" };
    case "bottom-left":  return { ...base, bottom: 0, left: 0, transform: "scale(1, -1)" };
    case "bottom-right": return { ...base, bottom: 0, right: 0, transform: "scale(-1, -1)" };
  }
}

function toneColor(tone: MotifProps["tone"]) {
  switch (tone) {
    case "champagne": return "var(--champagne)";
    case "bottle":    return "var(--bottle)";
    case "graphite":  return "var(--graphite)";
    case "chalk":     return "var(--chalk)";
    case "gold":
    default:          return "var(--gold-leaf)";
  }
}

// ---------------------------------------------------------------------------
// Sparkling — rising bubble streams, sparkle stars, airy vine curls.
// Denser: six streams, scattered sparkle clusters, a vine scroll at the top.
// ---------------------------------------------------------------------------
export function SparklingMotif({ anchor = "top-left", size = 360, opacity = 0.28, tone, className, style }: MotifProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 320 400"
      className={className}
      style={{ ...anchorStyle(anchor, size), height: Math.round(size * 1.25), opacity, color: toneColor(tone), ...style }}
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* Six rising streams at varied tempos */}
        {[
          { x: 40,  d: "M40,400 C32,340 56,300 42,250 C30,206 52,170 40,120" },
          { x: 84,  d: "M84,400 C76,340 98,300 84,250 C72,210 94,170 82,122" },
          { x: 128, d: "M128,400 C122,338 144,296 130,244 C116,200 138,164 124,116" },
          { x: 170, d: "M170,400 C162,340 184,300 170,248 C158,206 180,170 166,122" },
          { x: 216, d: "M216,400 C210,340 232,304 218,252 C206,210 228,172 214,124" },
          { x: 260, d: "M260,400 C252,340 274,300 260,252 C248,210 268,172 254,124" },
        ].map((s, i) => (
          <path key={i} d={s.d} strokeWidth={0.6 + (i % 3) * 0.2} opacity={0.55 + (i % 3) * 0.15} />
        ))}

        {/* Dense bubble field */}
        {(() => {
          const bubbles = [
            [40, 368, 1.8], [40, 332, 2.6], [40, 290, 2], [40, 246, 3.2], [40, 206, 1.6], [40, 164, 2.4], [40, 124, 1.8],
            [84, 360, 2.2], [84, 318, 1.4], [84, 276, 2.8], [84, 232, 1.6], [84, 188, 2.4], [84, 148, 1.6],
            [128, 372, 1.6], [128, 328, 2.6], [130, 284, 3], [128, 240, 1.8], [130, 198, 2.2], [128, 156, 1.4],
            [170, 364, 2], [170, 322, 1.6], [170, 280, 2.6], [168, 236, 3.2], [170, 194, 1.8], [170, 152, 2.2],
            [216, 356, 1.6], [216, 312, 2.2], [214, 268, 1.4], [216, 224, 2.8], [216, 180, 1.6], [218, 138, 2.4],
            [260, 368, 2], [260, 326, 1.6], [260, 284, 2.4], [260, 240, 1.8], [260, 196, 3], [258, 154, 1.6],
          ] as const;
          return bubbles.map(([cx, cy, r], i) => (
            <circle key={`b${i}`} cx={cx} cy={cy} r={r} strokeWidth="0.5" />
          ));
        })()}

        {/* Sparkle asterisks, grouped where streams meet */}
        <g strokeWidth="0.7" opacity="0.8">
          <Sparkle x={100} y={60} />
          <Sparkle x={172} y={90} s={0.8} />
          <Sparkle x={238} y={54} />
          <Sparkle x={60} y={96} s={0.7} />
          <Sparkle x={208} y={160} s={0.8} />
          <Sparkle x={146} y={180} s={0.7} />
          <Sparkle x={272} y={110} s={0.9} />
        </g>

        {/* Small vine scroll cresting at top */}
        <path
          d="M44,92 C60,70 88,66 100,82 C112,100 96,118 80,112 C68,108 62,94 76,88"
          strokeWidth="0.7"
          opacity="0.7"
        />
        <path
          d="M226,100 C240,78 268,76 278,92 C288,110 268,124 254,116 C244,110 240,96 252,92"
          strokeWidth="0.7"
          opacity="0.7"
        />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Grande Cuvée — formal baroque flourish with layered parallel engraving
// strokes, two volutes, an ornamental central form, scattered leaves.
// ---------------------------------------------------------------------------
export function GrandeCuveeMotif({ anchor = "top-right", size = 380, opacity = 0.28, tone, className, style }: MotifProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 400"
      className={className}
      style={{ ...anchorStyle(anchor, size), opacity, color: toneColor(tone), ...style }}
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* Outer S-curves with a parallel family for engraving feel */}
        <path d="M20,40 C90,50 130,100 150,168 C172,240 216,290 320,314" strokeWidth="1.1" />
        <path d="M28,52 C90,64 128,112 150,178 C170,244 214,294 314,318" strokeWidth="0.55" opacity="0.7" />
        <path d="M36,64 C90,76 126,124 150,188 C170,250 212,298 306,322" strokeWidth="0.45" opacity="0.55" />
        <path d="M44,76 C92,88 124,136 150,198 C170,256 208,302 298,326" strokeWidth="0.4" opacity="0.45" />

        {/* Upper spiral volute */}
        <path d="M22,38 C4,58 12,82 38,80 C60,78 66,56 52,46 C42,40 32,46 34,56" strokeWidth="0.9" />
        <path d="M22,38 C6,64 18,86 40,80" strokeWidth="0.4" opacity="0.5" />

        {/* Lower spiral volute */}
        <path d="M320,314 C344,322 356,342 346,360 C336,376 314,374 310,360 C308,350 318,346 324,352" strokeWidth="0.9" />

        {/* Ornamental center lotus / crest bud */}
        <g transform="translate(150 180)">
          <path d="M0,-28 C-6,-18 -10,-6 0,4 C10,-6 6,-18 0,-28 Z" strokeWidth="0.7" />
          <path d="M-18,-20 C-22,-8 -18,4 -8,6 C-10,-6 -14,-14 -18,-20 Z" strokeWidth="0.6" opacity="0.85" />
          <path d="M18,-20 C22,-8 18,4 8,6 C10,-6 14,-14 18,-20 Z" strokeWidth="0.6" opacity="0.85" />
          <path d="M-26,-6 C-26,4 -20,12 -12,12 C-14,4 -18,-2 -26,-6 Z" strokeWidth="0.5" opacity="0.7" />
          <path d="M26,-6 C26,4 20,12 12,12 C14,4 18,-2 26,-6 Z" strokeWidth="0.5" opacity="0.7" />
          <circle cx="0" cy="0" r="4" strokeWidth="0.6" />
          <circle cx="0" cy="0" r="10" strokeWidth="0.4" opacity="0.55" />
        </g>

        {/* Leaves stepping along the curve */}
        <Leaf x={80} y={54} rotate={20} />
        <Leaf x={104} y={96} rotate={35} />
        <Leaf x={128} y={138} rotate={50} />
        <Leaf x={208} y={236} rotate={30} />
        <Leaf x={248} y={274} rotate={15} />
        <Leaf x={290} y={306} rotate={-5} />

        {/* Starburst accents */}
        <g strokeWidth="0.55" opacity="0.7">
          <Sparkle x={66} y={134} />
          <Sparkle x={198} y={168} s={0.8} />
          <Sparkle x={262} y={246} s={0.7} />
          <Sparkle x={108} y={226} s={0.8} />
        </g>

        {/* Fine beadwork along primary curve */}
        <g strokeWidth="0.35" opacity="0.7">
          {Array.from({ length: 28 }).map((_, i) => {
            const t = i / 27;
            // sample along the S-curve with small offsets
            const x = 20 + 300 * t;
            const y = 40 + 80 * Math.sin(t * Math.PI) + 240 * t * t;
            return <circle key={`bd${i}`} cx={x} cy={y} r={0.9} />;
          })}
        </g>
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Ocean Aged — dense flowing currents, pressure vortex, diving curls.
// Inspired by the corner-waves reference; 16 parallel currents + 2 curls.
// ---------------------------------------------------------------------------
export function OceanAgedMotif({ anchor = "bottom-left", size = 420, opacity = 0.28, tone, className, style }: MotifProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 500 340"
      preserveAspectRatio="xMinYMax meet"
      className={className}
      style={{ ...anchorStyle(anchor, size), width: Math.round(size * 1.5), opacity, color: toneColor(tone), ...style }}
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* 18 parallel currents of decreasing opacity from foreground to horizon.
            Open curves only — no closing rectangle, so there's no border line. */}
        {Array.from({ length: 18 }).map((_, i) => {
          const y = 320 - i * 10;
          const amp = 22 - i * 0.6;
          const d = `M0,${y} C80,${y - amp} 140,${y + amp} 220,${y - amp * 0.8} C300,${y - amp * 2} 380,${y + amp * 0.6} 460,${y - amp} L500,${y}`;
          return (
            <path
              key={`c${i}`}
              d={d}
              strokeWidth={0.7 - i * 0.02}
              opacity={Math.max(0.25, 0.92 - i * 0.04)}
            />
          );
        })}

        {/* Diving curl top-left */}
        <path
          d="M16,160 C40,112 92,96 132,118 C168,138 164,178 132,184 C100,190 88,164 112,152"
          strokeWidth="0.9"
          opacity="0.85"
        />
        <path
          d="M24,158 C46,118 90,104 126,122 C152,136 150,172 130,180"
          strokeWidth="0.55"
          opacity="0.6"
        />
        <path
          d="M34,154 C50,122 86,112 120,128 C138,138 138,166 126,172"
          strokeWidth="0.4"
          opacity="0.45"
        />

        {/* Counter-curl (smaller) upper right */}
        <path
          d="M360,100 C380,70 420,62 440,82 C456,98 450,126 428,128 C410,130 404,112 422,104"
          strokeWidth="0.7"
          opacity="0.75"
        />
        <path
          d="M368,98 C384,76 416,70 434,86"
          strokeWidth="0.4"
          opacity="0.5"
        />

        {/* Pressure bubbles */}
        <g strokeWidth="0.55">
          <circle cx="168" cy="150" r="2" />
          <circle cx="196" cy="126" r="1.4" opacity="0.7" />
          <circle cx="230" cy="148" r="1" opacity="0.55" />
          <circle cx="290" cy="118" r="1.6" opacity="0.8" />
          <circle cx="322" cy="96" r="1" opacity="0.6" />
          <circle cx="260" cy="164" r="0.8" opacity="0.5" />
        </g>

        {/* Seaweed-vine hybrid — two thin fronds rising from left */}
        <path
          d="M72,320 C68,280 80,250 74,216 C68,188 82,170 76,140"
          strokeWidth="0.55"
          opacity="0.6"
        />
        <path
          d="M72,280 C84,274 92,266 88,256 M74,240 C62,236 56,228 62,218 M76,196 C88,192 92,184 86,176"
          strokeWidth="0.45"
          opacity="0.55"
        />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Club Releases — full vine with two branches, four leaves, tendrils, and a
// grape cluster. Closest in spirit to the wine-sketch reference.
// ---------------------------------------------------------------------------
export function ClubMotif({ anchor = "bottom-right", size = 380, opacity = 0.28, tone, className, style }: MotifProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 400"
      className={className}
      style={{ ...anchorStyle(anchor, size), opacity, color: toneColor(tone), ...style }}
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* Main stem, sweeping from bottom-left to upper-right */}
        <path d="M30,400 C48,340 72,300 104,272 C140,240 172,218 208,196 C244,174 280,146 306,108" strokeWidth="1" />
        {/* Secondary branch off mid-stem */}
        <path d="M120,256 C96,244 78,222 70,196 C64,180 70,162 82,154" strokeWidth="0.8" opacity="0.9" />
        {/* Upper side branch */}
        <path d="M220,190 C244,180 270,182 290,196" strokeWidth="0.7" opacity="0.85" />
        {/* Tendrils — small curls */}
        <path d="M320,96 C336,90 346,98 340,112 C334,122 320,118 324,106" strokeWidth="0.5" opacity="0.75" />
        <path d="M76,152 C60,148 58,162 70,168 C78,170 82,160 76,156" strokeWidth="0.5" opacity="0.75" />
        <path d="M148,280 C134,290 138,302 150,300 C160,298 160,288 154,284" strokeWidth="0.5" opacity="0.75" />

        {/* Four leaves at nodes — one filled in deep green for contrast */}
        <g transform="translate(200 198) rotate(-5)"><FilledVineLeaf /></g>
        <g transform="translate(112 262) rotate(20)"><VineLeaf /></g>
        <g transform="translate(82 176) rotate(-40)"><VineLeaf scale={0.75} /></g>
        <g transform="translate(280 140) rotate(-18)"><VineLeaf scale={0.85} /></g>

        {/* Grape cluster — down-left, fuller than before */}
        <g strokeWidth="0.55" opacity="0.9">
          {[
            [52, 296, 7], [66, 300, 7], [80, 296, 7], [94, 302, 7],
            [58, 312, 7], [72, 316, 7], [86, 312, 7],
            [64, 328, 7], [78, 332, 7], [92, 328, 7],
            [70, 344, 7], [84, 348, 7],
            [76, 360, 7],
          ].map(([cx, cy, r], i) => (
            <circle key={`g${i}`} cx={cx} cy={cy} r={r} />
          ))}
        </g>
        {/* Grape cluster stem */}
        <path d="M76,296 C82,290 90,282 102,276" strokeWidth="0.55" opacity="0.7" />
      </g>
    </svg>
  );
}

// Palmate 5-lobed grape-vine leaf with serration hints and radiating veins.
// Apex of the leaf sits above the origin; stem attaches at the bottom.
// Draw order: outline, then center vein, then 4 radiating veins.
const VINE_LEAF_PATH =
  "M0,-34 C2,-30 3,-26 5,-22 C10,-22 14,-20 17,-18 C15,-12 13,-10 10,-6 " +
  "C17,-4 24,-4 30,-2 C28,4 25,8 20,12 C24,18 25,23 22,28 C16,27 11,26 6,27 " +
  "C4,30 2,33 0,36 C-2,33 -4,30 -6,27 C-11,26 -16,27 -22,28 C-25,23 -24,18 -20,12 " +
  "C-25,8 -28,4 -30,-2 C-24,-4 -17,-4 -10,-6 C-13,-10 -15,-12 -17,-18 " +
  "C-14,-20 -10,-22 -5,-22 C-3,-26 -2,-30 0,-34 Z";

function VineLeaf({ scale = 1 }: { scale?: number }) {
  return (
    <g transform={`scale(${scale})`}>
      <path d={VINE_LEAF_PATH} strokeWidth="0.8" />
      {/* central vein (apex to stem) */}
      <path d="M0,-30 L0,34" strokeWidth="0.45" opacity="0.7" />
      {/* four radiating side veins toward the side lobes */}
      <path d="M0,-22 L-22,-4" strokeWidth="0.35" opacity="0.55" />
      <path d="M0,-22 L22,-4" strokeWidth="0.35" opacity="0.55" />
      <path d="M0,-8 L-22,14" strokeWidth="0.35" opacity="0.55" />
      <path d="M0,-8 L22,14" strokeWidth="0.35" opacity="0.55" />
    </g>
  );
}

// Solid filled leaf — used as a single point of deep contrast against the
// line-art vine. Renders a real-leaf fill with a deeper stroke edge and a
// lightly drawn vein showing through.
function FilledVineLeaf({ scale = 1 }: { scale?: number }) {
  return (
    <g transform={`scale(${scale})`}>
      <path
        d={VINE_LEAF_PATH}
        fill="var(--bottle)"
        fillOpacity="0.82"
        stroke="var(--graphite)"
        strokeOpacity="0.9"
        strokeWidth="0.5"
      />
      <path d="M0,-30 L0,34" stroke="var(--chalk)" strokeOpacity="0.38" strokeWidth="0.55" />
      <path d="M0,-22 L-22,-4" stroke="var(--chalk)" strokeOpacity="0.3" strokeWidth="0.4" />
      <path d="M0,-22 L22,-4" stroke="var(--chalk)" strokeOpacity="0.3" strokeWidth="0.4" />
      <path d="M0,-8 L-22,14" stroke="var(--chalk)" strokeOpacity="0.28" strokeWidth="0.4" />
      <path d="M0,-8 L22,14" stroke="var(--chalk)" strokeOpacity="0.28" strokeWidth="0.4" />
    </g>
  );
}

function Leaf({ x, y, rotate = 0 }: { x: number; y: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <path
        d="M0,0 C8,-14 24,-18 34,-8 C44,2 30,18 0,0 Z"
        strokeWidth="0.6"
        opacity="0.85"
      />
    </g>
  );
}

function Sparkle({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const a = 10 * s;
  const b = 7 * s;
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M0,-${a} L0,${a} M-${a},0 L${a},0 M-${b},-${b} L${b},${b} M-${b},${b} L${b},-${b}`} />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Flute — tall stemware silhouette with a rising bubble column and a small
// paisley flourish arched above the rim. Used for experience/tasting pages
// so the engraving there does not duplicate the club vine.
// ---------------------------------------------------------------------------
export function FluteMotif({ anchor = "top-right", size = 420, opacity = 0.28, tone, className, style }: MotifProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 320 440"
      className={className}
      style={{ ...anchorStyle(anchor, size), height: Math.round(size * 1.3), opacity, color: toneColor(tone), ...style }}
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* Flute silhouette — bowl, stem, foot. Two parallel strokes for engraving. */}
        <path
          d="M140,40 C140,120 128,200 130,264 C132,300 158,314 186,314 C214,314 240,300 242,264 C244,200 232,120 232,40"
          strokeWidth="1"
        />
        <path
          d="M146,48 C146,124 134,202 136,262 C138,294 160,306 186,306 C212,306 234,294 236,262 C238,202 226,124 226,48"
          strokeWidth="0.4"
          opacity="0.55"
        />
        {/* Rim highlight */}
        <path d="M140,40 C160,30 212,30 232,40" strokeWidth="0.7" opacity="0.8" />
        {/* Stem */}
        <path d="M186,314 L186,392" strokeWidth="0.9" />
        {/* Foot */}
        <path d="M150,402 C168,396 204,396 222,402" strokeWidth="0.9" />
        <path d="M146,408 C168,402 204,402 226,408" strokeWidth="0.45" opacity="0.6" />

        {/* Rising bubble column inside the bowl */}
        {(() => {
          const bubbles = [
            [170, 290, 1.6], [196, 284, 2], [182, 270, 1.4],
            [172, 248, 2.2], [198, 238, 1.6], [186, 224, 1.2],
            [176, 204, 2.4], [200, 192, 1.4], [184, 178, 1.8],
            [172, 158, 1.6], [198, 148, 2], [186, 132, 1.4],
            [176, 112, 1.8], [196, 102, 1.4], [184, 86, 1.6],
            [180, 68, 1.2], [190, 54, 1],
          ] as const;
          return bubbles.map(([cx, cy, r], i) => (
            <circle key={`fb${i}`} cx={cx} cy={cy} r={r} strokeWidth="0.5" opacity={0.55 + (i % 3) * 0.15} />
          ));
        })()}

        {/* Sparkles around rim */}
        <g strokeWidth="0.6" opacity="0.8">
          <Sparkle x={96} y={54} s={0.8} />
          <Sparkle x={274} y={60} s={0.9} />
          <Sparkle x={62} y={110} s={0.7} />
          <Sparkle x={292} y={128} s={0.7} />
          <Sparkle x={44} y={220} s={0.8} />
        </g>

        {/* Paisley flourish arching above the flute */}
        <path
          d="M60,38 C90,10 150,2 186,14 C222,2 282,10 308,38"
          strokeWidth="0.7"
          opacity="0.7"
        />
        <path
          d="M60,38 C80,22 122,18 148,28 M308,38 C288,22 248,18 222,28"
          strokeWidth="0.4"
          opacity="0.55"
        />
        {/* Small paisley drops hanging from the arch */}
        <path d="M96,36 C92,48 94,58 104,58 C112,58 114,46 108,40 Z" strokeWidth="0.55" opacity="0.75" />
        <path d="M268,36 C272,48 270,58 260,58 C252,58 250,46 256,40 Z" strokeWidth="0.55" opacity="0.75" />
        <path d="M186,14 C180,26 182,38 188,40 C196,42 200,30 194,22 Z" strokeWidth="0.55" opacity="0.7" />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Paisley frame — an ornate engraved border intended for dark backgrounds.
// Four paisley boteh ornaments sit in each corner, joined by a fine double
// rule. Designed to frame a portrait (e.g. a bottle) the way a library plate
// is framed — rich, quiet, not loud.
// ---------------------------------------------------------------------------
// Implemented as four absolutely-positioned band SVGs that tile a small
// paisley unit using SVG <pattern>. The unit repeats edge-to-edge so the
// border reads as a true textile run rather than a few placed ornaments.
// Corners get a larger paisley overlay to anchor the rhythm.
export function PaisleyFrame({
  opacity = 1,
  inset = 12,
  bandWidth = 80,
  tileSize = 200,
  className,
  style,
}: {
  tone?: MotifProps["tone"]; // accepted for API parity
  opacity?: number;
  /** Distance from the edge of the container, in px. */
  inset?: number;
  /** Thickness of the ornamental band on each side, in px. */
  bandWidth?: number;
  /** Tile size of the SVG paisley pattern inside each band. */
  tileSize?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  // Original SVG paisley pattern, encoded as a data URL so it can tile via
  // CSS background-image without making a network request. Inspired by the
  // gold-on-black paisley reference, redrawn from scratch.
  const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(paisleySvg(tileSize))}`;
  const bandStyle: React.CSSProperties = {
    position: "absolute",
    backgroundImage: `url("${dataUrl}")`,
    backgroundRepeat: "repeat",
    backgroundSize: `${tileSize}px ${tileSize}px`,
  };
  return (
    <div
      aria-hidden
      className={className}
      style={{
        position: "absolute",
        inset,
        pointerEvents: "none",
        opacity,
        ...style,
      }}
    >
      <div style={{ ...bandStyle, top: 0, left: 0, right: 0, height: bandWidth }} />
      <div style={{ ...bandStyle, bottom: 0, left: 0, right: 0, height: bandWidth }} />
      <div style={{ ...bandStyle, top: 0, bottom: 0, left: 0, width: bandWidth }} />
      <div style={{ ...bandStyle, top: 0, bottom: 0, right: 0, width: bandWidth }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Original paisley pattern, drawn from scratch. The boteh silhouette is filled
// with a shaded gold gradient and ringed by beadwork (a chain of small dots
// hugging the outline) — the defining trait of paisley jacquard. Each tile
// holds a large left-facing paisley, a smaller right-facing paisley, two
// star-rosettes, and scattered florets in the negative space, on a dark
// ground. Tiles seamlessly because all elements are placed wholly within
// the unit (no element crosses the seam).
// ---------------------------------------------------------------------------
function paisleySvg(size: number): string {
  // Boteh path used only for the small inner paisley sitting inside the
  // larger bead-defined silhouette.
  const boteh =
    "M0,32 C-30,32 -50,12 -50,-20 C-50,-58 -28,-86 4,-86 C36,-86 54,-62 48,-38 C42,-22 24,-18 14,-28 C6,-38 18,-52 26,-46 C32,-40 24,-30 14,-32 C36,-26 50,-8 46,16 C40,28 22,34 4,34 Z";
  // Hand-traced boteh outline as a chain of bead positions. Going clockwise
  // from the bottom of the bulb: down the left flank, up & over the top, the
  // tip recurves inward (the "hook"), then back down the right flank to the
  // bottom. The shape is unmistakably paisley — round bulb + recurved tip.
  const ringPts: [number, number][] = [
    // Bottom of bulb
    [0, 32], [-12, 32], [-24, 30],
    // Down the left flank (going up in y since y is inverted)
    [-34, 24], [-42, 14], [-48, 2], [-50, -12], [-50, -26], [-48, -40],
    // Curving over the top-left
    [-44, -54], [-38, -64], [-30, -72], [-20, -80], [-8, -84],
    // Top arch
    [4, -86], [16, -84], [28, -80], [38, -72],
    // Top-right shoulder
    [46, -62], [50, -50], [50, -38],
    // Tip starts hooking back inward (DOWN-LEFT)
    [46, -28], [38, -22], [28, -22], [18, -28],
    // The hook: tip curls into the body
    [12, -36], [10, -46], [16, -52], [24, -50],
    [28, -42], [22, -34],
    // Continue back down the outer right flank
    [30, -28], [38, -20], [44, -10], [48, 4],
    [46, 18], [40, 26], [30, 32], [16, 34], [4, 34],
  ];
  const ring = ringPts
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="url(#invinitybead)"/>`)
    .join("");

  // A smaller boteh sits inside the larger one (paisley-within-paisley) — a
  // hallmark of true paisley jacquard.
  const innerBoteh = `
    <g transform="translate(-2 -34) scale(0.30)">
      <path d="${boteh}" fill="url(#fillSoft)" stroke="${color.paisleyGoldMid}" stroke-width="1.2"/>
      <circle cx="-6" cy="-34" r="3" fill="${color.paisleyHighlight}"/>
    </g>
  `;

  // Petal rosette — eight pointed petals around a bead center.
  const rosette = (cx: number, cy: number, R: number) => {
    const petals = Array.from({ length: 8 })
      .map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const x1 = cx + Math.cos(a - 0.18) * R * 0.4;
        const y1 = cy + Math.sin(a - 0.18) * R * 0.4;
        const x2 = cx + Math.cos(a) * R;
        const y2 = cy + Math.sin(a) * R;
        const x3 = cx + Math.cos(a + 0.18) * R * 0.4;
        const y3 = cy + Math.sin(a + 0.18) * R * 0.4;
        return `<path d="M${x1.toFixed(1)},${y1.toFixed(1)} Q${x2.toFixed(1)},${y2.toFixed(1)} ${x3.toFixed(1)},${y3.toFixed(1)} Z" fill="url(#fillSoft)" stroke="${color.paisleyGoldDeep}" stroke-width="0.6"/>`;
      })
      .join("");
    const dots = Array.from({ length: 8 })
      .map((_, i) => {
        const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
        const x = cx + Math.cos(a) * R * 0.78;
        const y = cy + Math.sin(a) * R * 0.78;
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.2" fill="${color.paisleyHighlight}"/>`;
      })
      .join("");
    return `${petals}${dots}<circle cx="${cx}" cy="${cy}" r="${(R * 0.28).toFixed(1)}" fill="${color.paisleyHighlight}"/><circle cx="${cx}" cy="${cy}" r="${(R * 0.14).toFixed(1)}" fill="${color.paisleyShadow}"/>`;
  };

  // Sun-star — eight rays plus a filled center, used as a filler ornament.
  const star = (cx: number, cy: number, R: number) => {
    const rays = Array.from({ length: 8 })
      .map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const x1 = cx + Math.cos(a) * R * 0.32;
        const y1 = cy + Math.sin(a) * R * 0.32;
        const x2 = cx + Math.cos(a) * R;
        const y2 = cy + Math.sin(a) * R;
        return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color.paisleyGold}" stroke-width="${(R * 0.16).toFixed(1)}" stroke-linecap="round"/>`;
      })
      .join("");
    const halfRays = Array.from({ length: 8 })
      .map((_, i) => {
        const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
        const x1 = cx + Math.cos(a) * R * 0.32;
        const y1 = cy + Math.sin(a) * R * 0.32;
        const x2 = cx + Math.cos(a) * R * 0.7;
        const y2 = cy + Math.sin(a) * R * 0.7;
        return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color.paisleyGoldMid}" stroke-width="${(R * 0.1).toFixed(1)}" stroke-linecap="round"/>`;
      })
      .join("");
    return `${rays}${halfRays}<circle cx="${cx}" cy="${cy}" r="${(R * 0.30).toFixed(1)}" fill="${color.paisleyHighlight}"/><circle cx="${cx}" cy="${cy}" r="${(R * 0.12).toFixed(1)}" fill="${color.paisleyShadow}"/>`;
  };

  // Five-petal floret — small filler.
  const floret = (cx: number, cy: number, R: number) => {
    const petals = Array.from({ length: 5 })
      .map((_, i) => {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(a) * R;
        const y = cy + Math.sin(a) * R;
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(R * 0.6).toFixed(1)}" fill="${color.paisleyGold}"/>`;
      })
      .join("");
    return `${petals}<circle cx="${cx}" cy="${cy}" r="${(R * 0.55).toFixed(1)}" fill="${color.paisleyHighlight}"/><circle cx="${cx}" cy="${cy}" r="${(R * 0.22).toFixed(1)}" fill="${color.paisleyGoldDeep}"/>`;
  };

  // Vine of beads connecting two paisleys.
  const beadVine = (x1: number, y1: number, x2: number, y2: number, n: number) => {
    return Array.from({ length: n })
      .map((_, i) => {
        const t = (i + 1) / (n + 1);
        // arc midpoint offset
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2 - 8;
        const x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2;
        const y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y2;
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.4" fill="${color.paisleyGoldMid}"/>`;
      })
      .join("");
  };

  // One paisley unit — bead-ringed body, smaller paisley inside, rosette,
  // beadwork. NO solid fill on the body: the silhouette is defined entirely
  // by the bead chain, which is the defining trait of this paisley style.
  const paisleyUnit = `
    <g>
      ${ring}
      ${innerBoteh}
      ${rosette(-22, 0, 9)}
    </g>
  `;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="invinitybead" cx="0.35" cy="0.35" r="0.7">
      <stop offset="0" stop-color="${color.paisleyHighlightPeach}"/>
      <stop offset="0.55" stop-color="${color.paisleyGold}"/>
      <stop offset="1" stop-color="${color.paisleyGoldDeep}"/>
    </radialGradient>
    <linearGradient id="fillSoft" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${color.paisleyHighlight}"/>
      <stop offset="1" stop-color="${color.paisleyGoldMid}"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="${color.paisleyGround}"/>

  <!-- Large paisley, lower-left, tip pointing up-right -->
  <g transform="translate(${size * 0.34} ${size * 0.94}) scale(0.62)">${paisleyUnit}</g>
  <!-- Smaller paisley, upper-right, mirrored -->
  <g transform="translate(${size * 0.80} ${size * 0.40}) scale(-0.46 0.46)">${paisleyUnit}</g>

  <!-- Star ornaments — kept small so paisleys read as the dominant motif -->
  <g opacity="0.7">${star(size * 0.10, size * 0.16, 6)}</g>
  <g opacity="0.7">${star(size * 0.92, size * 0.80, 5)}</g>

  <!-- Florets in negative space -->
  <g>${floret(size * 0.62, size * 0.08, 5)}</g>
  <g>${floret(size * 0.18, size * 0.50, 5)}</g>
  <g>${floret(size * 0.94, size * 0.22, 3.5)}</g>
  <g>${floret(size * 0.04, size * 0.84, 3.5)}</g>
  <g>${floret(size * 0.50, size * 0.30, 3)}</g>
  <g>${floret(size * 0.46, size * 0.62, 3)}</g>

  <!-- Bead vines connecting ornaments -->
  <g>${beadVine(size * 0.16, size * 0.18, size * 0.50, size * 0.30, 6)}</g>
  <g>${beadVine(size * 0.46, size * 0.62, size * 0.86, size * 0.78, 6)}</g>
</svg>`;
}

// ---------------------------------------------------------------------------
// Dispatcher
// ---------------------------------------------------------------------------
export function CollectionMotif({
  collection,
  ...rest
}: { collection: Wine["collection"] } & MotifProps) {
  switch (collection) {
    case "sparkling":    return <SparklingMotif {...rest} />;
    case "grande-cuvee":
    case "library":      return <GrandeCuveeMotif {...rest} />;
    case "ocean-aged":   return <OceanAgedMotif {...rest} />;
    case "club":         return <ClubMotif {...rest} />;
  }
}
