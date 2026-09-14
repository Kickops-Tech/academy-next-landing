/** Frame desktop Figma 659:186 — coordenadas para layout proporcional. */
export const TARGET_DESKTOP_FRAME = {
  width: 1512,
  height: 982,
} as const;

/** Frame mobile Figma 702:1461. */
export const TARGET_MOBILE_FRAME = {
  width: 393,
  height: 1471,
} as const;

export type TargetLayoutVariant = "desktop" | "mobile";

export type TargetCardId = "corporate" | "tech" | "improvement";

type FigmaBox = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type NormalizedBox = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type NormalizedPoint = {
  left: number;
  top: number;
};

type TextBlockLayout = NormalizedPoint & {
  width?: number;
};

export type CorporateCardLayout = {
  globe: NormalizedBox;
  label: TextBlockLayout;
  title: TextBlockLayout;
  description: TextBlockLayout;
  arrow: NormalizedBox;
};

export type TechCardLayout = {
  image: NormalizedBox;
  label: TextBlockLayout;
  title: TextBlockLayout;
  description: TextBlockLayout;
};

export type ImprovementCardLayout = {
  image: NormalizedBox;
  /** Figma wraps 222×333 art in a larger frame and rotates the art. */
  imageRotate?: boolean;
  /** Art size in Figma px (defaults to the `image` box when omitted). */
  imageArt?: { width: number; height: number };
  label: TextBlockLayout;
  title: TextBlockLayout;
  description: TextBlockLayout;
};

function toPercent(value: number, total: number) {
  return `${(value / total) * 100}%`;
}

function normBox(
  left: number,
  top: number,
  width: number,
  height: number,
  cardW: number,
  cardH: number,
): NormalizedBox {
  return {
    left: left / cardW,
    top: top / cardH,
    width: width / cardW,
    height: height / cardH,
  };
}

function normText(
  left: number,
  top: number,
  cardW: number,
  cardH: number,
  width?: number,
): TextBlockLayout {
  return {
    left: left / cardW,
    top: top / cardH,
    ...(width !== undefined ? { width: width / cardW } : {}),
  };
}

export function figmaBoxStyle(
  box: FigmaBox,
  frame: { width: number; height: number } = TARGET_DESKTOP_FRAME,
): {
  left: string;
  top: string;
  width: string;
  height: string;
} {
  return {
    left: toPercent(box.left, frame.width),
    top: toPercent(box.top, frame.height),
    width: toPercent(box.width, frame.width),
    height: toPercent(box.height, frame.height),
  };
}

export function normalizedBoxStyle(box: NormalizedBox): {
  left: string;
  top: string;
  width: string;
  height: string;
} {
  return {
    left: toPercent(box.left, 1),
    top: toPercent(box.top, 1),
    width: toPercent(box.width, 1),
    height: toPercent(box.height, 1),
  };
}

export function normalizedPointStyle(point: NormalizedPoint): {
  left: string;
  top: string;
} {
  return {
    left: toPercent(point.left, 1),
    top: toPercent(point.top, 1),
  };
}

export const TARGET_DESKTOP_LAYOUT = {
  pra: { left: 428, top: 75, width: 326, height: 216 },
  quem: { left: 731, top: 58, width: 430, height: 260 },
  /** Absoluto no frame: Layer_1 (79,-128) + instance (121,464). */
  corporate: { left: 200, top: 388, width: 640, height: 511 },
  tech: { left: 860, top: 387, width: 452, height: 246 },
  improvement: { left: 860, top: 652, width: 452, height: 246 },
} as const satisfies Record<string, FigmaBox>;

export const TARGET_MOBILE_LAYOUT = {
  pra: { left: 51, top: 67, width: 139, height: 92 },
  quem: { left: 175, top: 37, width: 165, height: 148 },
  corporate: { left: 16, top: 225, width: 361, height: 587 },
  tech: { left: 16, top: 828, width: 361, height: 378 },
  improvement: { left: 16, top: 1222, width: 361, height: 246 },
} as const satisfies Record<string, FigmaBox>;

const CORPORATE_DESKTOP_W = 640;
const CORPORATE_DESKTOP_H = 511;
const CORPORATE_MOBILE_W = 361;
const CORPORATE_MOBILE_H = 587;

export const TARGET_CORPORATE_CARD_LAYOUT: Record<
  TargetLayoutVariant,
  CorporateCardLayout
> = {
  desktop: {
    globe: normBox(-197, -39, 757, 377, CORPORATE_DESKTOP_W, CORPORATE_DESKTOP_H),
    label: normText(31.75, 368.75, CORPORATE_DESKTOP_W, CORPORATE_DESKTOP_H),
    title: normText(31.75, 397.75, CORPORATE_DESKTOP_W, CORPORATE_DESKTOP_H, 360),
    description: normText(31.75, 438.75, CORPORATE_DESKTOP_W, CORPORATE_DESKTOP_H, 360),
    arrow: normBox(547.75, 418.75, 60, 60, CORPORATE_DESKTOP_W, CORPORATE_DESKTOP_H),
  },
  mobile: {
    globe: normBox(-412, -39, 757, 377, CORPORATE_MOBILE_W, CORPORATE_MOBILE_H),
    label: normText(32, 369, CORPORATE_MOBILE_W, CORPORATE_MOBILE_H),
    title: normText(32, 398, CORPORATE_MOBILE_W, CORPORATE_MOBILE_H, 360),
    description: normText(32, 439, CORPORATE_MOBILE_W, CORPORATE_MOBILE_H, 297),
    arrow: normBox(32, 495, 60, 60, CORPORATE_MOBILE_W, CORPORATE_MOBILE_H),
  },
};

const TECH_DESKTOP_W = 452;
const TECH_DESKTOP_H = 246;
const TECH_MOBILE_W = 361;
const TECH_MOBILE_H = 378;

export const TARGET_TECH_CARD_LAYOUT: Record<TargetLayoutVariant, TechCardLayout> = {
  desktop: {
    image: normBox(237, -27, 346, 230, TECH_DESKTOP_W, TECH_DESKTOP_H),
    // Raised vs Figma so a 3-line body still keeps ~32px bottom inset.
    label: normText(32, 58, TECH_DESKTOP_W, TECH_DESKTOP_H),
    title: normText(32, 87, TECH_DESKTOP_W, TECH_DESKTOP_H, 221),
    description: normText(32, 148, TECH_DESKTOP_W, TECH_DESKTOP_H, 308),
  },
  mobile: {
    image: normBox(12, -43, 346, 230, TECH_MOBILE_W, TECH_MOBILE_H),
    label: normText(32, 207, TECH_MOBILE_W, TECH_MOBILE_H),
    title: normText(32, 236, TECH_MOBILE_W, TECH_MOBILE_H, 221),
    description: normText(32, 302, TECH_MOBILE_W, TECH_MOBILE_H, 308),
  },
};

const IMPROVEMENT_DESKTOP_W = 452;
const IMPROVEMENT_DESKTOP_H = 246;
const IMPROVEMENT_MOBILE_W = 361;
const IMPROVEMENT_MOBILE_H = 246;

export const TARGET_IMPROVEMENT_CARD_LAYOUT: Record<
  TargetLayoutVariant,
  ImprovementCardLayout
> = {
  desktop: {
    image: normBox(283, 0, 222, 333, IMPROVEMENT_DESKTOP_W, IMPROVEMENT_DESKTOP_H),
    label: normText(32, 79, IMPROVEMENT_DESKTOP_W, IMPROVEMENT_DESKTOP_H),
    title: normText(32, 108, IMPROVEMENT_DESKTOP_W, IMPROVEMENT_DESKTOP_H, 221),
    description: normText(32, 174, IMPROVEMENT_DESKTOP_W, IMPROVEMENT_DESKTOP_H, 308),
  },
  mobile: {
    // Figma 715:2056 — 392² frame at (170.75, -100.25); art 222×333 @ -45° centered.
    image: normBox(
      170.75,
      -100.25,
      392.444,
      392.444,
      IMPROVEMENT_MOBILE_W,
      IMPROVEMENT_MOBILE_H,
    ),
    imageRotate: true,
    imageArt: { width: 222, height: 333 },
    label: normText(31.75, 78.75, IMPROVEMENT_MOBILE_W, IMPROVEMENT_MOBILE_H),
    title: normText(31.75, 107.75, IMPROVEMENT_MOBILE_W, IMPROVEMENT_MOBILE_H, 221),
    description: normText(
      31.75,
      173.75,
      IMPROVEMENT_MOBILE_W,
      IMPROVEMENT_MOBILE_H,
      308,
    ),
  },
};

export function getStageCardStyle(
  id: TargetCardId,
  variant: TargetLayoutVariant,
) {
  const layout =
    variant === "desktop" ? TARGET_DESKTOP_LAYOUT : TARGET_MOBILE_LAYOUT;
  const frame =
    variant === "desktop" ? TARGET_DESKTOP_FRAME : TARGET_MOBILE_FRAME;

  return figmaBoxStyle(layout[id], frame);
}
