"use client";

import {
  IN_VIEW_REVEAL_ROOT_MARGIN,
  IN_VIEW_REVEAL_THRESHOLD,
} from "@core/constants/in-view-reveal";
import { useEffect, useState, type RefObject } from "react";

function prefersReducedMotion() {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Becomes true once and stays true when `ref` intersects the viewport.
 * Reduced motion / missing IntersectionObserver → true immediately (skip wait).
 * `enabled: false` → true immediately (no observer).
 */
export function useInViewOnce(
  ref: RefObject<Element | null>,
  options?: {
    enabled?: boolean;
    rootMargin?: string;
    threshold?: number;
  },
) {
  const enabled = options?.enabled !== false;
  const [inView, setInView] = useState(!enabled);
  const rootMargin = options?.rootMargin ?? IN_VIEW_REVEAL_ROOT_MARGIN;
  const threshold = options?.threshold ?? IN_VIEW_REVEAL_THRESHOLD;

  useEffect(() => {
    if (!enabled || inView) {
      return;
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    if (prefersReducedMotion()) {
      setInView(true);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting !== true) {
          return;
        }
        setInView(true);
        observer.disconnect();
      },
      { rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, inView, ref, rootMargin, threshold]);

  return inView;
}
