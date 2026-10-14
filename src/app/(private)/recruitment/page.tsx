import { HugeiconsIcon } from "@hugeicons/react";
import { Link01Icon, Location01Icon, PlusSignIcon, StarIcon, UserAdd01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";

import { DataTable } from "@/components/common/data-table";
import { PageBody, PageHeader, PageTabPanel, PageTabs } from "@/components/common/page";
import { PersonAvatar } from "@/components/common/person-avatar";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { candidates, jobOpenings, pipelineStages } from "@/mocks/people";

export const metadata: Metadata = { title: "Recrutamento" };

export default function RecruitmentPage() {
  return (
    <>
      <PageHeader
        title="Recrutamento"
        icon={UserAdd01Icon}
        description="Vagas, candidatos e admissões"
        actions={
          <>
            <Button variant="outline" asChild className="hidden md:inline-flex">
              <Link href="/careers/kianda">
                <HugeiconsIcon icon={Link01Icon} aria-hidden />
                Página de carreiras
              </Link>
            </Button>
            <Button>
              <HugeiconsIcon icon={PlusSignIcon} aria-hidden />
              <span className="hidden sm:inline">Nova vaga</span>
              <span className="sr-only sm:hidden">Nova vaga</span>
            </Button>
          </>
        }
      />
      <PageTabs
        tabs={[
          { value: "pipeline", label: "Candidatos", count: candidates.length },
          { value: "jobs", label: "Vagas", count: jobOpenings.length },
        ]}
      >
        <PageBody className="max-w-none">
          <PageTabPanel value="pipeline">
            <div className="-mx-4 overflow-x-auto px-4 pb-2 md:-mx-6 md:px-6" role="region" aria-label="Quadro de candidatos por fase" tabIndex={0}>
              <ol className="flex min-w-max gap-4" aria-label="Fases do processo de recrutamento">
                {pipelineStages.map((stage) => {
                  const items = candidates.filter((candidate) => candidate.stage === stage);
                  return (
                    <li key={stage} className="flex w-72 flex-col rounded-xl border bg-muted/40 p-2">
                      <h2 className="flex items-center justify-between px-2 py-1.5 text-sm font-semibold">
                        {stage}
                        <span className="tabular text-xs font-normal text-muted-foreground">{items.length}</span>
                      </h2>
                      <ul className="mt-1 space-y-2">
                        {items.map((candidate) => (
                          <li key={candidate.name} className="rounded-lg border bg-card p-3 shadow-card">
                            <div className="flex items-center gap-2.5">
                              <PersonAvatar name={candidate.name} />
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium">{candidate.name}</p>
                                <p className="truncate text-xs text-muted-foreground">{candidate.job}</p>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                              <span className="flex items-center gap-0.5" role="img" aria-label={`Avaliação ${candidate.score} de 5`}>
                                {Array.from({ length: 5 }).map((_, index) => (
                                  <HugeiconsIcon
                                    key={index}
                                    icon={StarIcon}
                                    className={index < candidate.score ? "size-3.5 fill-amber-400 text-amber-400" : "size-3.5"}
                                    aria-hidden
                                  />
                                ))}
                              </span>
                              {formatDate(candidate.appliedAt)}
                            </div>
                          </li>
                        ))}
                        {items.length === 0 && <li className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">Sem candidatos</li>}
                      </ul>
                    </li>
                  );
                })}
              </ol>
            </div>
          </PageTabPanel>
          <PageTabPanel value="jobs">
            <DataTable
              caption="Vagas"
              rows={jobOpenings}
              getRowKey={(row) => row.id}
              columns={[
                {
                  key: "title",
                  header: "Vaga",
                  cell: (row) => (
                    <div>
                      <div className="font-medium">{row.title}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <HugeiconsIcon icon={Location01Icon} className="size-3.5" aria-hidden />
                        {row.location} · {row.type}
                      </div>
                    </div>
                  ),
                },
                { key: "stage", header: "Fase", hideBelow: "md", cell: (row) => row.stage },
                { key: "candidates", header: "Candidatos", align: "right", cell: (row) => <span className="tabular">{row.candidates}</span> },
                { key: "opened", header: "Aberta a", hideBelow: "lg", cell: (row) => formatDate(row.openedAt) },
                { key: "status", header: "Estado", cell: (row) => <StatusBadge tone={row.status === "open" ? "success" : "warning"}>{row.status === "open" ? "Aberta" : "Em pausa"}</StatusBadge> },
              ]}
            />
          </PageTabPanel>
        </PageBody>
      </PageTabs>
    </>
  );
}
