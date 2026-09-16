"use client";

import {
  SCROLL_CAROUSEL_REVEAL_DURATION_MS,
  SCROLL_CAROUSEL_REVEAL_EASE,
  SCROLL_CAROUSEL_REVEAL_STAGGER_MS,
  SCROLL_CAROUSEL_REVEAL_TRANSLATE_Y,
} from "@core/constants/scroll-carousel-reveal";
import { useHorizontalScrollMetrics } from "@core/hooks/use-horizontal-scroll-metrics";
import { useInViewOnce } from "@core/hooks/use-in-view-once";
import { cn } from "@shadcn/lib/utils";
import {
  Children,
  useId,
  useRef,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from "react";

export type ScrollCarouselTone = "dark" | "light";

/** Phone 16px; tablet+ larger inset so first cards don’t hug the edge. */
const GUTTER_CLASS = "px-4 md:px-12";
const SCROLL_PAD_CLASS = "scroll-px-4 md:scroll-px-12";

type ScrollCarouselProps = {
  children: ReactNode;
  /** `dark` = dark bar on light surfaces; `light` = light bar on dark surfaces. */
  tone?: ScrollCarouselTone;
  /** Gap between items in px. */
  gap?: number;
  /**
   * Staggered fade-in + slide-up when the track enters the viewport.
   * Once revealed, stays visible (no exit).
   */
  reveal?: boolean;
  className?: string;
  "aria-label"?: string;
};

const TONE_CLASSES: Record<
  ScrollCarouselTone,
  { track: string; thumb: string }
> = {
  dark: {
    track: "bg-kickops-gray/25",
    thumb: "bg-kickops-gray",
  },
  light: {
    track: "bg-white/25",
    thumb: "bg-white",
  },
};

const MIN_THUMB_FRACTION = 0.12;
const CARD_DRAG_CLICK_SUPPRESS_PX = 6;

function scrollMetrics(scroller: HTMLElement) {
  const maxScroll = scroller.scrollWidth - scroller.clientWidth;
  return {
    maxScroll: Math.max(0, maxScroll),
    thumbSize: Math.min(1, scroller.clientWidth / scroller.scrollWidth),
  };
}

function setScrollProgress(scroller: HTMLElement, progress: number) {
  const { maxScroll } = scrollMetrics(scroller);
  if (maxScroll <= 0) {
    return;
  }
  scroller.scrollLeft = Math.min(1, Math.max(0, progress)) * maxScroll;
}

function ScrollCarouselRevealItem({
  index,
  active,
  children,
}: {
  index: number;
  active: boolean;
  children: ReactNode;
}) {
  const style: CSSProperties = {
    opacity: active ? 1 : 0,
    transform: active
      ? "translate3d(0, 0, 0)"
      : `translate3d(0, ${SCROLL_CAROUSEL_REVEAL_TRANSLATE_Y}, 0)`,
    transition: `opacity ${SCROLL_CAROUSEL_REVEAL_DURATION_MS}ms ${SCROLL_CAROUSEL_REVEAL_EASE}, transform ${SCROLL_CAROUSEL_REVEAL_DURATION_MS}ms ${SCROLL_CAROUSEL_REVEAL_EASE}`,
    transitionDelay: active
      ? `${index * SCROLL_CAROUSEL_REVEAL_STAGGER_MS}ms`
      : "0ms",
  };

  return (
    <div className="shrink-0 will-change-[opacity,transform]" style={style}>
      {children}
    </div>
  );
}

function ScrollCarouselIndicator({
  tone,
  progress,
  thumbSize,
  scrollerRef,
  scrollerId,
}: {
  tone: ScrollCarouselTone;
  progress: number;
  thumbSize: number;
  scrollerRef: RefObject<HTMLElement | null>;
  scrollerId: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    offsetWithinThumb: number;
  } | null>(null);

  const colors = TONE_CLASSES[tone];
  const size = Math.max(thumbSize, MIN_THUMB_FRACTION);
  const travel = Math.max(0, 1 - size);
  const left = progress * travel;

  function progressFromClientX(clientX: number, offsetWithinThumb: number) {
    const track = trackRef.current;
    if (!track || travel <= 0) {
      return 0;
    }

    const rect = track.getBoundingClientRect();
    const thumbWidthPx = size * rect.width;
    const rawLeft = clientX - rect.left - offsetWithinThumb;
    const maxLeft = rect.width - thumbWidthPx;
    if (maxLeft <= 0) {
      return 0;
    }

    return Math.min(1, Math.max(0, rawLeft / maxLeft));
  }

  function beginDrag(
    event: ReactPointerEvent<HTMLElement>,
    offsetWithinThumb: number,
  ) {
    if (!scrollerRef.current) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      offsetWithinThumb,
    };
  }

  function onThumbPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.stopPropagation();
    const thumbRect = event.currentTarget.getBoundingClientRect();
    beginDrag(event, event.clientX - thumbRect.left);
  }

  function onTrackPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) {
      return;
    }

    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!scroller || !track) {
      return;
    }

    const rect = track.getBoundingClientRect();
    const thumbWidthPx = size * rect.width;
    const offsetWithinThumb = thumbWidthPx / 2;
    setScrollProgress(
      scroller,
      progressFromClientX(event.clientX, offsetWithinThumb),
    );
    beginDrag(event, offsetWithinThumb);
  }

  function onPointerMove(event: ReactPointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    const scroller = scrollerRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !scroller) {
      return;
    }

    setScrollProgress(
      scroller,
      progressFromClientX(event.clientX, drag.offsetWithinThumb),
    );
  }

  function endDrag(event: ReactPointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const pointerHandlers = {
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
  };

  return (
    <div className={cn("mt-10 flex h-3 items-center", GUTTER_CLASS)}>
      <div
        ref={trackRef}
        role="scrollbar"
        aria-orientation="horizontal"
        aria-controls={scrollerId}
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        className={cn(
          "relative h-px w-full cursor-pointer touch-none",
          colors.track,
        )}
        onPointerDown={onTrackPointerDown}
        {...pointerHandlers}
        onKeyDown={(event) => {
          const scroller = scrollerRef.current;
          if (!scroller) {
            return;
          }
          const { maxScroll } = scrollMetrics(scroller);
          if (maxScroll <= 0) {
            return;
          }
          const step = maxScroll * 0.1;
          if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            event.preventDefault();
            scroller.scrollLeft = Math.min(
              maxScroll,
              scroller.scrollLeft + step,
            );
          } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
            event.preventDefault();
            scroller.scrollLeft = Math.max(0, scroller.scrollLeft - step);
          } else if (event.key === "Home") {
            event.preventDefault();
            scroller.scrollLeft = 0;
          } else if (event.key === "End") {
            event.preventDefault();
            scroller.scrollLeft = maxScroll;
          }
        }}
      >
        <div
          className={cn(
            "absolute top-1/2 h-1.5 -translate-y-1/2 cursor-grab rounded-full active:cursor-grabbing",
            colors.thumb,
          )}
          style={{
            width: `${size * 100}%`,
            left: `${left * 100}%`,
          }}
          onPointerDown={onThumbPointerDown}
          {...pointerHandlers}
        />
      </div>
    </div>
  );
}

/**
 * Free-scroll carousel with Figma gutters, card drag (mouse), and a draggable
 * scrollbar. Touch uses native overflow scroll. End padding lives on the inner
 * track so the last item does not flush to the edge.
 */
export function ScrollCarousel({
  children,
  tone = "dark",
  gap = 0,
  reveal = false,
  className,
  "aria-label": ariaLabel,
}: ScrollCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollerId = useId();
  const cardDragRef = useRef<{
    pointerId: number;
    startX: number;
    startScroll: number;
    moved: boolean;
  } | null>(null);
  const { progress, thumbSize, canScroll } =
    useHorizontalScrollMetrics(scrollerRef);
  const revealed = useInViewOnce(rootRef, { enabled: reveal });
  const showItems = reveal !== true || revealed;

  const trackStyle: CSSProperties = {
    gap,
    width: "max-content",
  };

  function onCardPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    // Touch/pen keep native overflow scrolling; mouse gets explicit drag.
    if (event.pointerType !== "mouse" || !canScroll) {
      return;
    }

    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    cardDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: scroller.scrollLeft,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onCardPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = cardDragRef.current;
    const scroller = scrollerRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !scroller) {
      return;
    }

    const delta = event.clientX - drag.startX;
    if (Math.abs(delta) > CARD_DRAG_CLICK_SUPPRESS_PX) {
      drag.moved = true;
    }
    scroller.scrollLeft = drag.startScroll - delta;
  }

  function onCardPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = cardDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    cardDragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function onCardClickCapture(event: ReactMouseEvent<HTMLDivElement>) {
    if (event.currentTarget.dataset.dragMoved === "true") {
      event.preventDefault();
      event.stopPropagation();
      delete event.currentTarget.dataset.dragMoved;
    }
  }

  function endCardDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = cardDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    if (drag.moved) {
      event.currentTarget.dataset.dragMoved = "true";
    }
    onCardPointerUp(event);
  }

  const items =
    reveal === true
      ? Children.map(children, (child, index) => (
          <ScrollCarouselRevealItem
            key={index}
            index={index}
            active={showItems}
          >
            {child}
          </ScrollCarouselRevealItem>
        ))
      : children;

  return (
    <div ref={rootRef} className={cn("relative z-20 w-full", className)}>
      <div
        id={scrollerId}
        ref={scrollerRef}
        aria-label={ariaLabel}
        className={cn(
          "w-full overflow-x-auto overflow-y-hidden",
          "scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          SCROLL_PAD_CLASS,
          canScroll && "cursor-grab active:cursor-grabbing",
        )}
        onPointerDown={onCardPointerDown}
        onPointerMove={onCardPointerMove}
        onPointerUp={endCardDrag}
        onPointerCancel={endCardDrag}
        onClickCapture={onCardClickCapture}
      >
        <div className={cn("flex select-none", GUTTER_CLASS)} style={trackStyle}>
          {items}
        </div>
      </div>

      {canScroll ? (
        <ScrollCarouselIndicator
          tone={tone}
          progress={progress}
          thumbSize={thumbSize}
          scrollerRef={scrollerRef}
          scrollerId={scrollerId}
        />
      ) : null}
    </div>
  );
}
