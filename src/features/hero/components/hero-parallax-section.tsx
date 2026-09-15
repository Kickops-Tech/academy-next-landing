"use client";

import { Button } from "@shadcn/ui/button";
import { HeroArtificialText } from "@features/hero/components/hero-artificial-text";
import { HeroBaffleText } from "@features/hero/components/hero-baffle-text";
import { HeroBust } from "@features/hero/components/hero-bust";
import type { HeroIntroLoaderProps } from "@features/hero/components/hero-intro-loader";
import {
  HERO_INTRO_COPY_DURATION_MS,
  HERO_INTRO_LOADER_ENABLED,
  HERO_INTRO_TITLE_BAFFLE,
} from "@features/hero/constants/hero-intro";
import { HERO_SCROLL_CSS } from "@features/hero/constants/hero-scroll-parallax";
import { useHeroIntroSequence } from "@features/hero/hooks/use-hero-intro-sequence";
import { useHeroScrollParallax } from "@features/hero/hooks/use-hero-scroll-parallax";
import { cn } from "@shadcn/lib/utils";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, type CSSProperties } from "react";

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

/**
 * Lazy Lottie loader. Import lives only here so the kill-switch never pulls
 * `lottie_light` / JSON into the hero chunk. Failed chunk → onFinish release.
 */
const HeroIntroLoader = HERO_INTRO_LOADER_ENABLED
  ? dynamic(
      () =>
        import("@features/hero/components/hero-intro-loader").catch(() => ({
          default: function HeroIntroLoaderFailed({
            onFinish,
          }: HeroIntroLoaderProps) {
            useEffect(() => {
              onFinish();
            }, [onFinish]);
            return null;
          },
        })),
      { ssr: false },
    )
  : null;

/**
 * Hero section with scroll parallax: bust moves up faster and fades slower;
 * titles and copy fade out sooner with lighter vertical travel.
 *
 * Intro: optional Lottie loader → title baffle → copy/CTA fade-in slide-up.
 */
export function HeroParallaxSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useHeroScrollParallax(sectionRef);

  const intro = useHeroIntroSequence();

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
      {intro.showBackdrop ? (
        <div className="hero-intro-backdrop" aria-hidden={true} />
      ) : null}

      <noscript>
        <style>{`.hero-intro-backdrop{display:none!important}`}</style>
      </noscript>

      {intro.loaderMounted && HeroIntroLoader ? (
        <HeroIntroLoader
          pageReady={intro.pageReady}
          onPlayerReady={intro.onPlayerReady}
          onReveal={intro.onReveal}
          onFinish={intro.onFinish}
        />
      ) : null}

      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-0",
          "flex items-center justify-center",
        )}
      >
        <div
          className={cn(
            "flex h-full w-full justify-center",
            // Mobile: lift bust so eyes/nose clear the title stack.
            "items-end pb-[36%] md:items-center md:pb-0",
          )}
          style={BUST_LAYER_STYLE}
        >
          <HeroBust
            introMode={intro.bustIntroMode}
            onIntroReady={intro.onBustIntroReady}
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
              /*
                Lift bust so eyes/nose clear “Introspecção”; title still cuts
                mouth/beard. Offset on the bust node — parent keeps parallax.
              */
              "-translate-y-[min(8vh,3rem)]",
              "md:-translate-y-[min(12vh,6rem)]",
              "xl:-translate-y-[min(14vh,7rem)]",
              "3xl:-translate-y-[min(12vh,6.5rem)]",
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
          // md+: slightly more top pad so title sits lower on the lifted bust.
          "md:px-8 md:pb-16 md:pt-[min(44svh,22rem)]",
          "3xl:pb-20 3xl:pt-[min(40svh,24rem)]",
        )}
      >
        <h1
          className={cn(
            "flex w-full max-w-full flex-col items-center overflow-visible",
            "leading-none tracking-tight",
            !intro.titleActive && "invisible",
          )}
          style={TITLE_LAYER_STYLE}
          aria-hidden={!intro.titleActive}
        >
          <HeroBaffleText
            text={"Introspecção"}
            enabled={intro.titleActive}
            delay={HERO_INTRO_TITLE_BAFFLE.introspeccao.delay}
            duration={HERO_INTRO_TITLE_BAFFLE.introspeccao.duration}
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
              enabled={intro.titleActive}
              delay={HERO_INTRO_TITLE_BAFFLE.inteligencia.delay}
              duration={HERO_INTRO_TITLE_BAFFLE.inteligencia.duration}
              className={cn("block text-kickops-green")}
            />
            <HeroArtificialText
              enabled={intro.titleActive}
              delay={HERO_INTRO_TITLE_BAFFLE.artificial.delay}
              duration={HERO_INTRO_TITLE_BAFFLE.artificial.duration}
              className={cn("text-kickops-yellow", "-mt-[0.14em] lg:mt-0")}
            />
          </span>
        </h1>

        {/*
          Outer: scroll Y only. Opacity stays on the intro child so parallax
          vars cannot hide copy before the baffle finishes.
        */}
        <div
          style={{
            transform: `translate3d(0, var(${HERO_SCROLL_CSS.copyY}, 0px), 0)`,
            opacity: intro.copyActive
              ? `var(${HERO_SCROLL_CSS.copyOpacity}, 1)`
              : 1,
          }}
        >
          <div
            style={{
              opacity: intro.copyActive ? 1 : 0,
              transform: intro.copyActive
                ? "translateY(0)"
                : "translateY(1.25rem)",
              transition: `opacity ${HERO_INTRO_COPY_DURATION_MS}ms ease-out, transform ${HERO_INTRO_COPY_DURATION_MS}ms ease-out`,
            }}
            className={cn(
              "motion-reduce:transition-none",
              !intro.copyActive && "pointer-events-none",
            )}
          >
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
                "group mt-5 h-auto rounded-none border-0 md:mt-6 3xl:mt-8",
                "inline-flex items-center justify-center",
                // Figma Buttom: Amarelo → Variant2 (white + arrow)
                "bg-kickops-yellow px-10 py-4 3xl:px-12 3xl:py-5",
                "text-base font-bold text-kickops-gray md:text-lg 3xl:text-xl",
                "transition-colors duration-300 ease-out",
                "hover:bg-white focus-visible:bg-white active:bg-white",
              )}
            >
              {HERO_CTA_LABEL}
              <span
                aria-hidden
                className={cn(
                  "inline-flex h-6 shrink-0 overflow-hidden text-kickops-gray 3xl:h-7",
                  "w-0 opacity-0",
                  "transition-[width,opacity,margin] duration-300 ease-out",
                  "group-hover:ml-2 group-hover:w-6 group-hover:opacity-100",
                  "group-focus-visible:ml-2 group-focus-visible:w-6 group-focus-visible:opacity-100",
                  "3xl:group-hover:w-7 3xl:group-focus-visible:w-7",
                  "motion-reduce:transition-none",
                )}
              >
                <ArrowRight
                  className={cn(
                    "size-6 shrink-0 3xl:size-7",
                    "-translate-x-2 transition-transform duration-300 ease-out",
                    "group-hover:translate-x-0 group-focus-visible:translate-x-0",
                    "motion-reduce:translate-x-0",
                  )}
                  strokeWidth={2.25}
                />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
