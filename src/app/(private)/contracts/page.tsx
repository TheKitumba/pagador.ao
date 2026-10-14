import { HugeiconsIcon } from "@hugeicons/react";
import { Agreement01Icon, Alert02Icon, Calendar03Icon, File02Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";

import { StatCard, StatGrid } from "@/components/common/cards";
import { DataTable } from "@/components/common/data-table";
import { PageBody, PageHeader, PageTabPanel, PageTabs } from "@/components/common/page";
import { PersonCell } from "@/components/common/person-avatar";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { type ContractAlert, contractAlerts, employees } from "@/mocks/people";
import { FormDialog } from "@/components/common/form-dialog";
import { HeaderButton } from "@/components/common/header-button";
import { forms } from "@/config/forms";

import { ContractActions } from "./_components/contract-actions";

export const metadata: Metadata = { title: "Contratos" };

const contractTemplates: { name: string; type?: string; href?: string }[] = [
  { name: "Contrato por tempo indeterminado", type: "Por tempo indeterminado" },
  { name: "Contrato a termo certo", type: "Por tempo determinado" },
  { name: "Contrato de estágio profissional", type: "Estágio profissional" },
  { name: "Contrato de trabalhador estrangeiro", type: "Trabalhador estrangeiro" },
  { name: "Adenda de alteração salarial", href: "/employees" },
  { name: "Acordo de cessação", href: "/terminations?new=1" },
];

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
          cell: (row) => <ContractActions type={row.type} employee={row.employee.name} endDate={formatDate(row.endDate)} />,
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
          <FormDialog {...forms.contract} trigger={<HeaderButton icon={PlusSignIcon} label="Novo contrato" />} />
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
              {contractTemplates.map((template) => (
                <li key={template.name} className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-card">
                  <HugeiconsIcon icon={File02Icon} className="size-5 text-muted-foreground" aria-hidden />
                  <span className="flex-1 text-sm font-medium">{template.name}</span>
                  {template.type ? (
                    <FormDialog
                      {...forms.contract}
                      title={`Novo contrato — ${template.name}`}
                      fields={forms.contract.fields.map((field) => (field.name === "type" ? { ...field, defaultValue: template.type } : field))}
                      trigger={
                        <Button variant="ghost" size="sm">
                          Usar<span className="sr-only"> {template.name}</span>
                        </Button>
                      }
                    />
                  ) : (
                    <Button asChild variant="ghost" size="sm">
                      <Link href={template.href!}>
                        Usar<span className="sr-only"> {template.name}</span>
                      </Link>
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </PageTabPanel>
        </PageBody>
      </PageTabs>
    </>
  );
}
