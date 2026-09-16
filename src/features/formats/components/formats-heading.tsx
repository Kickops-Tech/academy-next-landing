"use client";

import { SECTION_DISPLAY_HEADING } from "@core/constants/section-display-heading";
import {
  SECTION_HEADING_LEAD_STYLE,
  SECTION_HEADING_TRAIL_STYLE,
} from "@core/utils/section-heading-parallax-style";
import type { FormatsLayoutVariant } from "@features/formats/constants/formats-layout";
import { cn } from "@shadcn/lib/utils";

type FormatsHeadingProps = {
  variant: FormatsLayoutVariant;
};

export function FormatsHeading({ variant }: FormatsHeadingProps) {
  const fonts = SECTION_DISPLAY_HEADING[variant];

  if (variant === "mobile") {
    return (
      <h2 className="relative z-30 flex items-center justify-center whitespace-nowrap px-4 pt-10 pb-0">
        <span
          className={cn(
            "relative z-10 font-abril-fatface leading-none text-kickops-yellow",
            fonts.lead,
          )}
          style={SECTION_HEADING_LEAD_STYLE}
        >
          É PRECISO
        </span>
        <span
          className={cn(
            "relative z-0 font-league-gothic font-black leading-none text-white",
            fonts.display,
          )}
          style={{
            marginLeft: "-0.8cqw",
            ...SECTION_HEADING_TRAIL_STYLE,
          }}
        >
          SABER
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
            "relative z-10 font-abril-fatface leading-none text-kickops-yellow",
            fonts.lead,
          )}
          style={SECTION_HEADING_LEAD_STYLE}
        >
          É PRECISO
        </span>
        <span
          className={cn(
            "relative z-0 font-league-gothic font-black leading-none text-white",
            fonts.display,
          )}
          style={{
            marginLeft: "-1.2cqw",
            ...SECTION_HEADING_TRAIL_STYLE,
          }}
        >
          SABER
        </span>
      </h2>
    </div>
  );
}
