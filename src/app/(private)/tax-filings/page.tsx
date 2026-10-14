import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, DocumentValidationIcon, Download04Icon, FileExportIcon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { SectionCard, StatCard, StatGrid } from "@/components/common/cards";
import { DataTable, Money } from "@/components/common/data-table";
import { PageBody, PageHeader, PageTabPanel, PageTabs } from "@/components/common/page";
import { StatusBadge, type Tone } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatKz, formatKzCompact } from "@/lib/format";
import { type FilingStatus, filingStatusLabel, fiscalDeadlines, taxFilings } from "@/mocks/compliance";

export const metadata: Metadata = { title: "Mapas fiscais" };

const filingTone: Record<FilingStatus, Tone> = {
  upcoming: "neutral",
  ready: "info",
  submitted: "violet",
  paid: "success",
  overdue: "danger",
};

type Filing = (typeof taxFilings)[number];

function FilingTable({ rows }: { rows: Filing[] }) {
  return (
    <DataTable
      caption="Obrigações fiscais e contributivas"
      rows={rows}
      getRowKey={(row) => row.id}
      columns={[
        {
          key: "name",
          header: "Obrigação",
          cell: (row) => (
            <div className="flex items-center gap-3">
              <StatusBadge tone={row.authority === "AGT" ? "info" : "violet"} dot={false}>
                {row.authority}
              </StatusBadge>
              <span className="font-medium">{row.name}</span>
            </div>
          ),
        },
        { key: "due", header: "Prazo", cell: (row) => <span className="tabular">{formatDate(row.due)}</span> },
        { key: "amount", header: "Valor", align: "right", hideBelow: "md", cell: (row) => <Money value={formatKz(row.amount)} /> },
        { key: "status", header: "Estado", cell: (row) => <StatusBadge tone={filingTone[row.status]}>{filingStatusLabel[row.status]}</StatusBadge> },
        {
          key: "file",
          header: "Ficheiro",
          align: "right",
          cell: (row) => (
            <Button variant="ghost" size="icon-sm" disabled={row.status === "upcoming"} aria-label={`Descarregar ${row.name}`}>
              <HugeiconsIcon icon={Download04Icon} />
            </Button>
          ),
        },
      ]}
    />
  );
}

export default function TaxFilingsPage() {
  return (
    <>
      <PageHeader
        title="Mapas fiscais"
        icon={DocumentValidationIcon}
        description="IRT para a AGT, folha de remunerações do INSS e calendário fiscal"
        actions={
          <Button>
            <HugeiconsIcon icon={FileExportIcon} aria-hidden />
            <span className="hidden sm:inline">Gerar mapas</span>
            <span className="sr-only sm:hidden">Gerar mapas</span>
          </Button>
        }
      />
      <PageTabs
        tabs={[
          { value: "all", label: "Todas", count: taxFilings.length },
          { value: "agt", label: "AGT", count: taxFilings.filter((f) => f.authority === "AGT").length },
          { value: "inss", label: "INSS", count: taxFilings.filter((f) => f.authority === "INSS").length },
          { value: "calendar", label: "Calendário fiscal" },
        ]}
      >
        <PageBody>
          <PageTabPanel value="all" className="space-y-6">
            <StatGrid>
              <StatCard label="Próximo prazo" value="31/10" icon={Calendar03Icon} tone="warning" hint="IRT de setembro (AGT)" />
              <StatCard label="IRT a entregar" value={formatKzCompact(14_602_330.9)} icon={DocumentValidationIcon} tone="info" />
              <StatCard label="INSS de outubro" value={formatKzCompact(13_027_238.54)} icon={DocumentValidationIcon} tone="violet" hint="Até 10/11" />
              <StatCard label="Em atraso" value="0" icon={DocumentValidationIcon} tone="success" hint="Sem multas nem juros" />
            </StatGrid>
            <FilingTable rows={taxFilings} />
          </PageTabPanel>
          <PageTabPanel value="agt">
            <FilingTable rows={taxFilings.filter((f) => f.authority === "AGT")} />
          </PageTabPanel>
          <PageTabPanel value="inss">
            <FilingTable rows={taxFilings.filter((f) => f.authority === "INSS")} />
          </PageTabPanel>
          <PageTabPanel value="calendar">
            <SectionCard title="Próximos prazos" description="Recebe um alerta 10 e 3 dias antes de cada prazo">
              <ol className="relative space-y-6 border-l pl-6">
                {fiscalDeadlines.map((deadline) => (
                  <li key={deadline.title} className="relative">
                    <span aria-hidden className="absolute -left-[31px] top-1 size-3 rounded-full border-2 border-card bg-warning" />
                    <p className="text-xs font-medium tabular text-muted-foreground">
                      {formatDate(deadline.date)} · faltam {deadline.daysLeft} dias
                    </p>
                    <p className="text-sm font-semibold">{deadline.title}</p>
                    <p className="text-xs text-muted-foreground">{deadline.authority}</p>
                  </li>
                ))}
              </ol>
            </SectionCard>
          </PageTabPanel>
        </PageBody>
      </PageTabs>
    </>
  );
}
