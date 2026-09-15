/** Frame desktop Figma 677:816. */
export const FORMATS_DESKTOP_FRAME = {
  width: 1512,
  height: 982,
} as const;

/** Frame mobile Figma 721:2099. */
export const FORMATS_MOBILE_FRAME = {
  width: 393,
  height: 852,
} as const;

export type FormatsLayoutVariant = "desktop" | "mobile";

export const FORMATS_MOBILE_BLOCK_WIDTH = 260;
export const FORMATS_MOBILE_BLOCK_GAP = 20;

/** Desktop block left edges (Figma 918:286). */
export const FORMATS_DESKTOP_BLOCK_LEFT = {
  formato: 199,
  conteudo: 577,
  investimento: 955,
} as const;

/**
 * Vertical positions in desktop frame (Figma 918:286).
 * Notice bar `918:351` @ 335; blocks resume below it.
 */
export const FORMATS_DESKTOP_TOP = {
  notice: 335,
  blocks: 500,
  cta: 780,
} as const;
