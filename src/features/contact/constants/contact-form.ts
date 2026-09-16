export const CONTACT_SOURCE_IDS = [
  "corporate",
  "tech",
  "improvement",
  "general",
] as const;

export type ContactSourceId = (typeof CONTACT_SOURCE_IDS)[number];

export const CONTACT_FORM_COPY = {
  title: "Fale com a gente",
  subtitle: "Preencha os dados abaixo e entraremos em contato.",
  submit: "Enviar",
  labels: {
    name: "Nome",
    phone: "Telefone",
    email: "E-mail",
    company: "Empresa (opcional)",
    employeeCount: "Nº de funcionários (opcional)",
    message: "Comentário",
  },
  placeholders: {
    name: "Seu nome",
    phone: "(11) 99999-9999",
    email: "voce@empresa.com",
    company: "Nome da empresa",
    employeeCount: "Selecione",
    message: "Conte um pouco sobre o que você precisa",
  },
} as const;

export const CONTACT_EMPLOYEE_COUNT_VALUES = [
  "1-10",
  "11-50",
  "51-200",
  "201-1000",
  "1000+",
] as const;

export type ContactEmployeeCount =
  (typeof CONTACT_EMPLOYEE_COUNT_VALUES)[number];

export const CONTACT_EMPLOYEE_COUNT_OPTIONS: {
  value: ContactEmployeeCount;
  label: string;
}[] = [
  { value: "1-10", label: "1-10" },
  { value: "11-50", label: "11-50" },
  { value: "51-200", label: "51-200" },
  { value: "201-1000", label: "201-1000" },
  { value: "1000+", label: "1000+" },
];
