"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

import { DownloadButton } from "@/components/common/action-buttons";
import { FormDialog } from "@/components/common/form-dialog";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { headcountByDepartment } from "@/mocks/management";

/** Report preview in a side sheet, with export and scheduled delivery. */
export function ReportSheet({ name, updated }: { name: string; updated: string }) {
  const rows = headcountByDepartment.map((row, index) => ({ grupo: row.department, valor: row.headcount, variacao: `${index % 2 ? "-" : "+"}${(index + 1) * 0.8}%` }));

  return (
    <Sheet>
      <SheetTrigger className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-accent">
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{name}</span>
          <span className="block text-xs text-muted-foreground">Actualizado: {updated}</span>
        </span>
        <HugeiconsIcon icon={ArrowRight01Icon} className="size-4 text-muted-foreground group-hover:text-foreground" aria-hidden />
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-xl">
        <SheetHeader className="border-b px-6 py-4 text-left">
          <SheetTitle>{name}</SheetTitle>
          <SheetDescription>Actualizado: {updated} · Kianda Logística, Lda.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <table className="w-full text-sm">
            <caption className="sr-only">{name}</caption>
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th scope="col" className="py-2 text-left font-medium">Departamento</th>
                <th scope="col" className="py-2 text-right font-medium">Valor</th>
                <th scope="col" className="py-2 text-right font-medium">Variação</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.grupo} className="border-b last:border-0">
                  <th scope="row" className="py-2.5 text-left font-medium">{row.grupo}</th>
                  <td className="py-2.5 text-right tabular">{row.valor}</td>
                  <td className="py-2.5 text-right tabular text-muted-foreground">{row.variacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SheetFooter className="gap-2 border-t px-6 py-4">
          <FormDialog
            title={`Agendar envio — ${name}`}
            submitLabel="Agendar"
            successTitle="Envio agendado"
            fields={[
              { name: "frequency", label: "Frequência", type: "select", required: true, options: ["Semanal", "Mensal", "Trimestral"] },
              { name: "recipients", label: "Destinatários (e-mails separados por vírgula)", required: true, full: true },
            ]}
            trigger={<Button variant="outline">Agendar envio</Button>}
          />
          <DownloadButton size="default" filename={`${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.csv`} label="Exportar CSV" rows={rows} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
