"use client";

import {
  ACADEMY_BRAIN,
  ACADEMY_BRAIN_EPISODIC_GLITCH,
  ACADEMY_BRAIN_FLOW,
  ACADEMY_BRAIN_GLITCH_ENABLED,
  ACADEMY_BRAIN_IMAGE,
  ACADEMY_BRAIN_PARALLAX_CSS_Y,
  ACADEMY_BRAIN_PARALLAX_TRANSLATE_VH,
  ACADEMY_BRAIN_PIXELATE_BLOCK_PX,
  ACADEMY_BRAIN_PIXELATE_MASK_DECAY,
  ACADEMY_BRAIN_PIXELATE_MASK_STAMP_STRENGTH,
  ACADEMY_BRAIN_PIXELATE_STAMP_BLOCK_SPAN,
  type AcademyBrainLayout,
  type AcademyBrainVariant,
} from "@core/constants/academy-brain";
import { useImageGlitch } from "@core/hooks/use-image-glitch";
import { subscribeScrollRaf } from "@core/lib/subscribe-scroll-raf";
import { cn } from "@shadcn/lib/utils";
import Image from "next/image";
import {
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type RefObject,
} from "react";

type AcademyBrainProps = {
  variant: AcademyBrainVariant;
  /** Default `stage`. People below xl uses `flow`. */
  layout?: AcademyBrainLayout;
};

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function stageBoxStyle(variant: AcademyBrainVariant): CSSProperties {
  const box = ACADEMY_BRAIN[variant];
  return {
    left: `${(box.left / box.frameWidth) * 100}%`,
    top: `${(box.topPeople / box.peopleFrameHeight) * 100}%`,
    width: `${(box.size / box.frameWidth) * 100}%`,
    aspectRatio: "1 / 1",
  };
}

/** Below-xl People: large Figma-scale art, shifted up into the fold. */
const FLOW_BOX_STYLE: CSSProperties = {
  left: "50%",
  top: "0%",
  aspectRatio: "1 / 1",
  transform: `translate(-50%, ${ACADEMY_BRAIN_FLOW.shiftY})`,
};

function boxStyle(
  variant: AcademyBrainVariant,
  layout: AcademyBrainLayout,
): CSSProperties {
  if (layout === "flow") {
    return FLOW_BOX_STYLE;
  }
  return stageBoxStyle(variant);
}

function boxClassName(layout: AcademyBrainLayout) {
  return cn("absolute", layout === "flow" && ACADEMY_BRAIN_FLOW.widthClass);
}

/**
 * Move-up parallax vs the gray Formats+People band.
 * Writes CSS var on the wrapper — no React re-renders.
 */
function useBrainParallax(wrapperRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;
    let lastY = "";

    const update = () => {
      if (reducedMotion) {
        if (lastY !== "0px") {
          lastY = "0px";
          wrapper.style.setProperty(ACADEMY_BRAIN_PARALLAX_CSS_Y, "0px");
        }
        return;
      }

      const band = wrapper.closest(
        "[data-brain-hover-root]",
      ) as HTMLElement | null;
      const rect = (band ?? wrapper).getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // 0 at band enter → 1 as the band scrolls through.
      const progress = clamp01(
        (viewportHeight - rect.top) / Math.max(rect.height + viewportHeight, 1),
      );
      const yPx =
        -progress *
        ACADEMY_BRAIN_PARALLAX_TRANSLATE_VH *
        (viewportHeight / 100);
      const next = `${Math.round(yPx * 2) / 2}px`;
      if (next === lastY) {
        return;
      }
      lastY = next;
      wrapper.style.setProperty(ACADEMY_BRAIN_PARALLAX_CSS_Y, next);
    };

    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      lastY = "";
      update();
    };

    const unsubscribe = subscribeScrollRaf(update);
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      unsubscribe();
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, [wrapperRef]);
}

const PARALLAX_WRAPPER_STYLE: CSSProperties = {
  transform: `translate3d(0, var(${ACADEMY_BRAIN_PARALLAX_CSS_Y}, 0px), 0)`,
};

function AcademyBrainStatic({
  variant,
  layout = "stage",
}: AcademyBrainProps) {
  const parallaxRef = useRef<HTMLDivElement>(null);
  useBrainParallax(parallaxRef);

  return (
    <div
      ref={parallaxRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 z-0 overflow-visible")}
      style={PARALLAX_WRAPPER_STYLE}
    >
      <div className={boxClassName(layout)} style={boxStyle(variant, layout)}>
        <Image
          src={ACADEMY_BRAIN_IMAGE}
          alt=""
          fill
          className="object-cover object-center"
          sizes={
            layout === "flow"
              ? "90rem"
              : variant === "desktop"
                ? "107vw"
                : "254vw"
          }
          priority={variant === "desktop"}
        />
      </div>
    </div>
  );
}

function AcademyBrainGlitch({
  variant,
  layout = "stage",
}: AcademyBrainProps) {
  const parallaxRef = useRef<HTMLDivElement>(null);
  useBrainParallax(parallaxRef);

  const { canvasRef, containerRef, isReady, useFallback } = useImageGlitch({
    layers: [ACADEMY_BRAIN_IMAGE],
    imageAspect: 1,
    fit: "cover",
    proceduralPixelate: true,
    enableHoverPixelate: true,
    enableEpisodicGlitch: ACADEMY_BRAIN_EPISODIC_GLITCH,
    pixelateBlockPx: ACADEMY_BRAIN_PIXELATE_BLOCK_PX,
    pixelateStampBlockSpan: ACADEMY_BRAIN_PIXELATE_STAMP_BLOCK_SPAN,
    pixelateMaskDecay: ACADEMY_BRAIN_PIXELATE_MASK_DECAY,
    pixelateStampStrength: ACADEMY_BRAIN_PIXELATE_MASK_STAMP_STRENGTH,
    hoverRootSelector: "[data-brain-hover-root]",
    logLabel: "AcademyBrainGlitch",
  });

  return (
    <div
      ref={parallaxRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 z-0 overflow-visible")}
      style={PARALLAX_WRAPPER_STYLE}
    >
      <div
        ref={containerRef}
        className={cn(
          boxClassName(layout),
          "overflow-hidden",
          !useFallback && "pointer-events-auto cursor-crosshair",
        )}
        style={boxStyle(variant, layout)}
      >
        <Image
          src={ACADEMY_BRAIN_IMAGE}
          alt=""
          fill
          className={cn(
            "object-cover object-center select-none",
            "transition-opacity duration-200",
            isReady && !useFallback && "opacity-0",
          )}
          sizes={
            layout === "flow"
              ? "90rem"
              : variant === "desktop"
                ? "107vw"
                : "254vw"
          }
          priority={variant === "desktop"}
        />

        {!useFallback && (
          <canvas
            ref={canvasRef}
            aria-hidden
            className={cn(
              "absolute inset-0 size-full select-none bg-transparent",
              "transition-opacity duration-200",
              !isReady && "opacity-0",
            )}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Yellow brain — Figma stage on desktop (bleed into Formats) + scroll
 * parallax up; `flow` below xl. Flag toggles WebGL vs static.
 */
export function AcademyBrain({
  variant,
  layout = "stage",
}: AcademyBrainProps) {
  if (!ACADEMY_BRAIN_GLITCH_ENABLED) {
    return <AcademyBrainStatic variant={variant} layout={layout} />;
  }
  return <AcademyBrainGlitch variant={variant} layout={layout} />;
}
