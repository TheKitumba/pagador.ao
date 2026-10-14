import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon, PlusSignIcon, TimeScheduleIcon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { DataTable } from "@/components/common/data-table";
import { PageBody, PageHeader, PageTabPanel, PageTabs } from "@/components/common/page";
import { PersonCell } from "@/components/common/person-avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { roster, scheduleTemplates, shifts, weekDays } from "@/mocks/time";

export const metadata: Metadata = { title: "Escalas" };

const shiftStyle = [
  "bg-sky-500/10 text-sky-700 border-sky-500/20 dark:text-sky-300",
  "bg-amber-500/10 text-amber-800 border-amber-500/25 dark:text-amber-300",
  "bg-violet-500/10 text-violet-700 border-violet-500/20 dark:text-violet-300",
  "bg-muted text-muted-foreground border-transparent",
];
const shiftShort = ["Manhã", "Tarde", "Noite", "Folga"];

export default function SchedulesPage() {
  return (
    <>
      <PageHeader
        title="Escalas"
        icon={TimeScheduleIcon}
        description="Horários e escalas de turnos"
        actions={
          <Button>
            <HugeiconsIcon icon={PlusSignIcon} aria-hidden />
            <span className="hidden sm:inline">Novo horário</span>
            <span className="sr-only sm:hidden">Novo horário</span>
          </Button>
        }
      />
      <PageTabs
        tabs={[
          { value: "roster", label: "Escala semanal" },
          { value: "templates", label: "Horários", count: scheduleTemplates.length },
        ]}
      >
        <PageBody>
          <PageTabPanel value="roster" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon-sm" aria-label="Semana anterior">
                  <HugeiconsIcon icon={ArrowLeft01Icon} />
                </Button>
                <h2 className="text-sm font-semibold">Armazém do Lobito · 12 a 18 de outubro de 2026</h2>
                <Button variant="outline" size="icon-sm" aria-label="Semana seguinte">
                  <HugeiconsIcon icon={ArrowRight01Icon} />
                </Button>
              </div>
              <ul className="flex flex-wrap gap-2" aria-label="Legenda dos turnos">
                {shifts.map((shift, index) => (
                  <li key={shift} className={cn("rounded-md border px-2 py-0.5 text-xs", shiftStyle[index])}>
                    {shift}
                  </li>
                ))}
              </ul>
            </div>
            <div className="overflow-x-auto rounded-xl border bg-card shadow-card">
              <table className="w-full min-w-[760px] text-sm">
                <caption className="sr-only">Escala semanal de turnos</caption>
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                      Trabalhador
                    </th>
                    {weekDays.map((day) => (
                      <th key={day} scope="col" className="px-2 py-2.5 text-center text-xs font-medium text-muted-foreground">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {roster.map((row) => (
                    <tr key={row.employee} className="border-b last:border-0">
                      <th scope="row" className="px-4 py-2.5 text-left font-normal">
                        <PersonCell name={row.employee} />
                      </th>
                      {row.shifts.map((shift, index) => (
                        <td key={index} className="px-1.5 py-2">
                          <span className={cn("block rounded-md border px-2 py-1.5 text-center text-xs font-medium", shiftStyle[shift])}>
                            {shiftShort[shift]}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PageTabPanel>
          <PageTabPanel value="templates">
            <DataTable
              caption="Horários de trabalho"
              rows={scheduleTemplates}
              getRowKey={(row) => row.name}
              columns={[
                { key: "name", header: "Horário", cell: (row) => <span className="font-medium">{row.name}</span> },
                { key: "pattern", header: "Padrão", hideBelow: "md", cell: (row) => <span className="text-muted-foreground">{row.pattern}</span> },
                { key: "hours", header: "Horas/semana", align: "right", cell: (row) => <span className="tabular">{row.weeklyHours} h</span> },
                { key: "employees", header: "Trabalhadores", align: "right", cell: (row) => <span className="tabular">{row.employees}</span> },
              ]}
            />
          </PageTabPanel>
        </PageBody>
      </PageTabs>
    </>
  );
}
