"use client";

import {
  CONTENTS_COLUMN_PARALLAX_DEPTH,
  CONTENTS_COLUMN_PARALLAX_EASE_MS,
} from "@features/contents/constants/contents-column-parallax";
import type { ContentsColumnId } from "@features/contents/constants/contents-layout";
import { useLayoutEffect, useState, type RefObject } from "react";

export type ContentsColumnParallaxLayer = {
  translateX: number;
  translateY: number;
};

export type ContentsColumnParallaxState = Record<
  ContentsColumnId,
  ContentsColumnParallaxLayer
>;

const IDENTITY_LAYER: ContentsColumnParallaxLayer = {
  translateX: 0,
  translateY: 0,
};

const IDENTITY_STATE: ContentsColumnParallaxState = {
  col1: IDENTITY_LAYER,
  col2: IDENTITY_LAYER,
  col3: IDENTITY_LAYER,
  col4: IDENTITY_LAYER,
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function hasFinePointer() {
  return window.matchMedia("(pointer: fine)").matches;
}

/**
 * Mouse-move parallax for decorative columns.
 * Depths come from {@link CONTENTS_COLUMN_PARALLAX_DEPTH}.
 * No-op when reduced motion or coarse pointer.
 */
export function useContentsColumnParallax(
  sectionRef: RefObject<HTMLElement | null>,
) {
  const [state, setState] = useState<ContentsColumnParallaxState>(IDENTITY_STATE);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    if (prefersReducedMotion() || !hasFinePointer()) {
      return;
    }

    let frame = 0;

    function applyFromEvent(event: PointerEvent) {
      const target = sectionRef.current;
      if (!target) {
        return;
      }

      const rect = target.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
      const ny = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1;

      const next: ContentsColumnParallaxState = {
        col1: {
          translateX: nx * CONTENTS_COLUMN_PARALLAX_DEPTH.col1.x,
          translateY: ny * CONTENTS_COLUMN_PARALLAX_DEPTH.col1.y,
        },
        col2: {
          translateX: nx * CONTENTS_COLUMN_PARALLAX_DEPTH.col2.x,
          translateY: ny * CONTENTS_COLUMN_PARALLAX_DEPTH.col2.y,
        },
        col3: {
          translateX: nx * CONTENTS_COLUMN_PARALLAX_DEPTH.col3.x,
          translateY: ny * CONTENTS_COLUMN_PARALLAX_DEPTH.col3.y,
        },
        col4: {
          translateX: nx * CONTENTS_COLUMN_PARALLAX_DEPTH.col4.x,
          translateY: ny * CONTENTS_COLUMN_PARALLAX_DEPTH.col4.y,
        },
      };

      setState(next);
    }

    function onPointerMove(event: PointerEvent) {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => applyFromEvent(event));
    }

    function onPointerLeave() {
      cancelAnimationFrame(frame);
      setState(IDENTITY_STATE);
    }

    section.addEventListener("pointermove", onPointerMove);
    section.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(frame);
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [sectionRef]);

  return {
    layers: state,
    transitionMs: CONTENTS_COLUMN_PARALLAX_EASE_MS,
  };
}
