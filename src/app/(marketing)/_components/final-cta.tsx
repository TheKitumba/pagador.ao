import { StartForm } from "./start-form";

/** Closes the story by sending the reader back to the hidden error, with their own payroll. */
export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="bg-neutral-950 text-neutral-100 dark:border-t dark:bg-card">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="max-w-3xl">
          <h2 id="cta-title" className="text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-5xl">
            Faça a folha deste mês nos dois sítios. Compare.
          </h2>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-neutral-300">
            Crie a conta, importe os trabalhadores e corra uma pré-folha. Se algum número for diferente da sua folha de cálculo, vai querer saber porquê.
          </p>
          <StartForm className="mt-10" tone="inverted" />
          <p className="mt-3 text-sm text-neutral-400">30 dias grátis, sem cartão.</p>
        </div>
      </div>
    </section>
  );
}
