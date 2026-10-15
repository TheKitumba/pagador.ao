import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/app";
import { cn } from "@/lib/utils";

import { SectionHeading } from "./section-heading";

// docs/01 (1.7). Prices are per active worker per month and not published yet.
const plans = [
  {
    name: "Essencial",
    audience: "Para micro e pequenas empresas que querem salários certos sem complicações.",
    features: ["Trabalhadores e contratos", "Folha de pagamento, IRT e INSS", "Recibos digitais", "Mapas AGT e INSS", "Férias, faltas e licenças", "Portal do trabalhador básico", "Suporte por e-mail"],
  },
  {
    name: "Profissional",
    audience: "Para empresas com várias equipas, turnos e pagamentos por banco.",
    highlighted: true,
    intro: "Tudo do Essencial, mais:",
    features: ["Ponto electrónico e escalas", "Ficheiros bancários em lote", "Recrutamento", "Avaliação de desempenho e formação", "Workflows de aprovação", "Portal do trabalhador completo", "Suporte por e-mail e telefone"],
  },
  {
    name: "Empresarial",
    audience: "Para grupos empresariais, várias províncias e integrações.",
    intro: "Tudo do Profissional, mais:",
    features: ["Multi-empresa e grupo empresarial", "Workflows avançados", "API, webhooks e SSO", "Integração com ERP", "Gestor de conta dedicado"],
  },
];

export function Plans() {
  return (
    <section aria-labelledby="planos-title" id="planos" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          id="planos-title"
          eyebrow="Planos"
          title="Pague apenas pelos trabalhadores activos"
          description="Preço mensal por trabalhador, em Kwanzas, com desconto no pagamento anual. Experimente qualquer plano durante 30 dias, sem cartão."
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-6 shadow-card sm:p-8",
                plan.highlighted && "border-primary/40 shadow-overlay ring-1 ring-primary/30",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold tracking-tight">{plan.name}</h3>
                {plan.highlighted && <Badge variant="info">Mais escolhido</Badge>}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{plan.audience}</p>
              <p className="mt-6 text-sm">
                <span className="font-semibold">Por trabalhador activo</span>
                <span className="text-muted-foreground"> / mês</span>
              </p>
              <Button asChild variant={plan.highlighted ? "default" : "outline"} className="mt-6 h-10">
                <Link href={ROUTES.register}>Começar 30 dias grátis</Link>
              </Button>
              <div className="mt-8 border-t pt-6">
                {plan.intro && <p className="mb-3 text-sm font-medium">{plan.intro}</p>}
                <ul className="space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <HugeiconsIcon icon={Tick02Icon} className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
