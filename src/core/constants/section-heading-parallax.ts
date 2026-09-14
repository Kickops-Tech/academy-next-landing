/** Horizontal enter offset as % of viewport width (lead ←, trail →). */
export const SECTION_HEADING_ENTER_OFFSET_CQW = 14;

/** Soft enter rise (px at progress 0) — layered under horizontal slide-in. */
export const SECTION_HEADING_ENTER_FROM_Y_PX = 12;

/** Expoente de easing na entrada. */
export const SECTION_HEADING_ENTER_EXPONENT = 1.15;

/** Expoente de easing no fade de saída. */
export const SECTION_HEADING_EXIT_EXPONENT = 1.05;

/**
 * Parallax vertical contínuo (vh por scroll da seção) — trail sobe mais rápido.
 */
export const SECTION_HEADING_SCROLL_LEAD_TRANSLATE_VH = 8;
export const SECTION_HEADING_SCROLL_TRAIL_TRANSLATE_VH = 14;

/** Extra lift on exit (vh), stacked on scroll parallax. */
export const SECTION_HEADING_EXIT_LEAD_TRANSLATE_VH = 5;
export const SECTION_HEADING_EXIT_TRAIL_TRANSLATE_VH = 8;

/**
 * Viewport: entrada (fração da altura) — começa mais alto para o título
 * não aparecer cedo demais enquanto a dobra ainda sobe.
 */
export const SECTION_HEADING_ENTER_VIEWPORT_START = 0.52;
export const SECTION_HEADING_ENTER_VIEWPORT_END = 0.12;

/**
 * Viewport: fade-out pelo topo — o título fica abaixo do topo da seção,
 * então o fade só começa depois que o bloco já saiu bastante da tela
 * (parallax de scroll continua independente).
 */
export const SECTION_HEADING_EXIT_VIEWPORT_START = -0.35;
export const SECTION_HEADING_EXIT_VIEWPORT_END = -0.95;

/** CSS custom properties written on the section element. */
export const SECTION_HEADING_CSS = {
  leadX: "--sh-lead-x",
  trailX: "--sh-trail-x",
  leadY: "--sh-lead-y",
  trailY: "--sh-trail-y",
  opacity: "--sh-opacity",
} as const;
