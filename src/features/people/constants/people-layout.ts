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

/** Horizontal travel for enter/exit swipe (direction-aware). */
export const PEOPLE_CAROUSEL_SWIPE_X = "42%";
