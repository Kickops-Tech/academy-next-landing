/** Copy + layout for Formats notice bar — Figma 918:351 (D) / 935:123 (M). */

export const FORMATS_NOTICE_DESKTOP = {
  top: 335,
  width: 1112,
  height: 80,
  left: (1512 - 1112) / 2,
  lead: "A Kickops recomenda que a Imersão tenha duração de até 4 horas: ",
  highlight: "3h de prática e 1h teórica.",
} as const;

export const FORMATS_NOTICE_MOBILE = {
  lead: "A Kickops recomenda que a Imersão tenha duração de até 4 horas, distribuídas entre ",
  highlight: "3 horas de atividades práticas e 1 hora de conteúdo teórico. ",
  trail:
    "Essa divisão tem o objetivo de garantir uma experiência dinâmica, equilibrando aprendizado e aplicação na prática.",
} as const;

export const FORMATS_NOTICE = {
  iconSrc: "/img/formats/circle-alert.svg",
} as const;
