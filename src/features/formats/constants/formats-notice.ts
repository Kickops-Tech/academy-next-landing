/** Copy + layout for Formats notice bar (Figma 918:351). */

export const FORMATS_NOTICE = {
  lead: "A Kickops recomenda que a Imersão tenha duração de até 4 horas, distribuídas entre ",
  highlight: "3 horas de atividades práticas e 1 hora de conteúdo teórico.",
  trail:
    "Essa divisão tem o objetivo de garantir uma experiência dinâmica, equilibrando aprendizado e aplicação na prática.",
  iconSrc: "/img/formats/circle-alert.svg",
} as const;

/** Desktop bar within 1512 frame — centered, former timeline slot. */
export const FORMATS_NOTICE_DESKTOP = {
  top: 335,
  width: 1112,
  height: 80,
  left: (1512 - 1112) / 2,
} as const;
