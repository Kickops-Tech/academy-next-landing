"use client";

import { cn } from "@shadcn/lib/utils";
import { Button } from "@shadcn/ui/button";
import { HeroArtificialText } from "@features/hero/components/hero-artificial-text";
import { HeroBaffleText } from "@features/hero/components/hero-baffle-text";
import { HeroBust } from "@features/hero/components/hero-bust";
import { HERO_SCROLL_CSS } from "@features/hero/constants/hero-scroll-parallax";
import { useHeroScrollParallax } from "@features/hero/hooks/use-hero-scroll-parallax";
import { useRef, type CSSProperties } from "react";

/**
 * Supporting copy under the Hero title (Figma Home D / Home M).
 */
const HERO_DESCRIPTION =
  "Chegou a hora de capacitar seu time de liderança para, de uma vez por todas, entender como a IA funciona, enxergar os horizontes possíveis e transformar conhecimento em uso da tecnologia como amplificação estratégica de negócio.";

const HERO_CTA_LABEL = "Quero saber mais";

/**
 * Fluid mobile sizes (clamp + vw), then stepped rem from md up.
 * Keeps “INTELIGÊNCIA” / “ARTIFICIAL” inside the padded stage on narrow phones.
 */
const HERO_TITLE_INTROSPECCAO_SIZE =
  "text-[clamp(1.75rem,0.55rem+6.8vw,3rem)] md:text-[4.5rem] lg:text-[5.25rem] xl:text-[6rem] 2xl:text-[6.75rem]";

const HERO_TITLE_IA_SIZE =
  "text-[clamp(2.5rem,0.35rem+11.2vw,5.5rem)] md:text-[6.75rem] lg:text-[7.25rem] xl:text-[7.75rem] 2xl:text-[8.75rem]";

function layerStyle(yVar: string, opacityVar: string): CSSProperties {
  return {
    transform: `translate3d(0, var(${yVar}, 0px), 0)`,
    opacity: `var(${opacityVar}, 1)`,
  };
}

const BUST_LAYER_STYLE = layerStyle(
  HERO_SCROLL_CSS.bustY,
  HERO_SCROLL_CSS.bustOpacity,
);
const TITLE_LAYER_STYLE = layerStyle(
  HERO_SCROLL_CSS.titleY,
  HERO_SCROLL_CSS.titleOpacity,
);
const COPY_LAYER_STYLE = layerStyle(
  HERO_SCROLL_CSS.copyY,
  HERO_SCROLL_CSS.copyOpacity,
);

/**
 * Hero section with scroll parallax: bust moves up faster and fades slower;
 * titles and copy fade out sooner with lighter vertical travel.
 * Parallax is driven by CSS vars on the section (no React re-renders on scroll).
 */
export function HeroParallaxSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useHeroScrollParallax(sectionRef);

  return (
    <section
      ref={sectionRef}
      aria-label={"Hero"}
      className={cn(
        "relative w-full min-h-svh overflow-hidden",
        // Narrow viewports: lock to one screen so overlay padding can’t grow the fold.
        "h-svh md:h-auto",
        "flex flex-col items-center justify-end",
        "bg-kickops-gray text-white",
        "bg-radial from-kickops-lightgray to-kickops-gray",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-0",
          "flex items-center justify-center",
        )}
      >
        <div
          className="flex h-full w-full items-center justify-center"
          style={BUST_LAYER_STYLE}
        >
          <HeroBust
            className={cn(
              "select-none",
              /*
                Height-driven on all breakpoints so aspect ratio resolves.
                Avoid width: % inside a shrink-wrapped flex item — on mobile
                that circular % can collapse the bust box to 0×0 (no WebGL).
              */
              "h-[min(68svh,26rem)] w-auto max-w-none",
              "md:h-[min(110svh,64.375rem)]",
            )}
          />
        </div>
      </div>

      {/*
        Readability scrim — anchored to the section, not the parallax bust layer,
        so scroll does not drag a visible color band across the composition.
      */}
      <div
        aria-hidden={true}
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-10",
          "h-[55%] md:h-[50%]",
          "bg-linear-to-b from-transparent via-kickops-gray/55 to-kickops-gray",
        )}
      />

      <div
        data-hero-overlay=""
        className={cn(
          "relative z-20 flex w-full max-w-[94.5rem] flex-col items-center text-center",
          // Mobile: light top pad — justify-end parks the CTA; huge pt was clipping the title.
          "px-4 pb-8 pt-4",
          "md:px-8 md:pb-20 md:pt-[min(40svh,20rem)]",
        )}
      >
        <h1
          className={cn(
            "flex w-full max-w-full flex-col items-center overflow-visible",
            "leading-none tracking-tight",
          )}
          style={TITLE_LAYER_STYLE}
        >
          <HeroBaffleText
            text={"Introspecção"}
            delay={80}
            duration={2400}
            className={cn(
              "font-abril-fatface",
              "bg-linear-to-b from-white to-[#f5f5f5] bg-clip-text text-transparent",
              HERO_TITLE_INTROSPECCAO_SIZE,
            )}
          />

          <span
            className={cn(
              "font-league-gothic font-black uppercase tracking-normal",
              "flex w-fit max-w-full flex-col items-center justify-center overflow-visible leading-none",
              "lg:flex-row lg:gap-[0.15em]",
              HERO_TITLE_IA_SIZE,
              "-mt-1 lg:-mt-4",
            )}
          >
            <HeroBaffleText
              text={"Inteligência"}
              delay={280}
              duration={3000}
              className={cn("block text-kickops-green")}
            />
            <HeroArtificialText
              delay={420}
              duration={3000}
              className={cn("text-kickops-yellow", "-mt-[0.14em] lg:mt-0")}
            />
          </span>
        </h1>

        <div style={COPY_LAYER_STYLE}>
          <p
            className={cn(
              "mt-5 max-w-[20.5625rem] text-sm leading-[1.4] text-white md:mt-6 md:max-w-[40rem] md:text-base",
            )}
          >
            {HERO_DESCRIPTION}
          </p>

          <Button
            className={cn(
              "mt-6 h-auto rounded-none border-0 md:mt-8",
              "bg-kickops-yellow px-10 py-6",
              "text-base font-bold text-kickops-gray md:text-lg",
              "hover:bg-kickops-yellow/90",
            )}
          >
            {HERO_CTA_LABEL}
          </Button>
        </div>
      </div>
    </section>
  );
}
