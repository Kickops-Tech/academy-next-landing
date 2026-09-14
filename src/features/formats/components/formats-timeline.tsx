import {
  FORMATS_TIMELINE_ITEMS,
  type FormatsTimelineItem,
} from "@features/formats/constants/formats-timeline";
import { cn } from "@shadcn/lib/utils";
import Image from "next/image";

type FormatsTimelineProps = {
  density?: "fluid" | "fixed";
  className?: string;
};

function TimelineItem({
  item,
  density,
}: {
  item: FormatsTimelineItem;
  density: "fluid" | "fixed";
}) {
  const fluid = density === "fluid";

  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 items-center",
        fluid ? "gap-[1.06cqw]" : "gap-4",
      )}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden",
          item.iconBgClass,
          fluid ? "size-[5.62cqw] rounded-[1.32cqw]" : "size-[85px] rounded-[20px]",
        )}
      >
        <Image
          src={item.iconSrc}
          alt=""
          width={40}
          height={40}
          className={cn(
            "absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2",
            fluid ? "size-[2.65cqw]" : "size-10",
          )}
          unoptimized
        />
      </div>
      <div className="flex min-w-0 flex-col leading-[1.4]">
        <p
          className={cn(
            "font-bold text-white",
            fluid ? "text-[1.85cqw]" : "text-[28px]",
          )}
        >
          {item.title}
        </p>
        <p
          className={cn(
            "font-normal",
            item.descriptionClass,
            fluid ? "mt-[0.2cqw] max-w-[14.55cqw] text-[0.926cqw]" : "mt-0.5 max-w-[220px] text-[14px]",
          )}
        >
          {item.description}
        </p>
      </div>
    </div>
  );
}

/**
 * Course-time strip above Formats cards — Figma `918:351`.
 */
export function FormatsTimeline({
  density = "fluid",
  className,
}: FormatsTimelineProps) {
  const fluid = density === "fluid";

  return (
    <div
      className={cn(
        "flex w-full items-stretch overflow-hidden bg-kickops-gray",
        fluid
          ? "flex-row gap-[1.59cqw] rounded-[0.794cqw] px-[1.32cqw] py-[1.32cqw]"
          : "flex-col gap-5 rounded-xl px-5 py-5 sm:flex-row sm:items-center sm:gap-6",
        className,
      )}
      role="list"
      aria-label="Tempo da experiência"
    >
      {FORMATS_TIMELINE_ITEMS.map((item) => (
        <div key={item.id} role="listitem" className="min-w-0 flex-1">
          <TimelineItem item={item} density={density} />
        </div>
      ))}
    </div>
  );
}
