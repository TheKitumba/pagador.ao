const pains = [
  "Actualizar à mão a tabela do IRT depois de cada OGE e esperar que ninguém tenha estragado a fórmula.",
  "Introduzir as transferências uma a uma no internet banking, com o IBAN copiado de um e-mail.",
  "Descobrir no dia 11 que a folha de remunerações do INSS era até dia 10.",
  "Refazer a folha porque uma falta foi comunicada depois do fecho.",
  "Procurar o contrato de um trabalhador numa pasta de arquivo, e não o encontrar.",
  "Responder pela décima vez a quem precisa do recibo de Março para o banco.",
];

/** The pain, in the reader's words. Dark band in both themes, to break the page rhythm. */
export function Problem() {
  return (
    <section aria-labelledby="o-problema-title" id="o-problema" className="scroll-mt-16 bg-neutral-950 text-neutral-100 dark:border-y dark:bg-card">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-neutral-400">O fim do mês, hoje</p>
          <h2 id="o-problema-title" className="mt-3 text-balance text-3xl font-semibold leading-[1.12] tracking-[-0.025em] sm:text-[2.5rem]">
            Se o fecho da folha é assim na sua empresa, o problema não é a sua equipa.
          </h2>
        </div>

        <ol className="mt-14 grid gap-x-12 border-t border-neutral-800 sm:grid-cols-2">
          {pains.map((pain, index) => (
            <li key={pain} className="flex gap-5 border-b border-neutral-800 py-6">
              <span aria-hidden className="tabular pt-0.5 text-sm text-neutral-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-lg leading-relaxed text-neutral-200">{pain}</p>
            </li>
          ))}
        </ol>

        <p className="mt-12 max-w-2xl text-pretty text-xl leading-relaxed text-neutral-300">
          Cada passo manual é um sítio por onde um erro entra. E na folha de pagamento os erros não ficam pequenos:{" "}
          <span className="text-white">repetem-se todos os meses, em todos os trabalhadores.</span>
        </p>
      </div>
    </section>
  );
}
