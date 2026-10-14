"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { parseAsInteger, useQueryState } from "nuqs";

import { Button } from "@/components/ui/button";

const FIRST_MONDAY = new Date("2026-10-12T12:00:00+01:00");

function weekLabel(offset: number) {
  const start = new Date(FIRST_MONDAY);
  start.setDate(start.getDate() + offset * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const day = (date: Date) => date.toLocaleDateString("pt-AO", { day: "numeric" });
  const month = (date: Date) => date.toLocaleDateString("pt-AO", { month: "long", year: "numeric" });
  return start.getMonth() === end.getMonth()
    ? `${day(start)} a ${day(end)} de ${month(end)}`
    : `${start.toLocaleDateString("pt-AO", { day: "numeric", month: "long" })} a ${day(end)} de ${month(end)}`;
}

/** Week selector bound to `?week=`, so a specific week can be shared. */
export function WeekNavigator({ site }: { site: string }) {
  const [offset, setOffset] = useQueryState("week", parseAsInteger.withDefault(0));

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon-sm" aria-label="Semana anterior" onClick={() => setOffset(offset - 1 || null)}>
        <HugeiconsIcon icon={ArrowLeft01Icon} />
      </Button>
      <h2 className="text-sm font-semibold" aria-live="polite">
        {site} · {weekLabel(offset)}
      </h2>
      <Button variant="outline" size="icon-sm" aria-label="Semana seguinte" onClick={() => setOffset(offset + 1 || null)}>
        <HugeiconsIcon icon={ArrowRight01Icon} />
      </Button>
      {offset !== 0 && (
        <Button variant="ghost" size="sm" onClick={() => setOffset(null)}>
          Esta semana
        </Button>
      )}
    </div>
  );
}
