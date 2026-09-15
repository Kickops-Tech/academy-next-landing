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
  /**
   * When false, keeps the line blank and does not run baffle (hero intro gate).
   * @default true
   */
  enabled?: boolean;
}

const BAFFLE_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789▓░█▒•/";

/**
 * Hero headline line with a one-shot baffle.js decode when {@link enabled}.
 *
 * Respects `prefers-reduced-motion` (shows final text immediately).
 */
export function HeroBaffleText({
  text,
  className,
  delay = 0,
  duration = 2400,
  enabled = true,
}: HeroBaffleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (!enabled) {
      element.textContent = "";
      return;
    }

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
  }, [text, delay, duration, enabled]);

  return (
    <span
      ref={ref}
      className={cn(className)}
      aria-hidden={enabled ? undefined : true}
    >
      {enabled ? text : null}
    </span>
  );
}
