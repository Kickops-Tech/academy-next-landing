"use client";

import { SECTION_DISPLAY_HEADING_MOBILE } from "@core/constants/section-display-heading";
import {
  SECTION_HEADING_LEAD_STYLE,
  SECTION_HEADING_TRAIL_STYLE,
} from "@core/utils/section-heading-parallax-style";
import type { ContentsLayoutVariant } from "@features/contents/constants/contents-layout";
import { cn } from "@shadcn/lib/utils";

const HEADING_FONT = {
  desktop: {
    vamos: "text-[6.61cqw]",
    abordar: "text-[13.23cqw]",
  },
  mobile: {
    vamos: SECTION_DISPLAY_HEADING_MOBILE.lead,
    abordar: SECTION_DISPLAY_HEADING_MOBILE.display,
  },
} as const;

type ContentsHeadingProps = {
  variant: ContentsLayoutVariant;
};

export function ContentsHeading({ variant }: ContentsHeadingProps) {
  const fonts = HEADING_FONT[variant];

  if (variant === "mobile") {
    return (
      <h2 className="relative z-30 flex items-center justify-center whitespace-nowrap px-4 pt-10 pb-12">
        <span
          className={cn(
            "relative z-10 font-abril-fatface leading-none text-kickops-green",
            fonts.vamos,
          )}
          style={SECTION_HEADING_LEAD_STYLE}
        >
          VAMOS
        </span>
        <span
          className={cn(
            "relative z-0 font-league-gothic font-black leading-none text-kickops-gray",
            fonts.abordar,
          )}
          style={{
            marginLeft: "-1.5cqw",
            ...SECTION_HEADING_TRAIL_STYLE,
          }}
        >
          ABORDAR
        </span>
      </h2>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      <h2
        className="absolute inset-x-0 flex items-center justify-center whitespace-nowrap"
        style={{ top: "4.073cqh" }}
      >
        <span
          className={cn(
            "relative z-10 font-abril-fatface leading-none text-kickops-green",
            fonts.vamos,
          )}
          style={SECTION_HEADING_LEAD_STYLE}
        >
          VAMOS
        </span>
        <span
          className={cn(
            "relative z-0 font-league-gothic font-black leading-none text-kickops-gray",
            fonts.abordar,
          )}
          style={{
            marginLeft: "-2.2cqw",
            ...SECTION_HEADING_TRAIL_STYLE,
          }}
        >
          ABORDAR
        </span>
      </h2>
    </div>
  );
}
