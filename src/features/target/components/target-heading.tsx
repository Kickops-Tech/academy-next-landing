"use client";

import { SECTION_DISPLAY_HEADING_MOBILE } from "@core/constants/section-display-heading";
import {
  SECTION_HEADING_LEAD_STYLE,
  SECTION_HEADING_TRAIL_STYLE,
} from "@core/utils/section-heading-parallax-style";
import { cn } from "@shadcn/lib/utils";
import type { TargetLayoutVariant } from "@features/target/constants/target-layout";

const HEADING_FONT = {
  desktop: {
    pra: "text-[10.58cqw]",
    quem: "text-[16cqw]",
  },
  mobile: {
    pra: SECTION_DISPLAY_HEADING_MOBILE.lead,
    quem: SECTION_DISPLAY_HEADING_MOBILE.display,
  },
} as const;

type TargetHeadingProps = {
  variant: TargetLayoutVariant;
  /** In-flow heading for tablet grid (avoids absolute stage). */
  placement?: "absolute" | "flow";
};

export function TargetHeading({
  variant,
  placement = "absolute",
}: TargetHeadingProps) {
  const fonts = HEADING_FONT[variant];

  const title = (
    <h2
      className={cn(
        "flex items-center justify-center gap-0 whitespace-nowrap",
        placement === "flow" && "relative px-2 py-6",
        placement === "absolute" && "absolute inset-x-0",
      )}
      style={
        placement === "absolute"
          ? { top: variant === "desktop" ? "7.637cqh" : "4.553cqh" }
          : undefined
      }
    >
      <span
        className={cn(
          "relative z-10 font-abril-fatface leading-none text-white",
          fonts.pra,
        )}
        style={SECTION_HEADING_LEAD_STYLE}
      >
        PRA
      </span>
      <span
        className={cn(
          "relative z-0 font-league-gothic font-black leading-none text-kickops-gray",
          fonts.quem,
        )}
        style={{
          marginLeft: variant === "desktop" ? "-2.5cqw" : "-1.25cqw",
          ...SECTION_HEADING_TRAIL_STYLE,
        }}
      >
        QUEM?
      </span>
    </h2>
  );

  if (placement === "flow") {
    return <div className="relative z-20 w-full">{title}</div>;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-20">{title}</div>
  );
}
