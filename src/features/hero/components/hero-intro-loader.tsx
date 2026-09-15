"use client";

import { HERO_INTRO_LOADER } from "@features/hero/constants/hero-intro";
import introData from "@assets/data/kickops-intro.json";
import lottie, { type AnimationItem } from "lottie-web/build/player/lottie_light";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Props for {@link HeroIntroLoader}.
 */
export interface HeroIntroLoaderProps {
  /** Page gate (bust + fonts, or ready timeout). Phase 2 starts when true. */
  pageReady: boolean;
  /** Lottie DOM ready — SSR black backdrop can be removed. */
  onPlayerReady: () => void;
  /** Frame crossed {@link HERO_INTRO_LOADER.revealFrame} — start baffle. */
  onReveal: () => void;
  /** Animation finished (or safety path). */
  onFinish: () => void;
}

/**
 * Full-screen Kickops Lottie intro: play 0→120, hold until `pageReady`,
 * then 120→220. Cover-fit SVG; transparent host (black comes from the art).
 *
 * Portaled to `document.body` so the section's `overflow-hidden` cannot clip it.
 */
export function HeroIntroLoader({
  pageReady,
  onPlayerReady,
  onReveal,
  onFinish,
}: HeroIntroLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const phaseRef = useRef<"phase1" | "hold" | "phase2">("phase1");
  const revealedRef = useRef(false);
  const finishedRef = useRef(false);
  const pageReadyRef = useRef(pageReady);
  pageReadyRef.current = pageReady;
  const [mounted, setMounted] = useState(false);

  const onPlayerReadyRef = useRef(onPlayerReady);
  onPlayerReadyRef.current = onPlayerReady;
  const onRevealRef = useRef(onReveal);
  onRevealRef.current = onReveal;
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    setMounted(true);
  }, []);

  const finishOnce = () => {
    if (finishedRef.current) {
      return;
    }
    finishedRef.current = true;
    onFinishRef.current();
  };

  const revealOnce = () => {
    if (revealedRef.current) {
      return;
    }
    revealedRef.current = true;
    onRevealRef.current();
  };

  const startPhase2 = (anim: AnimationItem) => {
    if (phaseRef.current === "phase2") {
      return;
    }
    phaseRef.current = "phase2";
    anim.playSegments(
      [HERO_INTRO_LOADER.holdFrame, HERO_INTRO_LOADER.endFrame],
      true,
    );
  };

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const anim = lottie.loadAnimation({
      container,
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData: introData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
        progressiveLoad: false,
      },
    });
    animRef.current = anim;

    let phase1Started = false;
    const onDomLoaded = () => {
      if (phase1Started) {
        return;
      }
      phase1Started = true;
      onPlayerReadyRef.current();
      phaseRef.current = "phase1";
      anim.playSegments([0, HERO_INTRO_LOADER.holdFrame], true);
    };

    const onComplete = () => {
      if (phaseRef.current === "phase1") {
        phaseRef.current = "hold";
        anim.pause();
        if (pageReadyRef.current) {
          startPhase2(anim);
        }
        return;
      }

      if (phaseRef.current === "phase2") {
        finishOnce();
      }
    };

    const onEnterFrame = () => {
      if (phaseRef.current !== "phase2" || revealedRef.current) {
        return;
      }
      // playSegments reports currentFrame relative to segment start (firstFrame).
      const absolute =
        HERO_INTRO_LOADER.holdFrame + (anim.currentFrame ?? 0);
      if (absolute >= HERO_INTRO_LOADER.revealFrame) {
        revealOnce();
      }
    };

    anim.addEventListener("DOMLoaded", onDomLoaded);
    anim.addEventListener("complete", onComplete);
    anim.addEventListener("enterFrame", onEnterFrame);

    if (anim.isLoaded) {
      onDomLoaded();
    }

    const safety = window.setTimeout(
      finishOnce,
      HERO_INTRO_LOADER.backdropSafetyMs,
    );

    return () => {
      window.clearTimeout(safety);
      anim.removeEventListener("DOMLoaded", onDomLoaded);
      anim.removeEventListener("complete", onComplete);
      anim.removeEventListener("enterFrame", onEnterFrame);
      anim.destroy();
      animRef.current = null;
    };
  }, [mounted]);

  useEffect(() => {
    if (!pageReady) {
      return;
    }
    const anim = animRef.current;
    if (!anim) {
      return;
    }
    if (phaseRef.current === "hold") {
      startPhase2(anim);
    }
  }, [pageReady]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      ref={containerRef}
      aria-hidden={true}
      className="pointer-events-auto fixed inset-0 z-100 size-full bg-transparent [&_svg]:size-full"
    />,
    document.body,
  );
}

export default HeroIntroLoader;
