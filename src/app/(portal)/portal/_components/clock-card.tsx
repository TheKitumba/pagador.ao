"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Location01Icon, Login03Icon, Logout03Icon } from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/format";
import { toastService } from "@/services/toast.service";

/** Clock in / out from the phone browser. Offline punches are refused clearly (doc 03, RF-05-06). */
export function ClockCard() {
  const [now, setNow] = useState<Date | null>(null);
  const [clockedInAt, setClockedInAt] = useState<string | null>("07:52");

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const punch = () => {
    if (!navigator.onLine) {
      toastService.error("Sem ligação à internet", "A marcação não foi registada. Use o quiosque ou peça correcção à chefia.");
      return;
    }
    if (clockedInAt) {
      setClockedInAt(null);
      toastService.success("Saída registada", `Às ${formatTime(new Date())} · Sede — Talatona`);
    } else {
      setClockedInAt(formatTime(new Date()));
      toastService.success("Entrada registada", `Às ${formatTime(new Date())} · Sede — Talatona`);
    }
  };

  return (
    <section aria-labelledby="clock-title" className="rounded-xl border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="clock-title" className="text-sm text-muted-foreground">
            Ponto de hoje
          </h2>
          <p className="mt-1 text-3xl font-semibold tabular" aria-live="off">
            {now ? formatTime(now) : "--:--"}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <HugeiconsIcon icon={Location01Icon} className="size-3.5" aria-hidden />
            Sede — Talatona, Luanda
          </p>
        </div>
        <p className="text-right text-sm" aria-live="polite">
          {clockedInAt ? (
            <>
              <span className="block text-muted-foreground">Entrada</span>
              <span className="font-medium tabular">{clockedInAt}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Ainda sem entrada</span>
          )}
        </p>
      </div>
      <Button onClick={punch} size="lg" variant={clockedInAt ? "outline" : "default"} className="mt-5 h-12 w-full text-base">
        <HugeiconsIcon icon={clockedInAt ? Logout03Icon : Login03Icon} aria-hidden />
        {clockedInAt ? "Registar saída" : "Registar entrada"}
      </Button>
    </section>
  );
}
