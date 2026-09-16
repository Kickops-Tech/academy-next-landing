import {
  CONTENTS_DESKTOP_FRAME,
  CONTENTS_MOBILE_FRAME,
  type ContentsLayoutVariant,
} from "@features/contents/constants/contents-layout";

/**
 * Figma bottom band — crop the full frame so only the column zone shows.
 * Y from frame top; height = frame.height - top (715:2054 / 659:435).
 *
 * Higher tops = shorter empty band above crowns (tighter fold under topics).
 * Mobile earliest shaft ~399; desktop crowns ~430–450 in Figma crop.
 */
export const CONTENTS_COLUMN_BAND_TOP: Record<ContentsLayoutVariant, number> = {
  mobile: 420,
  desktop: 430,
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

/**
 * Max strip height (svh). When natural band height exceeds this, the stage
 * scales on Y only from the bottom — full width is always preserved.
 */
export const CONTENTS_COLUMNS_STRIP_MAX_SVH: Record<
  ContentsLayoutVariant,
  number
> = {
  mobile: 38,
  desktop: 45,
};

/**
 * Composition scale inside the strip. Keep at 1 — uniform scale < 1 with
 * origin-bottom left empty gutters on tablet/wide md–xl widths.
 */
export const CONTENTS_COLUMNS_BAND_SCALE: Record<ContentsLayoutVariant, number> =
  {
    mobile: 1,
    desktop: 1,
  };

/**
 * Soft top edge only — blends the strip crop into the white page without
 * the heavy veil used on the full stage previously.
 */
export const CONTENTS_COLUMNS_STRIP_EDGE_MASK =
  "linear-gradient(to bottom, transparent 0%, black 12%, black 100%)";

/**
 * Strip viewport height + uniform fit scale so max-svh never flattens shafts
 * (legacy scaleY crushed columns on short iOS viewports).
 */
export function getContentsColumnStripFit(
  width: number,
  viewportHeight: number,
  variant: ContentsLayoutVariant,
) {
  const bandAspect = getContentsColumnBandWidthAspect(variant);
  const maxSvh = CONTENTS_COLUMNS_STRIP_MAX_SVH[variant];
  const naturalHeight = width * bandAspect;
  const maxHeight = (maxSvh / 100) * viewportHeight;
  const stripHeight =
    naturalHeight > 0 ? Math.min(naturalHeight, maxHeight) : 0;
  const fitScale =
    naturalHeight > 0 ? Math.min(1, stripHeight / naturalHeight) : 1;

  return { stripHeight, fitScale, naturalHeight };
}
