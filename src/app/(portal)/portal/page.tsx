import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, BeachIcon, Coins01Icon, Invoice01Icon, Megaphone01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";

import { IconTile, QuickActionCard, SectionCard } from "@/components/common/cards";
import { formatDate, formatKz } from "@/lib/format";

import { ClockCard } from "./_components/clock-card";

export const metadata: Metadata = { title: "Portal do trabalhador" };

export default function PortalHomePage() {
  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Olá, Ana</h1>
        <p className="text-sm text-muted-foreground">Quarta-feira, 14 de outubro</p>
      </div>

      <ClockCard />

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/portal/payslips" className="rounded-xl border bg-card p-4 shadow-card hover:bg-accent/40">
          <IconTile icon={Invoice01Icon} tone="info" />
          <p className="mt-3 text-sm text-muted-foreground">Próximo pagamento</p>
          <p className="text-xl font-semibold tabular">{formatDate("2026-10-30")}</p>
          <p className="text-xs text-muted-foreground">Último líquido: {formatKz(302_115.4)}</p>
        </Link>
        <Link href="/portal/requests" className="rounded-xl border bg-card p-4 shadow-card hover:bg-accent/40">
          <IconTile icon={BeachIcon} tone="success" />
          <p className="mt-3 text-sm text-muted-foreground">Férias disponíveis</p>
          <p className="text-xl font-semibold tabular">5 dias</p>
          <p className="text-xs text-muted-foreground">12 dias marcados de 21/12 a 08/01</p>
        </Link>
      </div>

      <section aria-labelledby="portal-actions" className="space-y-3">
        <h2 id="portal-actions" className="text-sm font-medium text-muted-foreground">
          Pedidos rápidos
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <QuickActionCard href="/portal/requests?new=leave" icon={BeachIcon} title="Pedir férias" description="Veja o saldo antes de pedir" />
          <QuickActionCard href="/portal/requests?new=advance" icon={Coins01Icon} title="Pedir adiantamento" description="Descontado no mês seguinte" />
        </div>
      </section>

      <SectionCard title="Avisos" contentClassName="px-2 pb-2">
        <ul>
          {[
            { title: "Feriado: Dia da Independência Nacional", detail: "11 de novembro · a empresa encerra" },
            { title: "Exames médicos periódicos", detail: "Marque até 30/10 com a Clínica Girassol" },
          ].map((notice) => (
            <li key={notice.title} className="flex items-center gap-3 rounded-lg px-3 py-2.5">
              <IconTile icon={Megaphone01Icon} />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{notice.title}</span>
                <span className="block text-xs text-muted-foreground">{notice.detail}</span>
              </span>
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4 text-muted-foreground" aria-hidden />
            </li>
          ))}
        </ul>
      </SectionCard>
    </>
  );
}
