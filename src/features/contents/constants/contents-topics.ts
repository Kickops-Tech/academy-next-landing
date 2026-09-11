export type ContentsTopicId = "past" | "inflection" | "now" | "future";

export type ContentsTopic = {
  id: ContentsTopicId;
  label: string;
  title: string;
  description: string;
  iconSrc: string;
};

export const CONTENTS_TOPICS: readonly ContentsTopic[] = [
  {
    id: "past",
    label: "VOLTANDO AO PASSADO",
    title: "Todos os bastidores",
    description:
      "Como funciona a IA? O que acontece quando escrevemos um prompt no conforto da nossa mesa de trabalho?",
    iconSrc: "/img/contents/icon-past.svg",
  },
  {
    id: "inflection",
    label: "PONTO DE MUDANÇA",
    title: "Inflexão",
    description:
      "Em que momento da história as coisas mudam? Onde foi que apertaram o botão que transformou nosso futuro?",
    iconSrc: "/img/contents/icon-inflection.svg",
  },
  {
    id: "now",
    label: "O AGORA",
    title: "Os dias de hoje",
    description:
      "Onde estamos? O que de fato está acontecendo, evoluindo e mudando de fato para a mudança do amanhã?",
    iconSrc: "/img/contents/icon-now.svg",
  },
  {
    id: "future",
    label: "FUTURO",
    title: "Pra onde vamos",
    description:
      "O que já se consegue ver lá na frente com evoluções muito rápidas e efetivas nas ferramentas de IA.",
    iconSrc: "/img/contents/icon-future.svg",
  },
] as const;
