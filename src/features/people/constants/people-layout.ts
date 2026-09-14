/** Frame desktop Figma 682:978 (conteúdo sem footer embutido). */
export const PEOPLE_DESKTOP_FRAME = {
  width: 1512,
  height: 899,
} as const;

/** Frame mobile Figma 721:2163. */
export const PEOPLE_MOBILE_FRAME = {
  width: 393,
  height: 1063,
} as const;

export type PeopleLayoutVariant = "desktop" | "mobile";

export const PEOPLE_CAROUSEL_MS = 360;

/**
 * Strip travel as a fraction of track width — short of a full card so the
 * neighbor peeks/bleeds outside the stage early (continuity), without needing
 * to drag past the whole card.
 */
export const PEOPLE_CAROUSEL_TRAVEL_FRACTION = 0.48;

/**
 * Extra space between current and neighbor on the strip (fraction of track).
 * Keeps cards from reading as glued during drag.
 */
export const PEOPLE_CAROUSEL_STRIP_GAP_FRACTION = 0.14;

/** Commit when drag reaches this fraction of track width. */
export const PEOPLE_CAROUSEL_DRAG_COMMIT_FRACTION = 0.16;
