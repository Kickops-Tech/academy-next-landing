/**
 * Hero bust layer assets for the Landing glitch pipeline.
 *
 * @module features/hero/constants/hero-bust-layers
 * @see {@link https://github.com/yuiti/academy-next-landing/blob/main/CONTEXT.md} — Hero domain term
 */

import type { GlitchGridConfig } from "@core/lib/image-glitch/glitch-grid";
import { DEFAULT_GLITCH_CONFIG } from "@core/lib/image-glitch/glitch-grid";
import type { GlitchSignalPresetId } from "@core/lib/image-glitch/glitch-signal-presets";
import type { GlitchShaderVariant } from "@core/lib/image-glitch/glitch-webgl";

/** Figma bust frame aspect (614×1030). */
export const HERO_BUST_ASPECT = 614 / 1030;

/**
 * Public paths for the classical bust layers.
 *
 * - `bust-1` — default base sculpture (always visible outside glitched cells).
 * - `bust-2` — pixel-color overlay (Figma “Pixel_Colors”) — vaporwave only.
 * - `bust-3` / `bust-4` — alternate glitch sources — vaporwave only.
 */
export const HERO_BUST_LAYERS = [
  "/img/home/bust-1.png",
  "/img/home/bust-2.png",
  "/img/home/bust-3.png",
  "/img/home/bust-4.png",
] as const;

/** Default layer (`bust-1`) — used as static fallback while WebGL loads. */
export const HERO_BUST_DEFAULT_LAYER = HERO_BUST_LAYERS[0];

/**
 * Signal glitch uses only the base bust (no layer swap). Flip to `vaporwave`
 * to restore the legacy CRT multi-layer shader.
 */
export const HERO_BUST_GLITCH_SHADER: GlitchShaderVariant = "signal";

/** `landing` = LP-friendly; `reference` = stronger Figma-like intensity. */
export const HERO_BUST_GLITCH_PRESET: GlitchSignalPresetId = "landing";

/** Base-only texture list for the signal path. */
export const HERO_BUST_SIGNAL_LAYERS = [HERO_BUST_DEFAULT_LAYER] as const;

/**
 * Grid config for signal: no Layer mode weight (flip/displace live in the FS).
 */
export const HERO_BUST_SIGNAL_GLITCH_CONFIG: GlitchGridConfig = {
  ...DEFAULT_GLITCH_CONFIG,
  effectWeights: [0.55, 0.2, 0.25, 0],
};

/** Screen-pixel block size for hover pixelate (one mask cell = one visual block). */
export const HERO_BUST_PIXELATE_BLOCK_PX = 48;

/**
 * Odd span of pixel blocks lit under the pointer (3 = 3×3 blocks, all-or-nothing).
 */
export const HERO_BUST_PIXELATE_STAMP_BLOCK_SPAN = 3;

/** Per-frame fade for lit blocks (0–255 mask). Lower = longer dissolve. */
export const HERO_BUST_PIXELATE_MASK_DECAY = 4;

/** Peak strength written when the pointer hits a block. */
export const HERO_BUST_PIXELATE_MASK_STAMP_STRENGTH = 255;
