/**
 * Display fonts registered in `layout.tsx` / `main.css` @theme.
 * Used for sporadic font glitch on Hero headlines.
 */
export const HERO_DISPLAY_FONT_CLASSES = [
  "font-abril-fatface",
  "font-dm-mono",
  "font-mrs-saint-delafield",
  "font-orbitron",
  "font-alfa-slab-one",
  "font-league-gothic",
] as const;

export type HeroDisplayFontClass = (typeof HERO_DISPLAY_FONT_CLASSES)[number];

/** Canonical font for “Artificial” outside glitch bursts. */
export const HERO_ARTIFICIAL_FONT: HeroDisplayFontClass = "font-league-gothic";
