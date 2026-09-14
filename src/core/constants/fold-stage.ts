/**
 * Desktop fold stage shell — tracks viewport width, plateaus at 1920px (3xl).
 * Cap must be 120rem (not 94.5) so stage cqw grows above the 1512 Figma frame
 * instead of locking type size until the 3xl breakpoint.
 */
export const FOLD_STAGE_SHELL_CLASS = "mx-auto w-full max-w-[120rem]";
