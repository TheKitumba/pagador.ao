import type { Metadata } from "next";

import { StatusBadge } from "@/components/common/status-badge";
import { formatDateShort } from "@/lib/format";

import { ClockCard } from "../_components/clock-card";

export const metadata: Metadata = { title: "Ponto" };

const history = [
  { date: "2026-10-13", in: "07:55", out: "17:04", hours: "8 h 09", status: "ok" as const },
  { date: "2026-10-12", in: "07:49", out: "17:12", hours: "8 h 23", status: "ok" as const },
  { date: "2026-10-09", in: "08:21", out: "17:30", hours: "8 h 09", status: "late" as const },
  { date: "2026-10-08", in: "07:58", out: null, hours: "—", status: "missing" as const },
];

const statusMeta = {
  ok: { label: "Completo", tone: "success" as const },
  late: { label: "Atraso", tone: "warning" as const },
  missing: { label: "Falta saída", tone: "danger" as const },
};

export default function PortalTimePage() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Ponto</h1>
      <ClockCard />
      <section aria-labelledby="history-title" className="space-y-3">
        <h2 id="history-title" className="text-sm font-medium text-muted-foreground">
          Últimos dias
        </h2>
        <ul className="divide-y overflow-hidden rounded-xl border bg-card shadow-card">
          {history.map((day) => (
            <li key={day.date} className="flex items-center gap-4 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium">{formatDateShort(day.date)}</p>
                <p className="text-xs tabular text-muted-foreground">
                  {day.in} – {day.out ?? "sem saída"} · {day.hours}
                </p>
              </div>
              <StatusBadge tone={statusMeta[day.status].tone}>{statusMeta[day.status].label}</StatusBadge>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
