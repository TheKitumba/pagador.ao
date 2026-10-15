import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/app";

import { StartForm } from "./start-form";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border bg-card px-6 py-14 text-center shadow-card sm:px-12 sm:py-20">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-400/15 via-violet-500/10 to-fuchsia-500/15" />
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative">
            <h2 id="cta-title" className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Processe a próxima folha de pagamento no Pagador.ao
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-muted-foreground">
              Crie a conta da sua empresa, importe os trabalhadores e tenha o primeiro processamento pronto ainda hoje.
            </p>
            <StartForm className="mx-auto mt-8" />
            <p className="mt-4 text-sm text-muted-foreground">
              Já tem conta?{" "}
              <Button asChild variant="link" className="h-auto p-0">
                <Link href={ROUTES.login}>Entrar</Link>
              </Button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
