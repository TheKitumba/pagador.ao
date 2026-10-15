import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { BankIcon, Calendar03Icon, File02Icon, Invoice01Icon, RepeatIcon, Table01Icon } from "@hugeicons/core-free-icons";

import { GlowCard, Mono, TwoTone } from "./primitives";

const pains: { icon: IconSvgElement; text: string }[] = [
  { icon: Table01Icon, text: "Actualizar à mão a tabela do IRT depois de cada OGE e esperar que ninguém tenha estragado a fórmula." },
  { icon: BankIcon, text: "Introduzir as transferências uma a uma no internet banking, com o IBAN copiado de um e-mail." },
  { icon: Calendar03Icon, text: "Descobrir no dia 11 que a folha de remunerações do INSS era até dia 10." },
  { icon: RepeatIcon, text: "Refazer a folha porque uma falta foi comunicada depois do fecho." },
  { icon: File02Icon, text: "Procurar o contrato de um trabalhador numa pasta de arquivo, e não o encontrar." },
  { icon: Invoice01Icon, text: "Responder pela décima vez a quem precisa do recibo de Março para o banco." },
];

/** The pain, in the reader's words. */
export function Problem() {
  return (
    <section aria-labelledby="o-problema-title" id="o-problema" className="scroll-mt-24 px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <TwoTone id="o-problema-title" lead="O fim do mês não devia ser assim." rest="E o problema não é a sua equipa: é o processo." />

        <ol className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pains.map((pain, index) => (
            <li key={pain.text}>
              <GlowCard className="h-full p-6">
                <div className="flex items-center justify-between">
                  <HugeiconsIcon icon={pain.icon} className="size-5 text-neutral-500" aria-hidden />
                  <Mono>{String(index + 1).padStart(2, "0")}</Mono>
                </div>
                <p className="mt-8 text-[15px] leading-relaxed text-neutral-300">{pain.text}</p>
              </GlowCard>
            </li>
          ))}
        </ol>

        <p className="mx-auto mt-16 max-w-2xl text-balance text-center text-xl leading-relaxed text-neutral-500">
          Cada passo manual é um sítio por onde um erro entra. E na folha de pagamento os erros{" "}
          <span className="text-white">repetem-se todos os meses, em todos os trabalhadores.</span>
        </p>
      </div>
    </section>
  );
}
