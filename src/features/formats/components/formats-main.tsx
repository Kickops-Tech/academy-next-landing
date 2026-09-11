"use client";

import { FormatsSection } from "@features/formats/components/formats-section";
import { ACADEMY_BRAIN_GLITCH_ENABLED } from "@core/constants/academy-brain";
import { useSectionHeadingParallax } from "@core/hooks/use-section-heading-parallax";
import { SECTION_HEADING_SECTION_STYLE } from "@core/utils/section-heading-parallax-style";
import { cn } from "@shadcn/lib/utils";
import { useRef } from "react";

export function FormatsMain() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionHeadingParallax(sectionRef);

  return (
    <section
      ref={sectionRef}
      aria-label="É preciso saber"
      style={SECTION_HEADING_SECTION_STYLE}
      className={cn(
        "relative z-10 w-full overflow-visible",
        "bg-transparent text-white",
        ACADEMY_BRAIN_GLITCH_ENABLED && "pointer-events-none",
      )}
    >
      <FormatsSection />
    </section>
  );
}
