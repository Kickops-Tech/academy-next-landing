import { AcademyBrain } from "@core/components/academy-brain";
import { PeopleCarousel } from "@features/people/components/people-carousel";
import { PeopleHeading } from "@features/people/components/people-heading";
import { PEOPLE_DESKTOP_FRAME } from "@features/people/constants/people-layout";

function toPercent(value: number, total: number) {
  return `${(value / total) * 100}%`;
}

/**
 * Full-bleed readability scrim: bottom of the People fold up to just
 * under “MENTES PENSANTES” (heading sits ~4.45cqh).
 */
const PEOPLE_DESKTOP_SCRIM_TOP = 250;

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
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] bg-linear-to-t from-black/90 via-black/55 to-transparent"
            style={{
              top: toPercent(PEOPLE_DESKTOP_SCRIM_TOP, PEOPLE_DESKTOP_FRAME.height),
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
          className="pointer-events-none absolute inset-x-0 bottom-0 top-[7.5rem] z-[15] bg-linear-to-t from-black/90 via-black/55 to-transparent"
        />
        <div className="relative z-20 w-full flex-1 pointer-events-auto">
          <PeopleCarousel layout="mobile" />
        </div>
      </div>
    </div>
  );
}
