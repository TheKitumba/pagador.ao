"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { MoreHorizontalIcon, UserGroupIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";

import { EmptyState } from "@/components/common/cards";
import { DataTable, Money } from "@/components/common/data-table";
import { PersonCell } from "@/components/common/person-avatar";
import { StatusBadge } from "@/components/common/status-badge";
import { employeeStatusTone } from "@/components/common/status-maps";
import { matches, useFilter, useSearchQuery } from "@/components/common/toolbar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate, formatKz } from "@/lib/format";
import { type Employee, type EmployeeStatus, employeeStatusLabel, employees } from "@/mocks/people";

export function EmployeeTable({ status }: { status?: EmployeeStatus }) {
  const query = useSearchQuery();
  const department = useFilter("dept");
  const site = useFilter("site");

  const rows = employees.filter(
    (employee) =>
      (!status || employee.status === status) &&
      (!department || employee.department === department) &&
      (!site || employee.establishment === site) &&
      matches(query, employee.name, employee.number, employee.nif, employee.position, employee.email),
  );

  return (
    <DataTable<Employee>
      caption="Lista de trabalhadores"
      rows={rows}
      getRowKey={(employee) => employee.id}
      empty={
        <div className="p-4">
          <EmptyState
            icon={UserGroupIcon}
            title="Nenhum trabalhador encontrado"
            description="Ajuste a pesquisa ou os filtros, ou admita um novo trabalhador."
            action={
              <Button asChild size="sm">
                <Link href="/employees/new">Admitir trabalhador</Link>
              </Button>
            }
          />
        </div>
      }
      footer={
        <>
          <span>
            {rows.length} de {employees.length} trabalhadores
          </span>
          <span className="hidden sm:inline">A mostrar a amostra da conta de demonstração</span>
        </>
      }
      columns={[
        {
          key: "name",
          header: "Trabalhador",
          cell: (employee) => (
            <PersonCell name={employee.name} detail={`N.º ${employee.number} · ${employee.email}`} href={`/employees/${employee.id}`} />
          ),
        },
        {
          key: "position",
          header: "Cargo",
          hideBelow: "md",
          className: "whitespace-nowrap",
          cell: (employee) => (
            <div>
              <div>{employee.position}</div>
              <div className="text-xs text-muted-foreground">{employee.department}</div>
            </div>
          ),
        },
        { key: "site", header: "Local", hideBelow: "2xl", className: "whitespace-nowrap", cell: (employee) => <span className="text-muted-foreground">{employee.establishment}</span> },
        { key: "hire", header: "Admissão", hideBelow: "lg", cell: (employee) => <span className="tabular">{formatDate(employee.hireDate)}</span> },
        {
          key: "salary",
          header: "Vencimento base",
          align: "right",
          hideBelow: "lg",
          cell: (employee) => <Money value={formatKz(employee.baseSalary)} />,
        },
        {
          key: "status",
          header: "Estado",
          cell: (employee) => <StatusBadge tone={employeeStatusTone[employee.status]}>{employeeStatusLabel[employee.status]}</StatusBadge>,
        },
        {
          key: "actions",
          header: "Acções",
          align: "right",
          className: "w-12",
          cell: (employee) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label={`Acções para ${employee.name}`}>
                  <HugeiconsIcon icon={MoreHorizontalIcon} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/employees/${employee.id}`}>Abrir ficha</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/employees/${employee.id}?tab=contracts`}>Ver contratos</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/employees/${employee.id}?tab=pay`}>Ver recibos</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="text-destructive focus:text-destructive">
                  <Link href="/terminations?new=1">Iniciar cessação</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
        },
      ]}
    />
  );
}
