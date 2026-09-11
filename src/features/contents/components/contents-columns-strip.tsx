"use client";

import { ContentsColumns } from "@features/contents/components/contents-columns";
import {
  CONTENTS_COLUMNS_BAND_MASK,
  CONTENTS_COLUMNS_BAND_SCALE,
  getContentsColumnBandHeight,
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

  return (
    <div
      aria-hidden
      className={cn(
        "relative w-full overflow-hidden",
        // Cap height by viewport width so tablet doesn’t grow a phone-aspect void.
        variant === "mobile"
          ? "h-[clamp(11rem,50vw,17rem)]"
          : "h-[clamp(13rem,28vw,22rem)]",
        className,
      )}
      style={{
        maskImage: CONTENTS_COLUMNS_BAND_MASK,
        WebkitMaskImage: CONTENTS_COLUMNS_BAND_MASK,
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
        />
      </div>
    </div>
  );
}
