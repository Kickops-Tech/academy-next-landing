"use client";

import {
  SECTION_HEADING_CSS,
  SECTION_HEADING_ENTER_EXPONENT,
  SECTION_HEADING_ENTER_FROM_Y_PX,
  SECTION_HEADING_ENTER_OFFSET_CQW,
  SECTION_HEADING_ENTER_VIEWPORT_END,
  SECTION_HEADING_ENTER_VIEWPORT_START,
  SECTION_HEADING_EXIT_EXPONENT,
  SECTION_HEADING_EXIT_LEAD_TRANSLATE_VH,
  SECTION_HEADING_EXIT_OUT_FRACTION_END,
  SECTION_HEADING_EXIT_OUT_FRACTION_START,
  SECTION_HEADING_EXIT_TRAIL_TRANSLATE_VH,
  SECTION_HEADING_SCROLL_LEAD_TRANSLATE_VH,
  SECTION_HEADING_SCROLL_TRAIL_TRANSLATE_VH,
} from "@core/constants/section-heading-parallax";
import { subscribeScrollRaf } from "@core/lib/subscribe-scroll-raf";
import { useLayoutEffect, type RefObject } from "react";

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function progressBetween(value: number, start: number, end: number) {
  return clamp01((start - value) / Math.max(start - end, 1));
}

function roundPx(px: number) {
  return `${Math.round(px * 2) / 2}px`;
}

function roundOpacity(value: number) {
  return String(Math.round(value * 50) / 50);
}

function writeVars(
  section: HTMLElement,
  leadX: number,
  trailX: number,
  leadY: number,
  trailY: number,
  opacity: number,
) {
  section.style.setProperty(SECTION_HEADING_CSS.leadX, roundPx(leadX));
  section.style.setProperty(SECTION_HEADING_CSS.trailX, roundPx(trailX));
  section.style.setProperty(SECTION_HEADING_CSS.leadY, roundPx(leadY));
  section.style.setProperty(SECTION_HEADING_CSS.trailY, roundPx(trailY));
  section.style.setProperty(SECTION_HEADING_CSS.opacity, roundOpacity(opacity));
}

function applyIdle(section: HTMLElement) {
  writeVars(section, 0, 0, 0, 0, 1);
}

function applyHidden(section: HTMLElement) {
  writeVars(section, 0, 0, 0, 0, 0);
}

/**
 * Enter: lead ← / trail → + fade-in.
 * Scroll: vertical parallax (different speeds).
 * Exit: fade starts when the heading is ~50% above the viewport top.
 * Mutates CSS vars on `sectionRef` — no React re-renders on scroll.
 */
export function useSectionHeadingParallax(
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
    const heading = section.querySelector("h2");

    const update = () => {
      if (reducedMotion) {
        if (lastKey !== "rm") {
          lastKey = "rm";
          applyIdle(section);
        }
        return;
      }

      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const rect = section.getBoundingClientRect();

      // Far off-screen: one write, skip work.
      if (rect.bottom < -80 || rect.top > viewportHeight + 80) {
        const key = rect.top > 0 ? "below" : "above";
        if (lastKey !== key) {
          lastKey = key;
          if (key === "below") {
            const offsetPx =
              (SECTION_HEADING_ENTER_OFFSET_CQW / 100) * viewportWidth;
            writeVars(
              section,
              -offsetPx,
              offsetPx,
              SECTION_HEADING_ENTER_FROM_Y_PX,
              SECTION_HEADING_ENTER_FROM_Y_PX,
              0,
            );
          } else {
            applyHidden(section);
          }
        }
        return;
      }

      const enter = Math.pow(
        progressBetween(
          rect.top,
          viewportHeight * SECTION_HEADING_ENTER_VIEWPORT_START,
          viewportHeight * SECTION_HEADING_ENTER_VIEWPORT_END,
        ),
        SECTION_HEADING_ENTER_EXPONENT,
      );

      const headingRect = heading?.getBoundingClientRect() ?? rect;
      const headingHeight = Math.max(headingRect.height, 1);
      const headingMidY = headingRect.top + headingHeight * 0.5;
      const exitStartY =
        headingHeight * (0.5 - SECTION_HEADING_EXIT_OUT_FRACTION_START);
      const exitEndY =
        headingHeight * (0.5 - SECTION_HEADING_EXIT_OUT_FRACTION_END);
      const exit = Math.pow(
        progressBetween(headingMidY, exitStartY, exitEndY),
        SECTION_HEADING_EXIT_EXPONENT,
      );

      const scroll = clamp01(-rect.top / Math.max(rect.height, 1));
      const vh = viewportHeight / 100;
      const offsetPx =
        (SECTION_HEADING_ENTER_OFFSET_CQW / 100) * viewportWidth;
      const slide = 1 - enter;

      // Horizontal only on enter (settles to 0); exit keeps X at 0.
      const leadX = slide * -offsetPx;
      const trailX = slide * offsetPx;
      const leadY =
        slide * SECTION_HEADING_ENTER_FROM_Y_PX -
        scroll * SECTION_HEADING_SCROLL_LEAD_TRANSLATE_VH * vh -
        exit * SECTION_HEADING_EXIT_LEAD_TRANSLATE_VH * vh;
      const trailY =
        slide * SECTION_HEADING_ENTER_FROM_Y_PX -
        scroll * SECTION_HEADING_SCROLL_TRAIL_TRANSLATE_VH * vh -
        exit * SECTION_HEADING_EXIT_TRAIL_TRANSLATE_VH * vh;
      const opacity = clamp01(enter * (1 - exit));

      const key = `${roundPx(leadX)}|${roundPx(trailX)}|${roundPx(leadY)}|${roundPx(trailY)}|${roundOpacity(opacity)}`;
      if (key === lastKey) {
        return;
      }
      lastKey = key;
      writeVars(section, leadX, trailX, leadY, trailY, opacity);
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
