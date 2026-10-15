import Link from "next/link";

import { ROUTES } from "@/config/app";

import { Brand } from "./brand";

export const sectionLinks = [
  { href: "#o-problema", label: "Porquê" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#seguranca", label: "Segurança" },
  { href: "#planos", label: "Planos" },
  { href: "#perguntas", label: "Perguntas" },
];

/** Floating, bordered navigation bar. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 rounded-2xl border border-white/[0.08] bg-[#0c0d10]/80 pl-4 pr-2 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:h-16 sm:pl-6 sm:pr-3">
        <Brand className="text-white" />
        <nav aria-label="Secções" className="hidden items-center gap-1 md:flex">
          {sectionLinks.map((link) => (
            <a key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-sm text-neutral-400 transition-colors hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link href={ROUTES.login} className="rounded-lg px-3 py-2 text-sm text-neutral-400 transition-colors hover:text-white">
            Entrar
          </Link>
          <Link
            href={ROUTES.register}
            className="inline-flex h-9 items-center rounded-lg bg-gradient-to-b from-white to-neutral-300 px-3.5 text-sm font-medium text-neutral-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_0_0_1px_rgba(0,0,0,0.5)] hover:to-neutral-200"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </header>
  );
}
