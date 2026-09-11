"use client";

import {
  HERO_SCROLL_BUST_FADE_AMOUNT,
  HERO_SCROLL_BUST_FADE_EXPONENT,
  HERO_SCROLL_BUST_TRANSLATE_VH,
  HERO_SCROLL_COPY_FADE_AMOUNT,
  HERO_SCROLL_COPY_FADE_EXPONENT,
  HERO_SCROLL_COPY_TRANSLATE_VH,
  HERO_SCROLL_TITLE_FADE_AMOUNT,
  HERO_SCROLL_TITLE_FADE_EXPONENT,
  HERO_SCROLL_TITLE_TRANSLATE_VH,
} from "@features/hero/constants/hero-scroll-parallax";
import { useLayoutEffect, useState, type RefObject } from "react";

export interface HeroScrollParallaxLayer {
  translateY: number;
  opacity: number;
}

export interface HeroScrollParallaxState {
  bust: HeroScrollParallaxLayer;
  title: HeroScrollParallaxLayer;
  copy: HeroScrollParallaxLayer;
}

const IDENTITY_LAYER: HeroScrollParallaxLayer = {
  translateY: 0,
  opacity: 1,
};

const IDENTITY_STATE: HeroScrollParallaxState = {
  bust: IDENTITY_LAYER,
  title: IDENTITY_LAYER,
  copy: IDENTITY_LAYER,
};

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function layerFromProgress(
  progress: number,
  translateVh: number,
  fadeExponent: number,
  fadeAmount: number,
  viewportHeight: number,
): HeroScrollParallaxLayer {
  const eased = Math.pow(progress, fadeExponent);
  return {
    translateY: -progress * translateVh * (viewportHeight / 100),
    opacity: clamp01(1 - eased * fadeAmount),
  };
}

function computeParallaxState(
  section: HTMLElement,
  reducedMotion: boolean,
): HeroScrollParallaxState {
  if (reducedMotion) return IDENTITY_STATE;

  const rect = section.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const progress = clamp01(-rect.top / Math.max(rect.height, 1));

  return {
    bust: layerFromProgress(
      progress,
      HERO_SCROLL_BUST_TRANSLATE_VH,
      HERO_SCROLL_BUST_FADE_EXPONENT,
      HERO_SCROLL_BUST_FADE_AMOUNT,
      viewportHeight,
    ),
    title: layerFromProgress(
      progress,
      HERO_SCROLL_TITLE_TRANSLATE_VH,
      HERO_SCROLL_TITLE_FADE_EXPONENT,
      HERO_SCROLL_TITLE_FADE_AMOUNT,
      viewportHeight,
    ),
    copy: layerFromProgress(
      progress,
      HERO_SCROLL_COPY_TRANSLATE_VH,
      HERO_SCROLL_COPY_FADE_EXPONENT,
      HERO_SCROLL_COPY_FADE_AMOUNT,
      viewportHeight,
    ),
  };
}

/**
 * Scroll-driven parallax + differentiated fade for Hero layers.
 * Disabled when `prefers-reduced-motion: reduce`.
 */
export function useHeroScrollParallax(
  sectionRef: RefObject<HTMLElement | null>,
): HeroScrollParallaxState {
  const [state, setState] = useState<HeroScrollParallaxState>(IDENTITY_STATE);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;
    let frame = 0;

    const update = () => {
      frame = 0;
      setState(computeParallaxState(section, reducedMotion));
    };

    const onScroll = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(update);
    };

    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      update();
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      motionQuery.removeEventListener("change", onMotionChange);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [sectionRef]);

  return state;
}
