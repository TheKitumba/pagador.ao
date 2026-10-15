import type { Metadata } from "next";
import Link from "next/link";

import { APP_NAME, ROUTES } from "@/config/app";

import { OnboardingWizard } from "./_components/onboarding-wizard";

export const metadata: Metadata = { title: "Configurar a empresa" };

export default function OnboardingPage() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="flex h-14 items-center justify-between border-b bg-card px-4 md:px-6">
        <span className="flex items-center gap-2 font-semibold">
          <span aria-hidden className="inline-flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 via-violet-500 to-fuchsia-500 text-xs font-bold text-white">
            P
          </span>
          {APP_NAME}
        </span>
        <Link href={ROUTES.dashboard} className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Terminar mais tarde
        </Link>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <OnboardingWizard />
      </main>
    </div>
  );
}
