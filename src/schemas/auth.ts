import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Indique o seu e-mail").email("E-mail inválido"),
  password: z.string().min(1, "Indique a sua palavra-passe"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const companySizes = ["1–10 trabalhadores", "11–50 trabalhadores", "51–250 trabalhadores", "Mais de 250 trabalhadores"] as const;

export const provinces = [
  "Bengo", "Benguela", "Bié", "Cabinda", "Cuando", "Cubango", "Cuanza Norte", "Cuanza Sul", "Cunene", "Huambo",
  "Huíla", "Icolo e Bengo", "Luanda", "Lunda Norte", "Lunda Sul", "Malanje", "Moxico", "Moxico Leste", "Namibe", "Uíge", "Zaire",
] as const;

export const registerSchema = z.object({
  name: z.string().trim().min(3, "Indique o seu nome"),
  email: z.string().min(1, "Indique o seu e-mail").email("E-mail inválido"),
  password: z
    .string()
    .min(8, "A palavra-passe deve ter pelo menos 8 caracteres")
    .regex(/[A-Za-z]/, "A palavra-passe deve conter letras")
    .regex(/\d/, "A palavra-passe deve conter números"),
  companyName: z.string().trim().min(2, "Indique o nome da empresa"),
  companyNif: z.string().trim().regex(/^\d{10}$/, "O NIF da empresa tem 10 dígitos"),
  companySize: z.enum(companySizes, { errorMap: () => ({ message: "Escolha a dimensão" }) }),
  province: z.enum(provinces, { errorMap: () => ({ message: "Escolha a província" }) }),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: "Tem de aceitar os termos e a política de privacidade" }) }),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
