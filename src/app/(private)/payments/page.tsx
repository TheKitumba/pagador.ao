import { Alert02Icon, BankIcon, Download04Icon, FileExportIcon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { StatCard, StatGrid } from "@/components/common/cards";
import { DataTable, Money } from "@/components/common/data-table";
import { PageBody, PageHeader, PageTabPanel, PageTabs } from "@/components/common/page";
import { StatusBadge, type Tone } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { formatKz, formatKzCompact } from "@/lib/format";
import { type BatchStatus, batchStatusLabel, paymentBatches } from "@/mocks/finance";
import { DownloadButton } from "@/components/common/action-buttons";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { HeaderButton } from "@/components/common/header-button";

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

/** Simplified fixed-width preview of a bank transfer file. The API generates the real per-bank format. */
function bankFile(batch: Batch) {
  return [
    `H|${batch.bank}|${batch.format}|KIANDA LOGISTICA LDA|5417089621|${batch.id}`,
    `T|${batch.instructions}|${batch.amount.toFixed(2)}`,
    "# Pré-visualização gerada pelo pagador.ao — não submeter ao banco",
  ].join("\n");
}

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
            <DownloadButton
              iconOnly
              variant="ghost"
              label={`Descarregar ficheiro do lote ${row.id}`}
              filename={`${row.id}.txt`}
              content={bankFile(row)}
            />
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
          <ConfirmDialog
            title="Gerar ficheiros bancários?"
            description={
              <>
                <p>São criados 3 lotes (BFA, BAI e BIC) com 248 transferências da folha de outubro.</p>
                <p>Segregação de funções: quem gera os lotes não os pode aprovar. Graça Mbemba recebe o pedido de aprovação.</p>
              </>
            }
            confirmLabel="Gerar lotes"
            successTitle="Lotes gerados"
            successDescription="Enviados para aprovação do aprovador financeiro."
            trigger={<HeaderButton icon={FileExportIcon} label="Gerar ficheiros bancários" />}
          />
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
