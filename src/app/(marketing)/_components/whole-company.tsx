import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Analytics01Icon, BeachIcon, CheckListIcon, Clock01Icon, Folder01Icon, UserSearch01Icon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";

import { type Glow, GlowCard, Mono, TwoTone } from "./primitives";

const modules: { icon: IconSvgElement; glow: Glow; tint: string; name: string; detail: string }[] = [
  { icon: Folder01Icon, glow: "blue", tint: "from-sky-400 to-blue-600", name: "Dossiê do trabalhador", detail: "Dados, contratos e documentos num só sítio. Importe a equipa da sua folha de cálculo." },
  { icon: Clock01Icon, glow: "green", tint: "from-emerald-400 to-green-600", name: "Assiduidade", detail: "Ponto no telemóvel, escalas, turnos e horas extra dentro dos limites legais." },
  { icon: BeachIcon, glow: "amber", tint: "from-amber-300 to-orange-500", name: "Férias e faltas", detail: "Saldos segundo a Lei Geral do Trabalho e mapa de férias da equipa." },
  { icon: CheckListIcon, glow: "violet", tint: "from-violet-400 to-purple-600", name: "Aprovações", detail: "Férias, adiantamentos e alterações salariais, por etapas." },
  { icon: UserSearch01Icon, glow: "pink", tint: "from-pink-400 to-rose-600", name: "Recrutamento", detail: "Página de carreiras, candidaturas e convites para entrevista." },
  { icon: Analytics01Icon, glow: "cyan", tint: "from-cyan-300 to-teal-600", name: "Relatórios", detail: "Custo com pessoal, absentismo e rotatividade por departamento." },
];

export function AppIcon({ icon, tint, className }: { icon: IconSvgElement; tint: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-b text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_20px_-6px_rgba(0,0,0,0.8)]",
        tint,
        className,
      )}
    >
      <HugeiconsIcon icon={icon} className="size-5" aria-hidden />
    </span>
  );
}

/** The rest of HR as an "extensions" grid, anchored on one scene: a leave request approved from a phone. */
export function WholeCompany() {
  return (
    <section aria-labelledby="empresa-title" className="px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <TwoTone id="empresa-title" lead="Os pedidos deixam de passar pela sua secretária." rest="Pedem e aprovam no telemóvel." />

        <div className="mt-16 grid gap-3 lg:grid-cols-3 lg:grid-rows-3">
          <GlowCard glow="violet" from="bottom" className="lg:row-span-3">
            <div className="flex h-full flex-col p-6 sm:p-8">
              <p className="font-medium text-white">Portal do trabalhador</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">Recibos, pedidos e dados pessoais no navegador do telemóvel. Sem instalar nada.</p>
              <PhoneApproval />
            </div>
          </GlowCard>

          {modules.map((module) => (
            <GlowCard key={module.name} glow={module.glow} className="p-6">
              <AppIcon icon={module.icon} tint={module.tint} />
              <h3 className="mt-5 font-medium text-white">{module.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-400">{module.detail}</p>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function PhoneApproval() {
  return (
    <figure className="mx-auto mt-8 w-full max-w-[17rem] flex-1">
      <div aria-hidden className="rounded-[2.25rem] border border-white/10 bg-[#141518] p-2 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]">
        <div className="rounded-[1.8rem] border border-white/[0.06] bg-[#0b0c0e] px-4 pb-5 pt-3">
          <div className="flex justify-center">
            <span className="h-1.5 w-14 rounded-full bg-white/10" />
          </div>
          <Mono className="mt-4 block">Aprovações · 1 pendente</Mono>
          <div className="mt-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-xs font-medium text-neutral-300">MK</span>
              <div>
                <p className="text-sm font-medium text-white">Mário Kiala</p>
                <p className="text-xs text-neutral-500">Pedido de férias</p>
              </div>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-500">Período</dt>
                <dd className="text-neutral-200">3 a 14 Nov</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Dias úteis</dt>
                <dd className="tabular text-neutral-200">10</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Saldo depois</dt>
                <dd className="tabular text-neutral-200">12 dias</dd>
              </div>
            </dl>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <span className="inline-flex h-9 items-center justify-center rounded-lg border border-white/10 text-sm text-neutral-300">Recusar</span>
              <span className="inline-flex h-9 items-center justify-center rounded-lg bg-gradient-to-b from-white to-neutral-300 text-sm font-medium text-neutral-900">Aprovar</span>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="sr-only">Uma chefia aprova no telemóvel um pedido de férias de 10 dias úteis.</figcaption>
    </figure>
  );
}
