import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import type React from "react";

import { APP_NAME } from "@/config/app";

const highlights = [
  "Folha em conformidade com o IRT e a Segurança Social",
  "Ficheiros para BAI, BFA, BIC e outros bancos",
  "Mapas para a AGT e o INSS no prazo",
  "Portal do trabalhador no telemóvel",
];

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_minmax(0,560px)] xl:grid-cols-[1fr_640px]">
      <div className="flex flex-col bg-card">
        <header className="flex items-center gap-2 px-6 py-5 sm:px-10">
          <Link href="/" className="flex items-center gap-2 rounded-md font-semibold">
            <span aria-hidden className="inline-flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 via-violet-500 to-fuchsia-500 text-sm font-bold text-white">
              P
            </span>
            {APP_NAME}
          </Link>
        </header>
        <main className="flex flex-1 items-center justify-center px-6 pb-12 sm:px-10">
          <div className="w-full max-w-sm">{children}</div>
        </main>
        <footer className="px-6 py-5 text-xs text-muted-foreground sm:px-10">
          © 2026 {APP_NAME} · Dados alojados em conformidade com a Lei n.º 22/11
        </footer>
      </div>

      <aside aria-label="Sobre o pagador.ao" className="relative hidden overflow-hidden bg-muted lg:flex lg:flex-col lg:justify-end">
        <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-sky-400/30 via-violet-500/25 to-fuchsia-500/30" />
        <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative m-10 rounded-2xl border bg-card/90 p-8 shadow-overlay backdrop-blur">
          <p className="text-xl font-semibold leading-snug tracking-tight">
            Recursos humanos e folha de pagamento feitos para empresas angolanas.
          </p>
          <ul className="mt-6 space-y-3">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
