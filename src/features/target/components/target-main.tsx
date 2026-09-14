"use client";

import { TargetAudienceSection } from "@features/target/components/target-audience-section";
import { useTargetHeadingParallax } from "@features/target/hooks/use-target-heading-parallax";
import { SECTION_HEADING_SECTION_STYLE } from "@core/utils/section-heading-parallax-style";
import { cn } from "@shadcn/lib/utils";
import { useRef } from "react";

export function TargetMain() {
  const sectionRef = useRef<HTMLElement>(null);
  useTargetHeadingParallax(sectionRef);

  return (
    <section
      ref={sectionRef}
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
