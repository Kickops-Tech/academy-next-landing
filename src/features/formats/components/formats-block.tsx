"use client";

import { InViewReveal } from "@core/components/in-view-reveal";
import type { FormatsBlock } from "@features/formats/constants/formats-blocks";
import { cn } from "@shadcn/lib/utils";
import type { CSSProperties } from "react";

type FormatsBlockCardProps = {
  block: FormatsBlock;
  className?: string;
  style?: CSSProperties;
  /** Stagger index for in-view reveal. */
  revealIndex?: number;
  /** `fluid` = stage cqw (desktop); `fixed` = px (mobile carousel). */
  density?: "fluid" | "fixed";
};

export function FormatsBlockCard({
  block,
  className,
  style,
  revealIndex = 0,
  density = "fixed",
}: FormatsBlockCardProps) {
  const fluid = density === "fluid";

  return (
    <InViewReveal index={revealIndex} className={className} style={style}>
      <article className={cn("flex w-full flex-col gap-0 leading-[1.4]")}>
        <p
          className={cn(
            "font-bold text-kickops-yellow",
            fluid ? "text-[0.794cqw]" : "text-[12px]",
          )}
        >
          {block.eyebrow}
        </p>
        <h3
          className={cn(
            "font-bold text-white",
            fluid ? "mt-[0.794cqw] text-[1.19cqw]" : "mt-[12px] text-[18px]",
          )}
        >
          {block.title}
        </h3>
        <div
          className={cn(
            "flex flex-col",
            fluid ? "mt-[1.06cqw] gap-[1.06cqw]" : "mt-[16px] gap-4",
          )}
        >
          {block.paragraphs.map((paragraph) => (
            <p
              key={paragraph.text}
              className={cn(
                fluid ? "text-[0.926cqw]" : "text-[14px]",
                paragraph.accent ? "text-kickops-yellow" : "text-white",
              )}
            >
              {paragraph.text}
            </p>
          ))}
        </div>
      </article>
    </InViewReveal>
  );
}
