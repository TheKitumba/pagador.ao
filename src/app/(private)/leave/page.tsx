import { HugeiconsIcon } from "@hugeicons/react";
import { BeachIcon, PlusSignIcon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { ProgressBar } from "@/components/common/cards";
import { DataTable } from "@/components/common/data-table";
import { DecisionButtons } from "@/components/common/decision-buttons";
import { PageBody, PageHeader, PageTabPanel, PageTabs } from "@/components/common/page";
import { PersonCell } from "@/components/common/person-avatar";
import { StatusBadge } from "@/components/common/status-badge";
import { requestStatusTone } from "@/components/common/status-maps";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { leaveBalances, leaveRequests, requestStatusLabel } from "@/mocks/time";

export const metadata: Metadata = { title: "Férias e faltas" };

type LeaveRequest = (typeof leaveRequests)[number];

function RequestsTable({ rows }: { rows: LeaveRequest[] }) {
  return (
    <DataTable
      caption="Pedidos de férias, faltas e licenças"
      rows={rows}
      getRowKey={(row) => row.id}
      columns={[
        { key: "employee", header: "Trabalhador", cell: (row) => <PersonCell name={row.employee} detail={row.type} /> },
        { key: "period", header: "Período", hideBelow: "md", cell: (row) => <span className="tabular">{formatDate(row.start)} – {formatDate(row.end)}</span> },
        { key: "days", header: "Dias", align: "right", cell: (row) => <span className="tabular">{row.days}</span> },
        { key: "approver", header: "Aprovador", hideBelow: "lg", cell: (row) => <span className="text-muted-foreground">{row.approver}</span> },
        {
          key: "status",
          header: "Estado",
          align: "right",
          cell: (row) =>
            row.status === "pending" ? (
              <DecisionButtons subject={`${row.type} de ${row.employee}`} />
            ) : (
              <StatusBadge tone={requestStatusTone[row.status]}>{requestStatusLabel[row.status]}</StatusBadge>
            ),
        },
      ]}
    />
  );
}

export default function LeavePage() {
  const pending = leaveRequests.filter((request) => request.status === "pending");

  return (
    <>
      <PageHeader
        title="Férias e faltas"
        icon={BeachIcon}
        description="Pedidos, saldos e mapa de férias"
        actions={
          <Button>
            <HugeiconsIcon icon={PlusSignIcon} aria-hidden />
            <span className="hidden sm:inline">Registar ausência</span>
            <span className="sr-only sm:hidden">Registar ausência</span>
          </Button>
        }
      />
      <PageTabs
        tabs={[
          { value: "pending", label: "Por aprovar", count: pending.length },
          { value: "all", label: "Todos os pedidos", count: leaveRequests.length },
          { value: "balances", label: "Saldos" },
          { value: "map", label: "Mapa de férias" },
        ]}
      >
        <PageBody>
          <PageTabPanel value="pending">
            <RequestsTable rows={pending} />
          </PageTabPanel>
          <PageTabPanel value="all">
            <RequestsTable rows={leaveRequests} />
          </PageTabPanel>
          <PageTabPanel value="balances">
            <DataTable
              caption="Saldos de férias de 2026"
              rows={leaveBalances}
              getRowKey={(row) => row.employee}
              columns={[
                { key: "employee", header: "Trabalhador", cell: (row) => <PersonCell name={row.employee} /> },
                { key: "entitled", header: "Direito", align: "right", hideBelow: "sm", cell: (row) => <span className="tabular">{row.entitled}</span> },
                { key: "carried", header: "Transitados", align: "right", hideBelow: "md", cell: (row) => <span className="tabular">{row.carried}</span> },
                { key: "taken", header: "Gozados", align: "right", cell: (row) => <span className="tabular">{row.taken}</span> },
                {
                  key: "available",
                  header: "Disponíveis",
                  className: "w-48",
                  cell: (row) => {
                    const total = row.entitled + row.carried;
                    const available = total - row.taken - row.scheduled;
                    return (
                      <div className="space-y-1">
                        <span className="text-sm font-medium tabular">{available} dias</span>
                        <ProgressBar value={((row.taken + row.scheduled) / total) * 100} label={`Férias usadas por ${row.employee}`} />
                      </div>
                    );
                  },
                },
              ]}
            />
          </PageTabPanel>
          <PageTabPanel value="map">
            <div className="overflow-x-auto rounded-xl border bg-card p-4 shadow-card">
              <table className="w-full min-w-[720px] text-xs">
                <caption className="sr-only">Mapa de férias de 2026 por mês</caption>
                <thead>
                  <tr>
                    <th scope="col" className="w-48 pb-2 text-left font-medium text-muted-foreground">
                      Trabalhador
                    </th>
                    {["jan.", "fev.", "mar.", "abr.", "mai.", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."].map((month) => (
                      <th key={month} scope="col" className="pb-2 text-center font-medium text-muted-foreground">
                        {month}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Ana Mateus", months: [7, 11] },
                    { name: "Domingos Cassoma", months: [3, 7] },
                    { name: "Feliciano Lukamba", months: [1, 8] },
                    { name: "Nádia Paím", months: [5, 10] },
                    { name: "Osvaldo Chipenda", months: [8] },
                  ].map((row) => (
                    <tr key={row.name}>
                      <th scope="row" className="py-1.5 text-left text-sm font-normal">
                        {row.name}
                      </th>
                      {Array.from({ length: 12 }).map((_, month) => (
                        <td key={month} className="px-0.5 py-1.5">
                          <span className={row.months.includes(month) ? "block h-5 rounded bg-success/70" : "block h-5 rounded bg-muted"}>
                            <span className="sr-only">{row.months.includes(month) ? "Férias" : "Sem férias"}</span>
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PageTabPanel>
        </PageBody>
      </PageTabs>
    </>
  );
}
