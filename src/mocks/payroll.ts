import { type Employee, employees } from "./people";

export type PayrollRunStatus = "draft" | "calculated" | "review" | "approved" | "paid" | "closed";

export const payrollRunStatusLabel: Record<PayrollRunStatus, string> = {
  draft: "Rascunho",
  calculated: "Calculada",
  review: "Em revisão",
  approved: "Aprovada",
  paid: "Paga",
  closed: "Fechada",
};

/** Ordered steps of the monthly cycle (doc 04, 4.8–4.9). */
export const payrollSteps: { status: PayrollRunStatus; label: string; hint: string }[] = [
  { status: "draft", label: "Lançamentos", hint: "Variáveis, admissões e alterações" },
  { status: "calculated", label: "Cálculo", hint: "Pré-folha e cálculo definitivo" },
  { status: "review", label: "Revisão", hint: "Alertas e comparação mensal" },
  { status: "approved", label: "Aprovação", hint: "Aprovador financeiro" },
  { status: "paid", label: "Pagamento", hint: "Ficheiros bancários e recibos" },
  { status: "closed", label: "Fecho", hint: "Mapas fiscais e contabilidade" },
];

export interface PayrollRun {
  id: string;
  name: string;
  period: string;
  type: "Mensal" | "Subsídio de férias" | "Subsídio de Natal" | "Complementar";
  status: PayrollRunStatus;
  employees: number;
  gross: number;
  socialSecurity: number;
  irt: number;
  net: number;
  employerCost: number;
  paymentDate: string;
  blocking: number;
  warnings: number;
}

export const payrollRuns: PayrollRun[] = [
  {
    id: "2026-10",
    name: "Folha de outubro 2026",
    period: "2026-10-01",
    type: "Mensal",
    status: "calculated",
    employees: 248,
    gross: 118_420_350.4,
    socialSecurity: 3_552_610.51,
    irt: 14_870_220.18,
    net: 99_997_519.71,
    employerCost: 127_894_978.43,
    paymentDate: "2026-10-30",
    blocking: 2,
    warnings: 5,
  },
  {
    id: "2026-09",
    name: "Folha de setembro 2026",
    period: "2026-09-01",
    type: "Mensal",
    status: "closed",
    employees: 246,
    gross: 116_980_110.0,
    socialSecurity: 3_509_403.3,
    irt: 14_602_330.9,
    net: 98_868_375.8,
    employerCost: 126_338_518.8,
    paymentDate: "2026-09-30",
    blocking: 0,
    warnings: 0,
  },
  {
    id: "2026-08",
    name: "Folha de agosto 2026",
    period: "2026-08-01",
    type: "Mensal",
    status: "closed",
    employees: 243,
    gross: 115_210_870.2,
    socialSecurity: 3_456_326.11,
    irt: 14_330_905.4,
    net: 97_423_638.69,
    employerCost: 124_427_739.82,
    paymentDate: "2026-08-31",
    blocking: 0,
    warnings: 0,
  },
  {
    id: "2026-07-sf",
    name: "Subsídio de férias 2026",
    period: "2026-07-01",
    type: "Subsídio de férias",
    status: "closed",
    employees: 241,
    gross: 49_870_000.0,
    socialSecurity: 1_496_100.0,
    irt: 6_120_440.0,
    net: 42_253_460.0,
    employerCost: 53_859_600.0,
    paymentDate: "2026-07-24",
    blocking: 0,
    warnings: 0,
  },
  {
    id: "2026-07",
    name: "Folha de julho 2026",
    period: "2026-07-01",
    type: "Mensal",
    status: "closed",
    employees: 241,
    gross: 113_640_220.0,
    socialSecurity: 3_409_206.6,
    irt: 14_022_870.3,
    net: 96_208_143.1,
    employerCost: 122_731_437.6,
    paymentDate: "2026-07-31",
    blocking: 0,
    warnings: 0,
  },
];

export function findPayrollRun(id: string) {
  return payrollRuns.find((run) => run.id === id);
}

export const payrollTrend = [
  { month: "mai.", gross: 110.2, net: 93.4 },
  { month: "jun.", gross: 111.9, net: 94.8 },
  { month: "jul.", gross: 113.6, net: 96.2 },
  { month: "ago.", gross: 115.2, net: 97.4 },
  { month: "set.", gross: 117.0, net: 98.9 },
  { month: "out.", gross: 118.4, net: 100.0 },
];

export const deductionsBreakdown = [
  { name: "IRT", value: 14_870_220.18, color: "hsl(var(--chart-1))" },
  { name: "Segurança Social (3%)", value: 3_552_610.51, color: "hsl(var(--chart-2))" },
  { name: "Segurança Social patronal (8%)", value: 9_474_628.03, color: "hsl(var(--chart-3))" },
  { name: "Empréstimos e penhoras", value: 1_240_500.0, color: "hsl(var(--chart-4))" },
];

export type PayslipStatus = "ok" | "warning" | "blocking";

export interface Payslip {
  id: string;
  runId: string;
  employee: Employee;
  gross: number;
  socialSecurity: number;
  irt: number;
  otherDeductions: number;
  net: number;
  previousNet: number;
  status: PayslipStatus;
  issue?: string;
}

// Display-only fixture values. Real figures always come from the API's payroll engine.
const payslipFigures: Record<string, Omit<Payslip, "id" | "runId" | "employee">> = {
  "emp-001": { gross: 371_800.7, socialSecurity: 11_154.02, irt: 49_372.87, otherDeductions: 0, net: 311_273.81, previousNet: 302_115.4, status: "ok" },
  "emp-002": { gross: 1_520_000, socialSecurity: 45_600, irt: 334_920, otherDeductions: 0, net: 1_139_480, previousNet: 1_139_480, status: "ok" },
  "emp-003": { gross: 490_000, socialSecurity: 14_700, irt: 72_910, otherDeductions: 0, net: 402_390, previousNet: 201_195, status: "warning", issue: "Líquido 100% acima do mês anterior (admissão a meio do mês)" },
  "emp-004": { gross: 850_000, socialSecurity: 25_500, irt: 160_485, otherDeductions: 45_000, net: 619_015, previousNet: 619_015, status: "ok" },
  "emp-005": { gross: 1_450_000, socialSecurity: 43_500, irt: 316_725, otherDeductions: 0, net: 1_089_775, previousNet: 1_089_775, status: "ok" },
  "emp-006": { gross: 330_000, socialSecurity: 9_900, irt: 38_115, otherDeductions: 0, net: 282_985, previousNet: 282_985, status: "blocking", issue: "IBAN inválido — pagamento por transferência bloqueado" },
  "emp-007": { gross: 1_320_000, socialSecurity: 39_600, irt: 283_380, otherDeductions: 0, net: 997_020, previousNet: 997_020, status: "ok" },
  "emp-008": { gross: 280_000, socialSecurity: 8_400, irt: 25_680, otherDeductions: 0, net: 245_920, previousNet: 245_920, status: "warning", issue: "Horas extra acima do limite legal (34 h no mês)" },
  "emp-009": { gross: 420_000, socialSecurity: 12_600, irt: 54_910, otherDeductions: 20_000, net: 332_490, previousNet: 332_490, status: "ok" },
  "emp-010": { gross: 550_000, socialSecurity: 16_500, irt: 84_335, otherDeductions: 0, net: 449_165, previousNet: 449_165, status: "ok" },
  "emp-011": { gross: 1_170_000, socialSecurity: 35_100, irt: 245_115, otherDeductions: 0, net: 889_785, previousNet: 889_785, status: "blocking", issue: "Trabalhador activo sem contrato vigente" },
};

export const payslips: Payslip[] = employees
  .filter((employee) => payslipFigures[employee.id])
  .map((employee) => ({
    id: `ps-${employee.number}`,
    runId: "2026-10",
    employee,
    ...payslipFigures[employee.id],
  }));

export function findPayslip(id: string) {
  return payslips.find((payslip) => payslip.id === id);
}

export interface PayslipLine {
  code: string;
  description: string;
  kind: "earning" | "deduction" | "employer";
  quantity?: string;
  amount: number;
  trace: string;
}

/** Calculation trace of the reference example (doc 04, 4.6). */
export const referencePayslipLines: PayslipLine[] = [
  { code: "R001", description: "Vencimento base", kind: "earning", amount: 300_000, trace: "Valor do contrato vigente em 01/10/2026" },
  { code: "R010", description: "Subsídio de alimentação", kind: "earning", amount: 40_000, trace: "Valor fixo mensal; isento de IRT até 30 000,00 Kz" },
  { code: "R011", description: "Subsídio de transporte", kind: "earning", amount: 30_000, trace: "Valor fixo mensal; isento de IRT até 30 000,00 Kz" },
  { code: "R040", description: "Horas extra — dia útil", kind: "earning", quantity: "5 h", amount: 11_800.7, trace: "valor_hora() × 1,5 × 5 = 1 573,4266 × 1,5 × 5" },
  { code: "D010", description: "Falta injustificada", kind: "deduction", quantity: "1 dia", amount: -10_000, trace: "valor_dia() × 1 = 300 000 / 30 × 1" },
  { code: "D001", description: "Segurança Social (3%)", kind: "deduction", amount: -11_154.02, trace: "Base de incidência 371 800,70 × 3%" },
  { code: "D002", description: "IRT — Grupo A, escalão 5", kind: "deduction", amount: -49_372.87, trace: "49 250 + (300 646,68 − 300 000) × 19%" },
  { code: "E001", description: "Segurança Social patronal (8%)", kind: "employer", amount: 29_744.06, trace: "Base de incidência 371 800,70 × 8%" },
];

/** Lines for any payslip: the full reference trace for Ana Mateus, a simple breakdown for the others. */
export function payslipLines(payslip: Payslip): PayslipLine[] {
  if (payslip.employee.id === "emp-001") return referencePayslipLines;

  const base = payslip.employee.baseSalary;
  return [
    { code: "R001", description: "Vencimento base", kind: "earning", amount: base, trace: "Valor do contrato vigente em 01/10/2026" },
    { code: "R010", description: "Subsídio de alimentação", kind: "earning", amount: 40_000, trace: "Valor fixo mensal; isento de IRT até 30 000,00 Kz" },
    { code: "R011", description: "Subsídio de transporte", kind: "earning", amount: 30_000, trace: "Valor fixo mensal; isento de IRT até 30 000,00 Kz" },
    { code: "D001", description: "Segurança Social (3%)", kind: "deduction", amount: -payslip.socialSecurity, trace: `Base de incidência ${payslip.gross.toLocaleString("pt-AO")} × 3%` },
    { code: "D002", description: "IRT — Grupo A", kind: "deduction", amount: -payslip.irt, trace: "Tabela de IRT Grupo A — 2026 v2, escalão aplicável à matéria colectável" },
    ...(payslip.otherDeductions
      ? [{ code: "D020", description: "Prestação de empréstimo", kind: "deduction" as const, amount: -payslip.otherDeductions, trace: "Plano de prestações em vigor" }]
      : []),
    { code: "E001", description: "Segurança Social patronal (8%)", kind: "employer", amount: Math.round(payslip.gross * 8) / 100, trace: `Base de incidência ${payslip.gross.toLocaleString("pt-AO")} × 8%` },
  ];
}

export const payrollAlerts = [
  { severity: "blocking" as const, title: "Trabalhador activo sem contrato vigente", detail: "Osvaldo Chipenda — o contrato terminou em 30/09/2026", employeeId: "emp-011" },
  { severity: "blocking" as const, title: "Pagamento por transferência sem IBAN válido", detail: "Hélder Kiala — dígitos de controlo do IBAN não conferem", employeeId: "emp-006" },
  { severity: "warning" as const, title: "Variação do líquido superior a 20%", detail: "Edvânia Tavares — +100% face a setembro", employeeId: "emp-003" },
  { severity: "warning" as const, title: "Horas extra acima do limite legal", detail: "Lukeny Bamba — 34 h registadas em outubro", employeeId: "emp-008" },
  { severity: "warning" as const, title: "Assiduidade do período ainda não fechada", detail: "Delegação do Huambo — 3 dias por consolidar" },
  { severity: "warning" as const, title: "Trabalhadores sem n.º de Segurança Social", detail: "2 admissões recentes sem número atribuído" },
  { severity: "warning" as const, title: "Prestação de empréstimo adiada", detail: "Feliciano Lukamba — limite impenhorável atingido", employeeId: "emp-004" },
  { severity: "info" as const, title: "3 admissões, 1 cessação e 4 alterações salariais no período", detail: "Incluídas automaticamente no cálculo" },
];
