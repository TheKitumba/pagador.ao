"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toastService } from "@/services/toast.service";

export function ApplyDialog({ jobTitle }: { jobTitle: string }) {
  const [open, setOpen] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    setOpen(false);
    toastService.success("Candidatura enviada", "Recebe uma confirmação por e-mail. Obrigado!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Candidatar-me<span className="sr-only"> a {jobTitle}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Candidatura</DialogTitle>
          <DialogDescription>{jobTitle}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="apply-name">Nome completo</Label>
            <Input id="apply-name" required autoComplete="name" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="apply-email">E-mail</Label>
              <Input id="apply-email" type="email" required autoComplete="email" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="apply-phone">Telemóvel</Label>
              <Input id="apply-phone" type="tel" required autoComplete="tel" placeholder="+244 9XX XXX XXX" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="apply-cv">Currículo (PDF, até 5 MB)</Label>
            <Input id="apply-cv" type="file" accept="application/pdf" required className="h-auto py-1.5" />
          </div>
          <div className="flex items-start gap-2.5">
            <Checkbox id="apply-consent" required className="mt-0.5" />
            <Label htmlFor="apply-consent" className="text-sm font-normal leading-snug">
              Autorizo o tratamento dos meus dados para este processo de recrutamento (Lei n.º 22/11).
            </Label>
          </div>
          <DialogFooter>
            <Button type="submit">Enviar candidatura</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
