"use client";

import { PeopleSection } from "@features/people/components/people-section";
import { ACADEMY_BRAIN_GLITCH_ENABLED } from "@core/constants/academy-brain";
import { useSectionHeadingParallax } from "@core/hooks/use-section-heading-parallax";
import { SECTION_HEADING_SECTION_STYLE } from "@core/utils/section-heading-parallax-style";
import { cn } from "@shadcn/lib/utils";
import { useRef } from "react";

export function PeopleMain() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionHeadingParallax(sectionRef);

  return (
    <section
      ref={sectionRef}
      aria-label="Mentes pensantes"
      style={SECTION_HEADING_SECTION_STYLE}
      className={cn(
        "relative z-0 flex min-h-0 w-full flex-1 flex-col overflow-visible",
        "bg-transparent text-white",
        ACADEMY_BRAIN_GLITCH_ENABLED && "pointer-events-none",
      )}
    >
      <PeopleSection />
    </section>
  );
}
