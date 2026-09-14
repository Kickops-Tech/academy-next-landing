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
 * Fluid mobile → stepped desktop → plateau at 3xl (1920px).
 * Atmosphere stays full-bleed; type/bust stop growing past ~2K.
 */
const HERO_TITLE_INTROSPECCAO_SIZE =
  "text-[clamp(2.75rem,1.25rem+8vw,4rem)] md:text-[4.5rem] lg:text-[5.25rem] xl:text-[6rem] 2xl:text-[6.75rem] 3xl:text-[7.5rem]";

const HERO_TITLE_IA_SIZE =
  "text-[clamp(5rem,2rem+14vw,7rem)] md:text-[6.75rem] lg:text-[7.25rem] xl:text-[7.75rem] 2xl:text-[8.75rem] 3xl:text-[10rem]";

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
        "relative w-full min-h-fold overflow-hidden",
        // Narrow viewports: lock to one screen so overlay padding can’t grow the fold.
        "h-fold md:h-auto",
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
          className={cn(
            "flex h-full w-full justify-center",
            // Mobile: sit the bust on the title stack (less empty crown).
            "items-end pb-[22%] md:items-center md:pb-0",
          )}
          style={BUST_LAYER_STYLE}
        >
          <HeroBust
            className={cn(
              "select-none",
              /*
                Height-driven so aspect ratio resolves. Caps climb through 2xl/3xl
                then plateau — no pure-vw growth on 4K ultrawides.
              */
              "h-[min(86svh,42rem)] w-auto max-w-[min(100vw,28rem)]",
              "md:h-[min(110svh,64.375rem)] md:max-w-none",
              "2xl:h-[min(108svh,72rem)]",
              "3xl:h-[min(105svh,80rem)]",
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
          "relative z-20 flex w-full flex-col items-center text-center",
          // Figma 1512 → soft grow to 1920 (3xl), then plateau for 4K.
          "max-w-[94.5rem] 3xl:max-w-[120rem]",
          // Mobile: light top pad — justify-end parks the CTA; keep titles readable.
          "px-3 pb-8 pt-4",
          "md:px-8 md:pb-20 md:pt-[min(40svh,20rem)]",
          "3xl:pb-24 3xl:pt-[min(36svh,22rem)]",
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
              "mt-5 max-w-[20.5625rem] text-sm leading-[1.4] text-white",
              "md:mt-6 md:max-w-[40rem] md:text-base",
              "3xl:mt-8 3xl:max-w-[48rem] 3xl:text-lg",
            )}
          >
            {HERO_DESCRIPTION}
          </p>

          <Button
            className={cn(
              "mt-6 h-auto rounded-none border-0 md:mt-8 3xl:mt-10",
              "bg-kickops-yellow px-10 py-6 3xl:px-12 3xl:py-7",
              "text-base font-bold text-kickops-gray md:text-lg 3xl:text-xl",
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
