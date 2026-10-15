import Link from "next/link";

import { APP_NAME, ROUTES } from "@/config/app";

import { Brand } from "./brand";
import { Mono } from "./primitives";
import { sectionLinks } from "./site-header";

const columns = [
  { title: "Produto", links: sectionLinks.map((link) => ({ ...link, external: false })) },
  {
    title: "Conta",
    links: [
      { href: ROUTES.register, label: "Criar conta", external: false },
      { href: ROUTES.login, label: "Entrar", external: false },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "https://pagador.ao/termos", label: "Termos de utilização", external: true },
      { href: "https://pagador.ao/privacidade", label: "Política de privacidade", external: true },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <Brand className="text-white" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-500">Recursos humanos e folha de pagamento para empresas angolanas.</p>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-sm font-medium text-white">{column.title}</h2>
            <ul className="mt-4 space-y-3 text-sm text-neutral-500">
              {column.links.map((link) => (
                <li key={link.href}>
                  {link.external || link.href.startsWith("#") ? (
                    <a href={link.href} className="transition-colors hover:text-white">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <Mono>
          © 2026 {APP_NAME} · Dados tratados segundo a Lei n.º 22/11
        </Mono>
      </div>
    </footer>
  );
}
