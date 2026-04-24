import NextImage from "next/image";
import type { Wine } from "@/data/wines";
import { ImagePlate } from "./sections";
import { BottleArt } from "./bottle";

// A single image seam for the site. Hand it a media asset and it renders an
// optimized next/image with correct aspect ratio, grain overlay, and alt text.
// Hand it nothing and it renders a token-backed placeholder that is visually
// coherent with the design system, so swapping in commissioned photography
// later is a content change, not a code change.

export type MediaAsset = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  // Hint for the layout; if absent, the wrapping aspectRatio wins.
  priority?: boolean;
};

type CommonProps = {
  ratio?: string;
  className?: string;
  style?: React.CSSProperties;
  sizes?: string;
};

export function HouseImage({
  asset,
  tone = "stone",
  ratio = "4 / 5",
  className,
  style,
  sizes = "(min-width: 1200px) 50vw, 100vw",
}: CommonProps & {
  asset?: MediaAsset;
  tone?: "stone" | "bottle" | "paper";
}) {
  if (!asset) {
    return (
      <div className={className} style={{ aspectRatio: ratio, ...style }}>
        <ImagePlate tone={tone} ratio={ratio} />
      </div>
    );
  }
  return (
    <figure
      className={className}
      style={{ position: "relative", aspectRatio: ratio, overflow: "hidden", ...style }}
    >
      <NextImage
        src={asset.src}
        alt={asset.alt}
        fill
        sizes={sizes}
        priority={asset.priority}
        style={{ objectFit: "cover" }}
      />
      <div className="grain" aria-hidden />
    </figure>
  );
}

export function BottleImage({
  wine,
  asset,
  width = "42%",
}: {
  wine: Wine;
  asset?: MediaAsset;
  width?: string;
}) {
  if (!asset) return <BottleArt wine={wine} width={width} />;
  return (
    <div style={{ position: "relative", width, aspectRatio: "2 / 5" }}>
      <NextImage src={asset.src} alt={asset.alt} fill sizes="30vw" style={{ objectFit: "contain" }} />
    </div>
  );
}
