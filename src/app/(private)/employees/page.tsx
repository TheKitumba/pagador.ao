import { HugeiconsIcon } from "@hugeicons/react";
import { FileImportIcon, UserAdd01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";

import { PageBody, PageHeader, PageTabPanel, PageTabs } from "@/components/common/page";
import { ExportButton, FilterMenu, SearchField } from "@/components/common/toolbar";
import { Button } from "@/components/ui/button";
import { departments, type EmployeeStatus, employees, establishments } from "@/mocks/people";

import { EmployeeTable } from "./_components/employee-table";

export const metadata: Metadata = { title: "Trabalhadores" };

const statusTabs: { value: string; label: string; status?: EmployeeStatus }[] = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Activos", status: "active" },
  { value: "probation", label: "Período experimental", status: "probation" },
  { value: "leave", label: "De licença", status: "leave" },
  { value: "terminated", label: "Cessados", status: "terminated" },
];

export default function EmployeesPage() {
  return (
    <>
      <PageHeader
        title="Trabalhadores"
        icon={UserGroupIcon}
        description="Dossiê digital de cada trabalhador"
        actions={
          <>
            <Button variant="outline" className="hidden md:inline-flex">
              <HugeiconsIcon icon={FileImportIcon} aria-hidden />
              Importar Excel
            </Button>
            <Button asChild>
              <Link href="/employees/new">
                <HugeiconsIcon icon={UserAdd01Icon} aria-hidden />
                <span className="hidden sm:inline">Admitir trabalhador</span>
                <span className="sr-only sm:hidden">Admitir trabalhador</span>
              </Link>
            </Button>
          </>
        }
      />
      <PageTabs
        tabs={statusTabs.map((tab) => ({
          value: tab.value,
          label: tab.label,
          count: tab.status ? employees.filter((employee) => employee.status === tab.status).length : employees.length,
        }))}
        toolbar={
          <>
            <SearchField label="Pesquisar trabalhadores" placeholder="Nome, n.º, NIF ou cargo" />
            <FilterMenu label="Departamento" param="dept" options={departments.map((d) => ({ value: d.name, label: d.name }))} />
            <FilterMenu label="Local" param="site" options={establishments.map((e) => ({ value: e, label: e }))} />
            <ExportButton />
          </>
        }
      >
        <PageBody>
          {statusTabs.map((tab) => (
            <PageTabPanel key={tab.value} value={tab.value}>
              <EmployeeTable status={tab.status} />
            </PageTabPanel>
          ))}
        </PageBody>
      </PageTabs>
    </>
  );
}
