import {
  TARGET_GLOBE_DOT_DENSITY_MAX,
  TARGET_GLOBE_DOT_DENSITY_MIN,
  TARGET_GLOBE_DOT_SEED,
  TARGET_GLOBE_HALO_FILLS,
} from "@features/target/constants/target-globe-config";
import { TARGET_GLOBE_INTERSECTIONS } from "@features/target/constants/target-globe-intersections";

export type WireframeGlobeDot = {
  id: string;
  x: number;
  y: number;
  haloFill: string;
  haloOpacity: number;
  sequenceIndex: number;
};

export type GlobeDotBatch = {
  batchId: number;
  dots: WireframeGlobeDot[];
};

function hashSeed(seed: string) {
  let hash = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function createSeededRandom(seed: string) {
  let state = hashSeed(seed);

  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleInPlace<T>(items: T[], random: () => number): T[] {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const current = items[index] as T;
    items[index] = items[swapIndex] as T;
    items[swapIndex] = current;
  }

  return items;
}

function buildDots(random: () => number): WireframeGlobeDot[] {
  const density =
    TARGET_GLOBE_DOT_DENSITY_MIN +
    random() * (TARGET_GLOBE_DOT_DENSITY_MAX - TARGET_GLOBE_DOT_DENSITY_MIN);

  // Fisher–Yates: fixed RNG call count — unlike Array.sort(random), which differs across engines.
  const shuffled = shuffleInPlace([...TARGET_GLOBE_INTERSECTIONS], random);
  const count = Math.max(8, Math.round(shuffled.length * density));

  return shuffled.slice(0, count).map((candidate, sequenceIndex) => {
    const haloIndex = Math.floor(random() * TARGET_GLOBE_HALO_FILLS.length);
    const halo = TARGET_GLOBE_HALO_FILLS[haloIndex] ?? TARGET_GLOBE_HALO_FILLS[0];

    return {
      id: `globe-dot-${candidate.x}-${candidate.y}`,
      x: candidate.x,
      y: candidate.y,
      haloFill: halo.fill,
      haloOpacity: halo.opacity,
      sequenceIndex,
    };
  });
}

export function buildGlobeDotBatch(
  batchId: number,
  random: () => number = Math.random,
): GlobeDotBatch {
  return {
    batchId,
    dots: buildDots(random),
  };
}

let cachedInitialBatch: GlobeDotBatch | null = null;

/** Primeiro batch seedado — estável no SSR/hidratação. */
export function buildInitialGlobeDotBatch(): GlobeDotBatch {
  if (cachedInitialBatch !== null) {
    return cachedInitialBatch;
  }

  cachedInitialBatch = buildGlobeDotBatch(
    0,
    createSeededRandom(TARGET_GLOBE_DOT_SEED),
  );

  return cachedInitialBatch;
}
