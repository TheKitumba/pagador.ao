import { HugeiconsIcon } from "@hugeicons/react";
import { Agreement01Icon, Alert02Icon, Calendar03Icon, File02Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { StatCard, StatGrid } from "@/components/common/cards";
import { DataTable } from "@/components/common/data-table";
import { PageBody, PageHeader, PageTabPanel, PageTabs } from "@/components/common/page";
import { PersonCell } from "@/components/common/person-avatar";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { type ContractAlert, contractAlerts, employees } from "@/mocks/people";

export const metadata: Metadata = { title: "Contratos" };

const alertLabel: Record<ContractAlert, string> = {
  ending: "Termo do contrato",
  probation: "Fim do período experimental",
  renewal: "Renovação / adenda",
};

export default function ContractsPage() {
  const rows = contractAlerts.map((alert) => ({ ...alert, employee: employees.find((e) => e.id === alert.employeeId)! }));

  const alertTable = (items: typeof rows) => (
    <DataTable
      caption="Contratos com acção necessária"
      rows={items}
      getRowKey={(row) => row.employeeId}
      columns={[
        { key: "employee", header: "Trabalhador", cell: (row) => <PersonCell name={row.employee.name} detail={row.employee.position} href={`/employees/${row.employee.id}?tab=contracts`} /> },
        { key: "type", header: "Motivo", hideBelow: "md", cell: (row) => alertLabel[row.type] },
        { key: "end", header: "Data", cell: (row) => <span className="tabular">{formatDate(row.endDate)}</span> },
        {
          key: "days",
          header: "Prazo",
          cell: (row) => <StatusBadge tone={row.daysLeft <= 20 ? "danger" : row.daysLeft <= 45 ? "warning" : "neutral"}>{row.daysLeft} dias</StatusBadge>,
        },
        {
          key: "action",
          header: "Acção",
          align: "right",
          cell: (row) => (
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                {row.type === "probation" ? "Avaliar" : "Não renovar"}
              </Button>
              <Button size="sm">{row.type === "probation" ? "Confirmar" : "Renovar"}</Button>
            </div>
          ),
        },
      ]}
    />
  );

  return (
    <>
      <PageHeader
        title="Contratos"
        icon={Agreement01Icon}
        description="Contratos a terminar, períodos experimentais e renovações"
        actions={
          <Button>
            <HugeiconsIcon icon={PlusSignIcon} aria-hidden />
            <span className="hidden sm:inline">Novo contrato</span>
            <span className="sr-only sm:hidden">Novo contrato</span>
          </Button>
        }
      />
      <PageTabs
        tabs={[
          { value: "action", label: "Requer acção", count: rows.length },
          { value: "ending", label: "A terminar", count: rows.filter((r) => r.type === "ending").length },
          { value: "probation", label: "Período experimental", count: rows.filter((r) => r.type === "probation").length },
          { value: "templates", label: "Modelos" },
        ]}
      >
        <PageBody>
          <PageTabPanel value="action" className="space-y-6">
            <StatGrid>
              <StatCard label="Contratos vigentes" value="246" icon={Agreement01Icon} tone="info" />
              <StatCard label="Terminam em 30 dias" value="3" icon={Alert02Icon} tone="danger" hint="Decida com a antecedência legal" />
              <StatCard label="Em período experimental" value="6" icon={Calendar03Icon} tone="warning" />
              <StatCard label="A termo certo" value="58" icon={File02Icon} tone="violet" hint="23% do efectivo" />
            </StatGrid>
            {alertTable(rows)}
          </PageTabPanel>
          <PageTabPanel value="ending">{alertTable(rows.filter((r) => r.type === "ending"))}</PageTabPanel>
          <PageTabPanel value="probation">{alertTable(rows.filter((r) => r.type === "probation"))}</PageTabPanel>
          <PageTabPanel value="templates">
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {["Contrato por tempo indeterminado", "Contrato a termo certo", "Contrato de estágio profissional", "Adenda de alteração salarial", "Contrato de trabalhador estrangeiro", "Acordo de cessação"].map((name) => (
                <li key={name} className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-card">
                  <HugeiconsIcon icon={File02Icon} className="size-5 text-muted-foreground" aria-hidden />
                  <span className="flex-1 text-sm font-medium">{name}</span>
                  <Button variant="ghost" size="sm">Usar</Button>
                </li>
              ))}
            </ul>
          </PageTabPanel>
        </PageBody>
      </PageTabs>
    </>
  );
}
