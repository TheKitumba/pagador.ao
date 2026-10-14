import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, TaskDaily01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { DataTable } from "@/components/common/data-table";
import { DecisionButtons } from "@/components/common/decision-buttons";
import { PageBody, PageHeader, PageTabPanel, PageTabs } from "@/components/common/page";
import { PersonCell } from "@/components/common/person-avatar";
import { StatusBadge } from "@/components/common/status-badge";
import { requestStatusTone } from "@/components/common/status-maps";
import { Button } from "@/components/ui/button";
import { requestStatusLabel, timesheets } from "@/mocks/time";

export const metadata: Metadata = { title: "Folhas de horas" };

type Timesheet = (typeof timesheets)[number];

function TimesheetTable({ rows }: { rows: Timesheet[] }) {
  return (
    <DataTable
      caption="Folhas de horas semanais"
      rows={rows}
      getRowKey={(row) => `${row.employee}-${row.week}`}
      columns={[
        { key: "employee", header: "Trabalhador", cell: (row) => <PersonCell name={row.employee} detail={row.project} /> },
        { key: "week", header: "Semana", hideBelow: "sm", cell: (row) => row.week },
        { key: "hours", header: "Horas", align: "right", cell: (row) => <span className="tabular font-medium">{row.hours} h</span> },
        {
          key: "status",
          header: "Estado",
          align: "right",
          cell: (row) =>
            row.status === "pending" ? (
              <DecisionButtons subject={`Folha de horas de ${row.employee}`} />
            ) : (
              <StatusBadge tone={requestStatusTone[row.status]}>{requestStatusLabel[row.status]}</StatusBadge>
            ),
        },
      ]}
    />
  );
}

export default function TimesheetsPage() {
  return (
    <>
      <PageHeader
        title="Folhas de horas"
        icon={TaskDaily01Icon}
        description="Horas por projecto, submissão e aprovação"
        actions={
          <Button>
            <HugeiconsIcon icon={PlusSignIcon} aria-hidden />
            <span className="hidden sm:inline">Nova folha de horas</span>
            <span className="sr-only sm:hidden">Nova folha de horas</span>
          </Button>
        }
      />
      <PageTabs
        tabs={[
          { value: "pending", label: "Por aprovar", count: timesheets.filter((t) => t.status === "pending").length },
          { value: "all", label: "Todas", count: timesheets.length },
        ]}
      >
        <PageBody>
          <PageTabPanel value="pending">
            <TimesheetTable rows={timesheets.filter((t) => t.status === "pending")} />
          </PageTabPanel>
          <PageTabPanel value="all">
            <TimesheetTable rows={timesheets} />
          </PageTabPanel>
        </PageBody>
      </PageTabs>
    </>
  );
}
