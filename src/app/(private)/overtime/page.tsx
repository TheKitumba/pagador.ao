import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, PlusSignIcon, Timer02Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { ProgressBar, StatCard, StatGrid } from "@/components/common/cards";
import { DataTable } from "@/components/common/data-table";
import { DecisionButtons } from "@/components/common/decision-buttons";
import { PageBody, PageHeader } from "@/components/common/page";
import { PersonCell } from "@/components/common/person-avatar";
import { StatusBadge } from "@/components/common/status-badge";
import { requestStatusTone } from "@/components/common/status-maps";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { overtimeRequests, requestStatusLabel } from "@/mocks/time";

export const metadata: Metadata = { title: "Horas extra" };

// Display value only: the legal limit is a dated parameter served by the API.
const MONTHLY_LIMIT = 30;

export default function OvertimePage() {
  const totalHours = overtimeRequests.reduce((sum, request) => sum + request.hours, 0);
  const overLimit = overtimeRequests.filter((request) => request.monthTotal > MONTHLY_LIMIT);

  return (
    <>
      <PageHeader
        title="Horas extra"
        icon={Timer02Icon}
        description="Pedidos, aprovação e limites legais"
        actions={
          <Button>
            <HugeiconsIcon icon={PlusSignIcon} aria-hidden />
            <span className="hidden sm:inline">Registar horas extra</span>
            <span className="sr-only sm:hidden">Registar horas extra</span>
          </Button>
        }
      />
      <PageBody>
        <StatGrid>
          <StatCard label="Horas extra em outubro" value={`${totalHours} h`} icon={Timer02Icon} tone="info" />
          <StatCard label="Por aprovar" value={String(overtimeRequests.filter((r) => r.status === "pending").length)} icon={Timer02Icon} tone="warning" />
          <StatCard label="Acima do limite mensal" value={String(overLimit.length)} icon={Alert02Icon} tone="danger" hint={`Limite configurado: ${MONTHLY_LIMIT} h`} />
          <StatCard label="Custo estimado" value="1,2 M Kz" icon={Timer02Icon} tone="violet" hint="Incluído na folha de outubro" />
        </StatGrid>
        <DataTable
          caption="Registos de horas extra"
          rows={overtimeRequests}
          getRowKey={(row) => `${row.employee}-${row.date}`}
          columns={[
            { key: "employee", header: "Trabalhador", cell: (row) => <PersonCell name={row.employee} detail={row.reason} /> },
            { key: "date", header: "Dia", hideBelow: "sm", cell: (row) => <span className="tabular">{formatDate(row.date)}</span> },
            { key: "kind", header: "Tipo", hideBelow: "lg", cell: (row) => <span className="text-muted-foreground">{row.kind}</span> },
            { key: "hours", header: "Horas", align: "right", cell: (row) => <span className="tabular font-medium">{row.hours} h</span> },
            {
              key: "month",
              header: "Total do mês",
              hideBelow: "md",
              className: "w-44",
              cell: (row) => (
                <div className="space-y-1">
                  <span className={row.monthTotal > MONTHLY_LIMIT ? "text-sm font-medium text-destructive tabular" : "text-sm tabular"}>
                    {row.monthTotal} h / {MONTHLY_LIMIT} h
                  </span>
                  <ProgressBar
                    value={(row.monthTotal / MONTHLY_LIMIT) * 100}
                    tone={row.monthTotal > MONTHLY_LIMIT ? "danger" : row.monthTotal > MONTHLY_LIMIT * 0.8 ? "warning" : "info"}
                    label={`Horas extra de ${row.employee} face ao limite`}
                  />
                </div>
              ),
            },
            {
              key: "status",
              header: "Estado",
              align: "right",
              cell: (row) =>
                row.status === "pending" ? (
                  <DecisionButtons subject={`${row.hours} h extra de ${row.employee}`} />
                ) : (
                  <StatusBadge tone={requestStatusTone[row.status]}>{requestStatusLabel[row.status]}</StatusBadge>
                ),
            },
          ]}
        />
      </PageBody>
    </>
  );
}
