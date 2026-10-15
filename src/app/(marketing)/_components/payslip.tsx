import { formatKz } from "@/lib/format";
import { cn } from "@/lib/utils";

import { example } from "./example";

function Line({ label, amount, className }: { label: React.ReactNode; amount: number; className?: string }) {
  return (
    <div className={cn("flex items-baseline justify-between gap-4 py-1.5", className)}>
      <dt>{label}</dt>
      <dd className="tabular whitespace-nowrap">{amount < 0 ? `− ${formatKz(-amount)}` : formatKz(amount)}</dd>
    </div>
  );
}

/** The payslip of the worked example, styled as the document the employee receives. */
export function Payslip() {
  return (
    <figure className="relative mx-auto w-full max-w-md lg:mx-0 lg:ml-auto">
      {/* Paper stack: two sheets behind the payslip. */}
      <div aria-hidden className="absolute inset-x-4 -bottom-3 top-3 rounded-2xl border bg-card/70" />
      <div aria-hidden className="absolute inset-x-8 -bottom-6 top-6 rounded-2xl border bg-card/40" />

      <div className="relative rounded-2xl border bg-card p-6 text-sm shadow-overlay sm:p-7">
        <header className="flex items-start justify-between gap-4 border-b pb-4">
          <div>
            <p className="font-semibold">Recibo de vencimento</p>
            <p className="text-muted-foreground">{example.period}</p>
          </div>
          <p className="text-right text-muted-foreground">{example.company}</p>
        </header>

        <p className="mt-4">
          <span className="font-medium">{example.employee}</span>
          <span className="text-muted-foreground"> · {example.role}</span>
        </p>

        <dl className="mt-3 text-muted-foreground">
          {example.earnings.map((line) => (
            <Line key={line.label} label={line.label} amount={line.amount} />
          ))}
          <Line label="Total ilíquido" amount={example.gross} className="mt-1 border-t pt-2.5 font-medium text-foreground" />
          <Line label="Segurança Social · 3%" amount={-example.socialSecurity} />
          <div className="-mx-3 rounded-lg bg-primary/[0.07] px-3 ring-1 ring-primary/20">
            <Line label="IRT · escalão 5" amount={-example.irt} className="font-medium text-foreground" />
            <p className="pb-2 text-xs leading-snug text-primary">Inclui os 10 000 Kz do subsídio de alimentação acima do limite de isenção.</p>
          </div>
        </dl>

        <div className="mt-4 flex items-baseline justify-between gap-4 border-t pt-4">
          <span className="font-medium">Líquido a receber</span>
          <span className="tabular text-xl font-semibold tracking-tight">{formatKz(example.net)}</span>
        </div>
      </div>
      <figcaption className="sr-only">Exemplo de recibo de vencimento calculado pelo Pagador.ao.</figcaption>
    </figure>
  );
}
