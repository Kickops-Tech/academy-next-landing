"use client";

import {
  HERO_INTRO_COPY_AFTER_TITLE_MS,
  HERO_INTRO_LOADER,
  HERO_INTRO_LOADER_ENABLED,
  HERO_INTRO_TITLE_GAP_MS,
} from "@features/hero/constants/hero-intro";
import { useCallback, useEffect, useRef, useState } from "react";

const SCROLL_LOCK_CLASS = "hero-intro-locked";

export type HeroBustIntroMode = "fade" | "instant";

export interface HeroIntroSequence {
  titleActive: boolean;
  copyActive: boolean;
  bustIntroMode: HeroBustIntroMode;
  loaderMounted: boolean;
  pageReady: boolean;
  showBackdrop: boolean;
  onBustIntroReady: () => void;
  onPlayerReady: () => void;
  onReveal: () => void;
  onFinish: () => void;
  onLoaderFailed: () => void;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function lockScroll(): void {
  document.documentElement.classList.add(SCROLL_LOCK_CLASS);
}

function unlockScroll(): void {
  document.documentElement.classList.remove(SCROLL_LOCK_CLASS);
  window.scrollTo(0, 0);
}

/**
 * Orchestrates first-paint intro: either the legacy bust-fade → baffle path
 * or the Lottie loader path, selected by {@link HERO_INTRO_LOADER_ENABLED}.
 */
export function useHeroIntroSequence(): HeroIntroSequence {
  const loaderPath = HERO_INTRO_LOADER_ENABLED;

  const [titleActive, setTitleActive] = useState(false);
  const [copyActive, setCopyActive] = useState(false);
  const [loaderMounted, setLoaderMounted] = useState(loaderPath);
  const [showBackdrop, setShowBackdrop] = useState(loaderPath);
  const [bustReady, setBustReady] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [readyTimedOut, setReadyTimedOut] = useState(false);

  const revealedRef = useRef(false);
  const finishedRef = useRef(false);
  const baffleDelayTimerRef = useRef<number | null>(null);

  const pageReady =
    loaderPath && (readyTimedOut || (bustReady && fontsReady));

  const clearBaffleDelay = useCallback(() => {
    if (baffleDelayTimerRef.current !== null) {
      window.clearTimeout(baffleDelayTimerRef.current);
      baffleDelayTimerRef.current = null;
    }
  }, []);

  const activateTitle = useCallback(() => {
    if (revealedRef.current) {
      return;
    }
    revealedRef.current = true;
    setTitleActive(true);
  }, []);

  const scheduleTitleAfterReveal = useCallback(() => {
    if (revealedRef.current || baffleDelayTimerRef.current !== null) {
      return;
    }
    baffleDelayTimerRef.current = window.setTimeout(() => {
      baffleDelayTimerRef.current = null;
      activateTitle();
    }, HERO_INTRO_LOADER.baffleDelayMs);
  }, [activateTitle]);

  const releaseWithoutLoader = useCallback(() => {
    clearBaffleDelay();
    setLoaderMounted(false);
    setShowBackdrop(false);
    unlockScroll();
    activateTitle();
  }, [activateTitle, clearBaffleDelay]);

  const onBustIntroReady = useCallback(() => {
    if (loaderPath) {
      setBustReady(true);
      return;
    }

    if (prefersReducedMotion()) {
      setTitleActive(true);
      setCopyActive(true);
      return;
    }

    window.setTimeout(() => setTitleActive(true), HERO_INTRO_TITLE_GAP_MS);
  }, [loaderPath]);

  const onPlayerReady = useCallback(() => {
    setShowBackdrop(false);
  }, []);

  const onReveal = useCallback(() => {
    scheduleTitleAfterReveal();
  }, [scheduleTitleAfterReveal]);

  const onFinish = useCallback(() => {
    if (finishedRef.current) {
      return;
    }
    finishedRef.current = true;
    setLoaderMounted(false);
    setShowBackdrop(false);
    unlockScroll();
    // Lottie ended before the post-reveal delay fired — still wait the beat.
    if (!revealedRef.current) {
      scheduleTitleAfterReveal();
    }
  }, [scheduleTitleAfterReveal]);

  const onLoaderFailed = useCallback(() => {
    releaseWithoutLoader();
  }, [releaseWithoutLoader]);

  // Loader path: reduced motion, fonts, ready timeout, scroll lock, backdrop safety.
  useEffect(() => {
    if (!loaderPath) {
      return;
    }

    if (prefersReducedMotion()) {
      setLoaderMounted(false);
      setShowBackdrop(false);
      setTitleActive(true);
      setCopyActive(true);
      return;
    }

    lockScroll();

    let cancelled = false;
    const fonts = document.fonts;
    if (fonts?.ready) {
      void fonts.ready.then(() => {
        if (!cancelled) {
          setFontsReady(true);
        }
      });
    } else {
      setFontsReady(true);
    }

    const readyTimer = window.setTimeout(() => {
      setReadyTimedOut(true);
    }, HERO_INTRO_LOADER.readyTimeoutMs);

    const safetyTimer = window.setTimeout(() => {
      releaseWithoutLoader();
    }, HERO_INTRO_LOADER.backdropSafetyMs);

    return () => {
      cancelled = true;
      window.clearTimeout(readyTimer);
      window.clearTimeout(safetyTimer);
      clearBaffleDelay();
      unlockScroll();
    };
  }, [loaderPath, releaseWithoutLoader, clearBaffleDelay]);

  // Copy/CTA after title starts (shared by both paths).
  useEffect(() => {
    if (!titleActive || copyActive) {
      return;
    }

    if (prefersReducedMotion()) {
      setCopyActive(true);
      return;
    }

    const timer = window.setTimeout(
      () => setCopyActive(true),
      HERO_INTRO_COPY_AFTER_TITLE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [titleActive, copyActive]);

  return {
    titleActive,
    copyActive,
    // Stay "instant" for the whole loader-path session (not tied to mount),
    // so unmounting the loader does not re-trigger the bust fade effect.
    bustIntroMode: loaderPath ? "instant" : "fade",
    loaderMounted,
    pageReady,
    showBackdrop,
    onBustIntroReady,
    onPlayerReady,
    onReveal,
    onFinish,
    onLoaderFailed,
  };
}
