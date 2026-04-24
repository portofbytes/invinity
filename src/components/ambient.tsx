// Ambient atmospheric decorations — small, restrained motion pieces that
// belong to the "coastal, architectural, quiet" tone of the brief.

"use client";

import { useEffect, useState } from "react";
import { color } from "@/tokens";

// ---------------------------------------------------------------------------
// OceanWaves — a quiet architectural divider, not a scene.
//
// Two faint wave silhouettes drift at different speeds; no foam highlights,
// no bright crests. The band is transparent at the top (page shows through)
// and fades into --graphite to meet the footer seamlessly.
// ---------------------------------------------------------------------------
export function OceanWaves() {
  return (
    <div aria-hidden className="invinity-ocean">
      <div className="invinity-ocean-floor" />
      <Layer className="invinity-ocean-far">
        <FarWave />
        <FarWave />
      </Layer>
      <Layer className="invinity-ocean-near">
        <NearWave />
        <NearWave />
      </Layer>
    </div>
  );
}

function Layer({ className, children }: { className: string; children: React.ReactNode }) {
  return <div className={`invinity-ocean-layer ${className}`}>{children}</div>;
}

// Each wave starts and ends at the same y so duplicates tile seamlessly.
// Fills are solid dark-tinted colors pulled from the palette — no highlights.
function FarWave() {
  return (
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="invinity-wave-svg">
      <path
        d="M0,60 C180,44 340,80 520,64 C700,48 860,82 1080,66 C1260,52 1360,76 1440,60 L1440,120 L0,120 Z"
        fill={color.bottle}
      />
    </svg>
  );
}

function NearWave() {
  return (
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="invinity-wave-svg">
      <path
        d="M0,82 C120,66 240,96 360,82 C480,68 600,96 720,82 C840,68 960,96 1080,82 C1200,68 1320,96 1440,82 L1440,120 L0,120 Z"
        fill={color.graphite}
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// VineSilhouette — a single decorative vine, placed in a hero corner.
// ---------------------------------------------------------------------------
export function VineSilhouette({ corner = "bottom-left" }: { corner?: "top-right" | "bottom-left" | "bottom-right" }) {
  const pos: React.CSSProperties =
    corner === "top-right"
      ? { top: 0, right: 0, transformOrigin: "100% 0%", transform: "scale(-1, 1)" }
      : corner === "bottom-right"
      ? { bottom: 0, right: 0, transformOrigin: "100% 100%", transform: "scale(-1, 1)" }
      : { bottom: 0, left: 0, transformOrigin: "0% 100%" };

  return (
    <svg
      aria-hidden
      viewBox="0 0 320 480"
      className="invinity-vine"
      style={{ position: "absolute", width: 260, maxWidth: "32vw", opacity: 0.18, ...pos }}
    >
      <g className="invinity-vine-sway" style={{ transformOrigin: "50% 100%" }}>
        <path
          d="M30,460 C60,380 40,320 80,260 C120,200 70,160 110,100 C140,60 160,40 180,20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path d="M78,280 C120,260 150,250 170,230" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M96,160 C140,150 170,140 200,120" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <Leaf x={70} y={270} rotate={-20} scale={1} />
        <Leaf x={160} y={230} rotate={30} scale={0.9} />
        <Leaf x={100} y={160} rotate={-10} scale={1.1} />
        <Leaf x={190} y={120} rotate={35} scale={0.85} />
        <Leaf x={170} y={40} rotate={-5} scale={1.05} />
      </g>
    </svg>
  );
}

function Leaf({ x, y, rotate, scale }: { x: number; y: number; rotate: number; scale: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path
        d="M0,0 C8,-14 24,-18 34,-8 C44,2 30,18 0,0 Z"
        fill="currentColor"
        opacity="0.85"
      />
      <path d="M0,0 C12,-6 24,-10 32,-8" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.4" />
    </g>
  );
}

// ---------------------------------------------------------------------------
// DriftingLeaf — a single leaf that drifts across the hero every ~45s.
// ---------------------------------------------------------------------------
export function DriftingLeaf() {
  const [key, setKey] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    const loop = () => {
      const gap = 40000 + Math.random() * 25000;
      setTimeout(() => {
        if (cancelled) return;
        setKey((k) => k + 1);
        loop();
      }, gap);
    };
    loop();
    return () => { cancelled = true; };
  }, [reduced]);

  if (reduced || key === 0) return null;

  return (
    <svg
      key={key}
      aria-hidden
      viewBox="0 0 60 40"
      className="invinity-drift-leaf"
      style={{ position: "absolute", width: 36, opacity: 0, animation: "invinity-leaf-drift 22s ease-in-out forwards" }}
    >
      <g className="invinity-leaf-flutter" style={{ transformOrigin: "50% 50%" }}>
        <path d="M2,20 C8,6 26,2 40,8 C54,14 58,28 50,34 C36,42 14,38 2,20 Z" fill="currentColor" opacity="0.75" />
        <path d="M6,20 C20,22 36,24 50,30" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.6" />
      </g>
    </svg>
  );
}
