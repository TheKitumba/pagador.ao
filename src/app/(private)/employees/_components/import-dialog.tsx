"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, CheckmarkCircle02Icon, Download04Icon, FileImportIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";

import { HeaderButton } from "@/components/common/header-button";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { downloadFile, toCsv } from "@/lib/download";
import { toastService } from "@/services/toast.service";

type Step = "choose" | "validating" | "review";

const TEMPLATE = toCsv([
  {
    nome: "Ana Mateus",
    bi: "006512378LA041",
    nif: "006512378LA041",
    telemovel: "+244 923 456 781",
    email: "ana.mateus@empresa.co.ao",
    cargo: "Técnica de Contabilidade",
    departamento: "Finanças",
    admissao: "2026-10-01",
    vencimento_base: "300000",
    banco: "BFA",
    iban: "AO06 0006 0000 4512 3781 0118 7",
  },
]);

export function ImportDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("choose");
  const [file, setFile] = useState<File | null>(null);

  const reset = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setStep("choose");
      setFile(null);
    }
  };

  const validate = () => {
    setStep("validating");
    setTimeout(() => setStep("review"), 900);
  };

  const confirm = () => {
    toastService.success("Importação concluída", "11 trabalhadores importados. 1 linha ignorada.");
    reset(false);
  };

  return (
    <Dialog open={open} onOpenChange={reset}>
      <DialogTrigger asChild>
        <HeaderButton variant="outline" icon={FileImportIcon} label="Importar Excel" className="hidden md:inline-flex" collapse={false} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Importar trabalhadores</DialogTitle>
          <DialogDescription>Excel ou CSV, uma linha por trabalhador. Validamos BI, NIF e IBAN antes de importar.</DialogDescription>
        </DialogHeader>

        {step === "choose" && (
          <div className="space-y-4">
            <label className="flex cursor-pointer flex-col items-center rounded-xl border border-dashed p-8 text-center hover:bg-accent/40 focus-within:ring-2 focus-within:ring-ring">
              <HugeiconsIcon icon={FileImportIcon} className="size-8 text-muted-foreground" aria-hidden />
              <span className="mt-3 text-sm font-medium">{file ? file.name : "Escolher ficheiro"}</span>
              <span className="mt-1 text-xs text-muted-foreground">.xlsx, .xls ou .csv · até 10 MB</span>
              <input type="file" accept=".xlsx,.xls,.csv" className="sr-only" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            </label>
            <Button variant="link" className="h-auto p-0" onClick={() => downloadFile("modelo-trabalhadores.csv", TEMPLATE, "text/csv;charset=utf-8")}>
              <HugeiconsIcon icon={Download04Icon} aria-hidden />
              Descarregar modelo
            </Button>
          </div>
        )}

        {step === "validating" && (
          <p role="status" className="py-10 text-center text-sm text-muted-foreground">
            A validar {file?.name}…
          </p>
        )}

        {step === "review" && (
          <ul className="space-y-2" aria-live="polite">
            <li className="flex items-center gap-3 rounded-lg border border-success/20 bg-success/5 p-3 text-sm">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-5 text-success" aria-hidden />
              <span>
                <span className="font-medium">11 linhas válidas</span> prontas a importar
              </span>
            </li>
            <li className="flex items-start gap-3 rounded-lg border border-warning/25 bg-warning/5 p-3 text-sm">
              <HugeiconsIcon icon={Alert02Icon} className="mt-0.5 size-5 text-warning" aria-hidden />
              <span>
                <span className="font-medium">Linha 7 ignorada:</span> IBAN inválido (dígitos de controlo não conferem). Corrija e importe de novo.
              </span>
            </li>
          </ul>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => reset(false)}>
            Cancelar
          </Button>
          {step === "review" ? (
            <Button onClick={confirm}>Importar 11 trabalhadores</Button>
          ) : (
            <Button onClick={validate} disabled={!file || step === "validating"}>
              Validar ficheiro
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
