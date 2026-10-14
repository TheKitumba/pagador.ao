import { Calendar03Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { SectionCard } from "@/components/common/cards";
import { PageBody, PageHeader } from "@/components/common/page";
import { StatusBadge, type Tone } from "@/components/common/status-badge";
import { formatDateShort } from "@/lib/format";
import { cn } from "@/lib/utils";
import { type CalendarEventKind, calendarEvents } from "@/mocks/inbox";

export const metadata: Metadata = { title: "Calendário" };

const kindMeta: Record<CalendarEventKind, { label: string; tone: Tone; bar: string }> = {
  holiday: { label: "Feriado", tone: "danger", bar: "bg-destructive" },
  payroll: { label: "Folha", tone: "info", bar: "bg-primary" },
  tax: { label: "Prazo fiscal", tone: "warning", bar: "bg-warning" },
  leave: { label: "Férias e licenças", tone: "success", bar: "bg-success" },
  training: { label: "Formação", tone: "violet", bar: "bg-violet-500" },
  interview: { label: "Entrevista", tone: "neutral", bar: "bg-muted-foreground" },
};

const weekdays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const TODAY = "2026-10-14";

function octoberGrid() {
  // October 2026 starts on a Thursday (index 3 with Monday first).
  const offset = 3;
  const days = 31;
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  return cells;
}

export default function CalendarPage() {
  const cells = octoberGrid();
  const weeks = Array.from({ length: cells.length / 7 }, (_, index) => cells.slice(index * 7, index * 7 + 7));
  const october = calendarEvents.filter((event) => event.date.startsWith("2026-10"));
  const upcoming = calendarEvents.filter((event) => event.date >= TODAY);

  return (
    <>
      <PageHeader title="Calendário" icon={Calendar03Icon} description="Feriados, férias, pagamentos e prazos fiscais" />
      <PageBody>
        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <section aria-labelledby="month-title" className="overflow-hidden rounded-xl border bg-card shadow-card">
            <div className="flex items-center justify-between border-b px-5 py-3">
              <h2 id="month-title" className="text-[15px] font-semibold">
                Outubro de 2026
              </h2>
              <ul className="hidden flex-wrap gap-3 text-xs text-muted-foreground lg:flex" aria-label="Legenda">
                {Object.values(kindMeta).map((meta) => (
                  <li key={meta.label} className="flex items-center gap-1.5">
                    <span aria-hidden className={cn("size-2 rounded-full", meta.bar)} />
                    {meta.label}
                  </li>
                ))}
              </ul>
            </div>
            <table className="w-full table-fixed border-collapse" aria-labelledby="month-title">
              <thead>
                <tr>
                  {weekdays.map((day) => (
                    <th key={day} scope="col" className="border-b bg-muted/40 px-2 py-2 text-center text-xs font-medium text-muted-foreground">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks.map((week, weekIndex) => (
                  <tr key={weekIndex}>
                    {week.map((day, index) => {
                      const date = day ? `2026-10-${String(day).padStart(2, "0")}` : null;
                      const events = date ? october.filter((event) => event.date === date) : [];
                      const isToday = date === TODAY;
                      return (
                        <td
                          key={index}
                          aria-current={isToday ? "date" : undefined}
                          className={cn("h-24 border-b border-r p-1.5 align-top text-xs last:border-r-0", !day && "bg-muted/20")}
                        >
                          {day && (
                            <>
                              <span
                                className={cn(
                                  "inline-flex size-6 items-center justify-center rounded-full tabular",
                                  isToday ? "bg-primary font-semibold text-primary-foreground" : "text-muted-foreground",
                                )}
                              >
                                {day}
                              </span>
                              <ul className="mt-1 space-y-1">
                                {events.map((event) => (
                                  <li key={event.title} className="flex items-center gap-1 truncate rounded bg-muted/60 px-1.5 py-0.5 text-[11px]">
                                    <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", kindMeta[event.kind].bar)} />
                                    <span className="truncate">{event.title}</span>
                                    <span className="sr-only"> ({kindMeta[event.kind].label})</span>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <SectionCard title="Próximos eventos" contentClassName="px-2 pb-2">
            <ul className="divide-y">
              {upcoming.map((event) => (
                <li key={`${event.date}-${event.title}`} className="flex items-start gap-3 px-3 py-2.5">
                  <span aria-hidden className={cn("mt-1 h-8 w-1 shrink-0 rounded-full", kindMeta[event.kind].bar)} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{event.title}</span>
                    <span className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      {formatDateShort(event.date)}
                      <StatusBadge tone={kindMeta[event.kind].tone} dot={false}>
                        {kindMeta[event.kind].label}
                      </StatusBadge>
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </PageBody>
    </>
  );
}
