import {
  CONTENTS_DESKTOP_FRAME,
  CONTENTS_MOBILE_FRAME,
  type ContentsLayoutVariant,
} from "@features/contents/constants/contents-layout";

/**
 * Figma bottom band — crop the full frame so only the column zone shows.
 * Y from frame top; height = frame.height - top (715:2054 / 659:435).
 *
 * Mobile: earliest shaft top ≈ 399 → band from 380.
 * Desktop/tablet strip: start above the capital crowns (~300) so the hard
 * crop doesn’t guillotine volutes (was 430 — tops looked cut off on md–xl).
 */
export const CONTENTS_COLUMN_BAND_TOP: Record<ContentsLayoutVariant, number> = {
  mobile: 380,
  desktop: 300,
};

export function getContentsColumnBandHeight(variant: ContentsLayoutVariant) {
  const frame =
    variant === "desktop" ? CONTENTS_DESKTOP_FRAME : CONTENTS_MOBILE_FRAME;
  return frame.height - CONTENTS_COLUMN_BAND_TOP[variant];
}

/**
 * Visible band height as fraction of container width (Figma frame).
 * Used so the strip matches shaft proportions instead of a short vw clamp.
 */
export function getContentsColumnBandWidthAspect(
  variant: ContentsLayoutVariant,
) {
  const frame =
    variant === "desktop" ? CONTENTS_DESKTOP_FRAME : CONTENTS_MOBILE_FRAME;
  return getContentsColumnBandHeight(variant) / frame.width;
}

/** Full Figma composition scale inside the cropped band (no extra shrink). */
export const CONTENTS_COLUMNS_BAND_SCALE = 1;

/**
 * Soft top edge only — blends the strip crop into the white page without
 * the heavy veil used on the full stage previously.
 */
export const CONTENTS_COLUMNS_STRIP_EDGE_MASK =
  "linear-gradient(to bottom, transparent 0%, black 10%, black 100%)";
