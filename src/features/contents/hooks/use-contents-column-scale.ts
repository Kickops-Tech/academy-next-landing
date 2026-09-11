"use client";

import {
  CONTENTS_COLUMNS_SCALE,
  getContentsColumnScale,
  type ContentsLayoutVariant,
} from "@features/contents/constants/contents-layout";
import { useLayoutEffect, useState, type RefObject } from "react";

/**
 * Desktop composition scale from stage vs viewport height.
 * Short windows shrink toward {@link CONTENTS_COLUMNS_SCALE_MIN}.
 */
export function useContentsColumnScale(
  containerRef: RefObject<HTMLElement | null>,
  variant: ContentsLayoutVariant,
) {
  const [scale, setScale] = useState<number>(
    () => CONTENTS_COLUMNS_SCALE[variant],
  );

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) {
      return;
    }

    function update() {
      const stageHeight = node.clientHeight;
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      setScale(getContentsColumnScale(stageHeight, viewportHeight, variant));
    }

    update();

    const observer = new ResizeObserver(() => update());
    observer.observe(node);
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, [containerRef, variant]);

  return scale;
}
