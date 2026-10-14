"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, ArrowRight01Icon, ArrowUp01Icon, Delete02Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { type FormEvent, type ReactNode, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { toastService } from "@/services/toast.service";

/** Settings form that validates natively and confirms the save. */
export function SaveForm({ children, className, successTitle }: { children: ReactNode; className?: string; successTitle: string }) {
  const [pending, setPending] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    setPending(true);
    setTimeout(() => {
      setPending(false);
      toastService.success(successTitle);
    }, 500);
  };

  return (
    <form onSubmit={submit} className={className} aria-busy={pending}>
      {children}
    </form>
  );
}

export function ToggleRow({ id, label, description, defaultChecked }: { id: string; label: string; description: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(Boolean(defaultChecked));

  return (
    <div className="flex items-start justify-between gap-6 py-3">
      <div>
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        <p id={`${id}-desc`} className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <Switch
        id={id}
        checked={checked}
        aria-describedby={`${id}-desc`}
        onCheckedChange={(next) => {
          setChecked(next);
          toastService.success(next ? "Activado" : "Desactivado", label);
        }}
      />
    </div>
  );
}

const approvers = ["Chefia directa", "Chefia de nível 2", "Técnico de RH", "Gestor de RH", "Aprovador financeiro", "Finanças", "Direcção", "Jurídico"];

/** Edit the steps of an approval workflow (doc 05, 5.5) in a side sheet. */
export function WorkflowSheet({ request, flow }: { request: string; flow: string }) {
  const initial = flow.split("→").map((step) => step.replace(/\(.*\)/, "").trim());
  const [steps, setSteps] = useState(initial.map((step) => (approvers.includes(step) ? step : approvers[0])));
  const [open, setOpen] = useState(false);

  const move = (index: number, delta: number) =>
    setSteps((current) => {
      const next = [...current];
      [next[index], next[index + delta]] = [next[index + delta], next[index]];
      return next;
    });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Editar fluxo de ${request}`}>
          <HugeiconsIcon icon={ArrowRight01Icon} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-4 text-left">
          <SheetTitle>Fluxo — {request}</SheetTitle>
          <SheetDescription>Os passos são executados por ordem. Ninguém aprova um pedido em seu próprio benefício.</SheetDescription>
        </SheetHeader>
        <ol className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
          {steps.map((step, index) => (
            <li key={index} className="flex items-center gap-2 rounded-lg border p-3">
              <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{index + 1}</span>
              <Select value={step} onValueChange={(value) => setSteps((current) => current.map((item, i) => (i === index ? value : item)))}>
                <SelectTrigger aria-label={`Aprovador do passo ${index + 1}`} className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {approvers.map((approver) => (
                    <SelectItem key={approver} value={approver}>
                      {approver}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon-sm" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Subir passo ${index + 1}`}>
                <HugeiconsIcon icon={ArrowUp01Icon} />
              </Button>
              <Button variant="ghost" size="icon-sm" disabled={index === steps.length - 1} onClick={() => move(index, 1)} aria-label={`Descer passo ${index + 1}`}>
                <HugeiconsIcon icon={ArrowDown01Icon} />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={steps.length === 1}
                onClick={() => setSteps((current) => current.filter((_, i) => i !== index))}
                aria-label={`Remover passo ${index + 1}`}
              >
                <HugeiconsIcon icon={Delete02Icon} />
              </Button>
            </li>
          ))}
          <li>
            <Button variant="outline" size="sm" onClick={() => setSteps((current) => [...current, approvers[0]])}>
              <HugeiconsIcon icon={PlusSignIcon} aria-hidden />
              Adicionar passo
            </Button>
          </li>
        </ol>
        <SheetFooter className="gap-2 border-t px-6 py-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              toastService.success("Fluxo guardado", `${request}: ${steps.join(" → ")}`);
              setOpen(false);
            }}
          >
            Guardar fluxo
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
