"use client";

import {
  HERO_SCROLL_BUST_FADE_AMOUNT,
  HERO_SCROLL_BUST_FADE_EXPONENT,
  HERO_SCROLL_BUST_TRANSLATE_VH,
  HERO_SCROLL_COPY_FADE_AMOUNT,
  HERO_SCROLL_COPY_FADE_EXPONENT,
  HERO_SCROLL_COPY_TRANSLATE_VH,
  HERO_SCROLL_CSS,
  HERO_SCROLL_TITLE_FADE_AMOUNT,
  HERO_SCROLL_TITLE_FADE_EXPONENT,
  HERO_SCROLL_TITLE_TRANSLATE_VH,
} from "@features/hero/constants/hero-scroll-parallax";
import { subscribeScrollRaf } from "@core/lib/subscribe-scroll-raf";
import { useLayoutEffect, type RefObject } from "react";

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function roundPx(px: number) {
  return `${Math.round(px * 2) / 2}px`;
}

function roundOpacity(value: number) {
  return String(Math.round(value * 50) / 50);
}

function layerValues(
  progress: number,
  translateVh: number,
  fadeExponent: number,
  fadeAmount: number,
  viewportHeight: number,
) {
  const eased = Math.pow(progress, fadeExponent);
  return {
    y: -progress * translateVh * (viewportHeight / 100),
    opacity: clamp01(1 - eased * fadeAmount),
  };
}

function writeVars(
  section: HTMLElement,
  bustY: number,
  bustOpacity: number,
  titleY: number,
  titleOpacity: number,
  copyY: number,
  copyOpacity: number,
) {
  section.style.setProperty(HERO_SCROLL_CSS.bustY, roundPx(bustY));
  section.style.setProperty(HERO_SCROLL_CSS.bustOpacity, roundOpacity(bustOpacity));
  section.style.setProperty(HERO_SCROLL_CSS.titleY, roundPx(titleY));
  section.style.setProperty(
    HERO_SCROLL_CSS.titleOpacity,
    roundOpacity(titleOpacity),
  );
  section.style.setProperty(HERO_SCROLL_CSS.copyY, roundPx(copyY));
  section.style.setProperty(
    HERO_SCROLL_CSS.copyOpacity,
    roundOpacity(copyOpacity),
  );
}

function applyIdentity(section: HTMLElement) {
  writeVars(section, 0, 1, 0, 1, 0, 1);
}

/**
 * Scroll-driven parallax + differentiated fade for Hero layers.
 * Writes CSS vars on the section — no React re-renders on scroll.
 * Disabled when `prefers-reduced-motion: reduce`.
 */
export function useHeroScrollParallax(
  sectionRef: RefObject<HTMLElement | null>,
) {
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;
    let lastKey = "";

    const update = () => {
      if (reducedMotion) {
        if (lastKey !== "idle") {
          lastKey = "idle";
          applyIdentity(section);
        }
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const progress = clamp01(-rect.top / Math.max(rect.height, 1));

      const bust = layerValues(
        progress,
        HERO_SCROLL_BUST_TRANSLATE_VH,
        HERO_SCROLL_BUST_FADE_EXPONENT,
        HERO_SCROLL_BUST_FADE_AMOUNT,
        viewportHeight,
      );
      const title = layerValues(
        progress,
        HERO_SCROLL_TITLE_TRANSLATE_VH,
        HERO_SCROLL_TITLE_FADE_EXPONENT,
        HERO_SCROLL_TITLE_FADE_AMOUNT,
        viewportHeight,
      );
      const copy = layerValues(
        progress,
        HERO_SCROLL_COPY_TRANSLATE_VH,
        HERO_SCROLL_COPY_FADE_EXPONENT,
        HERO_SCROLL_COPY_FADE_AMOUNT,
        viewportHeight,
      );

      const key = [
        roundPx(bust.y),
        roundOpacity(bust.opacity),
        roundPx(title.y),
        roundOpacity(title.opacity),
        roundPx(copy.y),
        roundOpacity(copy.opacity),
      ].join("|");

      if (key === lastKey) {
        return;
      }
      lastKey = key;
      writeVars(
        section,
        bust.y,
        bust.opacity,
        title.y,
        title.opacity,
        copy.y,
        copy.opacity,
      );
    };

    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      lastKey = "";
      update();
    };

    const unsubscribe = subscribeScrollRaf(update);
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      unsubscribe();
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, [sectionRef]);
}
