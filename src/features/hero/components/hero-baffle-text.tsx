"use client";

import { useLayoutEffect, useRef } from "react";
import { cn } from "@shadcn/lib/utils";

/**
 * Props for {@link HeroBaffleText}.
 */
export interface HeroBaffleTextProps {
  /** Final visible copy (also used for SSR / no-JS). */
  text: string;
  className?: string;
  /** Milliseconds before the reveal animation starts. */
  delay?: number;
  /** Milliseconds to decode into the final text. */
  duration?: number;
}

const BAFFLE_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789▓░█▒•/";

/**
 * Hero headline line with a one-shot baffle.js decode on mount.
 *
 * Respects `prefers-reduced-motion` (shows final text immediately).
 */
export function HeroBaffleText({
  text,
  className,
  delay = 0,
  duration = 2400,
}: HeroBaffleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      element.textContent = text;
      return;
    }

    let cancelled = false;
    let instance: { stop: () => void } | null = null;

    void import("baffle").then(({ default: baffle }) => {
      if (cancelled) return;

      element.textContent = text;
      instance = baffle(element)
        .set({
          characters: BAFFLE_CHARACTERS,
          speed: 40,
          exclude: [" "],
        })
        .start()
        .reveal(duration, delay);
    });

    return () => {
      cancelled = true;
      instance?.stop();
    };
  }, [text, delay, duration]);

  return (
    <span ref={ref} className={cn(className)}>
      {text}
    </span>
  );
}
