export type TargetAudienceId = "corporate" | "tech" | "improvement";

export type TargetDrawerStubBlock = {
  heading: string;
  body: string;
};

export type TargetAudience = {
  id: TargetAudienceId;
  label: string;
  title: string;
  titleLines?: string[];
  description: string;
  shellClassName: string;
  labelClassName: string;
  titleClassName: string;
  descriptionClassName: string;
  drawerTitle: string;
  drawerDescription: string;
  drawerStubBlocks: TargetDrawerStubBlock[];
};

export const TARGET_AUDIENCES: TargetAudience[] = [
  {
    id: "corporate",
    label: "Corporativo",
    title: "Empresas e equipes corporativas",
    description:
      "Pra quem deseja empoderar os times internos da sua organização.",
    shellClassName: "bg-white border border-kickops-gray/25",
    labelClassName: "text-kickops-gray",
    titleClassName: "text-kickops-gray",
    descriptionClassName: "text-kickops-gray",
    drawerTitle: "Empresas e equipes corporativas",
    drawerDescription:
      "Programas de IA pensados para escalar conhecimento, padronizar processos e dar autonomia aos times corporativos. Preencha os dados abaixo e entraremos em contato.",
    drawerStubBlocks: [
      {
        heading: "Capacitação em escala",
        body: "Trilhas modulares para diferentes papéis internos, com métricas de adoção e impacto nos fluxos existentes.",
      },
      {
        heading: "Governança e segurança",
        body: "Diretrizes claras de uso, templates aprovados e camadas de revisão antes de levar automações para produção.",
      },
    ],
  },
  {
    id: "tech",
    label: "Tech",
    title: "Profissionais de áreas não-técnicas",
    titleLines: ["Profissionais de áreas", "não-técnicas"],
    description:
      "Pra quem quer usar IA no trabalho sem depender do time de engenharia para cada passo.",
    shellClassName: "bg-kickops-gray",
    labelClassName: "text-white",
    titleClassName: "text-kickops-yellow",
    descriptionClassName: "text-white",
    drawerTitle: "Profissionais de áreas não-técnicas",
    drawerDescription:
      "Ferramentas e linguagem acessível para marketing, operações, RH e outras áreas criarem fluxos com IA — sem barreira técnica desnecessária. Preencha os dados abaixo e entraremos em contato.",
    drawerStubBlocks: [
      {
        heading: "Do prompt ao fluxo",
        body: "Exemplos práticos de automações que partem de tarefas reais do dia a dia, não de conceitos abstratos.",
      },
      {
        heading: "Integração leve",
        body: "Conectores e templates que reduzem a distância entre planilhas, CRMs e assistentes de IA.",
      },
    ],
  },
  {
    id: "improvement",
    label: "Aperfeiçoamento",
    title: "Equipes que precisam de automatização",
    titleLines: ["Equipes que precisam de", "automatização"],
    description:
      "Usando a IA como um braço criativo e técnico na produtividade de qualquer estrutura.",
    shellClassName: "bg-kickops-green border border-kickops-gray/25",
    labelClassName: "text-white",
    titleClassName: "text-kickops-gray",
    descriptionClassName: "text-kickops-gray",
    drawerTitle: "Equipes que precisam de automatização",
    drawerDescription:
      "Combinação de criatividade e execução técnica para tirar trabalho repetitivo das filas e liberar tempo para decisões de maior valor. Preencha os dados abaixo e entraremos em contato.",
    drawerStubBlocks: [
      {
        heading: "Automação assistida",
        body: "Prototipagem rápida de bots, rotinas e conteúdo com revisão humana no loop.",
      },
      {
        heading: "Produtividade composta",
        body: "Pequenas vitórias semanais que somam ganho operacional mensurável ao longo do trimestre.",
      },
    ],
  },
];

export function getTargetAudienceById(
  id: TargetAudienceId | null,
): TargetAudience | undefined {
  if (id === null) {
    return undefined;
  }

  return TARGET_AUDIENCES.find((audience) => audience.id === id);
}
