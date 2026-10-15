import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/app";

import { Brand } from "./brand";

export const sectionLinks = [
  { href: "#o-problema", label: "Porquê" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#seguranca", label: "Segurança" },
  { href: "#planos", label: "Planos" },
  { href: "#perguntas", label: "Perguntas" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Brand />
        <nav aria-label="Secções" className="hidden items-center gap-1 md:flex">
          {sectionLinks.map((link) => (
            <a key={link.href} href={link.href} className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href={ROUTES.login}>Entrar</Link>
          </Button>
          <Button asChild size="sm">
            <Link href={ROUTES.register}>Criar conta</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
