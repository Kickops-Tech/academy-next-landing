"use client";

import { cn } from "@shadcn/lib/utils";
import {
  HERO_BUST_DEFAULT_LAYER,
} from "@features/hero/constants/hero-bust-layers";
import { HERO_INTRO_BUST_FADE_MS } from "@features/hero/constants/hero-intro";
import { useHeroBustGlitch } from "@features/hero/hooks/use-hero-bust-glitch";
import { useEffect, useRef, useState } from "react";

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
  /**
   * `fade` — opacity 0→1 then `onIntroReady` (legacy).
   * `instant` — show immediately when assets ready (behind Lottie curtain).
   * @default "fade"
   */
  introMode?: "fade" | "instant";
  /** Fires once after the intro fade-in completes (or immediately if reduced motion / instant). */
  onIntroReady?: () => void;
}

/**
 * WebGL canvas that renders the layered Hero bust with glitch effects.
 * Starts invisible and fades in when textures (or static fallback) are ready.
 */
export function HeroBustGlitch({
  className,
  enableHoverPixelate = true,
  introMode = "fade",
  onIntroReady,
}: HeroBustGlitchProps) {
  const { canvasRef, containerRef, isReady, useFallback } = useHeroBustGlitch({
    enableHoverPixelate,
  });
  const [visible, setVisible] = useState(false);
  const [fallbackImageReady, setFallbackImageReady] = useState(false);
  const introNotifiedRef = useRef(false);
  const onIntroReadyRef = useRef(onIntroReady);
  onIntroReadyRef.current = onIntroReady;

  const assetReady = useFallback ? fallbackImageReady : isReady;

  useEffect(() => {
    if (!assetReady) {
      return;
    }

    const notifyReady = () => {
      if (!introNotifiedRef.current) {
        introNotifiedRef.current = true;
        onIntroReadyRef.current?.();
      }
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches || introMode === "instant") {
      setVisible(true);
      notifyReady();
      return;
    }

    const show = requestAnimationFrame(() => setVisible(true));
    const done = window.setTimeout(notifyReady, HERO_INTRO_BUST_FADE_MS);

    return () => {
      cancelAnimationFrame(show);
      window.clearTimeout(done);
    };
  }, [assetReady, introMode]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden",
        "aspect-614/1030",
        enableHoverPixelate && "cursor-crosshair",
        introMode === "fade" &&
          "transition-opacity ease-out motion-reduce:transition-none",
        visible ? "opacity-100" : "opacity-0",
        className,
      )}
      style={
        introMode === "fade"
          ? { transitionDuration: `${HERO_INTRO_BUST_FADE_MS}ms` }
          : undefined
      }
    >
      <img
        src={HERO_BUST_DEFAULT_LAYER}
        alt=""
        width={HERO_BUST_WIDTH}
        height={HERO_BUST_HEIGHT}
        aria-hidden={true}
        onLoad={() => setFallbackImageReady(true)}
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
            "pointer-events-none select-none bg-transparent",
            "transition-opacity duration-200",
            !isReady && "opacity-0",
          )}
        />
      )}
    </div>
  );
}
