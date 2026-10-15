"use client";

import { useId, useState } from "react";

import { Slider } from "@/components/ui/slider";
import { formatKz, formatNumber } from "@/lib/format";

import { monthlyShortfall } from "./example";
import { GlowCard, Mono } from "./primitives";

/** Scales the example's monthly IRT shortfall to the visitor's headcount, over a year. */
export function ShortfallCalculator({ className }: { className?: string }) {
  const labelId = useId();
  const [workers, setWorkers] = useState(40);
  const yearly = monthlyShortfall * workers * 12;

  return (
    <GlowCard glow="red" from="bottom" className={className}>
      <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_1.2fr] lg:items-end">
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <p id={labelId} className="text-neutral-300">
              Trabalhadores nesta situação
            </p>
            <p className="tabular font-mono text-2xl text-white">{formatNumber(workers)}</p>
          </div>
          <Slider aria-labelledby={labelId} min={1} max={500} step={1} value={[workers]} onValueChange={([value]) => setWorkers(value)} className="mt-6" />
          <div className="mt-3 flex justify-between">
            <Mono>1</Mono>
            <Mono>500</Mono>
          </div>
        </div>

        <div aria-live="polite" className="lg:text-right">
          <Mono>IRT por reter num ano</Mono>
          <p className="tabular mt-2 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl">{formatKz(yearly)}</p>
          <p className="mt-4 text-sm leading-relaxed text-neutral-400">Continua a ser devido pela empresa, com juros e multa, e só aparece quando a AGT o detecta.</p>
        </div>
      </div>
    </GlowCard>
  );
}
