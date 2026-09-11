"use client";

import { PeopleAgentSlide } from "@features/people/components/people-agent-slide";
import { PEOPLE_AGENTS } from "@features/people/constants/people-agents";
import {
  PEOPLE_CAROUSEL_MS,
  PEOPLE_CAROUSEL_SWIPE_X,
} from "@features/people/constants/people-layout";
import { usePeopleCarousel } from "@features/people/hooks/use-people-carousel";
import { cn } from "@shadcn/lib/utils";
import { useEffect, useState } from "react";

type PeopleCarouselProps = {
  layout: "desktop" | "mobile";
  className?: string;
};

export function PeopleCarousel({ layout, className }: PeopleCarouselProps) {
  const {
    index,
    direction,
    visible,
    agent,
    goToIndex,
    onTouchStart,
    onTouchEnd,
  } = usePeopleCarousel();

  // After index swaps while hidden, start off-canvas on the enter side, then settle.
  const [enterOffset, setEnterOffset] = useState(false);

  useEffect(() => {
    if (!visible) {
      setEnterOffset(true);
      return;
    }
    const id = window.requestAnimationFrame(() => {
      setEnterOffset(false);
    });
    return () => window.cancelAnimationFrame(id);
  }, [visible, index]);

  const exitX =
    direction === 1
      ? `-${PEOPLE_CAROUSEL_SWIPE_X}`
      : PEOPLE_CAROUSEL_SWIPE_X;
  const enterX =
    direction === 1
      ? PEOPLE_CAROUSEL_SWIPE_X
      : `-${PEOPLE_CAROUSEL_SWIPE_X}`;

  let transform = "translateX(0)";
  if (!visible) {
    transform = `translateX(${exitX})`;
  } else if (enterOffset) {
    transform = `translateX(${enterX})`;
  }

  return (
    <div
      className={cn(
        "relative z-20 flex w-full flex-col items-center",
        className,
      )}
    >
      <div
        className="w-full touch-pan-y select-none overflow-hidden"
        onTouchStart={(event) =>
          onTouchStart(event.changedTouches[0]?.clientX ?? 0)
        }
        onTouchEnd={(event) =>
          onTouchEnd(event.changedTouches[0]?.clientX ?? 0)
        }
      >
        <div
          className="will-change-[opacity,transform]"
          style={{
            transition: enterOffset
              ? "none"
              : `opacity ${PEOPLE_CAROUSEL_MS}ms cubic-bezier(0.22, 1, 0.36, 1), transform ${PEOPLE_CAROUSEL_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
            opacity: visible && !enterOffset ? 1 : 0,
            transform,
          }}
        >
          <PeopleAgentSlide agent={agent} layout={layout} />
        </div>
      </div>

      <div
        className="mt-8 flex items-center gap-3"
        role="tablist"
        aria-label="Agentes"
      >
        {PEOPLE_AGENTS.map((item, dotIndex) => {
          const active = dotIndex === index;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`Agente ${item.agentNumber}`}
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
