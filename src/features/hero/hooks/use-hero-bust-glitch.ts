"use client";

import {
  useImageGlitch,
  type UseImageGlitchResult,
} from "@core/hooks/use-image-glitch";
import {
  HERO_BUST_ASPECT,
  HERO_BUST_GLITCH_PRESET,
  HERO_BUST_GLITCH_SHADER,
  HERO_BUST_LAYERS,
  HERO_BUST_PIXELATE_BLOCK_PX,
  HERO_BUST_PIXELATE_MASK_DECAY,
  HERO_BUST_PIXELATE_MASK_STAMP_STRENGTH,
  HERO_BUST_PIXELATE_STAMP_BLOCK_SPAN,
  HERO_BUST_SIGNAL_GLITCH_CONFIG,
  HERO_BUST_SIGNAL_LAYERS,
} from "@features/hero/constants/hero-bust-layers";
import {
  DEFAULT_GLITCH_CONFIG,
  type GlitchGridConfig,
} from "@core/lib/image-glitch/glitch-grid";

export interface UseHeroBustGlitchOptions {
  config?: GlitchGridConfig;
  enableHoverPixelate?: boolean;
}

export type UseHeroBustGlitchResult = UseImageGlitchResult;

/**
 * Hero bust WebGL glitch — thin wrapper over shared {@link useImageGlitch}.
 * Default: Kickops signal shader + landing preset (legacy via constants).
 */
export function useHeroBustGlitch(
  options: UseHeroBustGlitchOptions = {},
): UseHeroBustGlitchResult {
  const isSignal = HERO_BUST_GLITCH_SHADER === "signal";

  return useImageGlitch({
    layers: isSignal ? HERO_BUST_SIGNAL_LAYERS : HERO_BUST_LAYERS,
    imageAspect: HERO_BUST_ASPECT,
    fit: "contain",
    proceduralPixelate: isSignal,
    enableHoverPixelate: options.enableHoverPixelate ?? true,
    shaderVariant: HERO_BUST_GLITCH_SHADER,
    signalPreset: HERO_BUST_GLITCH_PRESET,
    config:
      options.config ??
      (isSignal ? HERO_BUST_SIGNAL_GLITCH_CONFIG : DEFAULT_GLITCH_CONFIG),
    pixelateBlockPx: HERO_BUST_PIXELATE_BLOCK_PX,
    pixelateStampBlockSpan: HERO_BUST_PIXELATE_STAMP_BLOCK_SPAN,
    pixelateMaskDecay: HERO_BUST_PIXELATE_MASK_DECAY,
    pixelateStampStrength: HERO_BUST_PIXELATE_MASK_STAMP_STRENGTH,
    logLabel: "HeroBustGlitch",
  });
}
