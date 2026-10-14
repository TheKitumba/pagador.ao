import { HugeiconsIcon } from "@hugeicons/react";
import { Attachment01Icon, Invoice01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { DataTable, Money } from "@/components/common/data-table";
import { DecisionButtons } from "@/components/common/decision-buttons";
import { PageBody, PageHeader, PageTabPanel, PageTabs } from "@/components/common/page";
import { PersonCell } from "@/components/common/person-avatar";
import { StatusBadge } from "@/components/common/status-badge";
import { requestStatusTone } from "@/components/common/status-maps";
import { Button } from "@/components/ui/button";
import { formatDate, formatKz } from "@/lib/format";
import { reimbursements } from "@/mocks/finance";
import { requestStatusLabel } from "@/mocks/time";

export const metadata: Metadata = { title: "Reembolsos" };

type Reimbursement = (typeof reimbursements)[number];

function ReimbursementTable({ rows }: { rows: Reimbursement[] }) {
  return (
    <DataTable
      caption="Pedidos de reembolso"
      rows={rows}
      getRowKey={(row) => row.id}
      columns={[
        { key: "employee", header: "Trabalhador", cell: (row) => <PersonCell name={row.employee} detail={row.description} /> },
        { key: "category", header: "Categoria", hideBelow: "md", cell: (row) => <StatusBadge tone="neutral" dot={false}>{row.category}</StatusBadge> },
        { key: "date", header: "Data", hideBelow: "lg", cell: (row) => <span className="tabular">{formatDate(row.date)}</span> },
        {
          key: "receipt",
          header: "Comprovativo",
          hideBelow: "sm",
          cell: (row) =>
            row.receipt ? (
              <span className="inline-flex items-center gap-1 text-sm text-primary">
                <HugeiconsIcon icon={Attachment01Icon} className="size-4" aria-hidden />
                Anexado
              </span>
            ) : (
              <span className="text-sm font-medium text-warning-strong">Em falta</span>
            ),
        },
        { key: "amount", header: "Valor", align: "right", cell: (row) => <Money value={formatKz(row.amount)} className="font-medium" /> },
        {
          key: "status",
          header: "Estado",
          align: "right",
          cell: (row) =>
            row.status === "pending" ? (
              <DecisionButtons subject={`Reembolso ${row.id} de ${row.employee}`} />
            ) : (
              <StatusBadge tone={requestStatusTone[row.status]}>{requestStatusLabel[row.status]}</StatusBadge>
            ),
        },
      ]}
    />
  );
}

export default function ReimbursementsPage() {
  const pending = reimbursements.filter((item) => item.status === "pending");

  return (
    <>
      <PageHeader
        title="Reembolsos"
        icon={Invoice01Icon}
        description="Despesas, ajudas de custo e pagamento"
        actions={
          <Button>
            <HugeiconsIcon icon={PlusSignIcon} aria-hidden />
            <span className="hidden sm:inline">Novo pedido</span>
            <span className="sr-only sm:hidden">Novo pedido</span>
          </Button>
        }
      />
      <PageTabs
        tabs={[
          { value: "pending", label: "Por aprovar", count: pending.length },
          { value: "all", label: "Todos", count: reimbursements.length },
        ]}
      >
        <PageBody>
          <PageTabPanel value="pending">
            <ReimbursementTable rows={pending} />
          </PageTabPanel>
          <PageTabPanel value="all">
            <ReimbursementTable rows={reimbursements} />
          </PageTabPanel>
        </PageBody>
      </PageTabs>
    </>
  );
}
