/**
 * Scroll parallax tuning for the Hero section.
 *
 * @module features/hero/constants/hero-scroll-parallax
 */

/** Upward travel for the bust stage (vh per full hero scroll). */
export const HERO_SCROLL_BUST_TRANSLATE_VH = 34;

/** Upward travel for the title block (vh per full hero scroll). */
export const HERO_SCROLL_TITLE_TRANSLATE_VH = 22;

/** Upward travel for copy + CTA (vh per full hero scroll). */
export const HERO_SCROLL_COPY_TRANSLATE_VH = 13;

/** Max opacity loss for the bust (0–1). Lower exponent = slower fade. */
export const HERO_SCROLL_BUST_FADE_EXPONENT = 0.72;
export const HERO_SCROLL_BUST_FADE_AMOUNT = 0.95;

/** Titles fade out faster than the bust. */
export const HERO_SCROLL_TITLE_FADE_EXPONENT = 1.35;
export const HERO_SCROLL_TITLE_FADE_AMOUNT = 1;

/** Supporting copy / CTA fade fastest. */
export const HERO_SCROLL_COPY_FADE_EXPONENT = 1.65;
export const HERO_SCROLL_COPY_FADE_AMOUNT = 1;
