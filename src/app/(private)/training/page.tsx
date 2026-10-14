import { HugeiconsIcon } from "@hugeicons/react";
import { Mortarboard01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { ProgressBar } from "@/components/common/cards";
import { DataTable } from "@/components/common/data-table";
import { PageBody, PageHeader, PageTabPanel, PageTabs } from "@/components/common/page";
import { PersonCell } from "@/components/common/person-avatar";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { certificates, trainings } from "@/mocks/growth";

export const metadata: Metadata = { title: "Formação" };

export default function TrainingPage() {
  return (
    <>
      <PageHeader
        title="Formação"
        icon={Mortarboard01Icon}
        description="Plano de formação, acções e certificados"
        actions={
          <Button>
            <HugeiconsIcon icon={PlusSignIcon} aria-hidden />
            <span className="hidden sm:inline">Nova acção</span>
            <span className="sr-only sm:hidden">Nova acção</span>
          </Button>
        }
      />
      <PageTabs
        tabs={[
          { value: "sessions", label: "Acções", count: trainings.length },
          { value: "certificates", label: "Certificados", count: certificates.length },
        ]}
      >
        <PageBody>
          <PageTabPanel value="sessions">
            <ul className="grid gap-4 md:grid-cols-2">
              {trainings.map((training) => (
                <li key={training.title} className="rounded-xl border bg-card p-5 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-[15px] font-semibold">{training.title}</h2>
                      <p className="text-sm text-muted-foreground">{training.provider}</p>
                    </div>
                    {training.mandatory && <StatusBadge tone="warning">Obrigatória</StatusBadge>}
                  </div>
                  <p className="mt-3 text-sm tabular text-muted-foreground">
                    {formatDate(training.date)} · {training.hours} h
                  </p>
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Inscritos</span>
                      <span className="tabular">
                        {training.enrolled} / {training.seats}
                      </span>
                    </div>
                    <ProgressBar value={(training.enrolled / training.seats) * 100} tone={training.enrolled === training.seats ? "success" : "info"} label={`Vagas preenchidas em ${training.title}`} />
                  </div>
                </li>
              ))}
            </ul>
          </PageTabPanel>
          <PageTabPanel value="certificates">
            <DataTable
              caption="Certificados a expirar"
              rows={certificates}
              getRowKey={(row) => `${row.employee}-${row.title}`}
              columns={[
                { key: "employee", header: "Trabalhador", cell: (row) => <PersonCell name={row.employee} detail={row.title} /> },
                { key: "expires", header: "Validade", cell: (row) => <span className="tabular">{formatDate(row.expires)}</span> },
                { key: "status", header: "Estado", cell: (row) => <StatusBadge tone={row.expires < "2026-12-01" ? "warning" : "success"}>{row.expires < "2026-12-01" ? "A expirar" : "Válido"}</StatusBadge> },
              ]}
            />
          </PageTabPanel>
        </PageBody>
      </PageTabs>
    </>
  );
}
