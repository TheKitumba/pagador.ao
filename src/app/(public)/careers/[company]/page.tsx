import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, Location01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { APP_NAME } from "@/config/app";
import { formatDate } from "@/lib/format";
import { company, jobOpenings } from "@/mocks/people";

import { ApplyDialog } from "./_components/apply-dialog";

export const metadata: Metadata = { title: `Carreiras — ${company.shortName}` };

export default function CareersPage() {
  const openings = jobOpenings.filter((job) => job.status === "open");

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
          <span aria-hidden className="inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 via-violet-500 to-fuchsia-500 text-lg font-bold text-white">
            {company.shortName[0]}
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight">Trabalhe na {company.shortName}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Movemos mercadorias entre Luanda, Lobito e Huambo todos os dias. Procuramos pessoas rigorosas que gostem de resolver problemas.
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <h2 className="text-sm font-medium text-muted-foreground">
          {openings.length} vagas abertas
        </h2>
        <ul className="mt-4 space-y-3">
          {openings.map((job) => (
            <li key={job.id} className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-card sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <h3 className="text-[15px] font-semibold">{job.title}</h3>
                <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon icon={Location01Icon} className="size-4" aria-hidden />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon icon={Clock01Icon} className="size-4" aria-hidden />
                    {job.type}
                  </span>
                  <span>Publicada a {formatDate(job.openedAt)}</span>
                </p>
              </div>
              <ApplyDialog jobTitle={job.title} />
            </li>
          ))}
        </ul>
      </main>
      <footer className="py-8 text-center text-xs text-muted-foreground">Recrutamento gerido com {APP_NAME}</footer>
    </div>
  );
}
