import { HugeiconsIcon } from "@hugeicons/react";
import { BankIcon, Calendar03Icon, Tick02Icon } from "@hugeicons/core-free-icons";

import { Badge } from "@/components/ui/badge";
import { formatKz, initials } from "@/lib/format";
import { cn } from "@/lib/utils";

// Illustrative figures: INSS 3% (trabalhador) and 8% (empresa) on the gross; IRT from the Grupo A table.
const run = { gross: 18_450_000, irt: 2_214_000, ssEmployee: 553_500, ssEmployer: 1_476_000, employees: 48 };
const net = run.gross - run.irt - run.ssEmployee;

const steps = [
  { label: "Lançamentos", done: true },
  { label: "Cálculo", done: true },
  { label: "Aprovação", current: true },
  { label: "Pagamento" },
];

const people = [
  { name: "Ana Domingos", role: "Contabilista", net: 612_480 },
  { name: "Mário Kiala", role: "Técnico de manutenção", net: 284_950 },
  { name: "Joana Sebastião", role: "Gestora comercial", net: 905_300 },
];

/** A static, coded rendition of the payroll screen for the hero (no screenshot to keep current). */
export function ProductPreview() {
  return (
    <figure className="relative lg:py-12">
      <figcaption className="sr-only">
        Exemplo de um processamento salarial de Outubro de 2026 com 48 trabalhadores, à espera de aprovação, com o IRT e a Segurança Social calculados.
      </figcaption>

      <div aria-hidden className="relative rounded-2xl border bg-card p-1.5 shadow-overlay">
        <div className="rounded-xl border bg-background/60">
          <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
            <div>
              <p className="text-xs text-muted-foreground">Processamento salarial</p>
              <p className="text-sm font-semibold">Outubro 2026 · Mensal</p>
            </div>
            <Badge variant="warning">Em aprovação</Badge>
          </div>

          <ol className="flex items-center gap-2 border-b px-4 py-3">
            {steps.map((step, index) => (
              <li key={step.label} className="flex flex-1 items-center gap-2">
                <span
                  className={cn(
                    "inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                    step.done && "bg-success text-success-foreground",
                    step.current && "bg-primary text-primary-foreground ring-4 ring-primary/15",
                    !step.done && !step.current && "border bg-card text-muted-foreground",
                  )}
                >
                  {step.done ? <HugeiconsIcon icon={Tick02Icon} className="size-3" /> : index + 1}
                </span>
                <span className={cn("hidden text-xs sm:inline", step.current ? "font-medium" : "text-muted-foreground")}>{step.label}</span>
                {index < steps.length - 1 && <span className="h-px flex-1 bg-border" />}
              </li>
            ))}
          </ol>

          <dl className="grid grid-cols-2 gap-px border-b bg-border">
            {[
              { label: "Ilíquido", value: run.gross },
              { label: "IRT retido", value: run.irt },
              { label: "INSS (3% + 8%)", value: run.ssEmployee + run.ssEmployer },
              { label: "Líquido a pagar", value: net, strong: true },
            ].map((item) => (
              <div key={item.label} className="bg-card px-4 py-3">
                <dt className="text-[11px] text-muted-foreground">{item.label}</dt>
                <dd className={cn("tabular mt-0.5 text-base font-semibold tracking-tight", item.strong && "text-primary")}>{formatKz(item.value)}</dd>
              </div>
            ))}
          </dl>

          <ul className="divide-y">
            {people.map((person) => (
              <li key={person.name} className="flex items-center gap-3 px-4 py-2.5">
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                  {initials(person.name)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{person.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{person.role}</span>
                </span>
                <span className="tabular text-sm">{formatKz(person.net)}</span>
              </li>
            ))}
            <li className="px-4 py-2.5 text-xs text-muted-foreground">+ {run.employees - people.length} trabalhadores</li>
          </ul>
        </div>
      </div>

      <div aria-hidden className="absolute -left-8 bottom-0 hidden w-64 rounded-xl border bg-card p-3 shadow-overlay lg:block">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success-strong">
            <HugeiconsIcon icon={BankIcon} className="size-4" />
          </span>
          <div>
            <p className="text-sm font-medium">Ficheiro BAI gerado</p>
            <p className="text-xs text-muted-foreground">48 transferências validadas</p>
          </div>
        </div>
      </div>

      <div aria-hidden className="absolute -right-6 top-0 hidden w-64 rounded-xl border bg-card p-3 shadow-overlay lg:block">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-info/10 text-info-strong">
            <HugeiconsIcon icon={Calendar03Icon} className="size-4" />
          </span>
          <div>
            <p className="text-sm font-medium">Remunerações INSS</p>
            <p className="text-xs text-muted-foreground">Pronta a submeter · prazo 10/11</p>
          </div>
        </div>
      </div>
    </figure>
  );
}
