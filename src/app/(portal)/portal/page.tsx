import { ArrowRight01Icon, BeachIcon, Coins01Icon, Invoice01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";

import { IconTile, QuickActionCard, SectionCard } from "@/components/common/cards";
import { formatDate, formatKz } from "@/lib/format";

import { NoticeSheet } from "./_components/notice-sheet";

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
            {
              title: "Feriado: Dia da Independência Nacional",
              detail: "11 de novembro · a empresa encerra",
              body: "No dia 11 de novembro a empresa encerra em todos os estabelecimentos. As equipas de turno no Armazém do Lobito recebem a escala especial da chefia.",
            },
            {
              title: "Exames médicos periódicos",
              detail: "Marque até 30/10 com a Clínica Girassol",
              body: "Os exames periódicos são obrigatórios e pagos pela empresa. Marque pelo telefone +244 222 000 111 indicando o seu número de trabalhador.",
            },
          ].map((notice) => (
            <li key={notice.title}>
              <NoticeSheet title={notice.title} detail={notice.detail} body={notice.body} />
            </li>
          ))}
        </ul>
      </SectionCard>
    </>
  );
}
