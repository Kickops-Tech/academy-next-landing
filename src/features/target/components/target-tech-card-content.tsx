import type { TargetAudience } from "@features/target/constants/target-audiences";
import {
  normalizedBoxStyle,
  normalizedPointStyle,
  TARGET_TECH_CARD_LAYOUT,
  type TargetLayoutVariant,
} from "@features/target/constants/target-layout";
import { getTargetCardTypography } from "@features/target/constants/target-typography";
import { cn } from "@shadcn/lib/utils";
import Image from "next/image";

type TargetTechCardContentProps = {
  audience: TargetAudience;
  variant: TargetLayoutVariant;
};

export function TargetTechCardContent({
  audience,
  variant,
}: TargetTechCardContentProps) {
  const layout = TARGET_TECH_CARD_LAYOUT[variant];
  const typography = getTargetCardTypography("tech", variant);
  const imageStyle = normalizedBoxStyle(layout.image);

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute overflow-hidden"
        style={imageStyle}
      >
        <div className="relative size-full">
          <Image
            src="/img/target/boulder.png"
            alt="Fragmento de mármore branco"
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
          width: `${(layout.title.width ?? 0.3) * 100}%`,
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
          width: `${(layout.description.width ?? 0.62) * 100}%`,
        }}
      >
        {audience.description}
      </p>
    </>
  );
}
