"use client";

import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Wine } from "@/lib/schemas";
import { BottleArt } from "./bottle";

// Animated bottle presentation. Always renders at generous size; adds:
//   • idle float           — a slow up-down drift
//   • specular shine sweep — a diagonal highlight that passes every few seconds
//   • rising bubbles       — tiny circles drifting upward
//   • mouse-parallax tilt  — rotates with the cursor for a 3D feel
//   • continuous rotation  — optional, for hero / showcase / PDP gallery
//
// If `wine.media.bottle` is set, we render the real photo; otherwise the
// procedurally-generated BottleArt SVG. Both paths get the same effects.
// Reduced-motion is respected: float, shine, bubbles, and rotation all disable.

export type MagicalSize = "sm" | "md" | "lg" | "xl" | "full";
export type RotationMode = "idle" | "continuous" | "off";

const SIZE: Record<MagicalSize, { widthPct: string; bubbles: number }> = {
  sm:   { widthPct: "58%",  bubbles: 4 },
  md:   { widthPct: "68%",  bubbles: 8 },
  lg:   { widthPct: "78%",  bubbles: 12 },
  xl:   { widthPct: "86%",  bubbles: 16 },
  full: { widthPct: "100%", bubbles: 10 },
};

export function MagicalBottle({
  wine,
  size = "md",
  rotation = "idle",
  interactive = true,
  calm = false,
  bubbles,
  parallax,
  shine,
  fit = "contain",
}: {
  wine: Wine;
  size?: MagicalSize;
  rotation?: RotationMode;
  interactive?: boolean;
  /** Calm mode disables float, shine, parallax, and rotation. Bubbles stay on unless explicitly disabled. */
  calm?: boolean;
  /** Override the bubble default. `true` forces bubbles on (even when calm); `false` forces off. */
  bubbles?: boolean;
  /** Force parallax tilt on/off. Defaults to (interactive && !calm). */
  parallax?: boolean;
  /** Force the diagonal shine sweep on/off. Defaults to !calm. */
  shine?: boolean;
  /** `cover` fills the frame and crops (good for tiles); `contain` preserves the whole photo (good for galleries). */
  fit?: "cover" | "contain";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const parallaxOn = (parallax ?? (interactive && !calm)) && !reduced;
  useEffect(() => {
    if (!parallaxOn) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;  // 0..1
      const py = (e.clientY - rect.top) / rect.height;  // 0..1
      const maxY = 18; // deg
      const maxX = 8;  // deg
      setTilt({ y: (px - 0.5) * 2 * maxY, x: -(py - 0.5) * 2 * maxX });
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [parallaxOn]);

  const dims = SIZE[size];
  const photo = wine.media?.bottle;

  // Effective rotation: disabled if user prefers reduced motion OR calm mode
  const rot = reduced || calm ? "off" : rotation;

  const rotationAnimation =
    rot === "continuous"
      ? "invinity-bottle-spin 14s linear infinite"
      : rot === "idle"
      ? "invinity-bottle-float 6s ease-in-out infinite"
      : "none";

  return (
    <div
      ref={ref}
      className="invinity-bottle-stage"
      style={{ perspective: "1200px", perspectiveOrigin: "50% 40%" }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="invinity-bottle-glow"
        style={{
          background: "radial-gradient(ellipse at 50% 45%, color-mix(in oklab, var(--champagne) 22%, transparent) 0%, transparent 55%)",
        }}
      />

      {/* Rising bubbles. Default: on unless calm; an explicit prop wins. */}
      {!reduced && (bubbles ?? !calm) && <Bubbles count={dims.bubbles} />}

      {/* The bottle, inside the tilt + float/rotate wrapper */}
      <div
        className="invinity-bottle-tilt"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: tilt.x === 0 && tilt.y === 0 ? "transform 600ms var(--ease-out-quiet)" : "transform 120ms linear",
        }}
      >
        <div
          className="invinity-bottle-breath"
          style={{ animation: rotationAnimation }}
        >
          <div className="invinity-bottle-inner" style={{ width: dims.widthPct }}>
            {photo ? (
              <figure className="relative w-full h-full">
                <NextImage
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1200px) 33vw, 90vw"
                  style={{
                    objectFit: fit,
                    objectPosition: fit === "cover" ? "center 40%" : "center bottom",
                  }}
                  priority
                />
              </figure>
            ) : (
              <BottleArt wine={wine} width="100%" />
            )}

            {/* Specular shine sweep */}
            {!reduced && (shine ?? !calm) && <span aria-hidden className="invinity-bottle-shine" />}
          </div>
        </div>
      </div>

      {/* Cast shadow — subtle, warps with tilt */}
      <div
        aria-hidden
        className="invinity-bottle-shadow"
        style={{
          transform: `translateX(${tilt.y * 0.6}px) scale(${1 - Math.abs(tilt.y) / 200})`,
          opacity: 0.38 - Math.abs(tilt.x) / 120,
        }}
      />
    </div>
  );
}

function Bubbles({ count }: { count: number }) {
  // Deterministic bubble layout so SSR and client agree.
  const bubbles = Array.from({ length: count }, (_, i) => {
    const seed = (i + 1) * 97;
    const left = (seed * 13) % 100;
    const size = 3 + ((seed * 7) % 9);
    const delay = (seed % 50) / 10;
    const duration = 5 + ((seed * 3) % 40) / 10;
    return { left, size, delay, duration, key: i };
  });
  return (
    <div aria-hidden className="invinity-bottle-bubbles">
      {bubbles.map((b) => (
        <span
          key={b.key}
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
