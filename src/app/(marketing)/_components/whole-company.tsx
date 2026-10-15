import { SectionHeading } from "./section-heading";

const modules = [
  { name: "Dossiê do trabalhador", detail: "Dados, contratos, documentos e histórico. Importe a equipa da sua folha de cálculo." },
  { name: "Assiduidade", detail: "Ponto no telemóvel, escalas, turnos e horas extra dentro dos limites legais." },
  { name: "Férias e faltas", detail: "Saldos segundo a Lei Geral do Trabalho e mapa de férias da equipa." },
  { name: "Aprovações", detail: "Férias, adiantamentos e alterações salariais, por etapas." },
  { name: "Recrutamento", detail: "Página de carreiras, candidaturas e convites para entrevista." },
  { name: "Relatórios", detail: "Custo com pessoal, absentismo e rotatividade por departamento." },
];

/** The rest of HR, anchored on one scene: a leave request approved from a phone. */
export function WholeCompany() {
  return (
    <section aria-labelledby="empresa-title" className="py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-16 px-4 sm:px-6 lg:grid-cols-[1fr_22rem] lg:items-center lg:gap-24">
        <div>
          <SectionHeading id="empresa-title" kicker="Para lá da folha" title="Os pedidos deixam de passar pela sua secretária.">
            <p>
              O trabalhador pede férias no telemóvel. A chefia aprova no telemóvel. A folha do mês já sabe. Recibos, declarações e dados pessoais ficam no
              portal do trabalhador, sem instalar nenhuma aplicação.
            </p>
          </SectionHeading>

          <dl className="mt-12 grid gap-x-10 sm:grid-cols-2">
            {modules.map((module) => (
              <div key={module.name} className="border-t py-5">
                <dt className="font-semibold">{module.name}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{module.detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        <PhoneApproval />
      </div>
    </section>
  );
}

function PhoneApproval() {
  return (
    <figure className="mx-auto w-full max-w-[20rem]">
      <div aria-hidden className="rounded-[2.5rem] border bg-card p-2.5 shadow-overlay">
        <div className="overflow-hidden rounded-[2rem] border bg-background">
          <div className="flex justify-center pt-3">
            <span className="h-1.5 w-16 rounded-full bg-border" />
          </div>
          <div className="px-5 pb-6 pt-5">
            <p className="text-xs text-muted-foreground">Aprovações · 1 pendente</p>
            <div className="mt-4 rounded-2xl border bg-card p-4 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">MK</span>
                <div>
                  <p className="text-sm font-medium">Mário Kiala</p>
                  <p className="text-xs text-muted-foreground">Pedido de férias</p>
                </div>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Período</dt>
                  <dd>3 a 14 Nov</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Dias úteis</dt>
                  <dd className="tabular">10</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Saldo depois</dt>
                  <dd className="tabular">12 dias</dd>
                </div>
              </dl>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <span className="inline-flex h-10 items-center justify-center rounded-lg border text-sm font-medium">Recusar</span>
                <span className="inline-flex h-10 items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground">Aprovar</span>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">A folha de Novembro é actualizada ao aprovar.</p>
          </div>
        </div>
      </div>
      <figcaption className="sr-only">Uma chefia aprova um pedido de férias de 10 dias úteis no telemóvel.</figcaption>
    </figure>
  );
}
