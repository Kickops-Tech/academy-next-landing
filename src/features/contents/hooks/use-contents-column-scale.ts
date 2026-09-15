"use client";

import {
  CONTENTS_COLUMNS_SCALE,
  getContentsColumnScale,
  getContentsFoldCompress,
  type ContentsLayoutVariant,
} from "@features/contents/constants/contents-layout";
import { useLayoutEffect, useState, type RefObject } from "react";

/**
 * Desktop composition scale from stage vs viewport height.
 * Short windows shrink toward {@link CONTENTS_COLUMNS_SCALE_MIN}.
 * Tall folds (min-h-fold > aspect) grow shafts via fold compress.
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
      const stageWidth = node.clientWidth;
      const stageHeight = node.clientHeight;
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const foldCompress =
        variant === "desktop"
          ? getContentsFoldCompress(stageWidth, stageHeight)
          : 1;
      setScale(
        getContentsColumnScale(
          stageHeight,
          viewportHeight,
          variant,
          foldCompress,
        ),
      );
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
