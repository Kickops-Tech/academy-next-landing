import type { ContentsColumnId } from "@features/contents/constants/contents-layout";

/** Max translate (px) at screen edge for each column — subtle depth stack. */
export const CONTENTS_COLUMN_PARALLAX_DEPTH: Record<
  ContentsColumnId,
  { x: number; y: number }
> = {
  col1: { x: 10, y: 14 },
  col2: { x: 16, y: 20 },
  col3: { x: 20, y: 24 },
  col4: { x: 12, y: 16 },
};

export const CONTENTS_COLUMN_PARALLAX_EASE_MS = 120;
