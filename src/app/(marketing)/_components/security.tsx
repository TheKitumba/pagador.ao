import { HugeiconsIcon } from "@hugeicons/react";
import { AuditIcon, CloudServerIcon, FingerPrintIcon, LockIcon, SecurityCheckIcon, Shield01Icon } from "@hugeicons/core-free-icons";

import { SectionHeading } from "./section-heading";

// docs/08 (8.1, 8.2 and 8.9).
const safeguards = [
  { icon: Shield01Icon, title: "Lei n.º 22/11", description: "Consentimentos registados, dados sensíveis mascarados e exportação dos dados a pedido do titular." },
  { icon: LockIcon, title: "Dados cifrados", description: "Comunicações por TLS e dados cifrados em repouso. Palavras-passe guardadas com Argon2id." },
  { icon: FingerPrintIcon, title: "Autenticação em dois passos", description: "Obrigatória para quem tem acesso a dados financeiros." },
  { icon: SecurityCheckIcon, title: "Cada empresa isolada", description: "O isolamento entre clientes é garantido na própria base de dados." },
  { icon: AuditIcon, title: "Registo de auditoria", description: "Quem viu, criou ou alterou o quê, e quando. Registo imutável, conservado pelo prazo legal." },
  { icon: CloudServerIcon, title: "Cópias de segurança diárias", description: "Cifradas, com retenção de 30 dias e teste de reposição todos os meses." },
];

export function Security() {
  return (
    <section aria-labelledby="seguranca-title" id="seguranca" className="scroll-mt-20 border-y bg-card py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <SectionHeading
          id="seguranca-title"
          eyebrow="Segurança e privacidade"
          title="Salários e dados pessoais protegidos"
          description="A informação do pessoal é a mais sensível da empresa. Tratamo-la com o rigor que a banca e o sector petrolífero exigem."
          className="text-left lg:mx-0"
        />
        <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
          {safeguards.map((item) => (
            <li key={item.title} className="flex gap-4">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background text-foreground">
                <HugeiconsIcon icon={item.icon} className="size-4" aria-hidden />
              </span>
              <div>
                <h3 className="font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
