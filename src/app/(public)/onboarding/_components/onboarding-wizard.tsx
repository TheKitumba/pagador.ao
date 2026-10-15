"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Building03Icon,
  CheckmarkCircle02Icon,
  FileImportIcon,
  Invoice01Icon,
  MoneyBag02Icon,
  Tick02Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useRef, useState } from "react";

import { ProgressBar } from "@/components/common/cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/config/app";
import { cn } from "@/lib/utils";

const steps = [
  { id: "company", title: "Empresa", description: "Dados fiscais e da Segurança Social", icon: Building03Icon },
  { id: "structure", title: "Estrutura", description: "Estabelecimentos e departamentos", icon: UserGroupIcon },
  { id: "pay-items", title: "Rubricas", description: "Subsídios e descontos habituais", icon: Invoice01Icon },
  { id: "import", title: "Trabalhadores", description: "Importar a partir do Excel", icon: FileImportIcon },
  { id: "payroll", title: "Primeira folha", description: "Simular antes de processar", icon: MoneyBag02Icon },
];

export function OnboardingWizard() {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState<number[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const finished = done.length === steps.length;

  const complete = () => {
    setDone((items) => [...new Set([...items, current])]);
    if (current < steps.length - 1) {
      setCurrent(current + 1);
      requestAnimationFrame(() => headingRef.current?.focus());
    }
  };

  if (finished) {
    return (
      <div role="status" className="mx-auto max-w-md rounded-xl border bg-card p-8 text-center shadow-card">
        <HugeiconsIcon icon={CheckmarkCircle02Icon} className="mx-auto size-12 text-success" aria-hidden />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Está tudo pronto</h1>
        <p className="mt-2 text-sm text-muted-foreground">A sua empresa está configurada. Pode processar a primeira folha quando quiser.</p>
        <Button asChild className="mt-6">
          <Link href={ROUTES.dashboard}>Ir para o início</Link>
        </Button>
      </div>
    );
  }

  const step = steps[current];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Vamos configurar a sua empresa</h1>
      <p className="mt-1 text-sm text-muted-foreground">Cerca de 15 minutos. Pode parar e continuar mais tarde.</p>
      <div className="mt-4 flex items-center gap-3">
        <ProgressBar value={(done.length / steps.length) * 100} label="Progresso da configuração" />
        <span className="shrink-0 text-xs tabular text-muted-foreground">
          {done.length} de {steps.length}
        </span>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[240px_1fr]">
        <nav aria-label="Passos da configuração">
          <ol className="space-y-1">
            {steps.map((item, index) => {
              const isDone = done.includes(index);
              const active = index === current;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setCurrent(index)}
                    aria-current={active ? "step" : undefined}
                    className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left", active ? "bg-card shadow-card ring-1 ring-border" : "hover:bg-accent")}
                  >
                    <span
                      className={cn(
                        "inline-flex size-8 shrink-0 items-center justify-center rounded-lg",
                        isDone ? "bg-success/10 text-success" : active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                      )}
                    >
                      <HugeiconsIcon icon={isDone ? Tick02Icon : item.icon} className="size-4" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm font-medium">
                        {item.title}
                        {isDone && <span className="sr-only"> (concluído)</span>}
                      </span>
                      <span className="block text-xs text-muted-foreground">{item.description}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <section aria-labelledby="step-title" className="rounded-xl border bg-card shadow-card">
          <div className="border-b px-6 py-4">
            <h2 id="step-title" ref={headingRef} tabIndex={-1} className="text-lg font-semibold outline-none">
              {step.title}
            </h2>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
          <div className="space-y-4 p-6">
            {step.id === "company" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="ob-inss">N.º de contribuinte do INSS</Label>
                  <Input id="ob-inss" placeholder="0012 4478 90" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ob-payday">Dia de pagamento</Label>
                  <Input id="ob-payday" defaultValue="Último dia útil do mês" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="ob-address">Morada da sede</Label>
                  <Input id="ob-address" />
                </div>
              </div>
            )}
            {step.id === "structure" && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="ob-sites">Estabelecimentos (um por linha)</Label>
                  <textarea id="ob-sites" rows={3} className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm shadow-xs" defaultValue={"Sede — Luanda"} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ob-depts">Departamentos (um por linha)</Label>
                  <textarea id="ob-depts" rows={4} className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm shadow-xs" defaultValue={"Administração\nOperações\nFinanças"} />
                </div>
              </div>
            )}
            {step.id === "pay-items" && (
              <ul className="divide-y rounded-lg border">
                {["Subsídio de alimentação", "Subsídio de transporte", "Subsídio de férias (Julho)", "Subsídio de Natal (Dezembro)", "Horas extra"].map((item, index) => (
                  <li key={item} className="flex items-center justify-between px-4 py-3">
                    <Label htmlFor={`pi-${index}`} className="font-normal">
                      {item}
                    </Label>
                    <Switch id={`pi-${index}`} defaultChecked={index < 4} />
                  </li>
                ))}
              </ul>
            )}
            {step.id === "import" && (
              <div className="rounded-xl border border-dashed p-8 text-center">
                <HugeiconsIcon icon={FileImportIcon} className="mx-auto size-8 text-muted-foreground" aria-hidden />
                <p className="mt-3 text-sm font-medium">Arraste o ficheiro Excel ou</p>
                <label className="mt-2 inline-flex cursor-pointer items-center rounded-lg border bg-card px-3 py-1.5 text-sm font-medium shadow-xs hover:bg-accent focus-within:ring-2 focus-within:ring-ring">
                  escolha um ficheiro
                  <input type="file" accept=".xlsx,.xls,.csv" className="sr-only" />
                </label>
                <p className="mt-3 text-xs text-muted-foreground">
                  Excel ou CSV com uma linha por trabalhador. Validamos o BI, o NIF e o IBAN antes de importar.
                </p>
              </div>
            )}
            {step.id === "payroll" && (
              <p className="text-sm text-muted-foreground">
                Vamos simular a folha do mês corrente com os dados importados. Nada é pago nem submetido até aprovar. Pode comparar com a sua folha de cálculo actual.
              </p>
            )}
          </div>
          <div className="flex justify-between gap-3 border-t px-6 py-4">
            <Button variant="ghost" onClick={() => setCurrent(Math.min(current + 1, steps.length - 1))} disabled={current === steps.length - 1}>
              Saltar
            </Button>
            <Button onClick={complete}>{current === steps.length - 1 ? "Concluir" : "Guardar e continuar"}</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
