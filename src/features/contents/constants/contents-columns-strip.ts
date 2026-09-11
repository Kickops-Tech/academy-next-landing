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
 * Desktop: capitals dominate under topics (~335–600) → band from 430.
 */
export const CONTENTS_COLUMN_BAND_TOP: Record<ContentsLayoutVariant, number> = {
  mobile: 380,
  desktop: 430,
};

export function getContentsColumnBandHeight(variant: ContentsLayoutVariant) {
  const frame =
    variant === "desktop" ? CONTENTS_DESKTOP_FRAME : CONTENTS_MOBILE_FRAME;
  return frame.height - CONTENTS_COLUMN_BAND_TOP[variant];
}

/** Soft blend into white above the shafts (flow strip only). */
export const CONTENTS_COLUMNS_BAND_MASK =
  "linear-gradient(to bottom, transparent 0%, black 22%, black 100%)";

/** Full Figma composition scale inside the cropped band (no extra shrink). */
export const CONTENTS_COLUMNS_BAND_SCALE = 1;
