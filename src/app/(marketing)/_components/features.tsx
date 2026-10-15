import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Analytics01Icon,
  BankIcon,
  BeachIcon,
  Calculator01Icon,
  CheckListIcon,
  Clock01Icon,
  DocumentValidationIcon,
  SmartPhone01Icon,
  UserGroupIcon,
  UserSearch01Icon,
} from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";

import { SectionHeading } from "./section-heading";

interface Feature {
  icon: IconSvgElement;
  title: string;
  description: string;
  points?: string[];
}

const highlights: Feature[] = [
  {
    icon: Calculator01Icon,
    title: "Folha de pagamento",
    description: "Cálculo automático do vencimento de cada trabalhador, com todas as rubricas explicadas: de onde veio cada valor, quem o alterou e quando.",
    points: ["IRT por grupo de tributação", "INSS de 3% e 8%", "Subsídios de férias e de Natal", "Cálculo inverso do líquido para o ilíquido", "Recibos em PDF enviados por e-mail"],
  },
  {
    icon: DocumentValidationIcon,
    title: "Obrigações fiscais e contributivas",
    description: "Um calendário fiscal com alertas antes de cada prazo, e os mapas prontos no formato que a AGT e o INSS pedem.",
    points: ["Mapa de retenções de IRT", "Folha de remunerações do INSS", "Declaração anual (Modelo 2)", "Exportação contabilística (PGC)"],
  },
];

const features: Feature[] = [
  { icon: BankIcon, title: "Pagamentos em lote", description: "Ficheiros de transferência no formato de cada banco, com o IBAN validado antes de gerar." },
  { icon: UserGroupIcon, title: "Dossiê digital do trabalhador", description: "Dados, contratos, documentos e histórico num só sítio. Importe a equipa da sua folha de cálculo." },
  { icon: Clock01Icon, title: "Assiduidade e horas extra", description: "Ponto no telemóvel, escalas e turnos, folhas de horas e aprovação das horas extraordinárias." },
  { icon: BeachIcon, title: "Férias, faltas e licenças", description: "Saldos de férias segundo a Lei Geral do Trabalho, mapa de férias e pedidos aprovados no telemóvel." },
  { icon: CheckListIcon, title: "Aprovações", description: "Fluxos por etapa para férias, adiantamentos, alterações salariais, folhas e pagamentos." },
  { icon: SmartPhone01Icon, title: "Portal do trabalhador", description: "Recibos, pedidos de férias, declarações e actualização de dados, no navegador do telemóvel." },
  { icon: UserSearch01Icon, title: "Recrutamento", description: "Página de carreiras da empresa, candidaturas com currículo e convites para entrevista." },
  { icon: Analytics01Icon, title: "Relatórios", description: "Custo total com pessoal, absentismo e rotatividade, por departamento e centro de custo." },
];

function FeatureIcon({ icon, className }: { icon: IconSvgElement; className?: string }) {
  return (
    <span className={cn("inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary", className)}>
      <HugeiconsIcon icon={icon} className="size-5" aria-hidden />
    </span>
  );
}

export function Features() {
  return (
    <section aria-labelledby="funcionalidades-title" id="funcionalidades" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          id="funcionalidades-title"
          eyebrow="Funcionalidades"
          title="Tudo o que o departamento de pessoal precisa, num só sistema"
          description="Deixe as folhas de cálculo. As regras legais angolanas vêm pré-configuradas: não precisa de ser especialista em fiscalidade."
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          {highlights.map((feature) => (
            <article key={feature.title} className="rounded-2xl border bg-card p-6 shadow-card sm:p-8">
              <FeatureIcon icon={feature.icon} />
              <h3 className="mt-5 text-lg font-semibold tracking-tight">{feature.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{feature.description}</p>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {feature.points?.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm">
                    <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-2xl border bg-card p-6 shadow-card">
              <FeatureIcon icon={feature.icon} className="size-9 rounded-lg" />
              <h3 className="mt-4 font-semibold tracking-tight">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
