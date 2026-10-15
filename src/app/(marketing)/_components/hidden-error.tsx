import { formatKz } from "@/lib/format";

import { correct, example, monthlyShortfall, spreadsheet } from "./example";
import { SectionHeading } from "./section-heading";
import { ShortfallCalculator } from "./shortfall-calculator";

const rows = [
  { label: "Subsídio de alimentação tributável", sheet: formatKz(0), ours: formatKz(example.taxableAllowance) },
  { label: "Matéria colectável", sheet: formatKz(spreadsheet.taxableBase), ours: formatKz(correct.taxableBase) },
  { label: "Escalão do IRT", sheet: spreadsheet.bracket, ours: correct.bracket },
  { label: "IRT retido", sheet: formatKz(spreadsheet.irt), ours: formatKz(correct.irt), strong: true },
];

/** The turn of the story: one realistic mistake, made visible, then scaled to the reader's company. */
export function HiddenError() {
  return (
    <section aria-labelledby="erro-title" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="erro-title" kicker="Um exemplo com o recibo acima" title={`Um erro de ${formatKz(monthlyShortfall)} que ninguém vê, todos os meses.`}>
          <p>
            A Ana recebe 40 000 Kz de subsídio de alimentação. O Código do IRT só isenta os primeiros 30 000 Kz. Numa folha de cálculo que trata o
            subsídio todo como isento, o salário dela cai para o escalão de baixo e o IRT retido fica mais baixo do que devia.
          </p>
        </SectionHeading>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
            <table className="w-full text-[13px] sm:text-sm">
              <caption className="sr-only">IRT de Outubro calculado numa folha de cálculo e no Pagador.ao</caption>
              <thead>
                <tr className="border-b text-left">
                  <th scope="col" className="px-3 py-3.5 sm:px-6 sm:py-4 font-medium text-muted-foreground">
                    Outubro · {example.employee}
                  </th>
                  <th scope="col" className="px-3 py-3.5 sm:px-6 sm:py-4 text-right font-medium text-muted-foreground">
                    Folha de cálculo
                  </th>
                  <th scope="col" className="px-3 py-3.5 sm:px-6 sm:py-4 text-right font-semibold">
                    Pagador.ao
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b last:border-0">
                    <th scope="row" className="px-3 py-3.5 sm:px-6 sm:py-4 text-left font-normal text-muted-foreground">
                      {row.label}
                    </th>
                    <td className="tabular whitespace-nowrap px-3 py-3.5 text-right sm:px-6 sm:py-4 text-muted-foreground">{row.sheet}</td>
                    <td className={row.strong ? "tabular whitespace-nowrap px-3 py-3.5 text-right sm:px-6 sm:py-4 font-semibold" : "tabular whitespace-nowrap px-3 py-3.5 text-right sm:px-6 sm:py-4"}>{row.ours}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-destructive/[0.06]">
                  <th scope="row" className="px-3 py-3.5 sm:px-6 sm:py-4 text-left font-medium">
                    Diferença por trabalhador
                  </th>
                  <td colSpan={2} className="tabular whitespace-nowrap px-3 py-3.5 text-right sm:px-6 sm:py-4 font-semibold text-destructive-strong">
                    {formatKz(monthlyShortfall)} / mês
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <ShortfallCalculator />
        </div>

        <p className="mt-10 max-w-2xl text-pretty text-lg leading-relaxed">
          No Pagador.ao, cada subsídio tem o seu limite de isenção, e cada valor do recibo mostra de onde veio. Quando o OGE muda a tabela, a nova versão
          entra em vigor na data certa, sem apagar a anterior.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">Exemplo ilustrativo com a tabela de retenção do Grupo A (Lei n.º 28/20).</p>
      </div>
    </section>
  );
}
