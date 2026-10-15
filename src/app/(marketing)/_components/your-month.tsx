import { SectionHeading } from "./section-heading";

// The monthly cycle (docs/04, 4.8) and the pre-approval checks (4.7), split by who does what.
const month = [
  {
    when: "Ao longo do mês",
    you: "Regista admissões, alterações e prémios quando acontecem.",
    system: "Junta à folha as faltas, as horas extra e as férias que as chefias aprovaram no telemóvel.",
  },
  {
    when: "Dia 25",
    you: "Revê a pré-folha.",
    system: "Assinala o que pode correr mal: IBAN inválido, salário abaixo do mínimo, trabalhador sem NIF ou sem número de Segurança Social.",
  },
  {
    when: "Dia 27",
    you: "O director financeiro aprova.",
    system: "Bloqueia a folha e regista quem aprovou e quando. Ninguém altera um valor sem deixar rasto.",
  },
  {
    when: "Dia 28",
    you: "Carrega um ficheiro no internet banking.",
    system: "Gera as transferências no formato do seu banco: BAI, BFA, BIC, BPC, Millennium Atlântico e outros.",
  },
  {
    when: "Dia do pagamento",
    you: "Nada.",
    system: "Envia o recibo a cada trabalhador por e-mail e deixa-o no portal, para sempre.",
  },
  {
    when: "Até dia 10",
    you: "Submete no portal do INSS.",
    system: "Prepara a folha de remunerações e avisa-o antes do prazo.",
  },
  {
    when: "Até ao fim do mês",
    you: "Entrega o IRT à AGT.",
    system: "Prepara o mapa de retenções e avisa-o antes do prazo.",
  },
];

export function YourMonth() {
  return (
    <section aria-labelledby="como-funciona-title" id="como-funciona" className="scroll-mt-16 border-y bg-card py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="como-funciona-title" kicker="Como fica o seu mês" title="Você decide. O sistema faz o trabalho repetitivo.">
          <p>As datas são as da sua empresa. Para cada etapa há uma tarefa, um responsável e um aviso antes do prazo.</p>
        </SectionHeading>

        <div className="mt-14">
          <div aria-hidden className="hidden grid-cols-[10rem_1fr_1.4fr] gap-8 border-b pb-3 text-sm font-medium text-muted-foreground md:grid">
            <span>Quando</span>
            <span>Você</span>
            <span>Pagador.ao</span>
          </div>
          <ol>
            {month.map((step) => (
              <li key={step.when} className="grid gap-2 border-b py-6 md:grid-cols-[10rem_1fr_1.4fr] md:gap-8">
                <p className="text-sm font-semibold">{step.when}</p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground md:sr-only">Você: </span>
                  {step.you}
                </p>
                <p>
                  <span className="font-medium md:sr-only">Pagador.ao: </span>
                  {step.system}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
