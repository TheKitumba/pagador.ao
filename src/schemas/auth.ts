import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Indique o seu e-mail").email("E-mail inválido"),
  password: z.string().min(1, "Indique a sua palavra-passe"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().min(1, "Indique o seu e-mail").email("E-mail inválido"),
  password: z
    .string()
    .min(8, "A palavra-passe deve ter pelo menos 8 caracteres")
    .regex(/[A-Za-z]/, "A palavra-passe deve conter letras")
    .regex(/\d/, "A palavra-passe deve conter números"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
