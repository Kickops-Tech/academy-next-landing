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
  // Topic tops — Figma 659:435 (y=335).
  past: { left: 200, top: 335, width: 228, height: 268 },
  inflection: { left: 483, top: 335, width: 228, height: 268 },
  now: { left: 766, top: 335, width: 228, height: 268 },
  future: { left: 1049, top: 335, width: 228, height: 268 },
  // Glow ellipses 308×308 — blur extends via CSS inset (~-39%), not padded boxes.
  glow1: { left: 237, top: 773, width: 308, height: 308 },
  glow2: { left: 654, top: 773, width: 308, height: 308 },
  glow3: { left: 1000, top: 825, width: 308, height: 308 },
} as const satisfies Record<string, FigmaBox>;

export const CONTENTS_MOBILE_LAYOUT = {
  topicsRail: { left: 16, top: 216, width: 361, height: 268 },
  // Figma 715:2054 glow nodes 119×119 — blur via inset ~-100%.
  glow1: { left: 36, top: 681, width: 119, height: 119 },
  glow2: { left: 197, top: 761, width: 118, height: 119 },
  glow3: { left: 300, top: 691, width: 119, height: 119 },
} as const satisfies Record<string, FigmaBox>;

/** Soft shadow blur expand around Figma glow ellipses (matches Dev Mode inset). */
export const CONTENTS_GLOW_BLUR_INSET: Record<ContentsLayoutVariant, string> = {
  desktop: "-38.96%",
  mobile: "-100.84%",
};

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
