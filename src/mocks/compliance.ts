export type FilingStatus = "upcoming" | "ready" | "submitted" | "paid" | "overdue";

export const filingStatusLabel: Record<FilingStatus, string> = {
  upcoming: "Por preparar",
  ready: "Pronto a submeter",
  submitted: "Submetido",
  paid: "Pago",
  overdue: "Em atraso",
};

export const taxFilings = [
  { id: "inss-2026-09", authority: "INSS", name: "Folha de remunerações — setembro 2026", period: "2026-09", due: "2026-10-10", amount: 12_984_031.4, status: "paid" as FilingStatus },
  { id: "irt-2026-09", authority: "AGT", name: "IRT retido — setembro 2026", period: "2026-09", due: "2026-10-31", amount: 14_602_330.9, status: "ready" as FilingStatus },
  { id: "inss-2026-10", authority: "INSS", name: "Folha de remunerações — outubro 2026", period: "2026-10", due: "2026-11-10", amount: 13_027_238.54, status: "upcoming" as FilingStatus },
  { id: "irt-2026-10", authority: "AGT", name: "IRT retido — outubro 2026", period: "2026-10", due: "2026-11-30", amount: 14_870_220.18, status: "upcoming" as FilingStatus },
  { id: "irt-2026-08", authority: "AGT", name: "IRT retido — agosto 2026", period: "2026-08", due: "2026-09-30", amount: 14_330_905.4, status: "paid" as FilingStatus },
  { id: "ii-2026-09", authority: "AGT", name: "Imposto industrial retido — prestadores", period: "2026-09", due: "2026-10-31", amount: 235_300.0, status: "upcoming" as FilingStatus },
];

export const fiscalDeadlines = [
  { date: "2026-10-31", title: "Entrega do IRT retido de setembro", authority: "AGT", daysLeft: 17 },
  { date: "2026-10-31", title: "Retenção na fonte — prestadores de serviço", authority: "AGT", daysLeft: 17 },
  { date: "2026-11-10", title: "Folha de remunerações e pagamento de outubro", authority: "INSS", daysLeft: 27 },
  { date: "2026-11-30", title: "Entrega do IRT retido de outubro", authority: "AGT", daysLeft: 47 },
];

export const terminations = [
  { employee: "Rui Kapinga", reason: "Caducidade do contrato a termo", noticeDate: "2026-10-01", lastDay: "2026-10-31", settlement: 412_380.5, status: "calculating" as const },
  { employee: "Joana Capemba", reason: "Rescisão por iniciativa do trabalhador", noticeDate: "2026-09-15", lastDay: "2026-10-15", settlement: 688_120.0, status: "approval" as const },
  { employee: "Pedro Saluquila", reason: "Reforma por velhice", noticeDate: "2026-07-01", lastDay: "2026-09-30", settlement: 2_340_900.0, status: "paid" as const },
];

export const terminationStatusLabel = {
  calculating: "Acerto em cálculo",
  approval: "A aguardar aprovação",
  paid: "Concluída",
} as const;
