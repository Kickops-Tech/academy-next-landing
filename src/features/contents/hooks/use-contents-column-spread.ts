"use client";

import {
  getContentsColumnSpread,
  type ContentsLayoutVariant,
} from "@features/contents/constants/contents-layout";
import { useLayoutEffect, useState, type RefObject } from "react";

/**
 * Horizontal column spread from container width.
 * Narrower stages fan columns outward from center.
 */
export function useContentsColumnSpread(
  containerRef: RefObject<HTMLElement | null>,
  variant: ContentsLayoutVariant,
) {
  const [spread, setSpread] = useState<number>(
    () => CONTENTS_COLUMNS_SPREAD_DEFAULT[variant],
  );

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) {
      return;
    }

    function update(width: number) {
      setSpread(getContentsColumnSpread(width, variant));
    }

    update(node.clientWidth);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }
      update(entry.contentRect.width);
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [containerRef, variant]);

  return spread;
}

const CONTENTS_COLUMNS_SPREAD_DEFAULT = {
  desktop: 1,
  mobile: 1,
} as const;
