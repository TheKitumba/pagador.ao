"use client";

import { useId, useState } from "react";

import { Slider } from "@/components/ui/slider";
import { formatKz, formatNumber } from "@/lib/format";

import { monthlyShortfall } from "./example";

/** Scales the example's monthly IRT shortfall to the visitor's headcount, over a year. */
export function ShortfallCalculator() {
  const labelId = useId();
  const [workers, setWorkers] = useState(40);
  const yearly = monthlyShortfall * workers * 12;

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-card sm:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <p id={labelId} className="font-medium">
          Trabalhadores nesta situação
        </p>
        <p className="tabular text-2xl font-semibold tracking-tight">{formatNumber(workers)}</p>
      </div>
      <Slider aria-labelledby={labelId} min={1} max={500} step={1} value={[workers]} onValueChange={([value]) => setWorkers(value)} className="mt-5" />

      <div className="mt-8 border-t pt-6" aria-live="polite">
        <p className="text-sm text-muted-foreground">IRT por reter num ano</p>
        <p className="tabular mt-1 text-4xl font-semibold tracking-[-0.03em] text-destructive-strong sm:text-5xl">{formatKz(yearly)}</p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          O imposto em falta continua a ser devido pela empresa, acrescido de juros e multa, e só aparece quando a AGT o detecta.
        </p>
      </div>
    </div>
  );
}
