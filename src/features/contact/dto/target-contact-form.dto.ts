import { z } from "zod";

import {
  CONTACT_EMPLOYEE_COUNT_VALUES,
  CONTACT_SOURCE_IDS,
} from "@features/contact/constants/contact-form";

export const targetContactFormSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome"),
  phone: z
    .string()
    .trim()
    .min(8, "Informe um telefone válido")
    .regex(/^[\d\s()+-]+$/, "Informe um telefone válido"),
  email: z.email("Informe um e-mail válido"),
  company: z.string().trim(),
  employeeCount: z.union([
    z.enum(CONTACT_EMPLOYEE_COUNT_VALUES),
    z.literal(""),
  ]),
  message: z.string().trim(),
  audienceId: z.enum(CONTACT_SOURCE_IDS),
});

export type TargetContactFormValues = z.infer<typeof targetContactFormSchema>;
