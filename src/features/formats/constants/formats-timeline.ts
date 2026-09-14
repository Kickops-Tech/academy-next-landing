export type FormatsTimelineItem = {
  id: string;
  title: string;
  description: string;
  iconSrc: string;
  iconBgClass: string;
  descriptionClass: string;
};

export const FORMATS_TIMELINE_ITEMS: FormatsTimelineItem[] = [
  {
    id: "total",
    title: "Até 4 horas",
    description: "Esse é o tempo estimado para uma experiência completa.",
    iconSrc: "/img/formats/clock-10.svg",
    iconBgClass: "bg-white",
    descriptionClass: "text-white",
  },
  {
    id: "teorico",
    title: "Teórico: 2h",
    description: "São 2 módulos dedicados a história e teoria da IA.",
    iconSrc: "/img/formats/graduation-cap.svg",
    iconBgClass: "bg-kickops-yellow",
    descriptionClass: "text-kickops-yellow",
  },
  {
    id: "pratico",
    title: "Prático: 2h",
    description: "Usando as ferramentas de IA dentro do seu negócio.",
    iconSrc: "/img/formats/clapperboard.svg",
    iconBgClass: "bg-kickops-green",
    descriptionClass: "text-kickops-green",
  },
] as const;

/** Desktop Figma bar (918:351) within 1512 frame. */
export const FORMATS_TIMELINE_DESKTOP = {
  top: 335,
  width: 1112,
  height: 125,
  left: (1512 - 1112) / 2,
} as const;
