import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, BankIcon, Download04Icon, FileExportIcon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { StatCard, StatGrid } from "@/components/common/cards";
import { DataTable, Money } from "@/components/common/data-table";
import { PageBody, PageHeader, PageTabPanel, PageTabs } from "@/components/common/page";
import { StatusBadge, type Tone } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { formatKz, formatKzCompact } from "@/lib/format";
import { type BatchStatus, batchStatusLabel, paymentBatches } from "@/mocks/finance";

export const metadata: Metadata = { title: "Pagamentos" };

const batchTone: Record<BatchStatus, Tone> = {
  draft: "neutral",
  pending: "warning",
  approved: "info",
  sent: "violet",
  reconciled: "success",
  partial: "danger",
};

type Batch = (typeof paymentBatches)[number];

function BatchTable({ rows }: { rows: Batch[] }) {
  return (
    <DataTable
      caption="Lotes de pagamento"
      rows={rows}
      getRowKey={(row) => row.id}
      columns={[
        {
          key: "id",
          header: "Lote",
          cell: (row) => (
            <div>
              <div className="font-medium tabular">{row.id}</div>
              <div className="text-xs text-muted-foreground">{row.run}</div>
            </div>
          ),
        },
        { key: "bank", header: "Banco", cell: (row) => row.bank },
        { key: "format", header: "Formato do ficheiro", hideBelow: "lg", cell: (row) => <span className="text-muted-foreground">{row.format}</span> },
        { key: "count", header: "Pagamentos", align: "right", hideBelow: "md", cell: (row) => <span className="tabular">{row.instructions}</span> },
        { key: "amount", header: "Montante", align: "right", cell: (row) => <Money value={formatKz(row.amount)} className="font-medium" /> },
        { key: "status", header: "Estado", cell: (row) => <StatusBadge tone={batchTone[row.status]}>{batchStatusLabel[row.status]}</StatusBadge> },
        {
          key: "file",
          header: "Ficheiro",
          align: "right",
          cell: (row) => (
            <Button variant="ghost" size="icon-sm" aria-label={`Descarregar ficheiro do lote ${row.id}`} disabled={row.status === "draft"}>
              <HugeiconsIcon icon={Download04Icon} />
            </Button>
          ),
        },
      ]}
    />
  );
}

export default function PaymentsPage() {
  const current = paymentBatches.filter((batch) => batch.run === "Folha de outubro 2026");

  return (
    <>
      <PageHeader
        title="Pagamentos"
        icon={BankIcon}
        description="Lotes de pagamento, ficheiros bancários e reconciliação"
        actions={
          <Button>
            <HugeiconsIcon icon={FileExportIcon} aria-hidden />
            <span className="hidden sm:inline">Gerar ficheiros bancários</span>
            <span className="sr-only sm:hidden">Gerar ficheiros bancários</span>
          </Button>
        }
      />
      <PageTabs
        tabs={[
          { value: "current", label: "Outubro 2026", count: current.length },
          { value: "all", label: "Todos os lotes", count: paymentBatches.length },
        ]}
      >
        <PageBody>
          <PageTabPanel value="current" className="space-y-6">
            <StatGrid>
              <StatCard label="A pagar em outubro" value={formatKzCompact(current.reduce((sum, b) => sum + b.amount, 0))} icon={BankIcon} tone="info" hint="248 transferências em 3 bancos" />
              <StatCard label="Lotes por aprovar" value="0" icon={BankIcon} tone="warning" hint="Gerados após a aprovação da folha" />
              <StatCard label="Rejeições em setembro" value="2" icon={Alert02Icon} tone="danger" hint="IBAN encerrado (BAI)" />
              <StatCard label="Reconciliado em setembro" value="99,2%" icon={BankIcon} tone="success" />
            </StatGrid>
            <BatchTable rows={current} />
            <p className="text-xs text-muted-foreground">
              Segregação de funções: quem gera o lote não o pode aprovar. Alterações de IBAN nos 5 dias anteriores ao pagamento geram alerta ao aprovador.
            </p>
          </PageTabPanel>
          <PageTabPanel value="all">
            <BatchTable rows={paymentBatches} />
          </PageTabPanel>
        </PageBody>
      </PageTabs>
    </>
  );
}
