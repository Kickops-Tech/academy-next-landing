import {
  FORMATS_NOTICE,
} from "@features/formats/constants/formats-notice";
import { cn } from "@shadcn/lib/utils";
import Image from "next/image";

type FormatsNoticeProps = {
  density?: "fluid" | "fixed";
  className?: string;
};

/**
 * Immersion-duration notice — Figma `918:351` (desktop).
 * Mobile: stacked icon + wrapping copy (no mobile frame in Figma).
 */
export function FormatsNotice({
  density = "fluid",
  className,
}: FormatsNoticeProps) {
  const fluid = density === "fluid";

  return (
    <aside
      role="note"
      aria-label="Recomendação de duração da imersão"
      className={cn(
        "flex w-full bg-kickops-gray text-white",
        fluid
          ? "items-start gap-[0.926cqw] rounded-[0.794cqw] px-[1.32cqw] py-[1.32cqw]"
          : "items-start gap-3 rounded-xl px-4 py-4 sm:gap-4 sm:px-5 sm:py-5",
        className,
      )}
    >
      <Image
        src={FORMATS_NOTICE.iconSrc}
        alt=""
        width={40}
        height={40}
        className={cn(
          "shrink-0",
          fluid ? "size-[2.65cqw]" : "size-9 sm:size-10",
        )}
        unoptimized
      />
      <div
        className={cn(
          "min-w-0 flex-1 font-normal leading-[1.4]",
          fluid ? "text-[0.926cqw]" : "text-sm sm:text-[14px]",
        )}
      >
        <p>
          {FORMATS_NOTICE.lead}
          <span className="text-kickops-yellow">{FORMATS_NOTICE.highlight}</span>
        </p>
        <p>{FORMATS_NOTICE.trail}</p>
      </div>
    </aside>
  );
}
