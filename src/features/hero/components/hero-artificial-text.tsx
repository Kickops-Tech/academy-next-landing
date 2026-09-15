"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@shadcn/lib/utils";
import { HERO_ARTIFICIAL_FONT } from "@features/hero/constants/hero-display-fonts";
import { useSporadicFontGlitch } from "@features/hero/hooks/use-sporadic-font-glitch";

/**
 * Props for {@link HeroArtificialText}.
 */
export interface HeroArtificialTextProps {
  className?: string;
  /** Milliseconds before the baffle reveal starts. */
  delay?: number;
  /** Milliseconds to decode into the final text. */
  duration?: number;
  /**
   * When false, keeps the line blank and does not run baffle (hero intro gate).
   * @default true
   */
  enabled?: boolean;
  /** Fires once when the baffle reveal finishes (or immediately if reduced motion). */
  onRevealComplete?: () => void;
}

const TEXT = "Artificial";
const BAFFLE_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789▓░█▒•/";

/**
 * “Artificial” headline: baffle decode when enabled, then sporadic font glitches.
 *
 * Layout is locked to the default (League Gothic) metrics via an invisible sizer;
 * glitch glyphs may bleed outside that box without shifting surrounding copy.
 */
export function HeroArtificialText({
  className,
  delay = 420,
  duration = 1500,
  enabled = true,
  onRevealComplete,
}: HeroArtificialTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [baffleComplete, setBaffleComplete] = useState(false);
  const onRevealCompleteRef = useRef(onRevealComplete);
  onRevealCompleteRef.current = onRevealComplete;
  const { fontClass, style: glitchStyle, isGlitching } = useSporadicFontGlitch({
    enabled: enabled && baffleComplete,
    defaultFont: HERO_ARTIFICIAL_FONT,
    startAfterMs: 400,
    minIntervalMs: 4_200,
    maxIntervalMs: 9_500,
    stepMs: 65,
    minBurstSteps: 4,
    maxBurstSteps: 9,
  });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    setBaffleComplete(false);

    if (!enabled) {
      element.textContent = "";
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      element.textContent = TEXT;
      setBaffleComplete(true);
      onRevealCompleteRef.current?.();
      return;
    }

    let cancelled = false;
    let instance: { stop: () => void } | null = null;
    let completeTimer: ReturnType<typeof setTimeout> | undefined;

    void import("baffle").then(({ default: baffle }) => {
      if (cancelled) return;

      element.textContent = TEXT;
      instance = baffle(element)
        .set({
          characters: BAFFLE_CHARACTERS,
          speed: 40,
          exclude: [" "],
        })
        .start()
        .reveal(duration, delay);

      completeTimer = setTimeout(() => {
        if (cancelled) return;
        setBaffleComplete(true);
        onRevealCompleteRef.current?.();
      }, delay + duration);
    });

    return () => {
      cancelled = true;
      instance?.stop();
      if (completeTimer) clearTimeout(completeTimer);
    };
  }, [delay, duration, enabled]);

  return (
    <span
      className={cn(
        "relative isolate inline-block overflow-visible align-bottom",
        className,
      )}
      aria-hidden={enabled ? undefined : true}
    >
      <span
        aria-hidden={true}
        className={cn(
          HERO_ARTIFICIAL_FONT,
          "invisible block leading-none whitespace-nowrap",
        )}
      >
        {TEXT}
      </span>

      <span
        ref={ref}
        style={glitchStyle}
        className={cn(
          "absolute top-1/2 left-1/2 whitespace-nowrap",
          isGlitching && "z-10",
          fontClass,
          fontClass === "font-mrs-saint-delafield" && "normal-case",
          !enabled && "opacity-0",
        )}
      >
        {enabled ? TEXT : null}
      </span>
    </span>
  );
}
