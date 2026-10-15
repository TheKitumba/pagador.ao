import { GlowCard, Mono, TwoTone } from "./primitives";

// The monthly cycle (docs/04, 4.8) and the pre-approval checks (4.7), split by who does what.
const month = [
  { when: "1–20", you: "Regista admissões, alterações e prémios.", system: "Junta à folha as faltas, horas extra e férias que as chefias aprovaram." },
  { when: "25", you: "Revê a pré-folha.", system: "Assinala IBAN inválidos, salários abaixo do mínimo e trabalhadores sem NIF ou número de Segurança Social." },
  { when: "27", you: "O director financeiro aprova.", system: "Bloqueia a folha e regista quem aprovou e quando." },
  { when: "28", you: "Carrega um ficheiro no internet banking.", system: "Gera as transferências no formato do seu banco: BAI, BFA, BIC, BPC e outros." },
  { when: "Pagamento", you: "Nada.", system: "Envia o recibo a cada trabalhador e deixa-o no portal." },
  { when: "Até 10", you: "Submete no portal do INSS.", system: "Prepara a folha de remunerações e avisa antes do prazo." },
  { when: "Até 30", you: "Entrega o IRT à AGT.", system: "Prepara o mapa de retenções e avisa antes do prazo." },
];

export function YourMonth() {
  return (
    <section aria-labelledby="como-funciona-title" id="como-funciona" className="scroll-mt-24 px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <TwoTone id="como-funciona-title" lead="Você decide." rest="O Pagador.ao faz o trabalho repetitivo, do primeiro lançamento à entrega na AGT." />

        <GlowCard glow="violet" className="mt-16">
          <div aria-hidden className="hidden grid-cols-[7rem_1fr_1.5fr] gap-8 border-b border-white/[0.07] px-8 py-4 md:grid">
            <Mono>Dia</Mono>
            <Mono>Você</Mono>
            <Mono>Pagador.ao</Mono>
          </div>
          <ol>
            {month.map((step) => (
              <li key={step.when} className="grid gap-2 border-b border-white/[0.07] px-6 py-5 last:border-0 md:grid-cols-[7rem_1fr_1.5fr] md:gap-8 md:px-8">
                <p>
                  <span className="inline-flex rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-xs text-neutral-300">{step.when}</span>
                </p>
                <p className="text-neutral-500">
                  <span className="text-neutral-400 md:sr-only">Você: </span>
                  {step.you}
                </p>
                <p className="text-neutral-200">
                  <span className="text-neutral-400 md:sr-only">Pagador.ao: </span>
                  {step.system}
                </p>
              </li>
            ))}
          </ol>
        </GlowCard>
        <p className="mt-6 text-center">
          <Mono>As datas são as da sua empresa · cada etapa tem um responsável e um aviso</Mono>
        </p>
      </div>
    </section>
  );
}
