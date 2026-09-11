"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  HERO_ARTIFICIAL_FONT,
  HERO_DISPLAY_FONT_CLASSES,
  type HeroDisplayFontClass,
} from "@features/hero/constants/hero-display-fonts";

const GLITCH_LAYER_STYLE: CSSProperties = {
  transform: "translate(-50%, -50%)",
};

/**
 * Options for {@link useSporadicFontGlitch}.
 */
export interface UseSporadicFontGlitchOptions {
  /** When false, the effect stays idle on `defaultFont`. */
  enabled?: boolean;
  /** Resting font between bursts. */
  defaultFont?: HeroDisplayFontClass;
  /** Wait after `enabled` before the first burst. */
  startAfterMs?: number;
  /** Minimum idle time between bursts. */
  minIntervalMs?: number;
  /** Maximum idle time between bursts. */
  maxIntervalMs?: number;
  /** Milliseconds per font step inside a burst. */
  stepMs?: number;
  /** Minimum font steps per burst (inclusive). */
  minBurstSteps?: number;
  /** Maximum font steps per burst (inclusive). */
  maxBurstSteps?: number;
}

/**
 * Visual output of {@link useSporadicFontGlitch}.
 */
export interface SporadicFontGlitchState {
  fontClass: HeroDisplayFontClass;
  style: CSSProperties;
  isGlitching: boolean;
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1));
}

/**
 * Sporadically cycles an element's display font through the Hero font set.
 * Chaos comes from font metrics bleeding outside the layout sizer — no rotate,
 * skew or letter-spacing.
 */
export function useSporadicFontGlitch(
  options: UseSporadicFontGlitchOptions = {},
): SporadicFontGlitchState {
  const {
    enabled = true,
    defaultFont = HERO_ARTIFICIAL_FONT,
    startAfterMs = 0,
    minIntervalMs = 5_500,
    maxIntervalMs = 11_000,
    stepMs = 75,
    minBurstSteps = 3,
    maxBurstSteps = 7,
  } = options;

  const [state, setState] = useState<SporadicFontGlitchState>({
    fontClass: defaultFont,
    style: GLITCH_LAYER_STYLE,
    isGlitching: false,
  });
  const cycleIndexRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      setState({
        fontClass: defaultFont,
        style: GLITCH_LAYER_STYLE,
        isGlitching: false,
      });
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    let disposed = false;
    let burstTimer: ReturnType<typeof setTimeout> | undefined;
    let stepTimer: ReturnType<typeof setInterval> | undefined;
    let startTimer: ReturnType<typeof setTimeout> | undefined;

    const clearTimers = () => {
      if (burstTimer) clearTimeout(burstTimer);
      if (stepTimer) clearInterval(stepTimer);
      if (startTimer) clearTimeout(startTimer);
      burstTimer = undefined;
      stepTimer = undefined;
      startTimer = undefined;
    };

    const runBurst = () => {
      if (disposed) return;

      const burstLength = randomInt(
        Math.min(minBurstSteps, maxBurstSteps),
        Math.max(minBurstSteps, maxBurstSteps),
      );
      let step = 0;

      stepTimer = setInterval(() => {
        if (disposed) return;

        if (step < burstLength) {
          const next =
            HERO_DISPLAY_FONT_CLASSES[
              cycleIndexRef.current % HERO_DISPLAY_FONT_CLASSES.length
            ];
          cycleIndexRef.current += 1;
          setState({
            fontClass: next,
            style: GLITCH_LAYER_STYLE,
            isGlitching: true,
          });
          step += 1;
          return;
        }

        if (stepTimer) clearInterval(stepTimer);
        stepTimer = undefined;
        setState({
          fontClass: defaultFont,
          style: GLITCH_LAYER_STYLE,
          isGlitching: false,
        });
        scheduleBurst();
      }, stepMs);
    };

    const scheduleBurst = () => {
      if (disposed) return;
      burstTimer = setTimeout(runBurst, randomBetween(minIntervalMs, maxIntervalMs));
    };

    startTimer = setTimeout(scheduleBurst, startAfterMs);

    return () => {
      disposed = true;
      clearTimers();
      setState({
        fontClass: defaultFont,
        style: GLITCH_LAYER_STYLE,
        isGlitching: false,
      });
    };
  }, [
    enabled,
    defaultFont,
    startAfterMs,
    minIntervalMs,
    maxIntervalMs,
    stepMs,
    minBurstSteps,
    maxBurstSteps,
  ]);

  return state;
}
