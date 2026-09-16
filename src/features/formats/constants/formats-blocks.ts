export type FormatsBlockId = "formato" | "conteudo" | "investimento";

export type FormatsParagraph = {
  text: string;
  accent?: boolean;
};

export type FormatsBlock = {
  id: FormatsBlockId;
  eyebrow: string;
  title: string;
  paragraphs: FormatsParagraph[];
};

/** Block copy — Figma 918:286 (D) / 721:2099 (M). */
export const FORMATS_BLOCKS: FormatsBlock[] = [
  {
    id: "formato",
    eyebrow: "FORMATO",
    title: "Presencial ou Online",
    paragraphs: [
      {
        text: "Para explorarmos ao máximo essa introspecção em conjunto, o encontro presencial pode ser ótimo.",
      },
      {
        text: "Sabemos que pode não ser viável, por isso o formato online também está disponível.",
      },
      {
        text: "Se precisar de um local, nossa equipe pode cuidar disso para você!",
        accent: true,
      },
    ],
  },
  {
    id: "conteudo",
    eyebrow: "CONTEÚDO",
    title: "Personalizado",
    paragraphs: [
      {
        text: "A partir de um conteúdo adaptado e personalizado para o seu negócio, conseguimos criar interações únicas e ricas.",
      },
      {
        text: "O propósito desta introspecção é entrar nos seus processos e entender como esse novo mundo os impacta.",
      },
    ],
  },
  {
    id: "investimento",
    eyebrow: "INVESTIMENTO",
    title: "Contato",
    paragraphs: [
      {
        text: "A experiência é desenhada para o seu negócio, estruturada a partir de sua liderança e processos.",
      },
      {
        text: "Entre em contato conosco para realizarmos essa personalização!",
      },
    ],
  },
];
