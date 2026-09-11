import { ScrollCarousel } from "@core/components/scroll-carousel";
import { FormatsBlockCard } from "@features/formats/components/formats-block";
import { FORMATS_BLOCKS } from "@features/formats/constants/formats-blocks";
import {
  FORMATS_MOBILE_BLOCK_GAP,
  FORMATS_MOBILE_BLOCK_WIDTH,
} from "@features/formats/constants/formats-layout";

type FormatsBlocksCarouselProps = {
  className?: string;
};

export function FormatsBlocksCarousel({
  className,
}: FormatsBlocksCarouselProps) {
  return (
    <ScrollCarousel
      className={className}
      tone="light"
      gap={FORMATS_MOBILE_BLOCK_GAP}
      reveal
      aria-label="Formatos da introspecção"
    >
      {FORMATS_BLOCKS.map((block) => (
        <FormatsBlockCard
          key={block.id}
          block={block}
          className="shrink-0"
          style={{ width: FORMATS_MOBILE_BLOCK_WIDTH }}
        />
      ))}
    </ScrollCarousel>
  );
}
