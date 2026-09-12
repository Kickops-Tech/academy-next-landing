"use client";

import {
  WIREFRAME_GLOBE_DPR_CAP_DESKTOP,
  WIREFRAME_GLOBE_DPR_CAP_MOBILE,
  WIREFRAME_GLOBE_MOBILE_MAX_WIDTH,
  WIREFRAME_GLOBE_SECTION_ATTR,
  WIREFRAME_GLOBE_THEME,
  WIREFRAME_GLOBE_THEME_FADE_S,
  WIREFRAME_GLOBE_THEMES,
  type WireframeGlobeTheme,
} from "@core/constants/wireframe-globe";
import type { WireframeGlobeHandle } from "@core/lib/wireframe-globe/create-wireframe-globe";
import { cn } from "@shadcn/lib/utils";
import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type FillRect = {
  theme: WireframeGlobeTheme;
  top: number;
  height: number;
};

type LineAppearance = {
  r: number;
  g: number;
  b: number;
  opacity: number;
};

function isGlobeTheme(value: string | null): value is WireframeGlobeTheme {
  return (
    value === "target" || value === "contents" || value === "formats"
  );
}

function resolveDpr() {
  const mobile = window.innerWidth < WIREFRAME_GLOBE_MOBILE_MAX_WIDTH;
  const cap = mobile
    ? WIREFRAME_GLOBE_DPR_CAP_MOBILE
    : WIREFRAME_GLOBE_DPR_CAP_DESKTOP;
  return Math.min(window.devicePixelRatio || 1, cap);
}

function hexToRgb(hex: string): Pick<LineAppearance, "r" | "g" | "b"> {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);
  return {
    r: ((value >> 16) & 255) / 255,
    g: ((value >> 8) & 255) / 255,
    b: (value & 255) / 255,
  };
}

function themeAppearance(theme: WireframeGlobeTheme): LineAppearance {
  const tokens = WIREFRAME_GLOBE_THEME[theme];
  return {
    ...hexToRgb(tokens.lineColor),
    opacity: tokens.lineOpacity,
  };
}

function measureFills(wrapper: HTMLElement): FillRect[] {
  const wrapperRect = wrapper.getBoundingClientRect();
  const nodes = wrapper.querySelectorAll<HTMLElement>(
    `[${WIREFRAME_GLOBE_SECTION_ATTR}]`,
  );
  const fills: FillRect[] = [];

  for (const node of nodes) {
    const theme = node.getAttribute(WIREFRAME_GLOBE_SECTION_ATTR);
    if (!isGlobeTheme(theme)) {
      continue;
    }
    const rect = node.getBoundingClientRect();
    fills.push({
      theme,
      top: rect.top - wrapperRect.top,
      height: rect.height,
    });
  }

  return fills;
}

/**
 * Blend line color/opacity by how much of each themed section is in view.
 * Softens Contents (dark lines) → Formats (light lines) instead of a hard snap.
 */
function blendAppearanceFromViewport(
  sectionNodes: NodeListOf<HTMLElement>,
): LineAppearance {
  const viewportHeight = window.innerHeight;
  let total = 0;
  const weights: Record<WireframeGlobeTheme, number> = {
    target: 0,
    contents: 0,
    formats: 0,
  };

  for (const node of sectionNodes) {
    const theme = node.getAttribute(WIREFRAME_GLOBE_SECTION_ATTR);
    if (!isGlobeTheme(theme)) {
      continue;
    }
    const rect = node.getBoundingClientRect();
    const visible = Math.max(
      0,
      Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0),
    );
    weights[theme] = visible;
    total += visible;
  }

  if (total <= 0) {
    return themeAppearance("target");
  }

  let r = 0;
  let g = 0;
  let b = 0;
  let opacity = 0;
  for (const theme of WIREFRAME_GLOBE_THEMES) {
    const w = weights[theme] / total;
    if (w <= 0) {
      continue;
    }
    const appearance = themeAppearance(theme);
    r += appearance.r * w;
    g += appearance.g * w;
    b += appearance.b * w;
    opacity += appearance.opacity * w;
  }

  return { r, g, b, opacity };
}

function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

type WireframeGlobeBandProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Target → Formats/People band: theme fills under a single spinning
 * wireframe globe. The canvas is sticky + viewport-tall so the globe
 * stays centered in view while scrolling the band (does not stretch
 * across the full multi-section height).
 */
export function WireframeGlobeBand({
  children,
  className,
}: WireframeGlobeBandProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<WireframeGlobeHandle | null>(null);
  const bandVisibleRef = useRef(true);
  const reducedMotionRef = useRef(false);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  const currentAppearanceRef = useRef<LineAppearance>(
    themeAppearance("target"),
  );

  const [fills, setFills] = useState<FillRect[]>([]);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) {
      return;
    }

    let cancelled = false;
    let globe: WireframeGlobeHandle | null = null;

    const sectionNodes = wrapper.querySelectorAll<HTMLElement>(
      `[${WIREFRAME_GLOBE_SECTION_ATTR}]`,
    );

    const applyAppearance = (appearance: LineAppearance) => {
      currentAppearanceRef.current = appearance;
      globe?.setLineRgba(
        appearance.r,
        appearance.g,
        appearance.b,
        appearance.opacity,
      );
    };

    const syncThemeBlend = (dtSeconds: number) => {
      const target = blendAppearanceFromViewport(sectionNodes);
      const current = currentAppearanceRef.current;
      const fadeT =
        reducedMotionRef.current || WIREFRAME_GLOBE_THEME_FADE_S <= 0
          ? 1
          : Math.min(1, dtSeconds / WIREFRAME_GLOBE_THEME_FADE_S);

      if (fadeT >= 1) {
        applyAppearance(target);
        return;
      }

      applyAppearance({
        r: lerp(current.r, target.r, fadeT),
        g: lerp(current.g, target.g, fadeT),
        b: lerp(current.b, target.b, fadeT),
        opacity: lerp(current.opacity, target.opacity, fadeT),
      });
    };

    const syncSize = () => {
      // Viewport-sized sticky host — not the tall band height (avoids stretched globe).
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      globe?.setSize(width, height, resolveDpr());
      setFills(measureFills(wrapper));
    };

    const shouldAnimate = () =>
      bandVisibleRef.current && !reducedMotionRef.current;

    const frame = (ts: number) => {
      rafRef.current = 0;
      if (cancelled || !globe) {
        return;
      }
      if (!bandVisibleRef.current) {
        lastTsRef.current = 0;
        return;
      }
      const last = lastTsRef.current;
      lastTsRef.current = ts;
      const dt = last === 0 ? 0 : Math.min((ts - last) / 1000, 0.05);
      syncThemeBlend(dt);
      if (!reducedMotionRef.current) {
        globe.tick(dt);
      } else {
        globe.tick(0);
      }
      if (shouldAnimate() || bandVisibleRef.current) {
        // Keep looping while visible so theme fades still run (incl. reduced-motion).
        rafRef.current = window.requestAnimationFrame(frame);
      }
    };

    const ensureLoop = () => {
      if (cancelled || rafRef.current !== 0 || !bandVisibleRef.current) {
        return;
      }
      lastTsRef.current = 0;
      rafRef.current = window.requestAnimationFrame(frame);
    };

    const stopLoop = () => {
      if (rafRef.current !== 0) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      lastTsRef.current = 0;
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = motionQuery.matches;

    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches;
      if (bandVisibleRef.current) {
        ensureLoop();
      }
    };

    const bandObserver = new IntersectionObserver(
      ([entry]) => {
        bandVisibleRef.current = entry?.isIntersecting ?? false;
        if (bandVisibleRef.current) {
          ensureLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.01 },
    );
    bandObserver.observe(wrapper);

    const resizeObserver = new ResizeObserver(() => {
      syncSize();
    });
    resizeObserver.observe(wrapper);
    resizeObserver.observe(canvas);
    for (const node of sectionNodes) {
      resizeObserver.observe(node);
    }

    const onWindowResize = () => {
      syncSize();
    };
    window.addEventListener("resize", onWindowResize, { passive: true });
    window.visualViewport?.addEventListener("resize", onWindowResize);

    void import("@core/lib/wireframe-globe/create-wireframe-globe").then(
      ({ createWireframeGlobe }) => {
        if (cancelled) {
          return;
        }
        globe = createWireframeGlobe(canvas);
        globeRef.current = globe;
        applyAppearance(blendAppearanceFromViewport(sectionNodes));
        syncSize();
        globe.tick(0);
        motionQuery.addEventListener("change", onMotionChange);
        ensureLoop();
      },
    );

    return () => {
      cancelled = true;
      stopLoop();
      bandObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("resize", onWindowResize);
      window.visualViewport?.removeEventListener("resize", onWindowResize);
      motionQuery.removeEventListener("change", onMotionChange);
      globe?.dispose();
      globeRef.current = null;
    };
  }, []);

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <div
        aria-hidden={true}
        className="pointer-events-none absolute inset-0 z-0"
      >
        {fills.map((fill) => {
          const style: CSSProperties = {
            top: fill.top,
            height: fill.height,
          };
          return (
            <div
              key={fill.theme}
              className={cn(
                "absolute inset-x-0",
                WIREFRAME_GLOBE_THEME[fill.theme].fillClassName,
              )}
              style={style}
            />
          );
        })}
      </div>

      {/*
        Sticky viewport host: globe stays centered while the band scrolls;
        sizing uses 100svh, not the full Target→People height.
      */}
      <div
        aria-hidden={true}
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-full"
      >
        <div className="sticky top-0 h-svh w-full">
          <canvas ref={canvasRef} className="block h-full w-full" />
        </div>
      </div>

      <div className="relative z-[2]">{children}</div>
    </div>
  );
}
