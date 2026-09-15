import { ContentsColumns } from "@features/contents/components/contents-columns";
import { ContentsColumnsStrip } from "@features/contents/components/contents-columns-strip";
import { ContentsDesktopStage } from "@features/contents/components/contents-desktop-stage";
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
        Full-bleed desktop stage (no max-w shell). Topic type still scales via
        stage cqw; side gutters from a centered cap are intentional elsewhere,
        not here — columns need edge-to-edge.
      */}
      <div className="relative hidden w-full xl:block">
        <ContentsDesktopStage>
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
        </ContentsDesktopStage>
      </div>

      {/*
        Flow below xl — Figma column coords cropped to the bottom band
        (715:2054 phone / 659:435 tablet), height-capped so width doesn’t
        invent a tall empty stage.
      */}
      <div className="@container relative flex min-h-fold w-full flex-col overflow-hidden xl:hidden">
        <ContentsHeading variant="mobile" />
        <div className="relative z-20">
          <ContentsTopicsCarousel />
        </div>
        <ContentsColumnsStrip
          variant="mobile"
          parallax={parallax}
          transitionMs={transitionMs}
          className="mt-auto md:hidden"
        />
        <ContentsColumnsStrip
          variant="desktop"
          parallax={parallax}
          transitionMs={transitionMs}
          className="mt-auto hidden md:block"
        />
      </div>
    </div>
  );
}
