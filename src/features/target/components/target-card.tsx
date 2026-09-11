"use client";

import { cn } from "@shadcn/lib/utils";
import type { CSSProperties, ReactNode } from "react";

type TargetCardProps = {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  ariaLabel: string;
  onClick: () => void;
};

export function TargetCard({
  className,
  style,
  children,
  ariaLabel,
  onClick,
}: TargetCardProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      style={style}
      className={cn(
        "@container relative block cursor-pointer overflow-hidden text-left",
        "transition-transform duration-300 ease-out",
        "pointer-fine:hover:scale-[1.02]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kickops-gray",
        className,
      )}
    >
      <div className="absolute inset-0">{children}</div>
    </button>
  );
}
