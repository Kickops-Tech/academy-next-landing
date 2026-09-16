/** Copy + layout for Formats notice bar — Figma `918:351` (same on mobile). */

export const FORMATS_NOTICE_DESKTOP = {
  top: 335,
  width: 1112,
  height: 80,
  left: (1512 - 1112) / 2,
} as const;

export const FORMATS_NOTICE = {
  iconSrc: "/img/formats/circle-alert.svg",
  lead: "A Kickops recomenda que a Imersão tenha duração de até 4 horas: ",
  highlight: "3h de prática e 1h teórica.",
} as const;
