"use client";

import { useLayoutEffect, useState, type RefObject } from "react";

export type HorizontalScrollMetrics = {
  /** 0–1 scroll progress along the overflow axis. */
  progress: number;
  /** Thumb width as fraction of the track (clientWidth / scrollWidth). */
  thumbSize: number;
  canScroll: boolean;
};

const EMPTY: HorizontalScrollMetrics = {
  progress: 0,
  thumbSize: 1,
  canScroll: false,
};

function readMetrics(node: HTMLElement): HorizontalScrollMetrics {
  const { scrollLeft, scrollWidth, clientWidth } = node;
  const maxScroll = scrollWidth - clientWidth;

  if (maxScroll <= 1) {
    return EMPTY;
  }

  return {
    progress: Math.min(1, Math.max(0, scrollLeft / maxScroll)),
    thumbSize: Math.min(1, clientWidth / scrollWidth),
    canScroll: true,
  };
}

/**
 * Tracks horizontal overflow metrics for a scroll container (progress + thumb size).
 */
export function useHorizontalScrollMetrics(
  containerRef: RefObject<HTMLElement | null>,
) {
  const [metrics, setMetrics] = useState<HorizontalScrollMetrics>(EMPTY);

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) {
      return;
    }

    function update() {
      setMetrics(readMetrics(node));
    }

    update();

    const observer = new ResizeObserver(update);
    observer.observe(node);
    if (node.firstElementChild) {
      observer.observe(node.firstElementChild);
    }

    node.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      node.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [containerRef]);

  return metrics;
}
