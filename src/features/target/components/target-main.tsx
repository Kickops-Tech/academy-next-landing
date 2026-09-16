"use client";

import { LANDING_SECTION_ID } from "@core/constants/landing-sections";
import { SECTION_HEADING_SECTION_STYLE } from "@core/utils/section-heading-parallax-style";
import { TargetAudienceSection } from "@features/target/components/target-audience-section";
import { useTargetHeadingParallax } from "@features/target/hooks/use-target-heading-parallax";
import { cn } from "@shadcn/lib/utils";
import { useRef } from "react";

export function TargetMain() {
  const sectionRef = useRef<HTMLElement>(null);
  useTargetHeadingParallax(sectionRef);

  return (
    <section
      ref={sectionRef}
      id={LANDING_SECTION_ID.target}
      aria-label="Pra quem"
      data-globe-section="target"
      style={SECTION_HEADING_SECTION_STYLE}
      className={cn(
        "flex w-full min-h-fold flex-col justify-center",
        // Fill comes from WireframeGlobeBand (watermark sits above fill).
        "text-kickops-gray",
      )}
    >
      <TargetAudienceSection />
    </section>
  );
}
