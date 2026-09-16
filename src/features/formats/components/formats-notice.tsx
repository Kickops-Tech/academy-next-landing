import {
  FORMATS_NOTICE,
  FORMATS_NOTICE_DESKTOP,
  FORMATS_NOTICE_MOBILE,
} from "@features/formats/constants/formats-notice";
import { cn } from "@shadcn/lib/utils";
import Image from "next/image";

type FormatsNoticeProps = {
  density?: "fluid" | "fixed";
  className?: string;
};

/**
 * Immersion-duration notice — Figma `918:351` (desktop) / `935:123` (mobile).
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
          ? "h-full items-center gap-[0.926cqw] rounded-[0.794cqw] px-[1.85cqw] py-[1.32cqw]"
          : "items-start gap-3 rounded-xl px-5 py-5",
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
          fluid ? "size-[2.65cqw]" : "size-8",
        )}
        unoptimized
      />
      {fluid ? (
        <p
          className={cn(
            "min-w-0 flex-1 text-right font-medium leading-[1.4]",
            "text-[1.455cqw]",
          )}
        >
          {FORMATS_NOTICE_DESKTOP.lead}
          <span className="text-kickops-yellow">
            {FORMATS_NOTICE_DESKTOP.highlight}
          </span>
        </p>
      ) : (
        <p
          className={cn(
            "min-w-0 flex-1 font-normal leading-[1.4] text-[14px]",
          )}
        >
          {FORMATS_NOTICE_MOBILE.lead}
          <span className="text-kickops-yellow">
            {FORMATS_NOTICE_MOBILE.highlight}
          </span>
          {FORMATS_NOTICE_MOBILE.trail}
        </p>
      )}
    </aside>
  );
}
