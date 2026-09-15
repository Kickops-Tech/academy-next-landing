import { FOLD_STAGE_SHELL_CLASS } from "@core/constants/fold-stage";
import { FormatsBlockCard } from "@features/formats/components/formats-block";
import { FormatsBlocksCarousel } from "@features/formats/components/formats-blocks-carousel";
import { FormatsCta } from "@features/formats/components/formats-cta";
import { FormatsHeading } from "@features/formats/components/formats-heading";
import { FormatsNotice } from "@features/formats/components/formats-notice";
import { FORMATS_BLOCKS } from "@features/formats/constants/formats-blocks";
import {
  FORMATS_DESKTOP_BLOCK_LEFT,
  FORMATS_DESKTOP_FRAME,
  FORMATS_DESKTOP_TOP,
} from "@features/formats/constants/formats-layout";
import { FORMATS_NOTICE_DESKTOP } from "@features/formats/constants/formats-notice";
import { cn } from "@shadcn/lib/utils";

function toPercent(value: number, total: number) {
  return `${(value / total) * 100}%`;
}

export function FormatsSection() {
  return (
    <div className={cn("relative w-full", "py-0")}>
      {/*
        Desktop Figma is 1512-wide. Below xl the absolute 3-column stage
        collapses — keep the mobile carousel through tablet / small laptop.
      */}
      <div
        className={cn(
          "relative hidden overflow-visible xl:block",
          FOLD_STAGE_SHELL_CLASS,
        )}
      >
        <div className="@container relative aspect-[1512/982] min-h-fold w-full overflow-visible">
          <FormatsHeading variant="desktop" />

          <div
            className="absolute z-20 pointer-events-none"
            style={{
              left: toPercent(
                FORMATS_NOTICE_DESKTOP.left,
                FORMATS_DESKTOP_FRAME.width,
              ),
              top: toPercent(
                FORMATS_DESKTOP_TOP.notice,
                FORMATS_DESKTOP_FRAME.height,
              ),
              width: toPercent(
                FORMATS_NOTICE_DESKTOP.width,
                FORMATS_DESKTOP_FRAME.width,
              ),
            }}
          >
            <FormatsNotice density="fluid" />
          </div>

          {FORMATS_BLOCKS.map((block) => (
            <FormatsBlockCard
              key={block.id}
              block={block}
              density="fluid"
              className="absolute z-20 pointer-events-auto w-[17.2cqw]"
              style={{
                left: toPercent(
                  FORMATS_DESKTOP_BLOCK_LEFT[block.id],
                  FORMATS_DESKTOP_FRAME.width,
                ),
                top: toPercent(
                  FORMATS_DESKTOP_TOP.blocks,
                  FORMATS_DESKTOP_FRAME.height,
                ),
              }}
            />
          ))}

          <div
            className="absolute z-20 flex w-full justify-center pointer-events-auto"
            style={{
              top: toPercent(
                FORMATS_DESKTOP_TOP.cta,
                FORMATS_DESKTOP_FRAME.height,
              ),
            }}
          >
            <FormatsCta size="desktop" className="w-[19.31cqw]" />
          </div>
        </div>
      </div>

      {/*
        Flow layout below xl — phone aspect ratios scale to absurd heights
        on ~750px tablets (aspect 393/852 → ~1600px alone).
      */}
      <div className="@container relative flex min-h-fold w-full flex-col overflow-visible pb-12 xl:hidden">
        <FormatsHeading variant="mobile" />
        {/*
          No outer px — ScrollCarousel already gutters px-4 / md:px-12.
          Notice + CTA share that inset so borders match the track content.
        */}
        <div className="relative z-20 mx-auto w-full max-w-4xl pointer-events-auto">
          {/*
            Padding (not mx on w-full) — same gutter as ScrollCarousel.
            mx + w-full overflows and shifts the box on tablet.
          */}
          <div className="mb-6 px-4 md:px-12">
            <FormatsNotice density="fixed" />
          </div>
          <FormatsBlocksCarousel />
          <div className="mt-7 flex justify-center px-4 md:px-12">
            <FormatsCta size="mobile" className="w-[292px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
