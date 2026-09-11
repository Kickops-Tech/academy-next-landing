/**
 * Hero bust layer assets for the Landing glitch pipeline.
 *
 * @module features/hero/constants/hero-bust-layers
 * @see {@link https://github.com/yuiti/academy-next-landing/blob/main/CONTEXT.md} — Hero domain term
 */

/** Figma bust frame aspect (614×1030). */
export const HERO_BUST_ASPECT = 614 / 1030;

/**
 * Public paths for the classical bust layers.
 *
 * - `bust-1` — default base sculpture (always visible outside glitched cells).
 * - `bust-2` — pixel-color overlay (Figma “Pixel_Colors”).
 * - `bust-3` / `bust-4` — alternate glitch sources for randomized cells.
 */
export const HERO_BUST_LAYERS = [
  "/img/home/bust-1.png",
  "/img/home/bust-2.png",
  "/img/home/bust-3.png",
  "/img/home/bust-4.png",
] as const;

/** Default layer (`bust-1`) — used as static fallback while WebGL loads. */
export const HERO_BUST_DEFAULT_LAYER = HERO_BUST_LAYERS[0];

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
