"use client";

import { ContentsSection } from "@features/contents/components/contents-section";
import { useContentsColumnParallax } from "@features/contents/hooks/use-contents-column-parallax";
import { useSectionHeadingParallax } from "@core/hooks/use-section-heading-parallax";
import { SECTION_HEADING_SECTION_STYLE } from "@core/utils/section-heading-parallax-style";
import { cn } from "@shadcn/lib/utils";
import { useRef } from "react";

export function ContentsMain() {
  const sectionRef = useRef<HTMLElement>(null);
  const { layers, transitionMs } = useContentsColumnParallax(sectionRef);
  useSectionHeadingParallax(sectionRef);

  return (
    <section
      ref={sectionRef}
      aria-label="Vamos abordar"
      data-globe-section="contents"
      style={SECTION_HEADING_SECTION_STYLE}
      className={cn(
        "w-full text-kickops-gray",
        // Fill comes from WireframeGlobeBand (watermark sits above fill).
        // Desktop stage fills the viewport; flow layout below xl must not leave a white void.
        "xl:min-h-svh",
      )}
    >
      <ContentsSection parallax={layers} transitionMs={transitionMs} />
    </section>
  );
}
