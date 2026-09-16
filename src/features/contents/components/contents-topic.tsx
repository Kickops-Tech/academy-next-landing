"use client";

import { InViewReveal } from "@core/components/in-view-reveal";
import { CONTENTS_TOPIC_CARD } from "@features/contents/constants/contents-layout";
import type { ContentsTopic } from "@features/contents/constants/contents-topics";
import { cn } from "@shadcn/lib/utils";
import Image from "next/image";
import type { CSSProperties } from "react";

type ContentsTopicProps = {
  topic: ContentsTopic;
  className?: string;
  style?: CSSProperties;
  pulseDelayMs?: number;
  /** Stagger index for in-view reveal. */
  revealIndex?: number;
  /** `fluid` scales with @container (desktop stage); `fixed` for mobile carousel. */
  iconSize?: "fluid" | "fixed";
};

export function ContentsTopicCard({
  topic,
  className,
  style,
  pulseDelayMs = 0,
  revealIndex = 0,
  iconSize = "fluid",
}: ContentsTopicProps) {
  const fluid = iconSize === "fluid";
  const iconStyle: CSSProperties = fluid
    ? {
        width: `${CONTENTS_TOPIC_CARD.iconCqw}cqw`,
        height: `${CONTENTS_TOPIC_CARD.iconCqw}cqw`,
        animationDelay: `${pulseDelayMs}ms`,
      }
    : {
        width: 56,
        height: 56,
        animationDelay: `${pulseDelayMs}ms`,
      };

  return (
    <InViewReveal index={revealIndex} className={className} style={style}>
      <article className={cn("flex w-[228px] shrink-0 flex-col")}>
        <div className="contents-topic-icon relative" style={iconStyle}>
          <Image
            src={topic.iconSrc}
            alt=""
            width={64}
            height={64}
            className="size-full object-contain"
            unoptimized
          />
        </div>

        <p
          className={cn(
            "font-sans font-bold leading-[1.4] text-kickops-gray",
            fluid ? "mt-[1.85cqw] text-[0.7cqw]" : "mt-4 text-[12px]",
          )}
        >
          {topic.label}
        </p>
        <h3
          className={cn(
            "font-sans font-bold leading-[1.4] text-kickops-gray",
            fluid ? "text-[1.05cqw]" : "text-[18px]",
          )}
        >
          {topic.title}
        </h3>
        <p
          className={cn(
            "font-sans font-normal leading-[1.4] text-kickops-gray",
            fluid ? "mt-[1.06cqw] text-[0.815cqw]" : "mt-4 text-[14px]",
          )}
        >
          {topic.description}
        </p>
      </article>
    </InViewReveal>
  );
}
