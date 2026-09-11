import type { TargetAudience } from "@features/target/constants/target-audiences";
import {
  normalizedBoxStyle,
  normalizedPointStyle,
  TARGET_IMPROVEMENT_CARD_LAYOUT,
  TARGET_MOBILE_LAYOUT,
  TARGET_DESKTOP_LAYOUT,
  type TargetLayoutVariant,
} from "@features/target/constants/target-layout";
import { getTargetCardTypography } from "@features/target/constants/target-typography";
import { cn } from "@shadcn/lib/utils";
import Image from "next/image";
import type { CSSProperties } from "react";

type TargetImprovementCardContentProps = {
  audience: TargetAudience;
  variant: TargetLayoutVariant;
};

function artBoxStyle(
  layout: (typeof TARGET_IMPROVEMENT_CARD_LAYOUT)[TargetLayoutVariant],
  variant: TargetLayoutVariant,
): CSSProperties {
  if (!layout.imageArt) {
    return { width: "100%", height: "100%" };
  }

  const card =
    variant === "mobile"
      ? TARGET_MOBILE_LAYOUT.improvement
      : TARGET_DESKTOP_LAYOUT.improvement;
  const frameWidthPx = layout.image.width * card.width;
  const frameHeightPx = layout.image.height * card.height;

  return {
    width: `${(layout.imageArt.width / frameWidthPx) * 100}%`,
    height: `${(layout.imageArt.height / frameHeightPx) * 100}%`,
  };
}

export function TargetImprovementCardContent({
  audience,
  variant,
}: TargetImprovementCardContentProps) {
  const layout = TARGET_IMPROVEMENT_CARD_LAYOUT[variant];
  const typography = getTargetCardTypography("improvement", variant);

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute flex items-center justify-center overflow-visible"
        style={normalizedBoxStyle(layout.image)}
      >
        <div
          className={cn(
            "relative flex-none",
            layout.imageRotate === true && "-rotate-45",
          )}
          style={artBoxStyle(layout, variant)}
        >
          <Image
            src="/img/target/hand.png"
            alt="Escultura de mão humana"
            fill
            className="object-cover object-center"
            sizes="50vw"
          />
        </div>
      </div>

      <p
        className={cn("absolute", typography.label, audience.labelClassName)}
        style={normalizedPointStyle(layout.label)}
      >
        {audience.label}
      </p>

      <h3
        className={cn("absolute", typography.title, audience.titleClassName)}
        style={{
          ...normalizedPointStyle(layout.title),
          width: `${(layout.title.width ?? 0.49) * 100}%`,
        }}
      >
        {audience.titleLines?.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h3>

      <p
        className={cn("absolute", typography.body, audience.descriptionClassName)}
        style={{
          ...normalizedPointStyle(layout.description),
          width: `${(layout.description.width ?? 0.68) * 100}%`,
        }}
      >
        {audience.description}
      </p>
    </>
  );
}
