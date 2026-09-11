/** ViewBox do globo (box Figma 757×377). */
export const TARGET_GLOBE_VIEWBOX = {
  width: 757,
  height: 377,
} as const;

/** Seed fixa — posições/cores estáveis no SSR/hidratação. */
export const TARGET_GLOBE_DOT_SEED = "corporate-globe-v1";

/** Fração das interseções por batch. */
export const TARGET_GLOBE_DOT_DENSITY_MIN = 0.18;
export const TARGET_GLOBE_DOT_DENSITY_MAX = 0.28;

/** Raio do halo e núcleo em unidades do viewBox. */
export const TARGET_GLOBE_DOT_HALO_R = 9;
export const TARGET_GLOBE_DOT_CORE_R = 3;

/** Lifecycle por ponto (s). */
export const TARGET_GLOBE_DOT_FADE_IN_S = 0.9;
export const TARGET_GLOBE_DOT_PULSE_S = 2.8;
export const TARGET_GLOBE_DOT_PULSE_FADE_S = 0.75;
export const TARGET_GLOBE_DOT_FADE_OUT_S = 0.85;

/** Intervalo entre pontos dentro do batch (ordem aleatória). */
export const TARGET_GLOBE_DOT_STAGGER_S = 0.4;

export const TARGET_GLOBE_DOT_LIFECYCLE_S =
  TARGET_GLOBE_DOT_FADE_IN_S +
  TARGET_GLOBE_DOT_PULSE_S +
  TARGET_GLOBE_DOT_PULSE_FADE_S +
  TARGET_GLOBE_DOT_FADE_OUT_S;

export const TARGET_GLOBE_DOT_PULSE_TOTAL_S =
  TARGET_GLOBE_DOT_PULSE_S + TARGET_GLOBE_DOT_PULSE_FADE_S;

/** Paleta de halos — fills SVG (Kickops tokens). */
export const TARGET_GLOBE_HALO_FILLS = [
  { fill: "#FFE27A", opacity: 0.5 },
  { fill: "#B5CDBA", opacity: 0.5 },
  { fill: "#333333", opacity: 0.45 },
  { fill: "#B5CDBA", opacity: 0.45 },
  { fill: "#333333", opacity: 0.4 },
  { fill: "#FFE27A", opacity: 0.45 },
  { fill: "#B5CDBA", opacity: 0.4 },
] as const;

export const TARGET_GLOBE_WIREFRAME_SRC = "/img/target/corporate-globe.svg";

export function getGlobeBatchDurationMs(dotCount: number) {
  if (dotCount <= 0) {
    return 0;
  }

  const lastDotDelay = (dotCount - 1) * TARGET_GLOBE_DOT_STAGGER_S;
  return Math.ceil((lastDotDelay + TARGET_GLOBE_DOT_LIFECYCLE_S) * 1000) + 120;
}
