import { PlusSignIcon, Target02Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { ProgressBar, SectionCard } from "@/components/common/cards";
import { PageBody, PageHeader, PageTabPanel, PageTabs } from "@/components/common/page";
import { PersonAvatar } from "@/components/common/person-avatar";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { goals, nineBox, reviewCycles } from "@/mocks/growth";
import { FormDialog } from "@/components/common/form-dialog";
import { HeaderButton } from "@/components/common/header-button";
import { forms } from "@/config/forms";

export const metadata: Metadata = { title: "Desempenho" };

const cycleStatus = {
  scheduled: { label: "Agendado", tone: "neutral" as const },
  active: { label: "A decorrer", tone: "info" as const },
  closed: { label: "Concluído", tone: "success" as const },
};

export default function PerformancePage() {
  return (
    <>
      <PageHeader
        title="Desempenho"
        icon={Target02Icon}
        description="Ciclos de avaliação, objectivos e resultados"
        actions={
          <FormDialog {...forms.reviewCycle} trigger={<HeaderButton icon={PlusSignIcon} label="Novo ciclo" />} />
        }
      />
      <PageTabs
        tabs={[
          { value: "cycles", label: "Ciclos", count: reviewCycles.length },
          { value: "goals", label: "Objectivos", count: goals.length },
          { value: "ninebox", label: "Matriz 9-box" },
        ]}
      >
        <PageBody>
          <PageTabPanel value="cycles">
            <ul className="grid gap-4 md:grid-cols-3">
              {reviewCycles.map((cycle) => (
                <li key={cycle.name} className="rounded-xl border bg-card p-5 shadow-card">
                  <StatusBadge tone={cycleStatus[cycle.status].tone}>{cycleStatus[cycle.status].label}</StatusBadge>
                  <h2 className="mt-3 text-[15px] font-semibold">{cycle.name}</h2>
                  <p className="text-sm text-muted-foreground">{cycle.period}</p>
                  <div className="mt-5 space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Avaliações concluídas</span>
                      <span className="tabular">
                        {cycle.completed} / {cycle.participants}
                      </span>
                    </div>
                    <ProgressBar value={(cycle.completed / cycle.participants) * 100} label={`Progresso de ${cycle.name}`} tone={cycle.status === "closed" ? "success" : "info"} />
                  </div>
                </li>
              ))}
            </ul>
          </PageTabPanel>

          <PageTabPanel value="goals">
            <SectionCard title="Objectivos de 2026" contentClassName="px-0 pb-0">
              <ul className="divide-y">
                {goals.map((goal) => (
                  <li key={goal.title} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <PersonAvatar name={goal.owner} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{goal.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {goal.owner} · até {formatDate(goal.due)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:w-72">
                      <ProgressBar value={goal.progress} tone={goal.status === "at-risk" ? "warning" : "success"} label={goal.title} />
                      <span className="w-10 text-right text-sm tabular">{goal.progress}%</span>
                      <StatusBadge tone={goal.status === "at-risk" ? "warning" : "success"}>{goal.status === "at-risk" ? "Em risco" : "No bom caminho"}</StatusBadge>
                    </div>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </PageTabPanel>

          <PageTabPanel value="ninebox">
            <SectionCard title="Desempenho × potencial" description="Avaliação semestral 2026 · 248 trabalhadores">
              <div className="flex gap-3">
                <p className="flex w-6 items-center justify-center text-xs text-muted-foreground [writing-mode:vertical-rl] rotate-180">Potencial →</p>
                <div className="flex-1">
                  <ul className="grid grid-cols-3 gap-2">
                    {nineBox.map((cell, index) => (
                      <li
                        key={cell.label}
                        className={cn(
                          "flex min-h-24 flex-col justify-between rounded-lg border p-3",
                          [2].includes(index) && "border-success/30 bg-success/10",
                          [1, 5].includes(index) && "bg-success/5",
                          [6].includes(index) && "border-destructive/20 bg-destructive/5",
                          [3].includes(index) && "bg-warning/5",
                        )}
                      >
                        <span className="text-xs font-medium">{cell.label}</span>
                        <span className="text-2xl font-semibold tabular">{cell.count}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-center text-xs text-muted-foreground">Desempenho →</p>
                </div>
              </div>
            </SectionCard>
          </PageTabPanel>
        </PageBody>
      </PageTabs>
    </>
  );
}
