import Link from "next/link";
import type React from "react";

import { APP_NAME, ROUTES } from "@/config/app";

import { NightBody } from "./night-body";

/**
 * Sign-in, sign-up and recovery, in the public site's night theme (after raycast.com): one card
 * on a near-black page, lit by the brand glow.
 */
export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark theme-night relative flex min-h-dvh flex-col overflow-hidden bg-background text-foreground [color-scheme:dark]">
      <NightBody />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[26rem] w-[44rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-gradient-to-r from-sky-500/20 via-violet-500/25 to-fuchsia-500/20 blur-[110px]" />

      <header className="relative flex items-center justify-between px-5 py-5 sm:px-8">
        <Link href={ROUTES.home} className="flex items-center gap-2 rounded-md text-sm font-semibold text-white">
          <span aria-hidden className="inline-flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 via-violet-500 to-fuchsia-500 text-xs font-bold text-white">
            P
          </span>
          {APP_NAME}
        </Link>
        <Link href={ROUTES.home} className="text-sm text-muted-foreground transition-colors hover:text-white">
          Voltar ao site
        </Link>
      </header>

      <main className="relative flex flex-1 flex-col items-center px-4 pb-16 pt-6 sm:pt-10">
        <div aria-hidden className="relative">
          <div className="absolute inset-0 translate-y-3 rounded-[1.1rem] bg-gradient-to-br from-sky-400 via-violet-500 to-fuchsia-500 opacity-50 blur-xl" />
          <span className="relative inline-flex size-14 items-center justify-center rounded-[1.1rem] bg-gradient-to-br from-sky-400 via-violet-500 to-fuchsia-500 text-2xl font-bold text-white shadow-[inset_0_1.5px_0_rgba(255,255,255,0.45),inset_0_-4px_8px_rgba(0,0,0,0.25)]">
            P
          </span>
        </div>

        <div className="relative mt-8 w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.08] bg-card shadow-[0_30px_80px_-24px_rgba(0,0,0,0.9)]">
          <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="p-6 sm:p-8">{children}</div>
        </div>
      </main>

      <footer className="relative px-5 pb-6 text-center font-mono text-xs text-muted-foreground sm:px-8">
        © 2026 {APP_NAME} · Dados tratados segundo a Lei n.º 22/11
      </footer>
    </div>
  );
}
