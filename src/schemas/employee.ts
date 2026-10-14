import { z } from "zod";

/** Angolan BI / individual NIF: 9 digits, 2 letters (province), 3 digits. */
const BI_PATTERN = /^\d{9}[A-Z]{2}\d{3}$/;

/** Angolan IBAN: AO + 2 check digits + 21 digits, validated with ISO 13616 mod-97. */
export function isValidAngolanIban(value: string) {
  const iban = value.replace(/\s/g, "").toUpperCase();
  if (!/^AO\d{23}$/.test(iban)) return false;

  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, (letter) => String(letter.charCodeAt(0) - 55));
  let remainder = 0;
  for (const digit of numeric) remainder = (remainder * 10 + Number(digit)) % 97;
  return remainder === 1;
}

export const employeeSchema = z.object({
  // Pessoal
  fullName: z.string().trim().min(3, "Indique o nome completo"),
  birthDate: z.string().min(1, "Indique a data de nascimento"),
  bi: z.string().trim().toUpperCase().regex(BI_PATTERN, "Formato do BI: 9 dígitos, 2 letras e 3 dígitos (ex.: 006512378LA041)"),
  nif: z.string().trim().toUpperCase().regex(BI_PATTERN, "Para pessoas singulares, o NIF é o número do BI"),
  phone: z
    .string()
    .trim()
    .regex(/^\+244\s?9\d{2}\s?\d{3}\s?\d{3}$/, "Formato: +244 9XX XXX XXX"),
  email: z.union([z.literal(""), z.string().email("E-mail inválido")]),
  // Profissional
  position: z.string().min(1, "Escolha o cargo"),
  department: z.string().min(1, "Escolha o departamento"),
  establishment: z.string().min(1, "Escolha o estabelecimento"),
  hireDate: z.string().min(1, "Indique a data de admissão"),
  // Contrato e remuneração
  contractType: z.string().min(1, "Escolha o tipo de contrato"),
  baseSalary: z.coerce.number({ invalid_type_error: "Indique um valor" }).positive("O vencimento deve ser superior a zero"),
  // Pagamento
  bank: z.string().min(1, "Escolha o banco"),
  iban: z.string().refine(isValidAngolanIban, "IBAN inválido. Confirme os 25 caracteres (AO06…) e os dígitos de controlo"),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;

export const employeeFormSteps: { id: string; title: string; description: string; fields: (keyof EmployeeFormValues)[] }[] = [
  { id: "personal", title: "Dados pessoais", description: "Identificação e contactos", fields: ["fullName", "birthDate", "bi", "nif", "phone", "email"] },
  { id: "job", title: "Posição", description: "Cargo, departamento e local", fields: ["position", "department", "establishment", "hireDate"] },
  { id: "contract", title: "Contrato", description: "Tipo e remuneração", fields: ["contractType", "baseSalary"] },
  { id: "payment", title: "Pagamento", description: "Banco e IBAN", fields: ["bank", "iban"] },
  { id: "review", title: "Revisão", description: "Confirmar e admitir", fields: [] },
];
