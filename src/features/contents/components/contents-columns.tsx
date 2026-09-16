"use client";

import type { ContentsColumnParallaxState } from "@features/contents/hooks/use-contents-column-parallax";
import {
  CONTENTS_COLUMNS_MASK,
  CONTENTS_GLOW_BLUR_INSET,
  figmaBoxStyle,
  getContentsBoxStyle,
  getContentsColumns,
  getContentsFrame,
  type ContentsColumnId,
  type ContentsColumnLayer,
  type ContentsLayoutVariant,
} from "@features/contents/constants/contents-layout";
import { cn } from "@shadcn/lib/utils";
import Image from "next/image";
import type { CSSProperties } from "react";

const GLOW_KEYS = ["glow1", "glow2", "glow3"] as const;

type ContentsColumnsProps = {
  variant: ContentsLayoutVariant;
  parallax: ContentsColumnParallaxState;
  transitionMs: number;
  /** Soft top mask. Off by default — Figma shows full shaft tops without a veil. */
  fadeTop?: boolean;
  /**
   * Composition scale. Default 1 (Figma absolute). Strip may pass fit scale.
   */
  compositionScale?: number;
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
  const blurInset = CONTENTS_GLOW_BLUR_INSET[variant];

  return (
    <div className="absolute inset-0">
      {GLOW_KEYS.map((key) => {
        const style = getContentsBoxStyle(key, variant);
        if (!style) {
          return null;
        }

        return (
          <div key={key} className="absolute overflow-visible" style={style}>
            <div className="absolute" style={{ inset: blurInset }}>
              <Image
                src="/img/contents/glow.svg"
                alt=""
                fill
                className="object-contain opacity-80"
                unoptimized
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Decorative shafts + soft base glows — Figma absolute layout (no fan-out).
 */
export function ContentsColumns({
  variant,
  parallax,
  transitionMs,
  fadeTop = false,
  compositionScale = 1,
}: ContentsColumnsProps) {
  const frame = getContentsFrame(variant);
  const columns = getContentsColumns(variant);
  const mask = fadeTop === true ? CONTENTS_COLUMNS_MASK[variant] : undefined;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
      )}
    >
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
          style={
            compositionScale !== 1
              ? { transform: `scale(${compositionScale})` }
              : undefined
          }
        >
          <ColumnGlows variant={variant} />

          {columns.map((layer) => {
            const box = figmaBoxStyle(layer.box, frame);

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
