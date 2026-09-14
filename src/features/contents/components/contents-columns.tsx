"use client";

import type { ContentsColumnParallaxState } from "@features/contents/hooks/use-contents-column-parallax";
import { useContentsColumnScale } from "@features/contents/hooks/use-contents-column-scale";
import { useContentsColumnSpread } from "@features/contents/hooks/use-contents-column-spread";
import {
  CONTENTS_COLUMNS_MASK,
  getContentsBoxStyle,
  getContentsColumns,
  getContentsFrame,
  spreadFigmaBoxStyle,
  type ContentsColumnId,
  type ContentsColumnLayer,
  type ContentsLayoutVariant,
} from "@features/contents/constants/contents-layout";
import { cn } from "@shadcn/lib/utils";
import Image from "next/image";
import { useRef, type CSSProperties } from "react";

const GLOW_KEYS = ["glow1", "glow2", "glow3"] as const;

type ContentsColumnsProps = {
  variant: ContentsLayoutVariant;
  parallax: ContentsColumnParallaxState;
  transitionMs: number;
  /** Soft top mask. Off by default — Figma shows full shaft tops without a veil. */
  fadeTop?: boolean;
  /** Overrides measured composition scale (strip / special stages). */
  compositionScale?: number;
  /**
   * Overrides width-based fan-out. Flow strips lock to 1 so tablet widths
   * don’t push Figma shafts off-screen (narrowSpread was ~1.45–1.55).
   */
  spread?: number;
};

function outerParallaxStyle(
  parallax: ContentsColumnParallaxState[ContentsColumnId],
  transitionMs: number,
): CSSProperties {
  return {
    transform: `translate3d(${parallax.translateX}px, ${parallax.translateY}px, 0)`,
    transition: `transform ${transitionMs}ms ease-out`,
    willChange: "transform",
  };
}

function innerArtStyle(layer: ContentsColumnLayer): CSSProperties {
  const scaleX = layer.scaleX ?? 1;
  const scaleY = layer.scaleY ?? 1;

  return {
    width: `${(layer.image.width / layer.box.width) * 100}%`,
    height: `${(layer.image.height / layer.box.height) * 100}%`,
    transform: `rotate(${layer.rotateDeg}deg) scale(${scaleX}, ${scaleY})`,
  };
}

function ColumnGlows({ variant }: { variant: ContentsLayoutVariant }) {
  return (
    <>
      {GLOW_KEYS.map((key) => {
        const style = getContentsBoxStyle(key, variant);
        if (!style) {
          return null;
        }

        return (
          <div key={key} className="absolute" style={style}>
            <Image
              src="/img/contents/glow.svg"
              alt=""
              fill
              className="object-contain opacity-60"
              unoptimized
            />
          </div>
        );
      })}
    </>
  );
}

export function ContentsColumns({
  variant,
  parallax,
  transitionMs,
  fadeTop = false,
  compositionScale: compositionScaleProp,
  spread: spreadProp,
}: ContentsColumnsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measuredSpread = useContentsColumnSpread(containerRef, variant);
  const measuredScale = useContentsColumnScale(containerRef, variant);
  const spread = spreadProp ?? measuredSpread;
  const compositionScale = compositionScaleProp ?? measuredScale;
  const frame = getContentsFrame(variant);
  const columns = getContentsColumns(variant);
  const mask = fadeTop === true ? CONTENTS_COLUMNS_MASK[variant] : undefined;

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
      )}
    >
      <ColumnGlows variant={variant} />

      <div
        className="absolute inset-0"
        style={
          mask !== undefined
            ? { maskImage: mask, WebkitMaskImage: mask }
            : undefined
        }
      >
        <div
          className="absolute inset-0 origin-bottom"
          style={{ transform: `scale(${compositionScale})` }}
        >
          {columns.map((layer) => {
            const box = spreadFigmaBoxStyle(
              layer.box,
              frame,
              spread,
              layer.spreadWeight ?? 1,
            );

            return (
              <div
                key={layer.id}
                className="absolute flex items-center justify-center"
                style={{
                  ...box,
                  ...outerParallaxStyle(parallax[layer.id], transitionMs),
                }}
              >
                <div className="relative flex-none" style={innerArtStyle(layer)}>
                  <Image
                    src={layer.src}
                    alt=""
                    fill
                    className="object-contain mix-blend-screen"
                    sizes="60vw"
                    priority={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
