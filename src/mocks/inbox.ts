export type ApprovalKind = "leave" | "overtime" | "reimbursement" | "advance" | "payroll" | "payment" | "salary" | "attendance";

export const approvalKindLabel: Record<ApprovalKind, string> = {
  leave: "Férias e faltas",
  overtime: "Horas extra",
  reimbursement: "Reembolso",
  advance: "Adiantamento",
  payroll: "Folha de pagamento",
  payment: "Lote de pagamento",
  salary: "Alteração salarial",
  attendance: "Correcção de ponto",
};

export interface Approval {
  id: string;
  kind: ApprovalKind;
  title: string;
  requester: string;
  detail: string;
  submittedAt: string;
  dueIn: string;
  step: string;
  urgent: boolean;
  href: string;
}

export const approvals: Approval[] = [
  { id: "ap-01", kind: "payroll", title: "Aprovar folha de outubro 2026", requester: "Ana Mateus", detail: "248 trabalhadores · 99 997 519,71 Kz líquido · 2 bloqueios", submittedAt: "Hoje, 09:42", dueIn: "Prazo: 27/10", step: "Passo 2 de 2", urgent: true, href: "/payroll/2026-10" },
  { id: "ap-02", kind: "leave", title: "Férias de 02/11 a 13/11 (10 dias úteis)", requester: "Nádia Paím", detail: "Saldo após aprovação: 8 dias", submittedAt: "Ontem, 17:10", dueIn: "Responder em 2 dias", step: "Passo 1 de 2", urgent: false, href: "/leave" },
  { id: "ap-03", kind: "advance", title: "Adiantamento salarial de 150 000,00 Kz", requester: "Nádia Paím", detail: "Desconto integral na folha de novembro", submittedAt: "Ontem, 15:02", dueIn: "Responder em 1 dia", step: "Passo 2 de 3", urgent: false, href: "/loans" },
  { id: "ap-04", kind: "overtime", title: "3 h extra em dia útil — inventário", requester: "Feliciano Lukamba", detail: "Total no mês: 12 h · limite: 40 h", submittedAt: "12/10, 18:30", dueIn: "Responder hoje", step: "Passo 1 de 1", urgent: true, href: "/overtime" },
  { id: "ap-05", kind: "reimbursement", title: "Reembolso de 86 500,00 Kz — deslocação", requester: "Nádia Paím", detail: "Viagem a Benguela · comprovativo anexado", submittedAt: "09/10, 11:20", dueIn: "Responder em 3 dias", step: "Passo 1 de 2", urgent: false, href: "/reimbursements" },
  { id: "ap-06", kind: "salary", title: "Revisão salarial — fim do período experimental", requester: "Isabel Neto", detail: "Edvânia Tavares · 420 000,00 → 480 000,00 Kz", submittedAt: "08/10, 10:05", dueIn: "Responder em 5 dias", step: "Passo 3 de 3", urgent: false, href: "/employees/emp-003" },
  { id: "ap-07", kind: "attendance", title: "Correcção de ponto — saída às 17:30", requester: "Manuel Kalandula", detail: "13/10/2026 · esquecimento da marcação", submittedAt: "Hoje, 07:55", dueIn: "Responder em 2 dias", step: "Passo 1 de 1", urgent: false, href: "/attendance" },
];

export type NotificationKind = "deadline" | "alert" | "info" | "success";

export const notifications = [
  { id: "n-01", kind: "alert" as NotificationKind, title: "2 bloqueios na folha de outubro", body: "Resolva os bloqueios antes de submeter a folha para aprovação.", time: "Há 12 min", read: false, href: "/payroll/2026-10" },
  { id: "n-02", kind: "deadline" as NotificationKind, title: "IRT de setembro: faltam 17 dias", body: "O mapa está pronto a submeter no portal da AGT.", time: "Há 1 h", read: false, href: "/tax-filings" },
  { id: "n-03", kind: "alert" as NotificationKind, title: "Alteração de IBAN a menos de 5 dias do pagamento", body: "Hélder Kiala alterou o IBAN. A alteração está pendente de validação.", time: "Ontem", read: false, href: "/employees/emp-006" },
  { id: "n-04", kind: "deadline" as NotificationKind, title: "3 contratos terminam nos próximos 30 dias", body: "Decida sobre renovação ou caducidade com a antecedência legal.", time: "Ontem", read: false, href: "/contracts" },
  { id: "n-05", kind: "success" as NotificationKind, title: "Lote LOT-2026-09-BFA reconciliado", body: "131 de 131 pagamentos confirmados pelo banco.", time: "13/10", read: true, href: "/payments" },
  { id: "n-06", kind: "info" as NotificationKind, title: "Nova versão da tabela de IRT publicada", body: "Aplica-se a processamentos a partir de 01/10/2026.", time: "12/10", read: true, href: "/settings?tab=legal" },
  { id: "n-07", kind: "info" as NotificationKind, title: "Aniversário de Ana Mateus na sexta-feira", body: "Envie uma mensagem à equipa de Finanças.", time: "12/10", read: true, href: "/employees/emp-001" },
];

export const conversations = [
  { id: "c-01", name: "Equipa de RH", preview: "Edvânia: Já carreguei os BI das admissões de outubro.", time: "09:58", unread: 2, group: true },
  { id: "c-02", name: "Graça Mbemba", preview: "Posso aprovar a folha depois das 15h.", time: "09:31", unread: 1, group: false },
  { id: "c-03", name: "Feliciano Lukamba", preview: "As horas extra do inventário já estão lançadas.", time: "Ontem", unread: 0, group: false },
  { id: "c-04", name: "Comunicados — Toda a empresa", preview: "Feriado de 11 de novembro: Dia da Independência.", time: "12/10", unread: 0, group: true },
];

export const messages = [
  { author: "Edvânia Tavares", time: "09:41", text: "Bom dia! Já carreguei os BI e os NIF das três admissões de outubro." },
  { author: "Isabel Neto", time: "09:46", text: "Obrigada. Falta o número de Segurança Social de dois deles, certo?" },
  { author: "Edvânia Tavares", time: "09:52", text: "Sim, o INSS deve atribuir até sexta-feira. Deixei o alerta activo na folha." },
];

export type CalendarEventKind = "holiday" | "payroll" | "tax" | "leave" | "training" | "interview";

export const calendarEvents: { date: string; title: string; kind: CalendarEventKind }[] = [
  { date: "2026-10-14", title: "Entrevista — Benvinda Lussati", kind: "interview" },
  { date: "2026-10-17", title: "Fim da licença de Hélder Kiala", kind: "leave" },
  { date: "2026-10-21", title: "Condução defensiva (2 dias)", kind: "training" },
  { date: "2026-10-25", title: "Pré-folha de outubro", kind: "payroll" },
  { date: "2026-10-27", title: "Aprovação da folha", kind: "payroll" },
  { date: "2026-10-28", title: "Operação de empilhadoras", kind: "training" },
  { date: "2026-10-30", title: "Pagamento de salários", kind: "payroll" },
  { date: "2026-10-31", title: "IRT de setembro — AGT", kind: "tax" },
  { date: "2026-11-02", title: "Dia dos Finados", kind: "holiday" },
  { date: "2026-11-02", title: "Férias de Nádia Paím", kind: "leave" },
  { date: "2026-11-10", title: "Folha de remunerações — INSS", kind: "tax" },
  { date: "2026-11-11", title: "Dia da Independência Nacional", kind: "holiday" },
];

export const helpArticles = [
  { category: "Primeiros passos", title: "Configurar a empresa e os estabelecimentos", minutes: 4 },
  { category: "Primeiros passos", title: "Importar trabalhadores a partir do Excel", minutes: 6 },
  { category: "Folha de pagamento", title: "Processar a primeira folha mensal", minutes: 8 },
  { category: "Folha de pagamento", title: "Como é calculado o IRT do Grupo A", minutes: 5 },
  { category: "Pagamentos", title: "Gerar ficheiros bancários (BFA, BAI, BIC)", minutes: 4 },
  { category: "Obrigações", title: "Submeter a folha de remunerações no portal do INSS", minutes: 7 },
  { category: "Tempo", title: "Configurar o ponto no navegador com geolocalização", minutes: 3 },
  { category: "Segurança", title: "Activar a autenticação de dois factores", minutes: 2 },
];
