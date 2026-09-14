"use client";

import { PeopleAgentSlide } from "@features/people/components/people-agent-slide";
import {
  PEOPLE_AGENTS,
  PEOPLE_CAROUSEL_ARIA_LABEL,
} from "@features/people/constants/people-content";
import { PEOPLE_CAROUSEL_MS } from "@features/people/constants/people-layout";
import { usePeopleCarousel } from "@features/people/hooks/use-people-carousel";
import { cn } from "@shadcn/lib/utils";
import {
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";

type PeopleCarouselProps = {
  layout: "desktop" | "mobile";
  className?: string;
};

const STRIP_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Ease progress for opacity so fades reach 0/1 without a hard cut. */
function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

export function PeopleCarousel({ layout, className }: PeopleCarouselProps) {
  const {
    index,
    agent,
    neighbor,
    offsetPx,
    isDragging,
    snapPose,
    progress,
    stridePx,
    peekDir,
    setTrackWidth,
    goToIndex,
    beginPointerGesture,
  } = usePeopleCarousel();

  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const syncWidth = () => setTrackWidth(track.getBoundingClientRect().width);
    syncWidth();

    const observer = new ResizeObserver(syncWidth);
    observer.observe(track);
    return () => observer.disconnect();
  }, [setTrackWidth]);

  const neighborShift =
    peekDir === 1 ? stridePx : peekDir === -1 ? -stridePx : 0;

  const transition =
    isDragging || snapPose
      ? "none"
      : `transform ${PEOPLE_CAROUSEL_MS}ms ${STRIP_EASE}, opacity ${PEOPLE_CAROUSEL_MS}ms ${STRIP_EASE}`;

  // Full crossfade 1↔0 (smoothstep) — no residual opacity that then “pops” away.
  const fade = smoothstep(progress);
  const currentOpacity = 1 - fade;
  const neighborOpacity = fade;

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) {
      return;
    }
    // Capture is optional; window listeners guarantee release settles.
    event.currentTarget.setPointerCapture(event.pointerId);
    beginPointerGesture(event.clientX, event.pointerId);
  }

  return (
    <div
      className={cn(
        "relative z-20 flex w-full flex-col items-center",
        className,
      )}
    >
      <div
        ref={trackRef}
        className={cn(
          "relative w-full touch-pan-y select-none overflow-visible",
          layout === "desktop" && "cursor-grab",
          layout === "desktop" && isDragging && "cursor-grabbing",
        )}
        onPointerDown={handlePointerDown}
      >
        <div
          className="relative w-full will-change-[opacity,transform]"
          style={{
            transition,
            transform: `translateX(${offsetPx}px)`,
            opacity: currentOpacity,
          }}
        >
          <PeopleAgentSlide agent={agent} layout={layout} />
        </div>

        {neighbor ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 will-change-[opacity,transform]"
            style={{
              transition,
              transform: `translateX(${offsetPx + neighborShift}px)`,
              opacity: neighborOpacity,
            }}
          >
            <PeopleAgentSlide agent={neighbor} layout={layout} />
          </div>
        ) : null}
      </div>

      <div
        className="mt-8 flex items-center gap-3"
        role="tablist"
        aria-label={PEOPLE_CAROUSEL_ARIA_LABEL}
      >
        {PEOPLE_AGENTS.map((item, dotIndex) => {
          const active = dotIndex === index;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`${item.name}, agente ${item.agentNumber}`}
              className={cn(
                "size-3 rounded-full transition-colors",
                active ? "bg-kickops-yellow" : "bg-[#666666]",
              )}
              onClick={() => goToIndex(dotIndex)}
            />
          );
        })}
      </div>
    </div>
  );
}
