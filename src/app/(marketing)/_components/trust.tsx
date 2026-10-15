import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { AuditIcon, FingerPrintIcon, SecurityCheckIcon, Shield01Icon } from "@hugeicons/core-free-icons";

import { TwoTone } from "./primitives";

// Only safeguards implemented in api.pagador.ao today.
const safeguards: { icon: IconSvgElement; title: string; detail: string }[] = [
  { icon: SecurityCheckIcon, title: "Isolada", detail: "Cada empresa separada das outras pela própria base de dados." },
  { icon: FingerPrintIcon, title: "Verificada", detail: "Autenticação em dois passos para quem vê salários e pagamentos." },
  { icon: AuditIcon, title: "Rastreável", detail: "Quem criou, alterou ou aprovou cada valor. O registo não pode ser apagado." },
  { icon: Shield01Icon, title: "Conforme", detail: "Lei n.º 22/11: consentimentos registados e dados sensíveis mascarados." },
];

export function Trust() {
  return (
    <section aria-labelledby="seguranca-title" id="seguranca" className="scroll-mt-24 border-y border-white/[0.06] px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <TwoTone id="seguranca-title" lead="Os salários são o dado mais sensível da empresa." rest="Cada pessoa vê apenas o que o seu papel permite." />

        <dl className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-4">
          {safeguards.map((item) => (
            <div key={item.title} className="bg-[#0a0b0d] p-6 sm:p-8">
              <HugeiconsIcon icon={item.icon} className="size-6 text-white" aria-hidden />
              <dt className="mt-6 text-lg font-medium text-white">{item.title}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-neutral-400">{item.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
