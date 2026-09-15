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
export const WIREFRAME_GLOBE_LINE_WIDTH_PX = 2.25;

/** Cap devicePixelRatio — watermark does not need retina sharpness. */
export const WIREFRAME_GLOBE_DPR_CAP_DESKTOP = 1.5;
export const WIREFRAME_GLOBE_DPR_CAP_MOBILE = 1;

/** Treat viewports below this width as mobile for DPR. */
export const WIREFRAME_GLOBE_MOBILE_MAX_WIDTH = 768;

/**
 * Base sphere radius in world units. Scale keeps the camera inside
 * (see {@link WIREFRAME_GLOBE_INTERIOR_SCALE}).
 */
export const WIREFRAME_GLOBE_RADIUS = 1;

/**
 * Camera sits inside the sphere (experiment: immersive wireframe).
 * Must stay below scaled radius (`RADIUS * INTERIOR_SCALE`).
 */
export const WIREFRAME_GLOBE_CAMERA_Z = 0.55;

/** Vertical FOV for the globe camera (degrees). Wider when viewing from inside. */
export const WIREFRAME_GLOBE_CAMERA_FOV = 85;

/**
 * World scale applied in `setSize` — large enough that the camera is
 * internal on mobile and desktop (no exterior silhouette).
 */
export const WIREFRAME_GLOBE_INTERIOR_SCALE = 2.4;

/**
 * Soft follow speed for line color/opacity when crossing section themes.
 * Higher = snappier; lower = longer fade (seconds toward the blend target).
 */
export const WIREFRAME_GLOBE_THEME_FADE_S = 0.45;

/**
 * Opacity wave — thin transparent arc (top→bottom, slight diagonal).
 * Only lowers alpha; base theme opacity is the ceiling (never brighter than static).
 * Sharpness > 1 thins the transparent ridge.
 */
export const WIREFRAME_GLOBE_WAVE_AMP = 0.65;
export const WIREFRAME_GLOBE_WAVE_FREQ = 1.15;
export const WIREFRAME_GLOBE_WAVE_SPEED = 1.15;
export const WIREFRAME_GLOBE_WAVE_SHARPNESS = 10;
/** Weight of local X mixed into the wave axis (0 = pure vertical). */
export const WIREFRAME_GLOBE_WAVE_DIAGONAL = 0.35;

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
    lineOpacity: 0.035,
  },
  formats: {
    fillClassName: "wireframe-globe-fill-formats",
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
