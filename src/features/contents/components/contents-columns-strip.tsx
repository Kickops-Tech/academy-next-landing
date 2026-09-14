"use client";

import { ContentsColumns } from "@features/contents/components/contents-columns";
import {
  CONTENTS_COLUMNS_BAND_SCALE,
  CONTENTS_COLUMNS_STRIP_EDGE_MASK,
  getContentsColumnBandHeight,
  getContentsColumnBandWidthAspect,
} from "@features/contents/constants/contents-columns-strip";
import {
  getContentsFrame,
  type ContentsLayoutVariant,
} from "@features/contents/constants/contents-layout";
import type { ContentsColumnParallaxState } from "@features/contents/hooks/use-contents-column-parallax";
import { cn } from "@shadcn/lib/utils";

type ContentsColumnsStripProps = {
  variant: ContentsLayoutVariant;
  parallax: ContentsColumnParallaxState;
  transitionMs: number;
  className?: string;
};

/**
 * Bottom column band for flow layouts below xl.
 * Crops the Figma frame to the shaft zone (same absolute coords as desktop/
 * mobile stages) so proportions stay faithful without a tall empty stage.
 */
export function ContentsColumnsStrip({
  variant,
  parallax,
  transitionMs,
  className,
}: ContentsColumnsStripProps) {
  const frame = getContentsFrame(variant);
  const bandHeight = getContentsColumnBandHeight(variant);
  const bandAspect = getContentsColumnBandWidthAspect(variant);

  return (
    <div
      aria-hidden
      className={cn(
        "relative w-full overflow-hidden",
        // Figma band aspect (width → height); tablet needs more room for crowns.
        variant === "mobile" ? "max-h-[52svh]" : "max-h-[50svh]",
        className,
      )}
      style={{
        height: `calc(100cqw * ${bandAspect})`,
        maskImage: CONTENTS_COLUMNS_STRIP_EDGE_MASK,
        WebkitMaskImage: CONTENTS_COLUMNS_STRIP_EDGE_MASK,
      }}
    >
      {/*
        Full Figma-height stage, bottom-aligned: the strip window shows
        exactly [bandTop → frame.bottom], preserving Figma placement.
      */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: `${(frame.height / bandHeight) * 100}%`,
        }}
      >
        <ContentsColumns
          variant={variant}
          parallax={parallax}
          transitionMs={transitionMs}
          fadeTop={false}
          compositionScale={CONTENTS_COLUMNS_BAND_SCALE}
          spread={1}
        />
      </div>
    </div>
  );
}
