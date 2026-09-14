import { cn } from "@shadcn/lib/utils";
import Link from "next/link";
import type { CSSProperties } from "react";

type FormatsCtaProps = {
  className?: string;
  style?: CSSProperties;
  size?: "desktop" | "mobile";
};

export function FormatsCta({
  className,
  style,
  size = "desktop",
}: FormatsCtaProps) {
  return (
    <Link
      href="#"
      className={cn(
        "inline-flex items-center justify-center border border-white/25 bg-kickops-gray",
        "font-bold text-center whitespace-nowrap transition-colors hover:border-white/40",
        size === "desktop"
          ? "px-[2.65cqw] py-[1.59cqw] text-[1.19cqw]"
          : "px-10 py-6 text-[16px]",
        className,
      )}
      style={style}
    >
      <span className="text-white">
        Fale com a <span className="text-kickops-yellow">nossa equipe</span>
      </span>
    </Link>
  );
}
