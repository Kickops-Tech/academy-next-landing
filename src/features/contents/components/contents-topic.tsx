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
  /** `fluid` scales with @container (desktop stage); `fixed` for mobile carousel. */
  iconSize?: "fluid" | "fixed";
};

export function ContentsTopicCard({
  topic,
  className,
  style,
  pulseDelayMs = 0,
  iconSize = "fluid",
}: ContentsTopicProps) {
  const iconStyle: CSSProperties =
    iconSize === "fluid"
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
    <article
      className={cn("flex w-[228px] shrink-0 flex-col", className)}
      style={style}
    >
      <div className="contents-topic-icon relative overflow-clip" style={iconStyle}>
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
          "font-sans text-[12px] font-bold leading-[1.4] text-kickops-gray",
          iconSize === "fluid" ? "mt-[1.85cqw]" : "mt-4",
        )}
      >
        {topic.label}
      </p>
      <h3 className="font-sans text-[18px] font-bold leading-[1.4] text-kickops-gray">
        {topic.title}
      </h3>
      <p className="mt-4 font-sans text-[14px] font-normal leading-[1.4] text-kickops-gray">
        {topic.description}
      </p>
    </article>
  );
}
