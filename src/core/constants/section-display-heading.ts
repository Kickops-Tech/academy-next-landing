/**
 * Shared two-word LP section titles (all folds except Hero).
 *
 * Sized in `cqw` inside each feature’s `@container` stage. Desktop uses
 * `clamp` so wide stages (~1280+) don’t let display type dwarf the fold
 * or spill off artwork (e.g. MENTES on the brain).
 */
export const SECTION_DISPLAY_HEADING = {
  mobile: {
    lead: "text-[7.8cqw]",
    display: "text-[19.5cqw]",
  },
  desktop: {
    lead: "text-[clamp(2.5rem,4.8cqw,4.5rem)]",
    display: "text-[clamp(5rem,9.5cqw,8.75rem)]",
  },
} as const;

/** @deprecated Prefer {@link SECTION_DISPLAY_HEADING.mobile}. */
export const SECTION_DISPLAY_HEADING_MOBILE = SECTION_DISPLAY_HEADING.mobile;
