import { Mono } from "./primitives";
import { StartForm } from "./start-form";

/** Closes the story by sending the reader back to the hidden error, with their own payroll. */
export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden px-4 pb-32 pt-24 sm:px-6 sm:pt-32">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-24 -z-0 size-[28rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-sky-500/25 via-violet-500/25 to-fuchsia-500/25 blur-[100px]" />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        {/* The brand mark as a lit object, the way Raycast closes on its cube. */}
        <div aria-hidden className="relative">
          <div className="absolute inset-0 translate-y-6 rounded-[2.2rem] bg-gradient-to-br from-sky-400 via-violet-500 to-fuchsia-500 opacity-60 blur-2xl" />
          <div className="relative inline-flex size-28 items-center justify-center rounded-[2.2rem] bg-gradient-to-br from-sky-400 via-violet-500 to-fuchsia-500 text-5xl font-bold text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.45),inset_0_-6px_12px_rgba(0,0,0,0.25),0_30px_60px_-15px_rgba(0,0,0,0.9)]">
            P
          </div>
        </div>

        <h2 id="cta-title" className="mt-14 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl">
          <span className="text-white">Faça a folha deste mês nos dois sítios.</span> <span className="text-neutral-500">Compare.</span>
        </h2>
        <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-neutral-400">
          Crie a conta, importe os trabalhadores e corra uma pré-folha. Se algum número for diferente da sua folha de cálculo, vai querer saber porquê.
        </p>
        <StartForm className="mt-10" />
        <p className="mt-4">
          <Mono>30 dias grátis · sem cartão</Mono>
        </p>
      </div>
    </section>
  );
}
