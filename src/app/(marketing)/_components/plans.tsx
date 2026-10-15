import Link from "next/link";

import { ROUTES } from "@/config/app";
import { cn } from "@/lib/utils";

import { GlowCard, Mono, TwoTone, ghostButton, glossyButton } from "./primitives";

// docs/01 (1.7). Prices are per active worker per month and not published yet.
const plans = [
  {
    name: "Essencial",
    forWho: "Salários certos e a tempo, sem complicações.",
    features: ["Trabalhadores e contratos", "Folha de pagamento, IRT e INSS", "Recibos digitais", "Mapas para a AGT e o INSS", "Férias, faltas e licenças", "Portal do trabalhador básico"],
  },
  {
    name: "Profissional",
    forWho: "Várias equipas, turnos e pagamentos por banco.",
    intro: "Tudo do Essencial, e",
    lit: true,
    features: ["Ponto electrónico e escalas", "Ficheiros bancários em lote", "Recrutamento", "Desempenho e formação", "Fluxos de aprovação", "Portal do trabalhador completo"],
  },
  {
    name: "Empresarial",
    forWho: "Grupos com várias empresas, províncias e sistemas.",
    intro: "Tudo do Profissional, e",
    features: ["Multi-empresa", "Fluxos de aprovação avançados", "API, webhooks e SSO", "Integração com o ERP", "Gestor de conta dedicado"],
  },
];

export function Plans() {
  return (
    <section aria-labelledby="planos-title" id="planos" className="scroll-mt-24 px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <TwoTone id="planos-title" lead="Pague pelos trabalhadores activos." rest="Nada mais." />
        <p className="mt-6 text-center">
          <Mono>Preço mensal por trabalhador, em Kwanzas · desconto no pagamento anual · 30 dias grátis</Mono>
        </p>

        <div className="mt-16 grid gap-3 lg:grid-cols-3">
          {plans.map((plan) => (
            <GlowCard key={plan.name} glow={plan.lit ? "violet" : "none"} className={cn(plan.lit && "border-white/[0.14]")}>
              <article className="flex h-full flex-col p-6 sm:p-8">
                <h3 className="text-lg font-medium text-white">{plan.name}</h3>
                <p className="mt-2 text-sm text-neutral-400">{plan.forWho}</p>
                <p className="mt-6">
                  <Mono className="text-neutral-400">por trabalhador activo / mês</Mono>
                </p>
                <Link href={ROUTES.register} className={cn("mt-6 w-full", plan.lit ? glossyButton : ghostButton)}>
                  Começar 30 dias grátis
                </Link>
                <div className="mt-8 border-t border-white/[0.07] pt-6">
                  {plan.intro && <p className="mb-3 text-sm text-neutral-300">{plan.intro}</p>}
                  <ul className="space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-3 text-sm text-neutral-400">
                        <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-white/30" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}
