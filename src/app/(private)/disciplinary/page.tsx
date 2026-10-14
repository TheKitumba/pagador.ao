import { HugeiconsIcon } from "@hugeicons/react";
import { JusticeScale01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { DataTable } from "@/components/common/data-table";
import { PageBody, PageHeader } from "@/components/common/page";
import { PersonCell } from "@/components/common/person-avatar";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { disciplinaryCases } from "@/mocks/management";

export const metadata: Metadata = { title: "Disciplina" };

export default function DisciplinaryPage() {
  return (
    <>
      <PageHeader
        title="Disciplina"
        icon={JusticeScale01Icon}
        description="Processos disciplinares e prazos"
        actions={
          <Button>
            <HugeiconsIcon icon={PlusSignIcon} aria-hidden />
            <span className="hidden sm:inline">Abrir processo</span>
            <span className="sr-only sm:hidden">Abrir processo</span>
          </Button>
        }
      />
      <PageBody>
        <p className="rounded-xl border bg-card p-4 text-sm text-muted-foreground shadow-card">
          Acesso restrito: os processos disciplinares são dados sensíveis e só são visíveis para quem tem a permissão explícita.
        </p>
        <DataTable
          caption="Processos disciplinares"
          rows={disciplinaryCases}
          getRowKey={(row) => row.id}
          columns={[
            { key: "id", header: "Processo", cell: (row) => <span className="font-medium tabular">{row.id}</span> },
            { key: "employee", header: "Trabalhador", cell: (row) => <PersonCell name={row.employee} detail={row.infraction} /> },
            { key: "stage", header: "Fase", hideBelow: "md", cell: (row) => row.stage },
            { key: "deadline", header: "Próximo prazo", hideBelow: "sm", cell: (row) => (row.deadline ? <span className="tabular">{formatDate(row.deadline)}</span> : "—") },
            { key: "status", header: "Estado", cell: (row) => <StatusBadge tone={row.status === "open" ? "warning" : "neutral"}>{row.status === "open" ? "Em curso" : "Encerrado"}</StatusBadge> },
          ]}
        />
      </PageBody>
    </>
  );
}
