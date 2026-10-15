import Link from "next/link";

import { APP_NAME, ROUTES } from "@/config/app";

import { Brand } from "./brand";
import { sectionLinks } from "./site-header";

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="max-w-sm">
          <Brand />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Recursos humanos e folha de pagamento feitos para empresas angolanas, da micro empresa ao grupo empresarial.
          </p>
        </div>
        <nav aria-label="Produto">
          <h2 className="text-sm font-semibold">Produto</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {sectionLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover:text-foreground">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Conta">
          <h2 className="text-sm font-semibold">Conta</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link href={ROUTES.register} className="hover:text-foreground">
                Criar conta
              </Link>
            </li>
            <li>
              <Link href={ROUTES.login} className="hover:text-foreground">
                Entrar
              </Link>
            </li>
            <li>
              <a href="https://pagador.ao/termos" className="hover:text-foreground">
                Termos de utilização
              </a>
            </li>
            <li>
              <a href="https://pagador.ao/privacidade" className="hover:text-foreground">
                Política de privacidade
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground sm:px-6">
          © 2026 {APP_NAME} · Dados alojados em conformidade com a Lei n.º 22/11
        </p>
      </div>
    </footer>
  );
}
