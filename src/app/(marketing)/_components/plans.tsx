import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/app";

import { SectionHeading } from "./section-heading";

// docs/01 (1.7). Prices are per active worker per month and not published yet.
const plans = [
  {
    name: "Essencial",
    forWho: "Até algumas dezenas de trabalhadores, salários pagos a tempo e sem erros.",
    features: ["Trabalhadores e contratos", "Folha de pagamento, IRT e INSS", "Recibos digitais", "Mapas para a AGT e o INSS", "Férias, faltas e licenças", "Portal do trabalhador básico"],
  },
  {
    name: "Profissional",
    forWho: "Várias equipas, turnos e pagamentos por ficheiro bancário.",
    intro: "Tudo do Essencial, e",
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
    <section aria-labelledby="planos-title" id="planos" className="scroll-mt-16 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading id="planos-title" kicker="Planos" title="Pague pelos trabalhadores activos. Nada mais.">
            <p>Um preço mensal por trabalhador, em Kwanzas, com desconto no pagamento anual. Experimente 30 dias, sem cartão.</p>
          </SectionHeading>
          <Button asChild size="lg" className="h-11 self-start lg:self-auto">
            <Link href={ROUTES.register}>Criar conta grátis</Link>
          </Button>
        </div>

        <div className="mt-14 grid border-t lg:grid-cols-3">
          {plans.map((plan, index) => (
            <article key={plan.name} className={index > 0 ? "border-b py-8 lg:border-b-0 lg:border-l lg:pl-8 lg:pr-4" : "border-b py-8 lg:border-b-0 lg:pr-8"}>
              <h3 className="text-xl font-semibold tracking-tight">{plan.name}</h3>
              <p className="mt-2 min-h-12 text-muted-foreground">{plan.forWho}</p>
              {plan.intro && <p className="mt-6 text-sm font-medium">{plan.intro}</p>}
              <ul className={plan.intro ? "mt-3 space-y-2.5" : "mt-6 space-y-2.5"}>
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm">
                    <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-foreground/40" />
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
