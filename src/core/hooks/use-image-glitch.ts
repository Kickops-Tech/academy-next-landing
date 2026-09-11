"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import {
  createGlitchBurstState,
  tickGlitchBurst,
  type GlitchBurstState,
} from "@core/lib/image-glitch/glitch-burst";
import {
  buildStaticGrid,
  calculateGridDimensions,
  createEmptyGrid,
  createRng,
  DEFAULT_GLITCH_CONFIG,
  tickGlitchClusters,
  type GlitchCluster,
  type GlitchGridConfig,
  type GlitchGridData,
} from "@core/lib/image-glitch/glitch-grid";
import {
  createGlitchRenderer,
  drawGlitchFrame,
  loadGlitchTextures,
  resizeGlitchCanvas,
  uploadCellData,
  type DrawGlitchParams,
  type GlitchRenderer,
  type ImageGlitchFit,
} from "@core/lib/image-glitch/glitch-webgl";
import { clientPointToMediaCanvasUv } from "@core/lib/image-glitch/image-uv";
import {
  createPixelateTrail,
  decayPixelateTrail,
  stampPixelateBlocksAt,
  type PixelateTrail,
} from "@core/lib/image-glitch/pixelate-trail";
import { uploadTrailMask } from "@core/lib/image-glitch/pixelate-trail-webgl";

export interface UseImageGlitchOptions {
  layers: readonly string[];
  imageAspect: number;
  fit?: ImageGlitchFit;
  proceduralPixelate?: boolean;
  enableHoverPixelate?: boolean;
  config?: GlitchGridConfig;
  pixelateBlockPx?: number;
  pixelateStampBlockSpan?: number;
  pixelateMaskDecay?: number;
  pixelateStampStrength?: number;
  /**
   * CSS selector for the hover root (defaults to closest `section`).
   * Brain uses `[data-brain-hover-root]`.
   */
  hoverRootSelector?: string;
  logLabel?: string;
}

export interface UseImageGlitchResult {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  isReady: boolean;
  useFallback: boolean;
}

/**
 * Shared WebGL vaporwave glitch: textures, episodic bands, hover pixelate trail.
 */
export function useImageGlitch(
  options: UseImageGlitchOptions,
): UseImageGlitchResult {
  const {
    layers,
    imageAspect,
    fit = "contain",
    proceduralPixelate = false,
    enableHoverPixelate = true,
    config = DEFAULT_GLITCH_CONFIG,
    pixelateBlockPx = 48,
    pixelateStampBlockSpan = 3,
    pixelateMaskDecay = 4,
    pixelateStampStrength = 255,
    hoverRootSelector,
    logLabel = "ImageGlitch",
  } = options;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  const rendererRef = useRef<GlitchRenderer | null>(null);
  const gridRef = useRef<GlitchGridData | null>(null);
  const clustersRef = useRef<GlitchCluster[]>([]);
  const tunedConfigRef = useRef<GlitchGridConfig>(config);
  const gridDimensionsRef = useRef({ cols: 0, rows: 0 });
  const lastSpawnRef = useRef(0);
  const nextClusterIdRef = useRef(1);
  const rngRef = useRef(createRng(42));
  const reducedMotionRef = useRef(false);
  const visibleRef = useRef(true);
  const rafRef = useRef<number>(0);
  const animationStartedRef = useRef(false);
  const texturesReadyRef = useRef(false);
  const loadGenerationRef = useRef(0);
  const burstStateRef = useRef<GlitchBurstState | null>(null);
  const glitchMixRef = useRef(0);
  const trailRef = useRef<PixelateTrail | null>(null);
  const trailDirtyRef = useRef(false);
  const trailDimensionsRef = useRef({ cols: 0, rows: 0 });
  const enableHoverPixelateRef = useRef(enableHoverPixelate);
  enableHoverPixelateRef.current = enableHoverPixelate;

  const layersKey = layers.join("|");

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let disposed = false;
    let resizeQueue: Promise<void> = Promise.resolve();
    let resizeDebounce: ReturnType<typeof setTimeout> | undefined;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = motionQuery.matches;

    burstStateRef.current = createGlitchBurstState(
      performance.now(),
      rngRef.current,
    );
    glitchMixRef.current = 0;

    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches;
      const activeRenderer = rendererRef.current;
      if (!gridRef.current || !activeRenderer) return;

      const { cols, rows } = gridRef.current;
      if (event.matches) {
        clustersRef.current = [];
        gridRef.current = buildStaticGrid(cols, rows);
      } else {
        clustersRef.current = [];
        lastSpawnRef.current = 0;
        burstStateRef.current = createGlitchBurstState(
          performance.now(),
          rngRef.current,
        );
        glitchMixRef.current = 0;
        gridRef.current = createEmptyGrid(cols, rows);
      }
      uploadCellData(activeRenderer, gridRef.current.pixels, cols, rows);
    };
    motionQuery.addEventListener("change", onMotionChange);

    const buildDrawParams = (
      cols: number,
      rows: number,
      time: number,
      glitchMix: number,
    ): DrawGlitchParams => {
      const trail = trailRef.current;
      return {
        cols,
        rows,
        time,
        glitchMix,
        trailCols: trail?.cols ?? trailDimensionsRef.current.cols,
        trailRows: trail?.rows ?? trailDimensionsRef.current.rows,
        imageAspect,
        fit,
        proceduralPixelate,
      };
    };

    const ensureTrailGrid = (cssWidth: number, cssHeight: number) => {
      const { cols, rows } = calculateGridDimensions(
        cssWidth,
        cssHeight,
        pixelateBlockPx,
      );

      const trail = trailRef.current;
      const dimsChanged =
        !trail ||
        trail.cols !== cols ||
        trail.rows !== rows ||
        trailDimensionsRef.current.cols !== cols ||
        trailDimensionsRef.current.rows !== rows;

      if (dimsChanged) {
        trailRef.current = createPixelateTrail(cols, rows);
        trailDimensionsRef.current = { cols, rows };
        trailDirtyRef.current = true;
      }
    };

    const uploadTrailIfDirty = () => {
      const activeRenderer = rendererRef.current;
      const trail = trailRef.current;
      if (
        !activeRenderer ||
        !trail ||
        !trailDirtyRef.current ||
        !texturesReadyRef.current
      ) {
        return;
      }

      uploadTrailMask(
        activeRenderer,
        activeRenderer.trailTexture,
        trail.pixels,
        trail.cols,
        trail.rows,
      );
      trailDirtyRef.current = false;
    };

    const hoverRoot = hoverRootSelector
      ? container.closest(hoverRootSelector)
      : container.closest("section");

    const stampPixelateAtPointer = (clientX: number, clientY: number) => {
      const mediaRect = container.getBoundingClientRect();
      if (mediaRect.width < 1 || mediaRect.height < 1) return;

      ensureTrailGrid(mediaRect.width, mediaRect.height);

      const trail = trailRef.current;
      if (!trail) return;

      const rootRect = hoverRoot?.getBoundingClientRect();
      const uv = rootRect
        ? clientPointToMediaCanvasUv(
            clientX,
            clientY,
            mediaRect,
            rootRect,
            imageAspect,
            fit,
          )
        : { x: 0, y: 0, inside: false };

      if (!uv.inside) return;

      stampPixelateBlocksAt(
        trail,
        uv.x,
        uv.y,
        pixelateStampStrength,
        pixelateStampBlockSpan,
      );
      trailDirtyRef.current = true;
      uploadTrailIfDirty();

      const activeRenderer = rendererRef.current;
      const grid = gridRef.current;
      const cols = grid?.cols ?? gridDimensionsRef.current.cols;
      const rows = grid?.rows ?? gridDimensionsRef.current.rows;
      if (activeRenderer && cols > 0 && rows > 0 && texturesReadyRef.current) {
        drawGlitchFrame(
          activeRenderer,
          canvas,
          buildDrawParams(
            cols,
            rows,
            performance.now() * 0.001,
            reducedMotionRef.current ? 0 : glitchMixRef.current,
          ),
        );
      }
    };

    const onGlobalPointer = (event: PointerEvent) => {
      if (!enableHoverPixelateRef.current) return;
      stampPixelateAtPointer(event.clientX, event.clientY);
    };

    const pointerListenerOptions: AddEventListenerOptions = {
      capture: true,
      passive: true,
    };

    if (enableHoverPixelate) {
      window.addEventListener("pointermove", onGlobalPointer, pointerListenerOptions);
      window.addEventListener("pointerdown", onGlobalPointer, pointerListenerOptions);
      if ("onpointerrawupdate" in window) {
        window.addEventListener(
          "pointerrawupdate",
          onGlobalPointer,
          pointerListenerOptions,
        );
      }
    }

    const refreshGrid = (cols: number, rows: number, now: number) => {
      if (reducedMotionRef.current) {
        clustersRef.current = [];
        gridRef.current = buildStaticGrid(cols, rows);
        return;
      }

      const burstState =
        burstStateRef.current ??
        createGlitchBurstState(now, rngRef.current);
      const spawnEnabled = burstState.phase === "burst";

      const tickResult = tickGlitchClusters(
        clustersRef.current,
        cols,
        rows,
        tunedConfigRef.current,
        now,
        lastSpawnRef.current,
        nextClusterIdRef.current,
        rngRef.current,
        spawnEnabled,
      );
      clustersRef.current = tickResult.clusters;
      lastSpawnRef.current = tickResult.lastSpawnAt;
      nextClusterIdRef.current = tickResult.nextId;
      gridRef.current = tickResult.grid;
    };

    const rebuildGrid = (cssWidth: number, cssHeight: number) => {
      const activeRenderer = rendererRef.current;
      if (!activeRenderer) return;

      const cellSizePx =
        cssWidth < 480 ? Math.max(12, config.cellSizePx - 2) : config.cellSizePx;
      tunedConfigRef.current =
        cssWidth < 480
          ? {
              ...config,
              minClusters: 0,
              maxClusters: 4,
              clusterSpanMax: Math.max(config.clusterSpanMax - 1, 3),
            }
          : config;

      const { cols, rows } = calculateGridDimensions(
        cssWidth,
        cssHeight,
        cellSizePx,
      );

      const dimsChanged =
        cols !== gridDimensionsRef.current.cols ||
        rows !== gridDimensionsRef.current.rows;

      if (dimsChanged) {
        gridDimensionsRef.current = { cols, rows };
        clustersRef.current = [];
        lastSpawnRef.current = 0;
        nextClusterIdRef.current = 1;
      }

      if (enableHoverPixelateRef.current) {
        ensureTrailGrid(cssWidth, cssHeight);
        uploadTrailIfDirty();
      }

      refreshGrid(cols, rows, performance.now());

      if (!gridRef.current) return;

      uploadCellData(activeRenderer, gridRef.current.pixels, cols, rows);
    };

    const startAnimation = () => {
      if (animationStartedRef.current) return;
      animationStartedRef.current = true;

      const animate = (now: number) => {
        if (disposed) return;
        rafRef.current = requestAnimationFrame(animate);

        const activeRenderer = rendererRef.current;
        if (
          !visibleRef.current ||
          !gridRef.current ||
          !activeRenderer ||
          !texturesReadyRef.current
        ) {
          return;
        }

        if (!reducedMotionRef.current) {
          const prevPhase = burstStateRef.current?.phase ?? "idle";
          const burst = tickGlitchBurst(
            burstStateRef.current ??
              createGlitchBurstState(now, rngRef.current),
            now,
            rngRef.current,
          );
          burstStateRef.current = burst.state;
          glitchMixRef.current = burst.mix;

          if (prevPhase === "burst" && burst.state.phase === "idle") {
            clustersRef.current = [];
            lastSpawnRef.current = 0;
          }

          const tickResult = tickGlitchClusters(
            clustersRef.current,
            gridRef.current.cols,
            gridRef.current.rows,
            tunedConfigRef.current,
            now,
            lastSpawnRef.current,
            nextClusterIdRef.current,
            rngRef.current,
            burst.isBurst,
          );

          clustersRef.current = tickResult.clusters;
          lastSpawnRef.current = tickResult.lastSpawnAt;
          nextClusterIdRef.current = tickResult.nextId;
          gridRef.current = tickResult.grid;

          uploadCellData(
            activeRenderer,
            gridRef.current.pixels,
            gridRef.current.cols,
            gridRef.current.rows,
          );
        }

        if (enableHoverPixelateRef.current && trailRef.current) {
          decayPixelateTrail(trailRef.current, pixelateMaskDecay);
          trailDirtyRef.current = true;
          uploadTrailIfDirty();
        }

        drawGlitchFrame(
          activeRenderer,
          canvas,
          buildDrawParams(
            gridRef.current.cols,
            gridRef.current.rows,
            now * 0.001,
            reducedMotionRef.current ? 0 : glitchMixRef.current,
          ),
        );
      };

      rafRef.current = requestAnimationFrame(animate);
    };

    const finishSetup = () => {
      const activeRenderer = rendererRef.current;
      if (
        disposed ||
        !activeRenderer ||
        !texturesReadyRef.current ||
        !gridRef.current
      ) {
        return;
      }

      drawGlitchFrame(
        activeRenderer,
        canvas,
        buildDrawParams(
          gridRef.current.cols,
          gridRef.current.rows,
          performance.now() * 0.001,
          0,
        ),
      );

      setIsReady(true);
      startAnimation();
    };

    const getBufferSize = (cssWidth: number, cssHeight: number) => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      return {
        width: Math.max(1, Math.floor(cssWidth * dpr)),
        height: Math.max(1, Math.floor(cssHeight * dpr)),
      };
    };

    /** Cold start only — never call on routine resize (avoids texture reload flicker). */
    const initRenderer = async (
      cssWidth: number,
      cssHeight: number,
      generation: number,
    ) => {
      if (rendererRef.current && texturesReadyRef.current) {
        return true;
      }

      resizeGlitchCanvas(canvas, cssWidth, cssHeight);

      rendererRef.current?.destroy();
      const renderer = createGlitchRenderer(canvas);
      rendererRef.current = renderer;
      trailDirtyRef.current = true;

      const isStale = () =>
        disposed || generation !== loadGenerationRef.current;

      try {
        await loadGlitchTextures(renderer, layers, isStale);
      } catch (error) {
        if (error instanceof Error && error.message === "Stale texture upload") {
          return false;
        }
        throw error;
      }

      if (isStale()) return false;

      texturesReadyRef.current = true;
      return true;
    };

    /** Buffer + grid only — keeps textures and `isReady` so the canvas does not blink. */
    const softResize = (cssWidth: number, cssHeight: number) => {
      const activeRenderer = rendererRef.current;
      if (!activeRenderer || activeRenderer.gl.isContextLost()) {
        texturesReadyRef.current = false;
        return false;
      }

      resizeGlitchCanvas(canvas, cssWidth, cssHeight);
      rebuildGrid(cssWidth, cssHeight);

      const grid = gridRef.current;
      if (!grid || !texturesReadyRef.current) return true;

      drawGlitchFrame(
        activeRenderer,
        canvas,
        buildDrawParams(
          grid.cols,
          grid.rows,
          performance.now() * 0.001,
          reducedMotionRef.current ? 0 : glitchMixRef.current,
        ),
      );
      return true;
    };

    const runResize = async () => {
      const rect = container.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;

      const target = getBufferSize(rect.width, rect.height);
      const hasGpu = Boolean(
        rendererRef.current &&
          texturesReadyRef.current &&
          !rendererRef.current.gl.isContextLost(),
      );
      const bufferChanged =
        canvas.width !== target.width || canvas.height !== target.height;

      try {
        if (!hasGpu) {
          const generation = ++loadGenerationRef.current;
          const ready = await initRenderer(rect.width, rect.height, generation);
          if (!ready || disposed || generation !== loadGenerationRef.current) {
            return;
          }
          rebuildGrid(rect.width, rect.height);
          finishSetup();
          return;
        }

        if (bufferChanged) {
          const ok = softResize(rect.width, rect.height);
          if (!ok) {
            const generation = ++loadGenerationRef.current;
            const ready = await initRenderer(rect.width, rect.height, generation);
            if (!ready || disposed || generation !== loadGenerationRef.current) {
              return;
            }
            rebuildGrid(rect.width, rect.height);
            finishSetup();
          }
          return;
        }

        rebuildGrid(rect.width, rect.height);
      } catch (error) {
        console.error(`[${logLabel}] WebGL init failed:`, error);
        if (!disposed) setUseFallback(true);
      }
    };

    const scheduleResize = (immediate = false) => {
      clearTimeout(resizeDebounce);
      if (immediate) {
        resizeQueue = resizeQueue.then(runResize);
        return;
      }
      resizeDebounce = setTimeout(() => {
        resizeQueue = resizeQueue.then(runResize);
      }, 50);
    };

    scheduleResize(true);

    const resizeObserver = new ResizeObserver(() => scheduleResize());
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry?.isIntersecting ?? true;
      },
      { threshold: 0.05 },
    );
    intersectionObserver.observe(container);

    return () => {
      disposed = true;
      loadGenerationRef.current += 1;
      clearTimeout(resizeDebounce);
      cancelAnimationFrame(rafRef.current);
      animationStartedRef.current = false;
      texturesReadyRef.current = false;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
      if (enableHoverPixelate) {
        window.removeEventListener("pointermove", onGlobalPointer, pointerListenerOptions);
        window.removeEventListener("pointerdown", onGlobalPointer, pointerListenerOptions);
        if ("onpointerrawupdate" in window) {
          window.removeEventListener(
            "pointerrawupdate",
            onGlobalPointer,
            pointerListenerOptions,
          );
        }
      }
      rendererRef.current?.destroy();
      rendererRef.current = null;
    };
  }, [
    layersKey,
    imageAspect,
    fit,
    proceduralPixelate,
    enableHoverPixelate,
    config,
    pixelateBlockPx,
    pixelateStampBlockSpan,
    pixelateMaskDecay,
    pixelateStampStrength,
    hoverRootSelector,
    logLabel,
    layers,
  ]);

  return { canvasRef, containerRef, isReady, useFallback };
}
