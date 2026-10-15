import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { BankIcon, Calculator01Icon, Calendar03Icon, Mail01Icon, Search01Icon, UserIcon } from "@hugeicons/core-free-icons";

import { formatKz } from "@/lib/format";
import { cn } from "@/lib/utils";

import { Keycap } from "./primitives";

interface Item {
  icon: IconSvgElement;
  tint: string;
  title: string;
  subtitle: string;
  accessory?: string;
  accessoryTone?: "warning" | "muted";
  selected?: boolean;
}

// What the app's ⌘K menu (src/layouts/command-menu.tsx) looks like at the end of October.
const groups: { heading: string; items: Item[] }[] = [
  {
    heading: "Folha de pagamento",
    items: [
      { icon: Calculator01Icon, tint: "from-sky-400 to-blue-600", title: "Aprovar folha de Outubro 2026", subtitle: `48 trabalhadores · ${formatKz(15_682_500)} líquido`, accessory: "Em aprovação", accessoryTone: "warning", selected: true },
      { icon: BankIcon, tint: "from-emerald-400 to-green-600", title: "Gerar ficheiro de transferências", subtitle: "BAI · 48 IBAN validados" },
      { icon: Mail01Icon, tint: "from-violet-400 to-purple-600", title: "Enviar recibos por e-mail", subtitle: "Depois do pagamento" },
    ],
  },
  {
    heading: "Prazos",
    items: [
      { icon: Calendar03Icon, tint: "from-amber-400 to-orange-600", title: "Folha de remunerações do INSS", subtitle: "Pronta a submeter", accessory: "até 10/11" },
      { icon: Calendar03Icon, tint: "from-rose-400 to-red-600", title: "Mapa de retenções de IRT", subtitle: "AGT", accessory: "até 30/11" },
    ],
  },
  {
    heading: "Trabalhadores",
    items: [{ icon: UserIcon, tint: "from-neutral-400 to-neutral-600", title: "Ana Domingos", subtitle: "Contabilista · Finanças" }],
  },
];

/** The hero visual: Pagador.ao as a launcher window, floating on the brand glow. */
export function CommandPalette() {
  return (
    <figure className="relative mx-auto mt-20 w-full max-w-3xl text-left">
      <div aria-hidden className="pointer-events-none absolute -inset-x-24 -bottom-24 top-16">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500/40 via-violet-500/45 to-fuchsia-500/40 blur-[100px]" />
      </div>

      <div aria-hidden className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#141518]/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur">
        <div className="flex items-center gap-3 border-b border-white/[0.07] px-5 py-4">
          <HugeiconsIcon icon={Search01Icon} className="size-5 text-neutral-500" />
          <span className="min-w-0 flex-1 truncate text-base text-neutral-500">Pesquisar páginas, acções ou trabalhadores…</span>
          <Keycap>⌘</Keycap>
          <Keycap>K</Keycap>
        </div>

        <div className="space-y-3 p-2">
          {groups.map((group) => (
            <div key={group.heading}>
              <p className="px-3 pb-1 pt-2 text-xs font-medium text-neutral-500">{group.heading}</p>
              <ul>
                {group.items.map((item) => (
                  <li
                    key={item.title}
                    className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5", item.selected && "bg-white/[0.07] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]")}
                  >
                    <span className={cn("inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-b text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]", item.tint)}>
                      <HugeiconsIcon icon={item.icon} className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm">
                      <span className="text-neutral-100">{item.title}</span>
                      <span className="hidden text-neutral-500 sm:inline"> {item.subtitle}</span>
                    </span>
                    {item.accessory && (
                      <span className={cn("shrink-0 font-mono text-xs", item.accessoryTone === "warning" ? "rounded-md bg-amber-400/10 px-1.5 py-0.5 text-amber-300" : "text-neutral-500")}>
                        {item.accessory}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.07] bg-white/[0.02] px-4 py-2.5 text-xs text-neutral-400">
          <span className="flex items-center gap-2">
            <span className="inline-flex size-5 items-center justify-center rounded bg-gradient-to-br from-sky-400 via-violet-500 to-fuchsia-500 text-[10px] font-bold text-white">P</span>
            Pagador.ao
          </span>
          <span className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              Aprovar <Keycap>↵</Keycap>
            </span>
            <span className="hidden items-center gap-1.5 sm:flex">
              Acções <Keycap>⌘</Keycap>
              <Keycap>K</Keycap>
            </span>
          </span>
        </div>
      </div>
      <figcaption className="sr-only">
        O menu de pesquisa do Pagador.ao no fim de Outubro: aprovar a folha de 48 trabalhadores, gerar o ficheiro do banco e os prazos do INSS e do IRT.
      </figcaption>
    </figure>
  );
}
