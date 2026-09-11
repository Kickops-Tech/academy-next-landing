/**
 * Episodic glitch burst scheduler — bust stays clean between bursts.
 *
 * @module core/lib/image-glitch/glitch-burst
 */

/** Current phase of the bust glitch cycle. */
export type GlitchBurstPhase = "idle" | "burst";

/** Mutable burst scheduler state. */
export interface GlitchBurstState {
  phase: GlitchBurstPhase;
  phaseStart: number;
  phaseDuration: number;
}

/** Tunable idle / burst windows (ms). */
export interface GlitchBurstTuning {
  idleMinMs: number;
  idleMaxMs: number;
  burstMinMs: number;
  burstMaxMs: number;
  /** Portion of burst phase used for fade-in / fade-out (0–0.5). */
  fadeRatio: number;
}

export const DEFAULT_GLITCH_BURST_TUNING: GlitchBurstTuning = {
  idleMinMs: 5200,
  idleMaxMs: 9800,
  burstMinMs: 1500,
  burstMaxMs: 2800,
  fadeRatio: 0.16,
};

export interface TickGlitchBurstResult {
  state: GlitchBurstState;
  /** 0 = original bust, 1 = full glitch stack. */
  mix: number;
  /** True while clusters may spawn. */
  isBurst: boolean;
}

/**
 * Create initial state — starts idle before the first burst.
 */
export function createGlitchBurstState(
  now: number,
  rng: () => number,
  tuning: GlitchBurstTuning = DEFAULT_GLITCH_BURST_TUNING,
): GlitchBurstState {
  const duration =
    tuning.idleMinMs + rng() * (tuning.idleMaxMs - tuning.idleMinMs);
  return { phase: "idle", phaseStart: now, phaseDuration: duration };
}

function nextPhaseDuration(
  phase: GlitchBurstPhase,
  rng: () => number,
  tuning: GlitchBurstTuning,
): number {
  if (phase === "burst") {
    return (
      tuning.burstMinMs + rng() * (tuning.burstMaxMs - tuning.burstMinMs)
    );
  }
  return tuning.idleMinMs + rng() * (tuning.idleMaxMs - tuning.idleMinMs);
}

function burstMix(
  phase: GlitchBurstPhase,
  elapsed: number,
  duration: number,
  fadeRatio: number,
): number {
  if (phase === "idle" || duration <= 0) return 0;

  const t = elapsed / duration;
  const fade = Math.min(0.45, fadeRatio);

  if (t < fade) return t / fade;
  if (t > 1 - fade) return (1 - t) / fade;
  return 1;
}

/**
 * Advance the burst scheduler and return the current effect mix.
 */
export function tickGlitchBurst(
  state: GlitchBurstState,
  now: number,
  rng: () => number,
  tuning: GlitchBurstTuning = DEFAULT_GLITCH_BURST_TUNING,
): TickGlitchBurstResult {
  let { phase, phaseStart, phaseDuration } = state;

  if (now - phaseStart >= phaseDuration) {
    phase = phase === "idle" ? "burst" : "idle";
    phaseStart = now;
    phaseDuration = nextPhaseDuration(phase, rng, tuning);
  }

  const mix = burstMix(phase, now - phaseStart, phaseDuration, tuning.fadeRatio);

  return {
    state: { phase, phaseStart, phaseDuration },
    mix,
    isBurst: phase === "burst",
  };
}
