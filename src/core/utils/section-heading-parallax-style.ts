import {
  SECTION_HEADING_CSS,
  SECTION_HEADING_ENTER_FROM_Y_PX,
  SECTION_HEADING_ENTER_OFFSET_CQW,
} from "@core/constants/section-heading-parallax";
import type { CSSProperties } from "react";

/** Lead word — driven by CSS vars on the parent `<section>`. */
export const SECTION_HEADING_LEAD_STYLE: CSSProperties = {
  transform: `translate3d(var(${SECTION_HEADING_CSS.leadX}, 0px), var(${SECTION_HEADING_CSS.leadY}, 0px), 0)`,
  opacity: `var(${SECTION_HEADING_CSS.opacity}, 1)`,
};

/** Trail word — faster vertical rate via its own Y var. */
export const SECTION_HEADING_TRAIL_STYLE: CSSProperties = {
  transform: `translate3d(var(${SECTION_HEADING_CSS.trailX}, 0px), var(${SECTION_HEADING_CSS.trailY}, 0px), 0)`,
  opacity: `var(${SECTION_HEADING_CSS.opacity}, 1)`,
};

/** Pre-hydration defaults on `<section>` until the scroll hook writes. */
export const SECTION_HEADING_SECTION_STYLE: CSSProperties = {
  [SECTION_HEADING_CSS.leadX]: `-${SECTION_HEADING_ENTER_OFFSET_CQW}vw`,
  [SECTION_HEADING_CSS.trailX]: `${SECTION_HEADING_ENTER_OFFSET_CQW}vw`,
  [SECTION_HEADING_CSS.leadY]: `${SECTION_HEADING_ENTER_FROM_Y_PX}px`,
  [SECTION_HEADING_CSS.trailY]: `${SECTION_HEADING_ENTER_FROM_Y_PX}px`,
  [SECTION_HEADING_CSS.opacity]: "0",
} as CSSProperties;
