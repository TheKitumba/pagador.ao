import type { RequestStatus } from "./time";

export type BatchStatus = "draft" | "pending" | "approved" | "sent" | "reconciled" | "partial";

export const batchStatusLabel: Record<BatchStatus, string> = {
  draft: "Em preparação",
  pending: "A aguardar aprovação",
  approved: "Aprovado",
  sent: "Enviado ao banco",
  reconciled: "Reconciliado",
  partial: "Com rejeições",
};

export const paymentBatches = [
  { id: "LOT-2026-10-BFA", run: "Folha de outubro 2026", bank: "BFA", format: "PS2 BFA", instructions: 132, amount: 53_120_440.22, status: "draft" as BatchStatus, preparedBy: "Ana Mateus" },
  { id: "LOT-2026-10-BAI", run: "Folha de outubro 2026", bank: "BAI", format: "BAI Directo (CSV)", instructions: 71, amount: 29_884_310.5, status: "draft" as BatchStatus, preparedBy: "Ana Mateus" },
  { id: "LOT-2026-10-BIC", run: "Folha de outubro 2026", bank: "BIC", format: "BIC Empresas (TXT)", instructions: 45, amount: 16_992_768.99, status: "draft" as BatchStatus, preparedBy: "Ana Mateus" },
  { id: "LOT-2026-09-BFA", run: "Folha de setembro 2026", bank: "BFA", format: "PS2 BFA", instructions: 131, amount: 52_740_100.0, status: "reconciled" as BatchStatus, preparedBy: "Ana Mateus" },
  { id: "LOT-2026-09-BAI", run: "Folha de setembro 2026", bank: "BAI", format: "BAI Directo (CSV)", instructions: 70, amount: 29_501_995.8, status: "partial" as BatchStatus, preparedBy: "Ana Mateus" },
];

export const benefits = [
  { name: "Subsídio de alimentação", type: "Subsídio", value: "40 000,00 Kz / mês", taxable: "Isento até 30 000,00 Kz", employees: 248 },
  { name: "Subsídio de transporte", type: "Subsídio", value: "30 000,00 Kz / mês", taxable: "Isento até 30 000,00 Kz", employees: 248 },
  { name: "Seguro de saúde — ENSA", type: "Seguro", value: "Plano Família", taxable: "Não incide", employees: 186 },
  { name: "Subsídio de turno nocturno", type: "Subsídio", value: "20% do vencimento base", taxable: "Incide IRT e SS", employees: 38 },
  { name: "Seguro de acidentes de trabalho", type: "Seguro obrigatório", value: "Apólice AAA-2026-1187", taxable: "Não incide", employees: 248 },
  { name: "Telemóvel de serviço", type: "Benefício em espécie", value: "Plafond de 15 000,00 Kz", taxable: "Incide IRT", employees: 42 },
];

export const loans = [
  { employee: "Feliciano Lukamba", type: "Empréstimo", principal: 900_000, installment: 45_000, paid: 9, total: 20, balance: 495_000, status: "active" as const },
  { employee: "Manuel Kalandula", type: "Adiantamento salarial", principal: 100_000, installment: 20_000, paid: 2, total: 5, balance: 60_000, status: "active" as const },
  { employee: "Hélder Kiala", type: "Penhora judicial", principal: 360_000, installment: 30_000, paid: 4, total: 12, balance: 240_000, status: "active" as const },
  { employee: "Nádia Paím", type: "Adiantamento salarial", principal: 150_000, installment: 150_000, paid: 0, total: 1, balance: 150_000, status: "pending" as const },
  { employee: "Ana Mateus", type: "Empréstimo", principal: 600_000, installment: 50_000, paid: 12, total: 12, balance: 0, status: "settled" as const },
];

export const reimbursements = [
  { id: "RB-0412", employee: "Nádia Paím", category: "Deslocação", description: "Viagem a Benguela — visita a cliente", amount: 86_500, date: "2026-10-09", status: "pending" as RequestStatus, receipt: true },
  { id: "RB-0411", employee: "Osvaldo Chipenda", category: "Material", description: "Cabos de rede e adaptadores", amount: 24_300, date: "2026-10-07", status: "approved" as RequestStatus, receipt: true },
  { id: "RB-0410", employee: "Feliciano Lukamba", category: "Ajudas de custo", description: "Ajudas de custo — Huambo (3 dias)", amount: 75_000, date: "2026-10-02", status: "approved" as RequestStatus, receipt: false },
  { id: "RB-0409", employee: "Kátia Sebastião", category: "Representação", description: "Almoço com cliente — Ilha de Luanda", amount: 58_900, date: "2026-09-30", status: "returned" as RequestStatus, receipt: false },
  { id: "RB-0408", employee: "Manuel Kalandula", category: "Combustível", description: "Gasóleo — viatura de serviço LD-21-44-AB", amount: 42_000, date: "2026-09-28", status: "rejected" as RequestStatus, receipt: true },
];

export type InvoiceStatus = "pending" | "approved" | "paid" | "overdue";

export const invoices = [
  { id: "FT 2026/318", supplier: "Mukuxi Consultoria, Lda.", kind: "Prestador de serviço", description: "Formação em SST — outubro", amount: 1_250_000, withholding: 81_250, due: "2026-10-20", status: "pending" as InvoiceStatus },
  { id: "FT 2026/301", supplier: "Bento Kiluange (independente)", kind: "Prestador de serviço", description: "Desenvolvimento de relatórios — setembro", amount: 680_000, withholding: 44_200, due: "2026-10-05", status: "overdue" as InvoiceStatus },
  { id: "PAG-2026-10", supplier: "pagador.ao", kind: "Subscrição", description: "Plano Profissional — 248 trabalhadores", amount: 372_000, withholding: 0, due: "2026-10-10", status: "paid" as InvoiceStatus },
  { id: "FT 2026/287", supplier: "Clínica Girassol — Medicina do Trabalho", kind: "Prestador de serviço", description: "Exames periódicos — 42 trabalhadores", amount: 2_940_000, withholding: 191_100, due: "2026-09-30", status: "paid" as InvoiceStatus },
];
