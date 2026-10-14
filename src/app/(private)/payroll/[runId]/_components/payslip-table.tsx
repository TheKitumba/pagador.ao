"use client";

import Link from "next/link";

import { DataTable, Money } from "@/components/common/data-table";
import { PersonCell } from "@/components/common/person-avatar";
import { StatusBadge } from "@/components/common/status-badge";
import { matches, useSearchQuery } from "@/components/common/toolbar";
import { formatKz } from "@/lib/format";
import { type Payslip, payslips } from "@/mocks/payroll";

const statusMeta = {
  ok: { label: "Sem alertas", tone: "success" as const },
  warning: { label: "Aviso", tone: "warning" as const },
  blocking: { label: "Bloqueado", tone: "danger" as const },
};

export function PayslipTable({ runId }: { runId: string }) {
  const query = useSearchQuery();
  const rows = payslips.filter((payslip) => payslip.runId === runId && matches(query, payslip.employee.name, payslip.employee.number));

  return (
    <DataTable<Payslip>
      caption="Recibos do processamento"
      rows={rows}
      getRowKey={(row) => row.id}
      rowClassName={(row) => (row.status === "blocking" ? "bg-destructive/[0.03]" : undefined)}
      footer={<span>{rows.length} recibos</span>}
      columns={[
        {
          key: "employee",
          header: "Trabalhador",
          cell: (row) => <PersonCell name={row.employee.name} detail={row.issue ?? row.employee.position} href={`/payroll/${runId}/payslips/${row.id}`} />,
        },
        { key: "gross", header: "Ilíquido", align: "right", hideBelow: "md", cell: (row) => <Money value={formatKz(row.gross)} muted /> },
        { key: "ss", header: "Seg. Social", align: "right", hideBelow: "xl", cell: (row) => <Money value={formatKz(row.socialSecurity)} muted /> },
        { key: "irt", header: "IRT", align: "right", hideBelow: "lg", cell: (row) => <Money value={formatKz(row.irt)} muted /> },
        { key: "net", header: "Líquido", align: "right", cell: (row) => <Money value={formatKz(row.net)} className="font-medium" /> },
        { key: "status", header: "Estado", cell: (row) => <StatusBadge tone={statusMeta[row.status].tone}>{statusMeta[row.status].label}</StatusBadge> },
        {
          key: "open",
          header: "Recibo",
          align: "right",
          hideBelow: "sm",
          cell: (row) => (
            <Link href={`/payroll/${runId}/payslips/${row.id}`} className="text-sm font-medium text-primary hover:underline">
              Abrir<span className="sr-only"> recibo de {row.employee.name}</span>
            </Link>
          ),
        },
      ]}
    />
  );
}
