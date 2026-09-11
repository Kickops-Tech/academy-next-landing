import { AcademyBrain } from "@core/components/academy-brain";
import { PeopleCarousel } from "@features/people/components/people-carousel";
import { PeopleHeading } from "@features/people/components/people-heading";
import { PEOPLE_DESKTOP_FRAME } from "@features/people/constants/people-layout";

function toPercent(value: number, total: number) {
  return `${(value / total) * 100}%`;
}

export function PeopleSection() {
  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-visible">
      {/*
        Same xl gate as Formats. Below xl: flow stage; agent row goes
        horizontal from md (rem type), phone stays stacked.
      */}
      <div className="relative hidden w-full flex-1 overflow-visible xl:block">
        <div className="@container relative aspect-[1512/899] min-h-[100svh] w-full overflow-visible">
          <AcademyBrain variant="desktop" />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 z-[15] bg-gradient-to-b from-transparent to-kickops-gray"
            style={{
              top: toPercent(359, PEOPLE_DESKTOP_FRAME.height),
              height: toPercent(540, PEOPLE_DESKTOP_FRAME.height),
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
      <div className="@container relative flex min-h-[min(100%,20rem)] w-full flex-1 flex-col overflow-visible px-6 pb-16 xl:hidden md:px-12">
        <AcademyBrain variant="mobile" layout="flow" />
        <PeopleHeading variant="mobile" />
        <div className="relative z-20 w-full pointer-events-auto">
          <PeopleCarousel layout="mobile" />
        </div>
      </div>
    </div>
  );
}
