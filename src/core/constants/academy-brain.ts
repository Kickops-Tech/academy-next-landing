/**
 * Brain — Figma People `682:1023` (D) / `721:2165` (M).
 * Desktop: stage % in People (bleeds into Formats) + scroll parallax up.
 * Below xl: flow layout (short content box can’t use raw Figma %).
 */

/** Set false to restore static brain (no WebGL / no pointer-events passthrough). */
export const ACADEMY_BRAIN_GLITCH_ENABLED = true;

export const ACADEMY_BRAIN_IMAGE = "/img/people/brain.png";

export const ACADEMY_BRAIN_PIXELATE_BLOCK_PX = 48;
export const ACADEMY_BRAIN_PIXELATE_STAMP_BLOCK_SPAN = 3;
export const ACADEMY_BRAIN_PIXELATE_MASK_DECAY = 4;
export const ACADEMY_BRAIN_PIXELATE_MASK_STAMP_STRENGTH = 255;

export const ACADEMY_BRAIN = {
  desktop: {
    left: -101,
    // Figma -517; nudged down so more crown sits in People / less in Formats.
    topPeople: -400,
    size: 1616,
    frameWidth: 1512,
    peopleFrameHeight: 899,
  },
  mobile: {
    left: -301,
    topPeople: -414,
    size: 997,
    frameWidth: 393,
    peopleFrameHeight: 1063,
  },
} as const;

export type AcademyBrainVariant = keyof typeof ACADEMY_BRAIN;

/**
 * `stage` — Figma % box (desktop People stage).
 * `flow` — below-xl People: large art shifted up into the fold.
 */
export type AcademyBrainLayout = "stage" | "flow";

/**
 * Flow (md/phone People): pull crown into the heading/carousel band.
 * Width mirrors Figma mobile ~997/393 ≈ 254vw, capped for tablet.
 */
export const ACADEMY_BRAIN_FLOW = {
  width: "min(254vw, 90rem)",
  /** % of box height — negative pulls the silhouette upward. */
  shiftY: "-16%",
} as const;

/** Extra upward travel (vh) across the gray Formats+People band scroll. */
export const ACADEMY_BRAIN_PARALLAX_TRANSLATE_VH = 30;

export const ACADEMY_BRAIN_PARALLAX_CSS_Y = "--brain-y";
