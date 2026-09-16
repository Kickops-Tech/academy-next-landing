"use client";

import {
  IN_VIEW_REVEAL_DURATION_MS,
  IN_VIEW_REVEAL_EASE,
  IN_VIEW_REVEAL_ROOT_MARGIN,
  IN_VIEW_REVEAL_STAGGER_MS,
  IN_VIEW_REVEAL_THRESHOLD,
  IN_VIEW_REVEAL_TRANSLATE_Y,
} from "@core/constants/in-view-reveal";
import { useInViewOnce } from "@core/hooks/use-in-view-once";
import { cn } from "@shadcn/lib/utils";
import {
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";

type InViewRevealProps = {
  children: ReactNode;
  /** Stagger delay index within a sibling group (0-based). */
  index?: number;
  className?: string;
  style?: CSSProperties;
  /** When false, children render fully visible (no observer). */
  enabled?: boolean;
};

/**
 * Outer wrapper for once-on-enter fade + slide-up.
 * Keeps transform/opacity here so children can own their own transforms.
 */
export function InViewReveal({
  children,
  index = 0,
  className,
  style,
  enabled = true,
}: InViewRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInViewOnce(ref, {
    enabled,
    rootMargin: IN_VIEW_REVEAL_ROOT_MARGIN,
    threshold: IN_VIEW_REVEAL_THRESHOLD,
  });

  const revealStyle: CSSProperties = {
    opacity: active ? 1 : 0,
    transform: active
      ? "translate3d(0, 0, 0)"
      : `translate3d(0, ${IN_VIEW_REVEAL_TRANSLATE_Y}, 0)`,
    transition: `opacity ${IN_VIEW_REVEAL_DURATION_MS}ms ${IN_VIEW_REVEAL_EASE}, transform ${IN_VIEW_REVEAL_DURATION_MS}ms ${IN_VIEW_REVEAL_EASE}`,
    transitionDelay: active ? `${index * IN_VIEW_REVEAL_STAGGER_MS}ms` : "0ms",
  };

  return (
    <div
      ref={ref}
      className={cn("will-change-[opacity,transform]", className)}
      style={{ ...revealStyle, ...style }}
    >
      {children}
    </div>
  );
}
