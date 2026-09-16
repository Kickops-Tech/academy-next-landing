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
        "flex w-full min-h-0 flex-col overflow-clip text-kickops-gray",
        // Natural content height (no min-h-fold) so mobile/md don’t invent whitespace.
        // overflow-clip: shaft AABBs extend past the Figma frame — keep them in this fold.
      )}
    >
      <ContentsSection parallax={layers} transitionMs={transitionMs} />
    </section>
  );
}
