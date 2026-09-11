export type PeopleAgent = {
  id: string;
  agentNumber: number;
  name: string;
  imageSrc: string;
  imageAlt: string;
  paragraphs: string[];
};

const GUILHERME_PARAGRAPHS = [
  "CEO da Kickops, professor de Ciências da Computação no SENAC e mestrando pelo Instituto de Pesquisas Energéticas e Nucleares (IPEN).",
  "Já passou por diversas empresas como iFood, Grupo Primo, Spiti (XP),B4A Group e Catu.",
  "Principal idealizador dessa imersão por ter certeza que além de acreditar que a educação vai transformar o país, também tem a clareza que é hora de parar, respirar e entender como podemos usar a IA ao nosso favor, mas sem promessas falsas marketeiras.",
] as const;

export const PEOPLE_AGENTS: PeopleAgent[] = [1, 2, 3, 4].map((agentNumber) => ({
  id: `guilherme-rey-${agentNumber}`,
  agentNumber,
  name: "Guilherme Rey",
  imageSrc: "/img/people/guilherme-rey.jpg",
  imageAlt: "Guilherme Rey",
  paragraphs: [...GUILHERME_PARAGRAPHS],
}));
