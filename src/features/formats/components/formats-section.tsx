import { FormatsBlockCard } from "@features/formats/components/formats-block";
import { FormatsBlocksCarousel } from "@features/formats/components/formats-blocks-carousel";
import { FormatsCta } from "@features/formats/components/formats-cta";
import { FormatsHeading } from "@features/formats/components/formats-heading";
import { FORMATS_BLOCKS } from "@features/formats/constants/formats-blocks";
import {
  FORMATS_DESKTOP_BLOCK_LEFT,
  FORMATS_DESKTOP_FRAME,
} from "@features/formats/constants/formats-layout";
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
      <div className="relative hidden w-full overflow-visible xl:block">
        <div className="@container relative aspect-[1512/982] min-h-svh w-full overflow-visible">
          <FormatsHeading variant="desktop" />

          {FORMATS_BLOCKS.map((block) => (
            <FormatsBlockCard
              key={block.id}
              block={block}
              className="absolute z-20 pointer-events-auto w-[17.2cqw]"
              style={{
                left: toPercent(
                  FORMATS_DESKTOP_BLOCK_LEFT[block.id],
                  FORMATS_DESKTOP_FRAME.width,
                ),
                top: toPercent(335, FORMATS_DESKTOP_FRAME.height),
              }}
            />
          ))}

          <div
            className="absolute z-20 flex w-full justify-center pointer-events-auto"
            style={{ top: toPercent(628.5, FORMATS_DESKTOP_FRAME.height) }}
          >
            <FormatsCta size="desktop" className="w-[292px]" />
          </div>
        </div>
      </div>

      {/*
        Flow layout below xl — phone aspect ratios scale to absurd heights
        on ~750px tablets (aspect 393/852 → ~1600px alone).
      */}
      <div className="@container relative w-full overflow-visible pb-12 xl:hidden">
        <FormatsHeading variant="mobile" />
        <div className="relative z-20 mx-auto w-full max-w-4xl pointer-events-auto">
          <FormatsBlocksCarousel />
          <div className="mt-7 flex justify-center">
            <FormatsCta size="mobile" className="w-[292px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
