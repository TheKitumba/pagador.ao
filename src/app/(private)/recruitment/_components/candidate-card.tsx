"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, Download04Icon, StarIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useState } from "react";

import { DescriptionList } from "@/components/common/cards";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { FormDialog } from "@/components/common/form-dialog";
import { PersonAvatar } from "@/components/common/person-avatar";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { downloadFile } from "@/lib/download";
import { formatDate } from "@/lib/format";
import { pipelineStages } from "@/mocks/people";
import { toastService } from "@/services/toast.service";

interface Candidate {
  name: string;
  job: string;
  stage: string;
  score: number;
  appliedAt: string;
}

function Stars({ score }: { score: number }) {
  return (
    <span className="flex items-center gap-0.5" role="img" aria-label={`Avaliação ${score} de 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <HugeiconsIcon key={index} icon={StarIcon} className={index < score ? "size-3.5 fill-amber-400 text-amber-400" : "size-3.5"} aria-hidden />
      ))}
    </span>
  );
}

/** Kanban card that opens the candidate in a side sheet. */
export function CandidateCard({ candidate }: { candidate: Candidate }) {
  const [stage, setStage] = useState(candidate.stage);
  const email = `${candidate.name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, ".")}@gmail.com`;

  return (
    <Sheet>
      <SheetTrigger className="w-full rounded-lg border bg-card p-3 text-left shadow-card transition-colors hover:border-foreground/15">
        <span className="flex items-center gap-2.5">
          <PersonAvatar name={candidate.name} />
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">{candidate.name}</span>
            <span className="block truncate text-xs text-muted-foreground">{candidate.job}</span>
          </span>
        </span>
        <span className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <Stars score={candidate.score} />
          {formatDate(candidate.appliedAt)}
        </span>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-5 text-left">
          <div className="flex items-center gap-3">
            <PersonAvatar name={candidate.name} size="lg" />
            <div>
              <SheetTitle>{candidate.name}</SheetTitle>
              <SheetDescription>{candidate.job}</SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          <DescriptionList
            items={[
              { label: "Fase", value: <StatusBadge tone="info">{stage}</StatusBadge> },
              { label: "Avaliação", value: <Stars score={candidate.score} /> },
              { label: "Candidatura", value: formatDate(candidate.appliedAt) },
              { label: "E-mail", value: email },
            ]}
          />
          <div className="space-y-1.5">
            <Label htmlFor={`stage-${candidate.name}`}>Mover para</Label>
            <Select
              value={stage}
              onValueChange={(next) => {
                setStage(next);
                toastService.success("Candidato movido", `${candidate.name} → ${next}`);
              }}
            >
              <SelectTrigger id={`stage-${candidate.name}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pipelineStages.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2">
            <FormDialog
              title={`Agendar entrevista — ${candidate.name}`}
              submitLabel="Agendar"
              successTitle="Entrevista agendada"
              successDescription="Convite enviado ao candidato e aos entrevistadores."
              fields={[
                { name: "date", label: "Data", type: "date", required: true },
                { name: "time", label: "Hora", required: true, placeholder: "10:00" },
                { name: "interviewer", label: "Entrevistador", type: "employee", required: true, full: true },
                { name: "mode", label: "Formato", type: "select", required: true, full: true, options: ["Presencial — Talatona", "Videochamada", "Telefone"] },
              ]}
              trigger={
                <Button variant="outline" size="sm">
                  <HugeiconsIcon icon={Calendar03Icon} aria-hidden />
                  Agendar entrevista
                </Button>
              }
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadFile(`cv-${candidate.name.replace(/\s+/g, "-").toLowerCase()}.txt`, `Currículo de ${candidate.name}\nCandidatura a ${candidate.job}`)}
            >
              <HugeiconsIcon icon={Download04Icon} aria-hidden />
              Currículo
            </Button>
          </div>
        </div>
        <SheetFooter className="gap-2 border-t px-6 py-4">
          <ConfirmDialog
            tone="danger"
            title={`Rejeitar ${candidate.name}?`}
            description={<p>O candidato recebe um e-mail de agradecimento. Os dados são conservados apenas pelo prazo autorizado (Lei n.º 22/11).</p>}
            reason={{ label: "Motivo (interno)", required: true }}
            confirmLabel="Rejeitar candidato"
            successTitle="Candidato rejeitado"
            successDescription={candidate.name}
            trigger={<Button variant="outline">Rejeitar</Button>}
          />
          {stage === "Proposta" || stage === "Contratado" ? (
            <Button asChild>
              <Link href="/employees/new">Admitir</Link>
            </Button>
          ) : (
            <Button
              onClick={() => {
                const next = pipelineStages[Math.min(pipelineStages.indexOf(stage as (typeof pipelineStages)[number]) + 1, pipelineStages.length - 1)];
                setStage(next);
                toastService.success("Candidato avançou", `${candidate.name} → ${next}`);
              }}
            >
              Avançar fase
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
