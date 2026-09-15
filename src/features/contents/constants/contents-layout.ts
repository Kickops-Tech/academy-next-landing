import type { ContentsTopicId } from "@features/contents/constants/contents-topics";

/** Frame desktop Figma 659:435. */
export const CONTENTS_DESKTOP_FRAME = {
  width: 1512,
  height: 982,
} as const;

/** Frame mobile Figma 715:2054. */
export const CONTENTS_MOBILE_FRAME = {
  width: 393,
  height: 852,
} as const;

export type ContentsLayoutVariant = "desktop" | "mobile";

export type ContentsColumnId = "col1" | "col2" | "col3" | "col4";

export type { ContentsTopicId };

type FigmaBox = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/**
 * Figma rotation wrappers: outer AABB centers an inner image, then rotate/flip.
 * Image sizes are the pre-transform art boxes from the frame.
 */
export type ContentsColumnLayer = {
  id: ContentsColumnId;
  src: string;
  box: FigmaBox;
  image: { width: number; height: number };
  rotateDeg: number;
  scaleX?: number;
  scaleY?: number;
  /** Multiplier on horizontal fan-out (1 = default; >1 pushes outer flanks further). */
  spreadWeight?: number;
};

function toPercent(value: number, total: number) {
  return `${(value / total) * 100}%`;
}

export function figmaBoxStyle(
  box: FigmaBox,
  frame: { width: number; height: number },
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

/** Topic card shell — icon/type scale via stage `cqw` on desktop. */
export const CONTENTS_TOPIC_CARD = {
  width: 228,
  height: 268,
  /** Visual size vs Figma 90px — reduced (~64px @ 1512). */
  iconCqw: 4.23,
  /**
   * Type vs stage width — ~88% of Figma 12/18/14 @ 1512 so wide
   * viewports grow slower and body copy clears the column art.
   */
  labelCqw: 0.7,
  titleCqw: 1.05,
  bodyCqw: 0.815,
} as const;

export const CONTENTS_DESKTOP_LAYOUT = {
  // Topic tops opened vs Figma 335 — title→content air matches LP visual
  // (fold-compress no longer pulls cards up into the heading).
  past: { left: 200, top: 380, width: 228, height: 268 },
  inflection: { left: 483, top: 380, width: 228, height: 268 },
  now: { left: 766, top: 380, width: 228, height: 268 },
  future: { left: 1049, top: 380, width: 228, height: 268 },
  glow1: { left: 237 - 120, top: 773 - 120, width: 548, height: 548 },
  glow2: { left: 654 - 120, top: 773 - 120, width: 548, height: 548 },
  glow3: { left: 1000 - 120, top: 825 - 120, width: 548, height: 548 },
} as const satisfies Record<string, FigmaBox>;

export const CONTENTS_MOBILE_LAYOUT = {
  topicsRail: { left: 16, top: 216, width: 361, height: 268 },
  glow1: { left: 36 - 60, top: 681 - 60, width: 239, height: 239 },
  glow2: { left: 197 - 60, top: 761 - 60, width: 238, height: 239 },
  glow3: { left: 300 - 60, top: 691 - 60, width: 239, height: 239 },
} as const satisfies Record<string, FigmaBox>;

const DESKTOP_COLUMN_IMAGE = { width: 988, height: 1482 } as const;
const MOBILE_COLUMN_IMAGE = { width: 381, height: 571 } as const;

/**
 * Desktop column stack — Figma 659:435 paint order (back → front).
 * Assets: PM1→01, PM2→02, PM4/PM3→04.
 */
export const CONTENTS_DESKTOP_COLUMNS: readonly ContentsColumnLayer[] = [
  {
    id: "col1",
    src: "/img/contents/column-04.png",
    box: { left: -246, top: 429, width: 1597, height: 1778 },
    image: DESKTOP_COLUMN_IMAGE,
    rotateDeg: 30,
    scaleY: -1,
    spreadWeight: 1.15,
  },
  {
    id: "col2",
    src: "/img/contents/column-02.png",
    box: { left: -621, top: 7, width: 1597, height: 1778 },
    image: DESKTOP_COLUMN_IMAGE,
    rotateDeg: -30,
    spreadWeight: 1.45,
  },
  {
    id: "col3",
    src: "/img/contents/column-04.png",
    box: { left: -488, top: 463, width: 1747, height: 1747 },
    image: DESKTOP_COLUMN_IMAGE,
    rotateDeg: 45,
    spreadWeight: 1.1,
  },
  {
    id: "col4",
    src: "/img/contents/column-01.png",
    box: { left: 394, top: 136, width: 1778, height: 1597 },
    image: DESKTOP_COLUMN_IMAGE,
    rotateDeg: 60,
    spreadWeight: 1.4,
  },
] as const;

/**
 * Mobile column stack — Figma 715:2054 paint order (back → front).
 */
export const CONTENTS_MOBILE_COLUMNS: readonly ContentsColumnLayer[] = [
  {
    id: "col1",
    src: "/img/contents/column-04.png",
    box: { left: -160, top: 499, width: 615, height: 685 },
    image: MOBILE_COLUMN_IMAGE,
    rotateDeg: 30,
    scaleY: -1,
    spreadWeight: 1.2,
  },
  {
    id: "col2",
    src: "/img/contents/column-02.png",
    box: { left: -240, top: 399, width: 516, height: 650 },
    image: MOBILE_COLUMN_IMAGE,
    rotateDeg: -15,
    spreadWeight: 1.35,
  },
  {
    id: "col3",
    src: "/img/contents/column-04.png",
    box: { left: -231, top: 449, width: 673, height: 673 },
    image: MOBILE_COLUMN_IMAGE,
    rotateDeg: 45,
    spreadWeight: 1.1,
  },
  {
    id: "col4",
    src: "/img/contents/column-01.png",
    box: { left: 19, top: 459, width: 685, height: 615 },
    image: MOBILE_COLUMN_IMAGE,
    rotateDeg: 60,
    spreadWeight: 1.3,
  },
] as const;

/** Peek: second card starts at x=296 in a 393 frame (Figma). */
export const CONTENTS_MOBILE_TOPIC_GAP =
  296 - 16 - CONTENTS_TOPIC_CARD.width;

/**
 * Composition scale vs Figma boxes. Pointer parallax stays independent.
 *
 * Desktop base scale is height-clamped on short viewports (see
 * {@link getContentsColumnScale}) so shafts stay visible without hard crops.
 */
export const CONTENTS_COLUMNS_SCALE = {
  desktop: 0.9,
  mobile: 0.88,
} as const;

/** Floor for desktop height clamp (~0.55–0.65 target at 1366×768). */
export const CONTENTS_COLUMNS_SCALE_MIN = {
  desktop: 0.55,
  mobile: 0.88,
} as const;

/**
 * Soft top fade — desktop reveals earlier with a longer band so short
 * viewports do not get a hard “diagonal” cut across rotated shafts.
 * (Desktop xl stage keeps fadeTop off by default — Figma shows full crowns;
 * stops kept for strip/experiments.)
 */
export const CONTENTS_COLUMNS_MASK = {
  desktop:
    "linear-gradient(to bottom, transparent 0%, transparent 30%, black 52%)",
  mobile:
    "linear-gradient(to bottom, transparent 0%, transparent 48%, black 58%)",
} as const;

/**
 * When the xl stage is taller than the Figma aspect (min-h-fold wins),
 * compress mid-fold vertical % so topic→column gap does not inflate.
 * Sweet spot (stage ≈ aspect height) → 1.
 */
export function getContentsFoldCompress(
  stageWidth: number,
  stageHeight: number,
) {
  if (stageWidth <= 0 || stageHeight <= 0) {
    return 1;
  }

  const aspectHeight =
    stageWidth *
    (CONTENTS_DESKTOP_FRAME.height / CONTENTS_DESKTOP_FRAME.width);

  return Math.min(1, aspectHeight / stageHeight);
}

/**
 * Desktop: shrink with viewport/stage height so composition fits short windows.
 * Tall folds (compress < 1): grow shafts toward the mid gap (origin-bottom).
 * Mobile: keep the constant base scale.
 */
export function getContentsColumnScale(
  stageHeight: number,
  viewportHeight: number,
  variant: ContentsLayoutVariant,
  foldCompress = 1,
) {
  const base = CONTENTS_COLUMNS_SCALE[variant];
  if (variant === "mobile") {
    return base;
  }

  if (stageHeight <= 0 || viewportHeight <= 0) {
    return base;
  }

  const heightFit = Math.min(1, viewportHeight / stageHeight);
  let scaled = base * heightFit;
  scaled = Math.min(
    base,
    Math.max(CONTENTS_COLUMNS_SCALE_MIN.desktop, scaled),
  );

  if (foldCompress < 1) {
    // Fill inflated mid-gap without exceeding full Figma scale.
    scaled = Math.min(1, scaled / foldCompress);
  }

  return scaled;
}

/**
 * Horizontal fan-out from frame center by container width.
 * `wideSpread` > 1 so even Figma-width stages distribute across the bottom.
 */
export const CONTENTS_COLUMNS_SPREAD = {
  desktop: {
    referenceWidth: CONTENTS_DESKTOP_FRAME.width,
    narrowWidth: 900,
    narrowSpread: 1.55,
    wideSpread: 1.32,
  },
  mobile: {
    referenceWidth: CONTENTS_MOBILE_FRAME.width,
    narrowWidth: 320,
    narrowSpread: 1.28,
    wideSpread: 1.12,
  },
} as const;

export function getContentsColumnSpread(
  width: number,
  variant: ContentsLayoutVariant,
) {
  const config = CONTENTS_COLUMNS_SPREAD[variant];
  const span = config.referenceWidth - config.narrowWidth;
  if (span <= 0) {
    return config.wideSpread;
  }

  const t = Math.min(
    1,
    Math.max(0, (width - config.narrowWidth) / span),
  );

  return (
    config.narrowSpread + (config.wideSpread - config.narrowSpread) * t
  );
}

/** Shift a Figma box away from / toward the frame center by `spread`. */
export function spreadFigmaBoxStyle(
  box: FigmaBox,
  frame: { width: number; height: number },
  spread: number,
  spreadWeight = 1,
) {
  const centerX = frame.width / 2;
  const boxCenter = box.left + box.width / 2;
  const shiftedLeft =
    box.left + (boxCenter - centerX) * (spread - 1) * spreadWeight;

  return figmaBoxStyle({ ...box, left: shiftedLeft }, frame);
}

export function getContentsColumns(variant: ContentsLayoutVariant) {
  return variant === "desktop"
    ? CONTENTS_DESKTOP_COLUMNS
    : CONTENTS_MOBILE_COLUMNS;
}

export function getContentsFrame(variant: ContentsLayoutVariant) {
  return variant === "desktop" ? CONTENTS_DESKTOP_FRAME : CONTENTS_MOBILE_FRAME;
}

export function getContentsTopicStyle(
  id: ContentsTopicId,
  variant: ContentsLayoutVariant,
) {
  if (variant === "mobile") {
    return undefined;
  }

  const box = figmaBoxStyle(CONTENTS_DESKTOP_LAYOUT[id], CONTENTS_DESKTOP_FRAME);
  return {
    left: box.left,
    // Keep Figma title→topic air; fold-compress only grows columns below.
    top: box.top,
    width: box.width,
  };
}

export function getContentsBoxStyle(
  key: keyof typeof CONTENTS_DESKTOP_LAYOUT,
  variant: ContentsLayoutVariant,
) {
  const layout =
    variant === "desktop" ? CONTENTS_DESKTOP_LAYOUT : CONTENTS_MOBILE_LAYOUT;
  const frame =
    variant === "desktop" ? CONTENTS_DESKTOP_FRAME : CONTENTS_MOBILE_FRAME;

  const box = layout[key as keyof typeof layout];
  if (!box) {
    return undefined;
  }

  return figmaBoxStyle(box, frame);
}
