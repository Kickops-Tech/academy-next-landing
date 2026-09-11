import { ScrollCarousel } from "@core/components/scroll-carousel";
import { ContentsTopicCard } from "@features/contents/components/contents-topic";
import {
  CONTENTS_MOBILE_TOPIC_GAP,
  CONTENTS_TOPIC_CARD,
} from "@features/contents/constants/contents-layout";
import { CONTENTS_TOPICS } from "@features/contents/constants/contents-topics";

type ContentsTopicsCarouselProps = {
  className?: string;
};

export function ContentsTopicsCarousel({
  className,
}: ContentsTopicsCarouselProps) {
  return (
    <ScrollCarousel
      className={className}
      tone="dark"
      gap={CONTENTS_MOBILE_TOPIC_GAP}
      reveal
      aria-label="Tópicos do conteúdo"
    >
      {CONTENTS_TOPICS.map((topic, index) => (
        <ContentsTopicCard
          key={topic.id}
          topic={topic}
          className="shrink-0"
          style={{ width: CONTENTS_TOPIC_CARD.width }}
          pulseDelayMs={index * 280}
          iconSize="fixed"
        />
      ))}
    </ScrollCarousel>
  );
}
