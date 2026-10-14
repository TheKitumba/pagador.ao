export const reportCategories = [
  {
    title: "Pessoas",
    reports: [
      { name: "Efectivo por departamento e estabelecimento", updated: "Hoje, 08:00" },
      { name: "Admissões e saídas (rotatividade)", updated: "Hoje, 08:00" },
      { name: "Pirâmide etária e antiguidade", updated: "Ontem" },
      { name: "Diversidade de género por nível", updated: "Ontem" },
    ],
  },
  {
    title: "Remuneração",
    reports: [
      { name: "Custo da folha por centro de custo", updated: "Hoje, 08:00" },
      { name: "Evolução salarial e retroactivos", updated: "13/10/2026" },
      { name: "Mapa de encargos sociais", updated: "13/10/2026" },
    ],
  },
  {
    title: "Tempo",
    reports: [
      { name: "Absentismo por motivo", updated: "Hoje, 08:00" },
      { name: "Horas extra vs. limite legal", updated: "Hoje, 08:00" },
      { name: "Mapa de férias", updated: "Ontem" },
    ],
  },
];

export const headcountByDepartment = [
  { department: "Operações", headcount: 112 },
  { department: "Logística", headcount: 64 },
  { department: "Comercial", headcount: 31 },
  { department: "Tecnologia", headcount: 18 },
  { department: "Finanças", headcount: 14 },
  { department: "RH", headcount: 9 },
];

export const disciplinaryCases = [
  { id: "PD-2026-07", employee: "Lukeny Bamba", infraction: "Faltas injustificadas reiteradas", opened: "2026-10-08", stage: "Nota de culpa", deadline: "2026-10-23", status: "open" as const },
  { id: "PD-2026-06", employee: "Celso Mavinga", infraction: "Incumprimento de normas de segurança", opened: "2026-09-12", stage: "Resposta do trabalhador", deadline: "2026-10-17", status: "open" as const },
  { id: "PD-2026-05", employee: "Gelson Tchiwale", infraction: "Utilização indevida de viatura", opened: "2026-07-01", stage: "Decisão — repreensão registada", deadline: null, status: "closed" as const },
];

export const medicalExams = [
  { employee: "Hélder Kiala", exam: "Exame periódico", due: "2026-10-20", status: "scheduled" as const },
  { employee: "Lukeny Bamba", exam: "Exame periódico", due: "2026-10-16", status: "overdue" as const },
  { employee: "Edvânia Tavares", exam: "Exame de admissão", due: "2026-08-03", status: "done" as const },
  { employee: "Feliciano Lukamba", exam: "Exame periódico", due: "2026-11-30", status: "scheduled" as const },
];

export const accidents = [
  { date: "2026-09-27", employee: "Celso Mavinga", location: "Armazém do Lobito", severity: "Ligeiro", daysLost: 2, reported: true },
  { date: "2026-08-14", employee: "Manuel Kalandula", location: "Delegação do Huambo", severity: "Moderado", daysLost: 9, reported: true },
];

export const ppe = [
  { item: "Botas de segurança", stock: 64, assigned: 182, expiring: 12 },
  { item: "Coletes refletores", stock: 120, assigned: 210, expiring: 0 },
  { item: "Capacetes", stock: 35, assigned: 148, expiring: 8 },
  { item: "Luvas anticorte", stock: 18, assigned: 102, expiring: 40 },
];

export const auditLog = [
  { at: "2026-10-14T09:42:11+01:00", user: "Ana Mateus", action: "Calculou o processamento", entity: "Folha de outubro 2026", ip: "196.223.14.20", sensitive: false },
  { at: "2026-10-14T09:15:03+01:00", user: "Isabel Neto", action: "Alterou o vencimento base", entity: "Edvânia Tavares (0003)", ip: "196.223.14.18", sensitive: true },
  { at: "2026-10-13T16:48:55+01:00", user: "Hélder Kiala", action: "Alterou o IBAN (pendente de validação)", entity: "Hélder Kiala (0006)", ip: "41.63.10.112", sensitive: true },
  { at: "2026-10-13T11:20:40+01:00", user: "Graça Mbemba", action: "Aprovou o lote de pagamento", entity: "LOT-2026-09-BAI", ip: "196.223.14.25", sensitive: false },
  { at: "2026-10-12T08:05:12+01:00", user: "Sistema", action: "Publicou nova versão da tabela de IRT", entity: "Tabela IRT Grupo A — 2026 v2", ip: "—", sensitive: false },
  { at: "2026-10-10T14:31:09+01:00", user: "Isabel Neto", action: "Convidou utilizador com papel Processador salarial", entity: "ana.mateus@kianda.co.ao", ip: "196.223.14.18", sensitive: false },
];
