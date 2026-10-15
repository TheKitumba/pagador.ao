import { SectionHeading } from "./section-heading";

// The monthly cycle from docs/04 (4.8). Dates are configurable per company.
const cycle = [
  { when: "Dias 1–20", title: "Lançamentos do mês", description: "Admissões, alterações, prémios e variáveis entram no processamento." },
  { when: "Dias 20–25", title: "Fecho da assiduidade", description: "Faltas e horas extra aprovadas passam automaticamente para a folha." },
  { when: "Dia 26", title: "Cálculo e revisão", description: "Pré-folha, alertas de inconsistências e cálculo definitivo." },
  { when: "Dia 27", title: "Aprovação", description: "O director financeiro aprova a folha, com segregação de funções." },
  { when: "Dia 28", title: "Ficheiro bancário", description: "Lote de transferências gerado e aprovado para o internet banking." },
  { when: "Último dia útil", title: "Pagamento e recibos", description: "Os trabalhadores recebem o recibo por e-mail e no portal." },
  { when: "Até dia 10", title: "Segurança Social", description: "Folha de remunerações e guia de pagamento do INSS." },
  { when: "Até ao fim do mês", title: "IRT à AGT", description: "Mapa de retenções e entrega do imposto, com alerta antes do prazo." },
];

export function PayrollCycle() {
  return (
    <section aria-labelledby="como-funciona-title" id="como-funciona" className="scroll-mt-20 border-y bg-card py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          id="como-funciona-title"
          eyebrow="Como funciona"
          title="Um mês de salários, do primeiro lançamento à entrega na AGT"
          description="O sistema cria as tarefas e os alertas de cada etapa. A sua equipa sabe sempre o que falta fazer e até quando."
        />

        <ol className="relative mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {cycle.map((step, index) => (
            <li key={step.title} className="relative pl-12">
              <span
                aria-hidden
                className="absolute left-0 top-0 inline-flex size-8 items-center justify-center rounded-full border bg-background text-sm font-semibold text-primary"
              >
                {index + 1}
              </span>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{step.when}</p>
              <h3 className="mt-1 font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
