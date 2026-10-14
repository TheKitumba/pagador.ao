export type RequestStatus = "pending" | "approved" | "rejected" | "returned" | "draft";

export const requestStatusLabel: Record<RequestStatus, string> = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Rejeitado",
  returned: "Devolvido",
  draft: "Rascunho",
};

export const attendanceToday = {
  date: "2026-10-14",
  expected: 236,
  present: 214,
  late: 9,
  absent: 6,
  onLeave: 7,
};

export type PunchSource = "Navegador" | "Quiosque" | "Biométrico" | "Manual";

export const punches = [
  { employee: "Ana Mateus", establishment: "Sede — Talatona, Luanda", in: "07:52", out: null, source: "Navegador" as PunchSource, status: "present" as const },
  { employee: "Feliciano Lukamba", establishment: "Armazém do Lobito, Benguela", in: "06:58", out: null, source: "Biométrico" as PunchSource, status: "present" as const },
  { employee: "Lukeny Bamba", establishment: "Armazém do Lobito, Benguela", in: "08:24", out: null, source: "Quiosque" as PunchSource, status: "late" as const },
  { employee: "Manuel Kalandula", establishment: "Delegação do Huambo", in: null, out: null, source: null, status: "absent" as const },
  { employee: "Nádia Paím", establishment: "Sede — Talatona, Luanda", in: "08:01", out: null, source: "Navegador" as PunchSource, status: "present" as const },
  { employee: "Osvaldo Chipenda", establishment: "Sede — Talatona, Luanda", in: "08:37", out: null, source: "Navegador" as PunchSource, status: "late" as const },
  { employee: "Hélder Kiala", establishment: "Armazém do Lobito, Benguela", in: null, out: null, source: null, status: "leave" as const },
];

export const attendanceCorrections = [
  { employee: "Manuel Kalandula", date: "2026-10-13", reason: "Esquecimento da marcação de saída", requested: "17:30", status: "pending" as RequestStatus },
  { employee: "Nádia Paím", date: "2026-10-10", reason: "Reunião externa com cliente", requested: "Entrada 10:15", status: "pending" as RequestStatus },
  { employee: "Lukeny Bamba", date: "2026-10-09", reason: "Avaria do quiosque", requested: "Entrada 07:00", status: "approved" as RequestStatus },
];

export const leaveRequests = [
  { id: "lv-01", employee: "Nádia Paím", type: "Férias", start: "2026-11-02", end: "2026-11-13", days: 10, status: "pending" as RequestStatus, approver: "Kátia Sebastião" },
  { id: "lv-02", employee: "Manuel Kalandula", type: "Falta justificada — doença", start: "2026-10-13", end: "2026-10-14", days: 2, status: "pending" as RequestStatus, approver: "Domingos Cassoma" },
  { id: "lv-03", employee: "Hélder Kiala", type: "Licença de paternidade", start: "2026-10-06", end: "2026-10-17", days: 10, status: "approved" as RequestStatus, approver: "Feliciano Lukamba" },
  { id: "lv-04", employee: "Ana Mateus", type: "Férias", start: "2026-12-21", end: "2027-01-08", days: 12, status: "approved" as RequestStatus, approver: "Graça Mbemba" },
  { id: "lv-05", employee: "Osvaldo Chipenda", type: "Falta justificada — casamento", start: "2026-09-21", end: "2026-09-29", days: 9, status: "approved" as RequestStatus, approver: "Domingos Cassoma" },
  { id: "lv-06", employee: "Lukeny Bamba", type: "Falta injustificada", start: "2026-10-07", end: "2026-10-07", days: 1, status: "rejected" as RequestStatus, approver: "Feliciano Lukamba" },
];

export const leaveBalances = [
  { employee: "Ana Mateus", entitled: 22, carried: 3, taken: 8, scheduled: 12 },
  { employee: "Domingos Cassoma", entitled: 22, carried: 0, taken: 15, scheduled: 5 },
  { employee: "Feliciano Lukamba", entitled: 22, carried: 5, taken: 10, scheduled: 0 },
  { employee: "Nádia Paím", entitled: 22, carried: 2, taken: 6, scheduled: 10 },
  { employee: "Osvaldo Chipenda", entitled: 22, carried: 0, taken: 18, scheduled: 0 },
];

export const overtimeRequests = [
  { employee: "Lukeny Bamba", date: "2026-10-11", hours: 6, kind: "Descanso semanal (+100%)", reason: "Descarga do navio MSC Luanda", status: "approved" as RequestStatus, monthTotal: 34 },
  { employee: "Feliciano Lukamba", date: "2026-10-12", hours: 3, kind: "Dia útil (+50%)", reason: "Inventário trimestral", status: "pending" as RequestStatus, monthTotal: 12 },
  { employee: "Manuel Kalandula", date: "2026-10-08", hours: 4, kind: "Dia útil (+50%)", reason: "Reparação urgente de empilhadora", status: "approved" as RequestStatus, monthTotal: 8 },
  { employee: "Hélder Kiala", date: "2026-10-04", hours: 8, kind: "Feriado (+100%)", reason: "Entrega a cliente no Namibe", status: "approved" as RequestStatus, monthTotal: 16 },
  { employee: "Nádia Paím", date: "2026-10-13", hours: 2, kind: "Dia útil (+50%)", reason: "Fecho de proposta comercial", status: "pending" as RequestStatus, monthTotal: 2 },
];

export const timesheets = [
  { employee: "Osvaldo Chipenda", week: "06–12 out. 2026", project: "Migração ERP", hours: 42, status: "pending" as RequestStatus },
  { employee: "Nádia Paím", week: "06–12 out. 2026", project: "Conta Sonangol Logística", hours: 40, status: "approved" as RequestStatus },
  { employee: "Ana Mateus", week: "06–12 out. 2026", project: "Fecho de contas Q3", hours: 44, status: "approved" as RequestStatus },
  { employee: "Edvânia Tavares", week: "06–12 out. 2026", project: "Implementação pagador.ao", hours: 38, status: "draft" as RequestStatus },
  { employee: "Manuel Kalandula", week: "06–12 out. 2026", project: "Manutenção preventiva", hours: 44, status: "returned" as RequestStatus },
];

export const shifts = ["Manhã 06:00–14:00", "Tarde 14:00–22:00", "Noite 22:00–06:00", "Folga"] as const;

export const weekDays = ["Seg 12", "Ter 13", "Qua 14", "Qui 15", "Sex 16", "Sáb 17", "Dom 18"];

export const roster = [
  { employee: "Feliciano Lukamba", shifts: [0, 0, 0, 0, 0, 3, 3] },
  { employee: "Lukeny Bamba", shifts: [1, 1, 1, 1, 1, 0, 3] },
  { employee: "Hélder Kiala", shifts: [3, 3, 3, 3, 3, 3, 3] },
  { employee: "Manuel Kalandula", shifts: [2, 2, 2, 3, 3, 0, 0] },
  { employee: "Celso Mavinga", shifts: [0, 0, 3, 1, 1, 1, 3] },
];

export const scheduleTemplates = [
  { name: "Administrativo", pattern: "Seg–Sex · 08:00–17:00 · 1 h de almoço", weeklyHours: 44, employees: 71 },
  { name: "Armazém — 3 turnos", pattern: "Rotação semanal manhã/tarde/noite", weeklyHours: 44, employees: 102 },
  { name: "Motoristas", pattern: "Escala 5×2 com folgas rotativas", weeklyHours: 44, employees: 46 },
  { name: "Plataforma 28/28", pattern: "28 dias de trabalho, 28 de descanso", weeklyHours: 42, employees: 0 },
];
