import { HugeiconsIcon } from "@hugeicons/react";
import { Building03Icon, Location01Icon, PlusSignIcon, UserGroupIcon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { SectionCard, StatCard, StatGrid } from "@/components/common/cards";
import { DataTable } from "@/components/common/data-table";
import { PageBody, PageHeader, PageTabPanel, PageTabs } from "@/components/common/page";
import { AvatarStack, PersonAvatar } from "@/components/common/person-avatar";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { departments, employees, establishments, positions } from "@/mocks/people";

export const metadata: Metadata = { title: "Organização" };

export default function OrganizationPage() {
  const total = departments.reduce((sum, department) => sum + department.headcount, 0);

  return (
    <>
      <PageHeader
        title="Organização"
        icon={Building03Icon}
        description="Estabelecimentos, departamentos, cargos e centros de custo"
        actions={
          <Button>
            <HugeiconsIcon icon={PlusSignIcon} aria-hidden />
            <span className="hidden sm:inline">Nova unidade</span>
            <span className="sr-only sm:hidden">Nova unidade</span>
          </Button>
        }
      />
      <PageTabs
        tabs={[
          { value: "chart", label: "Organograma" },
          { value: "departments", label: "Departamentos", count: departments.length },
          { value: "sites", label: "Estabelecimentos", count: establishments.length },
          { value: "positions", label: "Cargos", count: positions.length },
        ]}
      >
        <PageBody>
          <PageTabPanel value="chart" className="space-y-6">
            <StatGrid>
              <StatCard label="Efectivo total" value={String(total)} icon={UserGroupIcon} tone="info" />
              <StatCard label="Departamentos" value={String(departments.length)} icon={Building03Icon} tone="violet" />
              <StatCard label="Estabelecimentos" value={String(establishments.length)} icon={Location01Icon} tone="success" />
              <StatCard label="Cargos activos" value={String(positions.length)} icon={UserGroupIcon} tone="warning" />
            </StatGrid>
            <SectionCard title="Estrutura" description="Direcção geral e departamentos">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-card">
                  <PersonAvatar name="Domingos Cassoma" size="md" />
                  <div>
                    <p className="text-sm font-semibold">Direcção Geral</p>
                    <p className="text-xs text-muted-foreground">Domingos Cassoma</p>
                  </div>
                </div>
                <div aria-hidden className="h-6 w-px bg-border" />
                <ul className="grid w-full gap-3 border-t pt-6 sm:grid-cols-2 lg:grid-cols-3">
                  {departments.map((department) => (
                    <li key={department.name} className="rounded-xl border bg-card p-4 shadow-card">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">{department.name}</p>
                          <p className="text-xs text-muted-foreground">Responsável: {department.head}</p>
                        </div>
                        <StatusBadge tone="neutral" dot={false}>
                          {department.costCenter}
                        </StatusBadge>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <AvatarStack names={employees.filter((e) => e.department === department.name).map((e) => e.name)} />
                        <span className="text-sm tabular text-muted-foreground">{department.headcount} pessoas</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </SectionCard>
          </PageTabPanel>

          <PageTabPanel value="departments">
            <DataTable
              caption="Departamentos"
              rows={departments}
              getRowKey={(row) => row.name}
              columns={[
                { key: "name", header: "Departamento", cell: (row) => <span className="font-medium">{row.name}</span> },
                { key: "head", header: "Responsável", cell: (row) => row.head },
                { key: "cc", header: "Centro de custo", hideBelow: "sm", cell: (row) => <span className="tabular">{row.costCenter}</span> },
                { key: "count", header: "Efectivo", align: "right", cell: (row) => <span className="tabular">{row.headcount}</span> },
              ]}
            />
          </PageTabPanel>

          <PageTabPanel value="sites">
            <ul className="grid gap-4 md:grid-cols-3">
              {establishments.map((site, index) => (
                <li key={site} className="rounded-xl border bg-card p-4 shadow-card">
                  <HugeiconsIcon icon={Location01Icon} className="size-5 text-primary" aria-hidden />
                  <p className="mt-3 text-sm font-semibold">{site}</p>
                  <p className="text-xs text-muted-foreground">{[142, 81, 25][index]} trabalhadores · Ponto por {["biométrico e navegador", "quiosque e biométrico", "navegador"][index]}</p>
                </li>
              ))}
            </ul>
          </PageTabPanel>

          <PageTabPanel value="positions">
            <DataTable
              caption="Cargos"
              rows={positions}
              getRowKey={(row) => row.title}
              columns={[
                { key: "title", header: "Cargo", cell: (row) => <span className="font-medium">{row.title}</span> },
                { key: "dept", header: "Departamento", hideBelow: "sm", cell: (row) => row.department },
                { key: "grade", header: "Nível", cell: (row) => <StatusBadge tone="neutral" dot={false}>{row.grade}</StatusBadge> },
                { key: "occupied", header: "Ocupados", align: "right", cell: (row) => <span className="tabular">{row.occupied}</span> },
              ]}
            />
          </PageTabPanel>
        </PageBody>
      </PageTabs>
    </>
  );
}
