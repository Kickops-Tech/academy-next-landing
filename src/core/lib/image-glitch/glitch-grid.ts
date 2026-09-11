/**
 * Procedural vaporwave grid mask for the Hero bust WebGL shader.
 *
 * Short-lived horizontal bands spawn, expire and relocate — each applies a
 * CRT-style glitch (slice displacement, chromatic aberration, smear, layer).
 *
 * @module core/lib/image-glitch/glitch-grid
 */

/** Cell effect encoded in data texture R channel. */
export const GlitchCellMode = {
  /** Show bust-1 only. */
  Default: 0,
  /** Horizontal slice + chromatic aberration. */
  Slice: 1,
  /** Chromatic fringes without heavy displacement. */
  Chroma: 2,
  /** Horizontal smear / trail. */
  Smear: 3,
  /** Slice glitch blended with bust-2 / bust-3 / bust-4. */
  Layer: 4,
} as const;

export type GlitchCellMode =
  (typeof GlitchCellMode)[keyof typeof GlitchCellMode];

/**
 * Tunable parameters for sparse, ephemeral cluster placement.
 */
export interface GlitchGridConfig {
  /** Target cell size in CSS pixels (before DPR). */
  cellSizePx: number;
  /** Target minimum concurrent clusters (respawned as others expire). */
  minClusters: number;
  /** Hard cap on concurrent clusters. */
  maxClusters: number;
  /** Smallest cluster side length (cells). */
  clusterSpanMin: number;
  /** Largest cluster side length (cells). */
  clusterSpanMax: number;
  /** 0–1 — how strongly new clusters gravitate toward the bust center. */
  centerBias: number;
  /** How often a new cluster may spawn (ms). */
  spawnIntervalMs: number;
  /** Shortest cluster lifetime (ms). */
  clusterLifetimeMinMs: number;
  /** Longest cluster lifetime (ms). */
  clusterLifetimeMaxMs: number;
  /** Relative weights for bust-2, bust-3, bust-4 (Layer mode only). */
  layerWeights: readonly [number, number, number];
  /** Relative weights for Slice / Chroma / Smear / Layer modes. */
  effectWeights: readonly [number, number, number, number];
}

/**
 * Default tuning: sparse horizontal glitch bands, face-biased.
 */
export const DEFAULT_GLITCH_CONFIG: GlitchGridConfig = {
  cellSizePx: 18,
  minClusters: 0,
  maxClusters: 6,
  clusterSpanMin: 2,
  clusterSpanMax: 6,
  centerBias: 0.55,
  spawnIntervalMs: 280,
  clusterLifetimeMinMs: 900,
  clusterLifetimeMaxMs: 1800,
  layerWeights: [0.5, 0.28, 0.22],
  effectWeights: [0.55, 0.12, 0.25, 0.08],
};

/** One ephemeral horizontal glitch band on the grid. */
export interface GlitchCluster {
  id: number;
  col: number;
  row: number;
  /** Horizontal extent of the band (cells). */
  colSpan: number;
  /** Vertical extent of the band (cells). */
  span: number;
  effectMode: GlitchCellMode;
  layerIndex: number;
  seed: number;
  spawnedAt: number;
  expiresAt: number;
}

/**
 * Result of building or updating a glitch grid.
 */
export interface GlitchGridData {
  cols: number;
  rows: number;
  /**
   * RGBA bytes per cell:
   * R = effect mode, G = layer (1–3) or span hint, B = seed, A = lifecycle 0–255.
   */
  pixels: Uint8Array;
  seed: number;
}

/**
 * Seeded PRNG (mulberry32).
 */
export function createRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Grid dimensions from canvas CSS size and cell size.
 */
export function calculateGridDimensions(
  width: number,
  height: number,
  cellSizePx: number,
): { cols: number; rows: number } {
  const cols = Math.max(8, Math.floor(width / cellSizePx));
  const rows = Math.max(12, Math.floor(height / cellSizePx));
  return { cols, rows };
}

function writeCell(
  pixels: Uint8Array,
  cols: number,
  col: number,
  row: number,
  mode: GlitchCellMode,
  paramG: number,
  seed: number,
  lifecycle: number,
): void {
  const i = (row * cols + col) * 4;
  pixels[i] = mode;
  pixels[i + 1] = paramG;
  pixels[i + 2] = seed;
  pixels[i + 3] = lifecycle;
}

function clearAll(
  pixels: Uint8Array,
  cols: number,
  rows: number,
): void {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      writeCell(pixels, cols, col, row, GlitchCellMode.Default, 0, 0, 0);
    }
  }
}

function pickLayer(
  rng: () => number,
  weights: readonly [number, number, number],
): number {
  const total = weights[0] + weights[1] + weights[2];
  let roll = rng() * total;
  if ((roll -= weights[0]) <= 0) return 1;
  if ((roll -= weights[1]) <= 0) return 2;
  return 3;
}

function pickEffectMode(
  rng: () => number,
  weights: readonly [number, number, number, number],
): GlitchCellMode {
  const total = weights[0] + weights[1] + weights[2] + weights[3];
  let roll = rng() * total;
  if ((roll -= weights[0]) <= 0) return GlitchCellMode.Slice;
  if ((roll -= weights[1]) <= 0) return GlitchCellMode.Chroma;
  if ((roll -= weights[2]) <= 0) return GlitchCellMode.Smear;
  return GlitchCellMode.Layer;
}

function pickClusterPlacement(
  rng: () => number,
  cols: number,
  rows: number,
  centerBias: number,
  config: GlitchGridConfig,
): { col: number; row: number; colSpan: number; span: number } {
  const span = pickClusterSpan(rng, config);
  const colSpan = Math.min(
    cols,
    Math.max(4, Math.floor(cols * (0.38 + rng() * 0.58))),
  );
  const col = Math.floor(rng() * Math.max(1, cols - colSpan + 1));

  const spreadV = 0.3 + (1 - centerBias) * 0.38;
  const v = 0.55 + (rng() - 0.5) * 2 * spreadV;
  const row = Math.floor(Math.max(0, Math.min(0.999, v)) * rows);
  const maxRow = Math.max(0, rows - span);

  return {
    col,
    row: Math.min(maxRow, Math.max(0, row)),
    colSpan,
    span,
  };
}

function rowActiveInCluster(seed: number, dy: number): boolean {
  return ((seed * 17 + dy * 31) % 100) > 4;
}

/** Bias ~35% of clusters toward the larger end of clusterSpanMax. */
function pickClusterSpan(
  rng: () => number,
  config: GlitchGridConfig,
): number {
  const { clusterSpanMin, clusterSpanMax } = config;
  if (rng() < 0.35) {
    const largeMin = Math.max(clusterSpanMin, clusterSpanMax - 1);
    return (
      largeMin +
      Math.floor(rng() * (clusterSpanMax - largeMin + 1))
    );
  }
  return (
    clusterSpanMin +
    Math.floor(rng() * (clusterSpanMax - clusterSpanMin + 1))
  );
}

function encodeLifecycle(cluster: GlitchCluster, now: number): number {
  const duration = cluster.expiresAt - cluster.spawnedAt;
  if (duration <= 0) return 255;
  const t = Math.max(0, Math.min(1, (now - cluster.spawnedAt) / duration));
  // Avoid envelope=0 on the first frames so patches are visible immediately.
  return Math.max(64, Math.floor(t * 255));
}

function clusterParamG(cluster: GlitchCluster): number {
  if (cluster.effectMode === GlitchCellMode.Layer) {
    return cluster.layerIndex;
  }
  return Math.min(255, 96 + cluster.span * 64);
}

function paintCluster(
  pixels: Uint8Array,
  cols: number,
  rows: number,
  cluster: GlitchCluster,
  now: number,
): void {
  const lifecycle = encodeLifecycle(cluster, now);
  const paramG = clusterParamG(cluster);

  // Partial-width horizontal patches with ragged vertical edges.
  for (let dy = 0; dy < cluster.span; dy++) {
    if (!rowActiveInCluster(cluster.seed, dy)) continue;
    const r = cluster.row + dy;
    if (r >= rows) continue;
    const endCol = Math.min(cols, cluster.col + cluster.colSpan);
    for (let c = cluster.col; c < endCol; c++) {
      writeCell(
        pixels,
        cols,
        c,
        r,
        cluster.effectMode,
        paramG,
        cluster.seed,
        lifecycle,
      );
    }
  }
}

/**
 * Empty grid (bust-1 everywhere).
 */
export function createEmptyGrid(cols: number, rows: number): GlitchGridData {
  const pixels = new Uint8Array(cols * rows * 4);
  clearAll(pixels, cols, rows);
  return { cols, rows, pixels, seed: 0 };
}

/**
 * Paint all active clusters onto a fresh grid.
 */
export function renderClustersToGrid(
  cols: number,
  rows: number,
  clusters: readonly GlitchCluster[],
  now: number,
): GlitchGridData {
  const pixels = new Uint8Array(cols * rows * 4);
  clearAll(pixels, cols, rows);
  for (const cluster of clusters) {
    paintCluster(pixels, cols, rows, cluster, now);
  }
  return { cols, rows, pixels, seed: Date.now() };
}

/**
 * Spawn one ephemeral cluster at a random (face-biased) position.
 */
export function spawnGlitchCluster(
  cols: number,
  rows: number,
  config: GlitchGridConfig,
  now: number,
  rng: () => number,
  id: number,
): GlitchCluster {
  const placement = pickClusterPlacement(rng, cols, rows, config.centerBias, config);
  const lifetime =
    config.clusterLifetimeMinMs +
    rng() * (config.clusterLifetimeMaxMs - config.clusterLifetimeMinMs);
  const effectMode = pickEffectMode(rng, config.effectWeights);

  return {
    id,
    col: placement.col,
    row: placement.row,
    colSpan: placement.colSpan,
    span: placement.span,
    effectMode,
    layerIndex: pickLayer(rng, config.layerWeights),
    seed: Math.floor(rng() * 255),
    spawnedAt: now,
    expiresAt: now + lifetime,
  };
}

export interface TickGlitchClustersResult {
  clusters: GlitchCluster[];
  grid: GlitchGridData;
  lastSpawnAt: number;
  nextId: number;
}

/**
 * Expire old clusters, spawn new ones, rebuild the grid mask.
 */
export function tickGlitchClusters(
  clusters: GlitchCluster[],
  cols: number,
  rows: number,
  config: GlitchGridConfig,
  now: number,
  lastSpawnAt: number,
  nextId: number,
  rng: () => number,
  spawnEnabled = true,
): TickGlitchClustersResult {
  if (!spawnEnabled) {
    return {
      clusters: [],
      grid: renderClustersToGrid(cols, rows, [], now),
      lastSpawnAt,
      nextId,
    };
  }

  let active = clusters.filter((c) => c.expiresAt > now);
  let spawnAt = lastSpawnAt;
  let id = nextId;

  const trySpawn = () => {
    if (active.length >= config.maxClusters) return;
    active = [
      ...active,
      spawnGlitchCluster(cols, rows, config, now, rng, id++),
    ];
    spawnAt = now;
  };

  const jitter = rng() * config.spawnIntervalMs * 0.45;
  const spawnDue = now - lastSpawnAt >= config.spawnIntervalMs + jitter;

  if (spawnDue && active.length < config.maxClusters) {
    trySpawn();
  }

  if (
    spawnDue &&
    active.length < config.minClusters &&
    active.length < config.maxClusters &&
    rng() < 0.85
  ) {
    trySpawn();
  } else if (
    spawnDue &&
    active.length < config.maxClusters &&
    rng() < 0.45
  ) {
    trySpawn();
  }

  return {
    clusters: active,
    grid: renderClustersToGrid(cols, rows, active, now),
    lastSpawnAt: spawnAt,
    nextId: id,
  };
}

/** Flat grid — bust-1 only (reduced-motion). */
export function buildStaticGrid(cols: number, rows: number): GlitchGridData {
  return createEmptyGrid(cols, rows);
}
