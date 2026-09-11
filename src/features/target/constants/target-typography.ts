import { cn } from "@shadcn/lib/utils";
import type { TargetCardId, TargetLayoutVariant } from "@features/target/constants/target-layout";

export const TARGET_HEADING_PRA = cn(
  "font-abril-fatface text-white",
  "text-[4.25rem] leading-none md:text-[10rem]",
);

export const TARGET_HEADING_QUEM = cn(
  "font-league-gothic font-black text-kickops-gray",
  "leading-none",
  "text-[6.25rem] md:text-[12.5rem]",
);

/** Largura nativa Figma por card — divisor do cqw interno. */
export const TARGET_CARD_REF_WIDTH: Record<
  TargetCardId,
  Record<TargetLayoutVariant, number>
> = {
  corporate: { desktop: 640, mobile: 361 },
  tech: { desktop: 452, mobile: 361 },
  improvement: { desktop: 452, mobile: 361 },
};

const CARD_TYPOGRAPHY: Record<
  TargetCardId,
  Record<
    TargetLayoutVariant,
    { label: string; title: string; body: string; dot: string; arrowPad: string; arrowIcon: string }
  >
> = {
  corporate: {
    desktop: {
      label: "text-[1.875cqw]",
      title: "text-[2.8125cqw]",
      body: "text-[2.1875cqw]",
      dot: "size-[1.71875cqw]",
      arrowPad: "p-[1.5625cqw]",
      arrowIcon: "size-[6.25cqw]",
    },
    mobile: {
      label: "text-[3.3241cqw]",
      title: "text-[4.9861cqw]",
      body: "text-[3.8781cqw]",
      dot: "size-[7.7562cqw]",
      arrowPad: "p-[2.7701cqw]",
      arrowIcon: "size-[11.0803cqw]",
    },
  },
  tech: {
    desktop: {
      label: "text-[2.6549cqw]",
      title: "text-[3.9823cqw]",
      body: "text-[3.0973cqw]",
      dot: "",
      arrowPad: "",
      arrowIcon: "",
    },
    mobile: {
      label: "text-[3.3241cqw]",
      title: "text-[4.9861cqw]",
      body: "text-[3.8781cqw]",
      dot: "",
      arrowPad: "",
      arrowIcon: "",
    },
  },
  improvement: {
    desktop: {
      label: "text-[2.6549cqw]",
      title: "text-[3.9823cqw]",
      body: "text-[3.0973cqw]",
      dot: "",
      arrowPad: "",
      arrowIcon: "",
    },
    mobile: {
      label: "text-[3.3241cqw]",
      title: "text-[4.9861cqw]",
      body: "text-[3.8781cqw]",
      dot: "",
      arrowPad: "",
      arrowIcon: "",
    },
  },
};

const CARD_TYPO_BASE = "font-bold uppercase leading-[1.4] tracking-wide";
const CARD_TITLE_BASE = "font-bold leading-[1.4]";
const CARD_BODY_BASE = "font-normal leading-[1.4]";

export function getTargetCardTypography(
  cardId: TargetCardId,
  variant: TargetLayoutVariant,
) {
  const tokens = CARD_TYPOGRAPHY[cardId][variant];

  return {
    label: cn(CARD_TYPO_BASE, tokens.label),
    title: cn(CARD_TITLE_BASE, tokens.title),
    body: cn(CARD_BODY_BASE, tokens.body),
    dot: tokens.dot,
    arrowPad: tokens.arrowPad,
    arrowIcon: tokens.arrowIcon,
  };
}

/** Tipografia fixa do drawer (fora do stage fluido). */
export const TARGET_CARD_LABEL = cn(
  "text-xs font-bold uppercase leading-[1.4] tracking-wide",
);

export const TARGET_CARD_TITLE = cn("text-lg font-bold leading-[1.4]");

export const TARGET_CARD_BODY = cn("text-sm font-normal leading-[1.4]");
