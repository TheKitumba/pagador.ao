"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { BookOpen01Icon, ThumbsDownIcon, ThumbsUpIcon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toastService } from "@/services/toast.service";

const steps: Record<string, string[]> = {
  default: [
    "Abra o módulo indicado no menu lateral ou pesquise com ⌘K.",
    "Use o botão principal no canto superior direito para criar um novo registo.",
    "Preencha os campos obrigatórios (marcados com *) e guarde.",
    "Acompanhe o estado na lista. As aprovações chegam à caixa Aprovações.",
  ],
};

/** Help article in a side sheet, so users keep their place in the help centre. */
export function ArticleSheet({ title, category, minutes }: { title: string; category: string; minutes: number }) {
  return (
    <Sheet>
      <SheetTrigger className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-accent">
        <HugeiconsIcon icon={BookOpen01Icon} className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        <span className="flex-1 text-sm font-medium">{title}</span>
        <span className="text-xs text-muted-foreground">{minutes} min</span>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader className="text-left">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            {category} · leitura de {minutes} min
          </SheetDescription>
        </SheetHeader>
        <ol className="mt-6 list-decimal space-y-3 pl-5 text-sm leading-relaxed">
          {steps.default.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <div className="mt-8 rounded-lg border p-4">
          <p className="text-sm font-medium">Este artigo foi útil?</p>
          <div className="mt-3 flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toastService.success("Obrigado pela resposta")}>
              <HugeiconsIcon icon={ThumbsUpIcon} aria-hidden />
              Sim
            </Button>
            <Button variant="outline" size="sm" onClick={() => toastService.info("Obrigado. Vamos melhorar este artigo.")}>
              <HugeiconsIcon icon={ThumbsDownIcon} aria-hidden />
              Não
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
