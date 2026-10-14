import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, UserRemove01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { SectionCard } from "@/components/common/cards";
import { DataTable, Money } from "@/components/common/data-table";
import { PageBody, PageHeader } from "@/components/common/page";
import { PersonCell } from "@/components/common/person-avatar";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatKz } from "@/lib/format";
import { terminationStatusLabel, terminations } from "@/mocks/compliance";

export const metadata: Metadata = { title: "Cessações" };

const statusTone = { calculating: "info", approval: "warning", paid: "success" } as const;

export default function TerminationsPage() {
  return (
    <>
      <PageHeader
        title="Cessações"
        icon={UserRemove01Icon}
        description="Saídas, acertos de contas e documentos de cessação"
        actions={
          <Button>
            <HugeiconsIcon icon={PlusSignIcon} aria-hidden />
            <span className="hidden sm:inline">Iniciar cessação</span>
            <span className="sr-only sm:hidden">Iniciar cessação</span>
          </Button>
        }
      />
      <PageBody>
        <DataTable
          caption="Processos de cessação"
          rows={terminations}
          getRowKey={(row) => row.employee}
          columns={[
            { key: "employee", header: "Trabalhador", cell: (row) => <PersonCell name={row.employee} detail={row.reason} /> },
            { key: "notice", header: "Comunicação", hideBelow: "lg", cell: (row) => <span className="tabular">{formatDate(row.noticeDate)}</span> },
            { key: "last", header: "Último dia", cell: (row) => <span className="tabular">{formatDate(row.lastDay)}</span> },
            { key: "settlement", header: "Acerto de contas", align: "right", hideBelow: "sm", cell: (row) => <Money value={formatKz(row.settlement)} className="font-medium" /> },
            { key: "status", header: "Estado", cell: (row) => <StatusBadge tone={statusTone[row.status]}>{terminationStatusLabel[row.status]}</StatusBadge> },
          ]}
        />
        <SectionCard title="O que entra no acerto final de contas" description="Calculado automaticamente a partir do contrato e da assiduidade">
          <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            {[
              "Vencimento dos dias trabalhados no mês da cessação",
              "Férias vencidas e não gozadas e respectivo subsídio",
              "Proporcionais de férias e de subsídio de Natal",
              "Indemnização ou compensação, quando aplicável",
              "Aviso prévio a pagar ou a descontar",
              "Saldo de empréstimos e adiantamentos",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </SectionCard>
      </PageBody>
    </>
  );
}
