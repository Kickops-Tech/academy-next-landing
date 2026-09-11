"use client";

import { cn } from "@shadcn/lib/utils";
import {
  HERO_BUST_DEFAULT_LAYER,
} from "@features/hero/constants/hero-bust-layers";
import { useHeroBustGlitch } from "@features/hero/hooks/use-hero-bust-glitch";

/** Figma bust frame (614×1030) — reserves aspect before the PNG loads. */
const HERO_BUST_WIDTH = 614;
const HERO_BUST_HEIGHT = 1030;

/**
 * Props for {@link HeroBustGlitch}.
 */
export interface HeroBustGlitchProps {
  /** Classes on the outer frame (aspect / sizing from parent Hero stage). */
  className?: string;
  /**
   * Experimental: 16px pixelate brush on hover (bust-1 + bust-2).
   * @default true — enabled for hypothesis validation; pass `false` to disable.
   */
  enableHoverPixelate?: boolean;
}

/**
 * WebGL canvas that renders the layered Hero bust with vaporwave glitch effects.
 *
 * - `bust-1` is the default base outside sparse horizontal glitch bands.
 * - Ephemeral bands apply slice displacement, chromatic aberration, smear or
 *   color-layer accents (bust-2/3/4).
 * - Falls back to a static `bust-1` image if WebGL fails or while loading.
 *
 * Decorative only (`aria-hidden`); respects `prefers-reduced-motion`.
 */
export function HeroBustGlitch({
  className,
  enableHoverPixelate = true,
}: HeroBustGlitchProps) {
  const { canvasRef, containerRef, isReady, useFallback } = useHeroBustGlitch({
    enableHoverPixelate,
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden",
        "aspect-614/1030",
        enableHoverPixelate && "cursor-crosshair",
        className,
      )}
    >
      <img
        src={HERO_BUST_DEFAULT_LAYER}
        alt=""
        width={HERO_BUST_WIDTH}
        height={HERO_BUST_HEIGHT}
        aria-hidden={true}
        className={cn(
          "absolute inset-0 size-full object-contain object-center",
          "pointer-events-none select-none",
          "transition-opacity duration-200",
          isReady && !useFallback && "opacity-0",
        )}
      />

      {!useFallback && (
        <canvas
          ref={canvasRef}
          aria-hidden={true}
          className={cn(
            "absolute inset-0 size-full",
            "pointer-events-none select-none",
            "transition-opacity duration-200",
            !isReady && "opacity-0",
          )}
        />
      )}
    </div>
  );
}
