/**
 * Shared wireframe globe watermark (Target → Formats/People band).
 */

export type WireframeGlobeTheme = "target" | "contents" | "formats";

export const WIREFRAME_GLOBE_SECTION_ATTR = "data-globe-section";

/** Latitude / longitude segment count for the sphere mesh. */
export const WIREFRAME_GLOBE_SEGMENTS = 48;

/** Continuous Y rotation (radians per second). */
export const WIREFRAME_GLOBE_ROTATION_RAD_S = 0.08;

/** Screen-space line thickness (px) — fat lines via LineSegments2. */
export const WIREFRAME_GLOBE_LINE_WIDTH_PX = 2.75;

/** Cap devicePixelRatio — watermark does not need retina sharpness. */
export const WIREFRAME_GLOBE_DPR_CAP_DESKTOP = 1.5;
export const WIREFRAME_GLOBE_DPR_CAP_MOBILE = 1;

/** Treat viewports below this width as mobile for DPR. */
export const WIREFRAME_GLOBE_MOBILE_MAX_WIDTH = 768;

/**
 * Base sphere radius in world units (scaled in `setSize` to
 * {@link WIREFRAME_GLOBE_WIDTH_RATIO} of the viewport width).
 */
export const WIREFRAME_GLOBE_RADIUS = 1;

export const WIREFRAME_GLOBE_CAMERA_Z = 2.55;

/** Vertical FOV for the globe camera (degrees). */
export const WIREFRAME_GLOBE_CAMERA_FOV = 42;

/** Target on-screen diameter as a fraction of canvas width. */
export const WIREFRAME_GLOBE_WIDTH_RATIO = 0.7;

/**
 * Soft follow speed for line color/opacity when crossing section themes.
 * Higher = snappier; lower = longer fade (seconds toward the blend target).
 */
export const WIREFRAME_GLOBE_THEME_FADE_S = 0.45;

/** Line colors / opacity per section theme (CSS hex + alpha 0–1). */
export const WIREFRAME_GLOBE_THEME = {
  target: {
    fillClassName: "bg-kickops-yellow",
    lineColor: "#121212",
    lineOpacity: 0.09,
  },
  contents: {
    fillClassName: "bg-white",
    lineColor: "#121212",
    lineOpacity: 0.015,
  },
  formats: {
    fillClassName: "bg-kickops-gray",
    lineColor: "#f5f5f5",
    lineOpacity: 0.035,
  },
} as const satisfies Record<
  WireframeGlobeTheme,
  { fillClassName: string; lineColor: string; lineOpacity: number }
>;

export const WIREFRAME_GLOBE_THEMES: WireframeGlobeTheme[] = [
  "target",
  "contents",
  "formats",
];
