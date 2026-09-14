"use client";

import { PEOPLE_AGENTS } from "@features/people/constants/people-content";
import {
  PEOPLE_CAROUSEL_DRAG_COMMIT_FRACTION,
  PEOPLE_CAROUSEL_MS,
  PEOPLE_CAROUSEL_STRIP_GAP_FRACTION,
  PEOPLE_CAROUSEL_TRAVEL_FRACTION,
} from "@features/people/constants/people-layout";
import { useCallback, useEffect, useRef, useState } from "react";

export type CarouselDirection = 1 | -1;

function prefersReducedMotion() {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function rubberBand(deltaPx: number, limitPx: number) {
  const abs = Math.abs(deltaPx);
  if (abs <= limitPx) {
    return deltaPx;
  }
  const overflow = abs - limitPx;
  return Math.sign(deltaPx) * (limitPx + overflow * 0.28);
}

function wrapIndex(index: number, count: number) {
  return (index + count) % count;
}

function travelForWidth(width: number) {
  return Math.max(160, width * PEOPLE_CAROUSEL_TRAVEL_FRACTION);
}

function gapForWidth(width: number) {
  return Math.max(56, width * PEOPLE_CAROUSEL_STRIP_GAP_FRACTION);
}

/** Distance from current center to neighbor center (travel + gap). */
function strideForWidth(width: number) {
  return travelForWidth(width) + gapForWidth(width);
}

function commitForWidth(width: number) {
  return Math.max(48, width * PEOPLE_CAROUSEL_DRAG_COMMIT_FRACTION);
}

/**
 * Continuous strip carousel. Pointer up/cancel are handled on `window`
 * so releasing outside the track always clears the hold state.
 */
export function usePeopleCarousel() {
  const count = PEOPLE_AGENTS.length;
  const [index, setIndex] = useState(0);
  const [offsetPx, setOffsetPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [snapPose, setSnapPose] = useState(false);
  const [peekDir, setPeekDir] = useState<CarouselDirection | 0>(0);
  const [trackWidth, setTrackWidthState] = useState(0);

  const offsetRef = useRef(0);
  const trackWidthRef = useRef(640);
  const busyRef = useRef(false);
  const draggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const startXRef = useRef(0);
  const animTimerRef = useRef<number | null>(null);
  const indexRef = useRef(index);

  indexRef.current = index;

  const setTrackWidth = useCallback((width: number) => {
    if (width > 0) {
      trackWidthRef.current = width;
      setTrackWidthState(width);
    }
  }, []);

  const setOffset = useCallback((value: number) => {
    offsetRef.current = value;
    setOffsetPx(value);
  }, []);

  const clearAnimTimer = useCallback(() => {
    if (animTimerRef.current !== null) {
      window.clearTimeout(animTimerRef.current);
      animTimerRef.current = null;
    }
  }, []);

  const resetStrip = useCallback(() => {
    clearAnimTimer();
    draggingRef.current = false;
    pointerIdRef.current = null;
    setIsDragging(false);
    setSnapPose(false);
    setPeekDir(0);
    setOffset(0);
    busyRef.current = false;
  }, [clearAnimTimer, setOffset]);

  const settleAtIndex = useCallback(
    (nextIndex: number) => {
      setSnapPose(true);
      setPeekDir(0);
      setIndex(nextIndex);
      setOffset(0);
      draggingRef.current = false;
      pointerIdRef.current = null;
      setIsDragging(false);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setSnapPose(false);
          busyRef.current = false;
        });
      });
    },
    [setOffset],
  );

  const animateOffsetTo = useCallback(
    (target: number, onDone: () => void) => {
      clearAnimTimer();
      draggingRef.current = false;
      setIsDragging(false);
      setSnapPose(false);
      setOffset(target);
      animTimerRef.current = window.setTimeout(() => {
        animTimerRef.current = null;
        onDone();
      }, PEOPLE_CAROUSEL_MS);
    },
    [clearAnimTimer, setOffset],
  );

  const goTo = useCallback(
    (next: number, dir: CarouselDirection) => {
      const current = indexRef.current;
      if (busyRef.current || next === current) {
        resetStrip();
        return;
      }

      if (prefersReducedMotion()) {
        setIndex(next);
        resetStrip();
        return;
      }

      busyRef.current = true;
      setPeekDir(dir);
      const stride = strideForWidth(trackWidthRef.current);
      const target = dir === 1 ? -stride : stride;
      animateOffsetTo(target, () => settleAtIndex(next));
    },
    [animateOffsetTo, resetStrip, settleAtIndex],
  );

  const goToIndex = useCallback(
    (next: number) => {
      if (busyRef.current || draggingRef.current) {
        return;
      }
      const current = indexRef.current;
      if (next === current) {
        return;
      }
      const forward = wrapIndex(next - current, count);
      const backward = wrapIndex(current - next, count);
      goTo(next, forward <= backward ? 1 : -1);
    },
    [count, goTo],
  );

  const endPointerGesture = useCallback(() => {
    if (!draggingRef.current) {
      return;
    }

    const delta = offsetRef.current;
    draggingRef.current = false;
    pointerIdRef.current = null;
    setIsDragging(false);

    const commit = commitForWidth(trackWidthRef.current);
    if (Math.abs(delta) < commit) {
      resetStrip();
      return;
    }

    const current = indexRef.current;
    if (delta < 0) {
      goTo(wrapIndex(current + 1, count), 1);
    } else {
      goTo(wrapIndex(current - 1, count), -1);
    }
  }, [count, goTo, resetStrip]);

  const beginPointerGesture = useCallback(
    (clientX: number, pointerId: number) => {
      if (busyRef.current) {
        return;
      }
      clearAnimTimer();
      draggingRef.current = true;
      pointerIdRef.current = pointerId;
      startXRef.current = clientX;
      setSnapPose(false);
      setIsDragging(true);
      setOffset(0);
      setPeekDir(0);
    },
    [clearAnimTimer, setOffset],
  );

  useEffect(() => {
    function onWindowPointerMove(event: PointerEvent) {
      if (!draggingRef.current || event.pointerId !== pointerIdRef.current) {
        return;
      }
      const raw = event.clientX - startXRef.current;
      const stride = strideForWidth(trackWidthRef.current);
      const next = rubberBand(raw, stride * 1.08);
      offsetRef.current = next;
      setOffsetPx(next);
      if (next < -1) {
        setPeekDir(1);
      } else if (next > 1) {
        setPeekDir(-1);
      } else {
        setPeekDir(0);
      }
    }

    function onWindowPointerUp(event: PointerEvent) {
      if (!draggingRef.current || event.pointerId !== pointerIdRef.current) {
        return;
      }
      endPointerGesture();
    }

    window.addEventListener("pointermove", onWindowPointerMove);
    window.addEventListener("pointerup", onWindowPointerUp);
    window.addEventListener("pointercancel", onWindowPointerUp);
    return () => {
      window.removeEventListener("pointermove", onWindowPointerMove);
      window.removeEventListener("pointerup", onWindowPointerUp);
      window.removeEventListener("pointercancel", onWindowPointerUp);
    };
  }, [endPointerGesture]);

  const width = trackWidth > 0 ? trackWidth : trackWidthRef.current;
  const stridePx = strideForWidth(width);
  const progress =
    stridePx > 0 ? Math.min(1, Math.abs(offsetPx) / stridePx) : 0;

  const neighborIndex =
    peekDir === 1
      ? wrapIndex(index + 1, count)
      : peekDir === -1
        ? wrapIndex(index - 1, count)
        : null;

  // Keep neighbor mounted for the whole peek — opacity handles visibility
  // (avoids unmount while still at a mid/low opacity).
  const neighbor =
    neighborIndex === null ? null : PEOPLE_AGENTS[neighborIndex]!;

  return {
    index,
    agent: PEOPLE_AGENTS[index]!,
    neighbor,
    offsetPx,
    stridePx,
    peekDir,
    isDragging,
    snapPose,
    progress,
    setTrackWidth,
    goToIndex,
    beginPointerGesture,
  };
}
