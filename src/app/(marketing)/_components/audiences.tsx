import { SectionHeading } from "./section-heading";

// docs/01 (1.3 and 1.4.2).
const audiences = [
  { who: "Direcção", gain: "Custo total com pessoal em tempo real, previsões e conformidade legal garantida." },
  { who: "Recursos humanos", gain: "Processos digitais, dossiê único do trabalhador e menos tarefas repetitivas." },
  { who: "Contabilidade e finanças", gain: "Folha calculada automaticamente, mapas fiscais prontos e exportação contabilística." },
  { who: "Chefias", gain: "Aprovação de férias, faltas e horas extra no telemóvel." },
  { who: "Trabalhadores", gain: "Recibos, férias, declarações e actualização de dados, sem ir aos recursos humanos." },
];

const sectors = [
  "Petróleo e gás",
  "Construção civil",
  "Comércio e retalho",
  "Banca e seguros",
  "Saúde",
  "Segurança privada",
  "Agricultura",
  "Educação",
  "Hotelaria e restauração",
  "ONG",
  "Sector público",
];

export function Audiences() {
  return (
    <section aria-labelledby="para-quem-title" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          id="para-quem-title"
          eyebrow="Para toda a empresa"
          title="Simples para a micro empresa, poderoso para o grupo"
          description="Da cantina de bairro ao grupo empresarial com milhares de trabalhadores, em qualquer uma das 21 províncias."
        />

        <dl className="mt-14 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-5">
          {audiences.map((audience) => (
            <div key={audience.who} className="bg-card p-6">
              <dt className="font-semibold tracking-tight">{audience.who}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{audience.gain}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">Preparado para as particularidades de cada sector: turnos, rotações, trabalho sazonal, escalas e expatriados.</p>
          <ul className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-2">
            {sectors.map((sector) => (
              <li key={sector} className="rounded-full border bg-card px-3 py-1 text-sm">
                {sector}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
