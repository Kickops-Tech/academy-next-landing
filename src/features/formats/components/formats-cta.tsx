import { cn } from "@shadcn/lib/utils";
import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";

type FormatsCtaProps = {
  className?: string;
  style?: CSSProperties;
  size?: "desktop" | "mobile";
  onClick?: () => void;
};

/**
 * Figma Buttom Black → White (679:958 / 679:960):
 * default dark + yellow accent; hover/focus white fill, solid dark label + arrow.
 */
export function FormatsCta({
  className,
  style,
  size = "desktop",
  onClick,
}: FormatsCtaProps) {
  const fluid = size === "desktop";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group inline-flex cursor-pointer items-center justify-center border-0 bg-kickops-gray",
        "font-bold text-center whitespace-nowrap",
        "transition-colors duration-300 ease-out",
        "hover:bg-white focus-visible:bg-white active:bg-white",
        fluid
          ? "px-[2.65cqw] py-[1.59cqw] text-[1.19cqw]"
          : "px-10 py-6 text-[16px]",
        className,
      )}
      style={style}
    >
      <span
        className={cn(
          "transition-colors duration-300 ease-out",
          "text-white group-hover:text-kickops-gray group-focus-visible:text-kickops-gray",
        )}
      >
        Fale com a{" "}
        <span
          className={cn(
            "transition-colors duration-300 ease-out",
            "text-kickops-yellow",
            "group-hover:text-kickops-gray group-focus-visible:text-kickops-gray",
          )}
        >
          nossa equipe
        </span>
      </span>
      <span
        aria-hidden
        className={cn(
          "inline-flex h-6 shrink-0 overflow-hidden text-kickops-gray",
          "w-0 opacity-0",
          "transition-[width,opacity,margin] duration-300 ease-out",
          "group-hover:ml-2 group-hover:w-6 group-hover:opacity-100",
          "group-focus-visible:ml-2 group-focus-visible:w-6 group-focus-visible:opacity-100",
          "motion-reduce:transition-none",
        )}
      >
        <ArrowRight
          className={cn(
            "size-6 shrink-0",
            "-translate-x-2 transition-transform duration-300 ease-out",
            "group-hover:translate-x-0 group-focus-visible:translate-x-0",
            "motion-reduce:translate-x-0",
          )}
          strokeWidth={2.25}
        />
      </span>
    </button>
  );
}
