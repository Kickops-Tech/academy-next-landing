"use client";

import { SECTION_DISPLAY_HEADING_MOBILE } from "@core/constants/section-display-heading";
import {
  SECTION_HEADING_LEAD_STYLE,
  SECTION_HEADING_TRAIL_STYLE,
} from "@core/utils/section-heading-parallax-style";
import { PEOPLE_HEADING } from "@features/people/constants/people-content";
import type { PeopleLayoutVariant } from "@features/people/constants/people-layout";
import { cn } from "@shadcn/lib/utils";

const HEADING_FONT = {
  desktop: {
    lead: "text-[6.61cqw]",
    display: "text-[13.23cqw]",
  },
  mobile: {
    lead: SECTION_DISPLAY_HEADING_MOBILE.lead,
    display: SECTION_DISPLAY_HEADING_MOBILE.display,
  },
} as const;

type PeopleHeadingProps = {
  variant: PeopleLayoutVariant;
};

export function PeopleHeading({ variant }: PeopleHeadingProps) {
  const fonts = HEADING_FONT[variant];

  if (variant === "mobile") {
    return (
      <h2 className="relative z-30 flex items-center justify-center whitespace-nowrap px-4 pt-8 pb-4">
        <span
          className={cn(
            "relative z-10 font-abril-fatface leading-none text-kickops-gray",
            fonts.lead,
          )}
          style={SECTION_HEADING_LEAD_STYLE}
        >
          {PEOPLE_HEADING.lead}
        </span>
        <span
          className={cn(
            "relative z-0 font-league-gothic font-black leading-none text-white",
            fonts.display,
          )}
          style={{
            marginLeft: "-1cqw",
            ...SECTION_HEADING_TRAIL_STYLE,
          }}
        >
          {PEOPLE_HEADING.display}
        </span>
      </h2>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      <h2
        className="absolute inset-x-0 flex items-center justify-center whitespace-nowrap"
        style={{ top: "4.45cqh" }}
      >
        <span
          className={cn(
            "relative z-10 font-abril-fatface leading-none text-kickops-gray",
            fonts.lead,
          )}
          style={SECTION_HEADING_LEAD_STYLE}
        >
          {PEOPLE_HEADING.lead}
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
          {PEOPLE_HEADING.display}
        </span>
      </h2>
    </div>
  );
}
