import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";

import { ProductPreview } from "./product-preview";
import { StartForm } from "./start-form";

const reassurances = ["30 dias grátis", "Sem cartão", "Configuração em minutos"];

const banks = ["BAI", "BFA", "BIC", "BPC", "Millennium Atlântico", "Standard Bank", "Banco Sol", "Banco Keve"];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[480px] w-[880px] -translate-x-1/2 rounded-full bg-gradient-to-br from-sky-400/20 via-violet-500/15 to-fuchsia-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.6)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.6)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pb-28 lg:pt-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs">
            <span className="size-1.5 rounded-full bg-success" aria-hidden />
            IRT e Segurança Social segundo a legislação angolana
          </p>
          <h1 id="hero-title" className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
            A folha de pagamento da sua empresa,{" "}
            <span className="bg-gradient-to-r from-sky-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">certa e a tempo.</span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Recursos humanos do recrutamento à cessação do contrato. Calcule salários com o IRT e o INSS correctos, pague por ficheiro bancário e entregue os mapas à AGT e ao INSS dentro do prazo.
          </p>

          <StartForm className="mt-8" />

          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {reassurances.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4 text-success" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <ProductPreview />
      </div>

      <div className="border-y bg-card/60">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">Ficheiros de pagamento prontos para o seu banco</p>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {banks.map((bank) => (
              <li key={bank} className="text-base font-semibold tracking-tight text-muted-foreground/80">
                {bank}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
