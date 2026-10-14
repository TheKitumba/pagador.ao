import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";
import { type PayrollRunStatus, payrollSteps } from "@/mocks/payroll";

/** Monthly payroll cycle; the current step is announced with aria-current. */
export function PayrollStepper({ status, compact = false }: { status: PayrollRunStatus; compact?: boolean }) {
  const currentIndex = payrollSteps.findIndex((step) => step.status === status);

  return (
    <ol className={cn("grid gap-2", compact ? "grid-cols-6" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6")}>
      {payrollSteps.map((step, index) => {
        const done = index < currentIndex || status === "closed";
        const current = index === currentIndex && status !== "closed";

        return (
          <li key={step.status} aria-current={current ? "step" : undefined} className="min-w-0">
            <div
              className={cn(
                "h-1 rounded-full",
                done ? "bg-success" : current ? "bg-primary" : "bg-muted",
              )}
            />
            {!compact && (
              <div className="mt-2 flex items-start gap-1.5">
                <span
                  className={cn(
                    "mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                    done && "bg-success text-success-foreground",
                    current && "bg-primary text-primary-foreground",
                    !done && !current && "bg-muted text-muted-foreground",
                  )}
                  aria-hidden
                >
                  {done ? <HugeiconsIcon icon={Tick02Icon} className="size-3" strokeWidth={2.5} /> : index + 1}
                </span>
                <span className="min-w-0">
                  <span className={cn("block truncate text-[13px] font-medium", !done && !current && "text-muted-foreground")}>
                    {step.label}
                    <span className="sr-only">{done ? " (concluído)" : current ? " (passo actual)" : " (por fazer)"}</span>
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">{step.hint}</span>
                </span>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
