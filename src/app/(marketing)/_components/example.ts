/**
 * The worked example from docs/04 (4.6): October 2026, full-time, Grupo A table of Lei n.º 28/20.
 * The hero payslip and the "hidden error" section both read from here so the story stays consistent.
 */
export const example = {
  company: "Kitumba, Lda",
  employee: "Ana Domingos",
  role: "Contabilista",
  period: "Outubro 2026",
  earnings: [
    { label: "Vencimento base", amount: 300_000 },
    { label: "Subsídio de alimentação", amount: 40_000 },
    { label: "Subsídio de transporte", amount: 30_000 },
    { label: "Horas extra · 5 h a 150%", amount: 11_800.7 },
    { label: "Falta injustificada · 1 dia", amount: -10_000 },
  ],
  gross: 371_800.7,
  socialSecurity: 11_154.02,
  irt: 49_372.87,
  net: 311_273.81,
  /** Meal allowance above the 30 000 Kz exemption: taxable, and what a spreadsheet often misses. */
  taxableAllowance: 10_000,
};

/** The same payslip computed with the whole meal allowance treated as exempt. */
export const spreadsheet = {
  taxableBase: 290_646.68,
  bracket: "4 · 18%",
  irt: 47_566.4,
};

export const correct = {
  taxableBase: 300_646.68,
  bracket: "5 · 19%",
  irt: example.irt,
};

export const monthlyShortfall = correct.irt - spreadsheet.irt; // 1 806,47 Kz per worker
