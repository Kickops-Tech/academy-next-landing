"use client";

import { SECTION_DISPLAY_HEADING } from "@core/constants/section-display-heading";
import {
  SECTION_HEADING_LEAD_STYLE,
  SECTION_HEADING_TRAIL_STYLE,
} from "@core/utils/section-heading-parallax-style";
import { cn } from "@shadcn/lib/utils";
import type { TargetLayoutVariant } from "@features/target/constants/target-layout";

type TargetHeadingProps = {
  variant: TargetLayoutVariant;
  /** In-flow heading for tablet grid (avoids absolute stage). */
  placement?: "absolute" | "flow";
};

export function TargetHeading({
  variant,
  placement = "absolute",
}: TargetHeadingProps) {
  const fonts = SECTION_DISPLAY_HEADING[variant];

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
          fonts.lead,
        )}
        style={SECTION_HEADING_LEAD_STYLE}
      >
        PRA
      </span>
      <span
        className={cn(
          "relative z-0 font-league-gothic font-black leading-none text-kickops-gray",
          fonts.display,
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
