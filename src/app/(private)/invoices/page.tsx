import { Invoice03Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { DataTable, Money } from "@/components/common/data-table";
import { PageBody, PageHeader, PageTabPanel, PageTabs } from "@/components/common/page";
import { StatusBadge, type Tone } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatKz } from "@/lib/format";
import { type InvoiceStatus, invoices } from "@/mocks/finance";
import { FormDialog } from "@/components/common/form-dialog";
import { HeaderButton } from "@/components/common/header-button";
import { forms } from "@/config/forms";

export const metadata: Metadata = { title: "Faturas" };

const invoiceStatus: Record<InvoiceStatus, { label: string; tone: Tone }> = {
  pending: { label: "Por aprovar", tone: "warning" },
  approved: { label: "Aprovada", tone: "info" },
  paid: { label: "Paga", tone: "success" },
  overdue: { label: "Vencida", tone: "danger" },
};

type Invoice = (typeof invoices)[number];

function InvoiceTable({ rows }: { rows: Invoice[] }) {
  return (
    <DataTable
      caption="Facturas"
      rows={rows}
      getRowKey={(row) => row.id}
      columns={[
        {
          key: "supplier",
          header: "Fornecedor",
          cell: (row) => (
            <div>
              <div className="font-medium">{row.supplier}</div>
              <div className="text-xs text-muted-foreground">
                {row.id} · {row.description}
              </div>
            </div>
          ),
        },
        { key: "kind", header: "Tipo", hideBelow: "lg", cell: (row) => <StatusBadge tone="neutral" dot={false}>{row.kind}</StatusBadge> },
        { key: "due", header: "Vencimento", hideBelow: "sm", cell: (row) => <span className="tabular">{formatDate(row.due)}</span> },
        { key: "withholding", header: "Retenção na fonte", align: "right", hideBelow: "md", cell: (row) => <Money value={row.withholding ? formatKz(row.withholding) : "—"} muted /> },
        { key: "amount", header: "Valor", align: "right", cell: (row) => <Money value={formatKz(row.amount)} className="font-medium" /> },
        { key: "status", header: "Estado", cell: (row) => <StatusBadge tone={invoiceStatus[row.status].tone}>{invoiceStatus[row.status].label}</StatusBadge> },
      ]}
    />
  );
}

export default function InvoicesPage() {
  return (
    <>
      <PageHeader
        title="Faturas"
        icon={Invoice03Icon}
        description="Facturas de prestadores e da subscrição"
        actions={
          <FormDialog {...forms.invoice} trigger={<HeaderButton icon={PlusSignIcon} label="Registar factura" />} />
        }
      />
      <PageTabs
        tabs={[
          { value: "contractors", label: "Prestadores", count: invoices.filter((i) => i.kind !== "Subscrição").length },
          { value: "subscription", label: "Subscrição", count: invoices.filter((i) => i.kind === "Subscrição").length },
        ]}
      >
        <PageBody>
          <PageTabPanel value="contractors">
            <InvoiceTable rows={invoices.filter((i) => i.kind !== "Subscrição")} />
          </PageTabPanel>
          <PageTabPanel value="subscription">
            <InvoiceTable rows={invoices.filter((i) => i.kind === "Subscrição")} />
          </PageTabPanel>
        </PageBody>
      </PageTabs>
    </>
  );
}
