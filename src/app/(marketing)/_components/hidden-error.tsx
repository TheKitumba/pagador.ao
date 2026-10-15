import { formatKz } from "@/lib/format";

import { correct, example, monthlyShortfall, spreadsheet } from "./example";
import { Payslip } from "./payslip";
import { GlowCard, Mono, TwoTone } from "./primitives";
import { ShortfallCalculator } from "./shortfall-calculator";

const rows = [
  { label: "Subsídio de alimentação tributável", sheet: formatKz(0), ours: formatKz(example.taxableAllowance) },
  { label: "Matéria colectável", sheet: formatKz(spreadsheet.taxableBase), ours: formatKz(correct.taxableBase) },
  { label: "Escalão do IRT", sheet: spreadsheet.bracket, ours: correct.bracket },
  { label: "IRT retido", sheet: formatKz(spreadsheet.irt), ours: formatKz(correct.irt) },
];

const cell = "px-3 py-3.5 sm:px-5 sm:py-4";

/** The turn of the story: one realistic mistake, made visible, then scaled to the reader's company. */
export function HiddenError() {
  return (
    <section aria-labelledby="erro-title" className="px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <TwoTone id="erro-title" lead={`Um erro de ${formatKz(monthlyShortfall)} que ninguém vê.`} rest="Todos os meses, em cada trabalhador." />
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-center text-lg leading-relaxed text-neutral-400">
          A Ana recebe 40 000 Kz de subsídio de alimentação. O Código do IRT só isenta os primeiros 30 000 Kz. Numa folha de cálculo que trata o subsídio
          todo como isento, o salário dela cai para o escalão de baixo e o IRT retido fica abaixo do devido.
        </p>

        <div className="mt-16 grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
          <Payslip />

          <GlowCard className="h-full">
            <table className="w-full text-[13px] sm:text-sm">
              <caption className="sr-only">IRT de Outubro calculado numa folha de cálculo e no Pagador.ao</caption>
              <thead>
                <tr className="border-b border-white/[0.07] text-left">
                  <th scope="col" className={`${cell} font-normal`}>
                    <Mono>Outubro · {example.employee}</Mono>
                  </th>
                  <th scope="col" className={`${cell} text-right font-normal text-neutral-500`}>
                    Folha de cálculo
                  </th>
                  <th scope="col" className={`${cell} text-right font-medium text-white`}>
                    Pagador.ao
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-white/[0.07]">
                    <th scope="row" className={`${cell} text-left font-normal text-neutral-400`}>
                      {row.label}
                    </th>
                    <td className={`${cell} tabular whitespace-nowrap text-right text-neutral-500`}>{row.sheet}</td>
                    <td className={`${cell} tabular whitespace-nowrap text-right text-white`}>{row.ours}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" className={`${cell} text-left font-medium text-neutral-200`}>
                    Diferença por trabalhador
                  </th>
                  <td colSpan={2} className={`${cell} tabular whitespace-nowrap text-right font-semibold text-red-400`}>
                    {formatKz(monthlyShortfall)} / mês
                  </td>
                </tr>
              </tfoot>
            </table>
            <p className="px-3 pb-5 pt-2 text-sm leading-relaxed text-neutral-500 sm:px-5">
              No Pagador.ao, cada subsídio tem o seu limite de isenção e cada valor do recibo mostra de onde veio. Quando o OGE muda a tabela, a nova versão
              entra em vigor na data certa, sem apagar a anterior.
            </p>
          </GlowCard>
        </div>

        <ShortfallCalculator className="mt-3" />
        <p className="mt-6 text-center">
          <Mono>Exemplo ilustrativo · tabela de retenção do Grupo A, Lei n.º 28/20</Mono>
        </p>
      </div>
    </section>
  );
}
