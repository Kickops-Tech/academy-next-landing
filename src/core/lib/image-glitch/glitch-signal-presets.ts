/**
 * Intensity presets for the Kickops “signal” glitch fragment.
 *
 * @module core/lib/image-glitch/glitch-signal-presets
 */

export type GlitchSignalPresetId = "landing" | "reference";

export type GlitchSignalPreset = {
  /** Max horizontal strip shift (UV) — hard step, no wave. */
  shiftAmp: number;
  /** Full-bust chromatic ghost offset (UV). */
  chromaAmp: number;
  /** 0–1 chance an active strip flips U or V. */
  invertChance: number;
  /**
   * Strip active if hash > threshold — higher = fewer bands at once.
   */
  stripActiveThreshold: number;
};

export const GLITCH_SIGNAL_PRESETS: Record<
  GlitchSignalPresetId,
  GlitchSignalPreset
> = {
  landing: {
    // Slight bump from micro — still tight; smear + fast flip carry motion.
    shiftAmp: 0.018,
    chromaAmp: 0.0085,
    invertChance: 0.07,
    stripActiveThreshold: 0.86,
  },
  reference: {
    shiftAmp: 0.028,
    chromaAmp: 0.013,
    invertChance: 0.12,
    stripActiveThreshold: 0.78,
  },
};
