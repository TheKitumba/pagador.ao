import { HugeiconsIcon } from "@hugeicons/react";
import { Link01Icon, Location01Icon, PlusSignIcon, UserAdd01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";

import { DataTable } from "@/components/common/data-table";
import { PageBody, PageHeader, PageTabPanel, PageTabs } from "@/components/common/page";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { candidates, jobOpenings } from "@/mocks/people";
import { FormDialog } from "@/components/common/form-dialog";
import { HeaderButton } from "@/components/common/header-button";
import { forms } from "@/config/forms";

import { CandidateBoard } from "./_components/candidate-board";

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
            <FormDialog {...forms.job} trigger={<HeaderButton icon={PlusSignIcon} label="Nova vaga" />} />
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
            <CandidateBoard initialCandidates={candidates} />
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
