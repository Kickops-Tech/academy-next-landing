"use client";

import { useSectionHeadingParallax } from "@core/hooks/use-section-heading-parallax";
import type { RefObject } from "react";

/**
 * PRA / QUEM heading motion — writes CSS vars on the section (no React state).
 */
export function useTargetHeadingParallax(
  sectionRef: RefObject<HTMLElement | null>,
) {
  useSectionHeadingParallax(sectionRef);
}
