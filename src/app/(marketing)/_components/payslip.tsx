import { formatKz } from "@/lib/format";
import { cn } from "@/lib/utils";

import { example } from "./example";
import { GlowCard, Mono } from "./primitives";

function Line({ label, amount, className }: { label: React.ReactNode; amount: number; className?: string }) {
  return (
    <div className={cn("flex items-baseline justify-between gap-4 py-1.5", className)}>
      <dt>{label}</dt>
      <dd className="tabular whitespace-nowrap">{amount < 0 ? `− ${formatKz(-amount)}` : formatKz(amount)}</dd>
    </div>
  );
}

/** The payslip of the worked example (docs/04, 4.6), as the employee receives it. */
export function Payslip() {
  return (
    <GlowCard glow="blue" className="h-full">
      <figure className="p-6 text-sm sm:p-7">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="font-medium text-white">Recibo de vencimento</p>
            <Mono>{example.period}</Mono>
          </div>
          <Mono>{example.company}</Mono>
        </header>

        <p className="mt-5 text-neutral-300">
          {example.employee} <span className="text-neutral-500">· {example.role}</span>
        </p>

        <dl className="mt-3 text-neutral-400">
          {example.earnings.map((line) => (
            <Line key={line.label} label={line.label} amount={line.amount} />
          ))}
          <Line label="Total ilíquido" amount={example.gross} className="mt-1 border-t border-white/[0.07] pt-2.5 text-neutral-200" />
          <Line label="Segurança Social · 3%" amount={-example.socialSecurity} />
          <div className="-mx-3 mt-1 rounded-lg bg-sky-400/[0.08] px-3 ring-1 ring-sky-400/25">
            <Line label="IRT · escalão 5" amount={-example.irt} className="text-white" />
            <p className="pb-2 text-xs leading-snug text-sky-300">Inclui os 10 000 Kz do subsídio de alimentação acima do limite de isenção.</p>
          </div>
        </dl>

        <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-white/[0.07] pt-4">
          <span className="text-neutral-300">Líquido a receber</span>
          <span className="tabular text-xl font-semibold tracking-tight text-white">{formatKz(example.net)}</span>
        </div>
        <figcaption className="sr-only">Recibo de vencimento de exemplo calculado pelo Pagador.ao.</figcaption>
      </figure>
    </GlowCard>
  );
}
