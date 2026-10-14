import { HugeiconsIcon } from "@hugeicons/react";
import { Coins01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { ProgressBar, StatCard, StatGrid } from "@/components/common/cards";
import { DataTable, Money } from "@/components/common/data-table";
import { DecisionButtons } from "@/components/common/decision-buttons";
import { PageBody, PageHeader } from "@/components/common/page";
import { PersonCell } from "@/components/common/person-avatar";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { formatKz, formatKzCompact } from "@/lib/format";
import { loans } from "@/mocks/finance";

export const metadata: Metadata = { title: "Empréstimos" };

export default function LoansPage() {
  const active = loans.filter((loan) => loan.status === "active");

  return (
    <>
      <PageHeader
        title="Empréstimos"
        icon={Coins01Icon}
        description="Adiantamentos, empréstimos e penhoras"
        actions={
          <Button>
            <HugeiconsIcon icon={PlusSignIcon} aria-hidden />
            <span className="hidden sm:inline">Novo adiantamento</span>
            <span className="sr-only sm:hidden">Novo adiantamento</span>
          </Button>
        }
      />
      <PageBody>
        <StatGrid>
          <StatCard label="Em curso" value={String(active.length)} icon={Coins01Icon} tone="info" />
          <StatCard label="Capital em dívida" value={formatKzCompact(active.reduce((sum, loan) => sum + loan.balance, 0))} icon={Coins01Icon} tone="violet" />
          <StatCard label="Desconto em outubro" value={formatKzCompact(active.reduce((sum, loan) => sum + loan.installment, 0))} icon={Coins01Icon} tone="warning" hint="Respeita o limite impenhorável" />
          <StatCard label="Por aprovar" value={String(loans.filter((loan) => loan.status === "pending").length)} icon={Coins01Icon} tone="danger" />
        </StatGrid>
        <DataTable
          caption="Adiantamentos, empréstimos e penhoras"
          rows={loans}
          getRowKey={(row) => `${row.employee}-${row.type}`}
          columns={[
            { key: "employee", header: "Trabalhador", cell: (row) => <PersonCell name={row.employee} detail={row.type} /> },
            { key: "principal", header: "Montante", align: "right", hideBelow: "md", cell: (row) => <Money value={formatKz(row.principal)} muted /> },
            { key: "installment", header: "Prestação", align: "right", hideBelow: "lg", cell: (row) => <Money value={formatKz(row.installment)} /> },
            {
              key: "progress",
              header: "Prestações",
              className: "w-40",
              hideBelow: "sm",
              cell: (row) => (
                <div className="space-y-1">
                  <span className="text-xs tabular text-muted-foreground">
                    {row.paid} de {row.total}
                  </span>
                  <ProgressBar value={(row.paid / row.total) * 100} tone={row.paid === row.total ? "success" : "info"} label={`Prestações pagas por ${row.employee}`} />
                </div>
              ),
            },
            { key: "balance", header: "Em dívida", align: "right", cell: (row) => <Money value={formatKz(row.balance)} className="font-medium" /> },
            {
              key: "status",
              header: "Estado",
              align: "right",
              cell: (row) =>
                row.status === "pending" ? (
                  <DecisionButtons subject={`${row.type} de ${row.employee}`} />
                ) : (
                  <StatusBadge tone={row.status === "active" ? "info" : "success"}>{row.status === "active" ? "Em curso" : "Liquidado"}</StatusBadge>
                ),
            },
          ]}
        />
      </PageBody>
    </>
  );
}
