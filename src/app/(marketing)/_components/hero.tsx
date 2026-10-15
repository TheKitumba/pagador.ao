import { CommandPalette } from "./command-palette";
import { Mono } from "./primitives";
import { StartForm } from "./start-form";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden px-4 pb-24 pt-24 sm:px-6 sm:pt-32">
      <div className="mx-auto max-w-6xl text-center">
        <h1 id="hero-title" className="mx-auto max-w-4xl text-balance text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-7xl">
          A folha de pagamento certa, sem noites no Excel.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-neutral-400">
          Vencimentos, IRT e Segurança Social segundo a lei angolana. O ficheiro para o seu banco. Um aviso antes de cada prazo da AGT e do INSS.
        </p>

        <StartForm className="mx-auto mt-10" />
        <p className="mt-4">
          <Mono>30 dias grátis · sem cartão · para empresas angolanas</Mono>
        </p>

        <CommandPalette />
      </div>
    </section>
  );
}
