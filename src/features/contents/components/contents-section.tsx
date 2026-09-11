"use client";

import { ContentsColumns } from "@features/contents/components/contents-columns";
import { ContentsColumnsStrip } from "@features/contents/components/contents-columns-strip";
import { ContentsHeading } from "@features/contents/components/contents-heading";
import { ContentsTopicCard } from "@features/contents/components/contents-topic";
import { ContentsTopicsCarousel } from "@features/contents/components/contents-topics-carousel";
import { getContentsTopicStyle } from "@features/contents/constants/contents-layout";
import { CONTENTS_TOPICS } from "@features/contents/constants/contents-topics";
import type { ContentsColumnParallaxState } from "@features/contents/hooks/use-contents-column-parallax";

type ContentsSectionProps = {
  parallax: ContentsColumnParallaxState;
  transitionMs: number;
};

export function ContentsSection({
  parallax,
  transitionMs,
}: ContentsSectionProps) {
  return (
    <div className="relative w-full">
      {/*
        Desktop stage is full viewport width (no max-w). Below xl the absolute
        topic cards shrink too hard — keep the mobile carousel through mid widths.
      */}
      <div className="relative hidden w-full xl:block">
        <div className="@container relative aspect-[1512/982] min-h-svh w-full overflow-x-clip">
          <ContentsColumns
            variant="desktop"
            parallax={parallax}
            transitionMs={transitionMs}
          />
          <ContentsHeading variant="desktop" />
          {CONTENTS_TOPICS.map((topic, index) => (
            <ContentsTopicCard
              key={topic.id}
              topic={topic}
              className="absolute z-20"
              style={getContentsTopicStyle(topic.id, "desktop")}
              pulseDelayMs={index * 280}
            />
          ))}
        </div>
      </div>

      {/*
        Flow below xl — Figma column coords cropped to the bottom band
        (715:2054 phone / 659:435 tablet), height-capped so width doesn’t
        invent a tall empty stage.
      */}
      <div className="@container relative w-full overflow-hidden xl:hidden">
        <ContentsHeading variant="mobile" />
        <div className="relative z-20">
          <ContentsTopicsCarousel />
        </div>
        <ContentsColumnsStrip
          variant="mobile"
          parallax={parallax}
          transitionMs={transitionMs}
          className="mt-2 md:hidden"
        />
        <ContentsColumnsStrip
          variant="desktop"
          parallax={parallax}
          transitionMs={transitionMs}
          className="mt-3 hidden md:block"
        />
      </div>
    </div>
  );
}
