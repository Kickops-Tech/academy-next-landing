"use client";

import { PEOPLE_AGENTS } from "@features/people/constants/people-agents";
import { PEOPLE_CAROUSEL_MS } from "@features/people/constants/people-layout";
import { useCallback, useEffect, useRef, useState } from "react";

export type CarouselDirection = 1 | -1;

function prefersReducedMotion() {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function usePeopleCarousel() {
  const count = PEOPLE_AGENTS.length;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<CarouselDirection>(1);
  const [visible, setVisible] = useState(true);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const busyRef = useRef(false);

  const finishEnter = useCallback(() => {
    busyRef.current = false;
  }, []);

  const goTo = useCallback(
    (next: number, dir: CarouselDirection) => {
      if (busyRef.current || next === index) {
        return;
      }

      setDirection(dir);

      if (prefersReducedMotion()) {
        setIndex(next);
        return;
      }

      busyRef.current = true;
      setPendingIndex(next);
      setVisible(false);
    },
    [index],
  );

  useEffect(() => {
    if (visible || pendingIndex === null) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIndex(pendingIndex);
      setPendingIndex(null);
      setVisible(true);
      window.setTimeout(finishEnter, PEOPLE_CAROUSEL_MS);
    }, PEOPLE_CAROUSEL_MS);

    return () => window.clearTimeout(timer);
  }, [visible, pendingIndex, finishEnter]);

  const goNext = useCallback(() => {
    goTo((index + 1) % count, 1);
  }, [count, goTo, index]);

  const goPrev = useCallback(() => {
    goTo((index - 1 + count) % count, -1);
  }, [count, goTo, index]);

  const goToIndex = useCallback(
    (next: number) => {
      if (next === index) {
        return;
      }
      const forward = (next - index + count) % count;
      const backward = (index - next + count) % count;
      goTo(next, forward <= backward ? 1 : -1);
    },
    [count, goTo, index],
  );

  const onTouchStart = useCallback((clientX: number) => {
    touchStartX.current = clientX;
  }, []);

  const onTouchEnd = useCallback(
    (clientX: number) => {
      if (touchStartX.current === null) {
        return;
      }
      const delta = clientX - touchStartX.current;
      touchStartX.current = null;
      if (Math.abs(delta) < 48) {
        return;
      }
      if (delta < 0) {
        goNext();
      } else {
        goPrev();
      }
    },
    [goNext, goPrev],
  );

  return {
    index,
    direction,
    visible,
    agent: PEOPLE_AGENTS[index]!,
    goToIndex,
    onTouchStart,
    onTouchEnd,
  };
}
