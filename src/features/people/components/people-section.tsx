import { AcademyBrain } from "@core/components/academy-brain";
import { PeopleCarousel } from "@features/people/components/people-carousel";
import { PeopleHeading } from "@features/people/components/people-heading";
import { PEOPLE_DESKTOP_FRAME } from "@features/people/constants/people-layout";
import type { CSSProperties } from "react";

function toPercent(value: number, total: number) {
  return `${(value / total) * 100}%`;
}

/**
 * Full-bleed readability scrim under agent copy. Starts below the Formats
 * bleed / brain crown so its top edge never draws a hard cut across folds.
 */
const PEOPLE_DESKTOP_SCRIM_TOP = 360;

/** Long transparent head — avoids a straight contrast line at the scrim top. */
const PEOPLE_SCRIM_FADE: CSSProperties = {
  backgroundImage:
    "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.2) 65%, transparent 88%, transparent 100%)",
};

export function PeopleSection() {
  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-visible">
      {/*
        Same xl gate as Formats. Below xl: flow stage; agent row goes
        horizontal from md (rem type), phone stays stacked.
      */}
      <div className="relative hidden w-full flex-1 overflow-visible xl:block">
        <div className="@container relative aspect-[1512/899] min-h-fold w-full overflow-visible">
          <AcademyBrain variant="desktop" />

          <div
            aria-hidden={true}
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[15]"
            style={{
              top: toPercent(
                PEOPLE_DESKTOP_SCRIM_TOP,
                PEOPLE_DESKTOP_FRAME.height,
              ),
              ...PEOPLE_SCRIM_FADE,
            }}
          />

          <PeopleHeading variant="desktop" />

          <div
            className="absolute z-20 pointer-events-auto"
            style={{
              left: toPercent(294, PEOPLE_DESKTOP_FRAME.width),
              top: toPercent(335, PEOPLE_DESKTOP_FRAME.height),
              width: toPercent(921, PEOPLE_DESKTOP_FRAME.width),
            }}
          >
            <PeopleCarousel layout="desktop" />
          </div>
        </div>
      </div>

      {/*
        Content-height stage below xl. Phone stacks; md+ is photo|copy row.
        flex-1 + min-h keeps the gray band at least one viewport with Formats.
      */}
      <div className="@container relative flex min-h-fold w-full flex-1 flex-col overflow-visible px-6 pb-16 xl:hidden md:px-12">
        <AcademyBrain variant="mobile" layout="flow" />
        <PeopleHeading variant="mobile" />
        <div
          aria-hidden={true}
          className="pointer-events-none absolute inset-x-0 bottom-0 top-[9rem] z-[15]"
          style={PEOPLE_SCRIM_FADE}
        />
        <div className="relative z-20 w-full flex-1 pointer-events-auto">
          <PeopleCarousel layout="mobile" />
        </div>
      </div>
    </div>
  );
}
