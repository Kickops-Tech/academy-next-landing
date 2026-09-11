import type { TargetAudience } from "@features/target/constants/target-audiences";
import {
  normalizedBoxStyle,
  normalizedPointStyle,
  TARGET_CORPORATE_CARD_LAYOUT,
  type TargetLayoutVariant,
} from "@features/target/constants/target-layout";
import { getTargetCardTypography } from "@features/target/constants/target-typography";
import { TargetCorporateGlobe } from "@features/target/components/target-corporate-globe";
import { cn } from "@shadcn/lib/utils";
import Image from "next/image";

type TargetCorporateCardContentProps = {
  audience: TargetAudience;
  variant: TargetLayoutVariant;
};

export function TargetCorporateCardContent({
  audience,
  variant,
}: TargetCorporateCardContentProps) {
  const layout = TARGET_CORPORATE_CARD_LAYOUT[variant];
  const typography = getTargetCardTypography("corporate", variant);
  const globeStyle = normalizedBoxStyle(layout.globe);
  const arrowStyle = normalizedBoxStyle(layout.arrow);

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute overflow-hidden"
        style={globeStyle}
      >
        <TargetCorporateGlobe />
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
          ...(layout.title.width !== undefined
            ? { width: `${layout.title.width * 100}%` }
            : {}),
        }}
      >
        {audience.title}
      </h3>

      <p
        className={cn("absolute", typography.body, audience.descriptionClassName)}
        style={{
          ...normalizedPointStyle(layout.description),
          width: `${(layout.description.width ?? 0.5625) * 100}%`,
        }}
      >
        {audience.description}
      </p>

      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute bg-kickops-yellow",
          typography.arrowPad,
        )}
        style={arrowStyle}
      >
        <Image
          src="/img/target/diagonal-arrow.svg"
          alt=""
          width={40}
          height={40}
          className={typography.arrowIcon}
        />
      </div>
    </>
  );
}
