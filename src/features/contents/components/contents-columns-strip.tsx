"use client";

import { ContentsColumns } from "@features/contents/components/contents-columns";
import {
  CONTENTS_COLUMNS_BAND_SCALE,
  CONTENTS_COLUMNS_STRIP_EDGE_MASK,
  getContentsColumnBandHeight,
  getContentsColumnStripFit,
} from "@features/contents/constants/contents-columns-strip";
import {
  getContentsFrame,
  type ContentsLayoutVariant,
} from "@features/contents/constants/contents-layout";
import type { ContentsColumnParallaxState } from "@features/contents/hooks/use-contents-column-parallax";
import { cn } from "@shadcn/lib/utils";
import { useLayoutEffect, useRef, useState } from "react";

type ContentsColumnsStripProps = {
  variant: ContentsLayoutVariant;
  parallax: ContentsColumnParallaxState;
  transitionMs: number;
  className?: string;
};

type StripFitState = {
  stripHeight: number;
  fitScale: number;
  /** Full-frame stage height at current width (Figma aspect). */
  stageHeight: number;
};

/**
 * Bottom column band for flow layouts below xl.
 * Crops the Figma frame to the shaft zone. When max-svh caps height, scales
 * on Y only from the bottom so the band always spans full useful width.
 */
export function ContentsColumnsStrip({
  variant,
  parallax,
  transitionMs,
  className,
}: ContentsColumnsStripProps) {
  const frame = getContentsFrame(variant);
  const bandHeight = getContentsColumnBandHeight(variant);
  const rootRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<StripFitState>({
    stripHeight: 0,
    fitScale: 1,
    stageHeight: 0,
  });

  useLayoutEffect(() => {
    const node = rootRef.current;
    if (!node) {
      return;
    }

    function update() {
      const width = node.clientWidth;
      const viewportHeight =
        window.visualViewport?.height ?? window.innerHeight;
      const next = getContentsColumnStripFit(width, viewportHeight, variant);
      setFit({
        stripHeight: next.stripHeight,
        fitScale: next.fitScale,
        // Full-frame height at this width; fitScaleY compresses into max-svh.
        stageHeight: next.naturalHeight * (frame.height / bandHeight),
      });
    }

    update();

    const observer = new ResizeObserver(() => update());
    observer.observe(node);
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, [variant, frame.height, bandHeight]);

  const bandScale = CONTENTS_COLUMNS_BAND_SCALE[variant];

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={cn("relative w-full overflow-hidden", className)}
      style={{
        height: fit.stripHeight > 0 ? fit.stripHeight : undefined,
        maskImage: CONTENTS_COLUMNS_STRIP_EDGE_MASK,
        WebkitMaskImage: CONTENTS_COLUMNS_STRIP_EDGE_MASK,
      }}
    >
      <div
        className="absolute inset-x-0 bottom-0 origin-bottom"
        style={{
          height: fit.stageHeight > 0 ? fit.stageHeight : undefined,
          // Y-only: uniform scale left ~55px gutters at ~1130px (fitScale≈0.9).
          transform:
            fit.fitScale < 1 ? `scaleY(${fit.fitScale})` : undefined,
        }}
      >
        <ContentsColumns
          variant={variant}
          parallax={parallax}
          transitionMs={transitionMs}
          fadeTop={false}
          compositionScale={bandScale}
          spread={1}
        />
      </div>
    </div>
  );
}
