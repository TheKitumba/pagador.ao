"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  BeachIcon,
  Coins01Icon,
  DocumentValidationIcon,
  Invoice01Icon,
  MoneyBag02Icon,
  PlusSignIcon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const createActions = [
  { title: "Admitir trabalhador", description: "Dados, contrato e documentos", href: "/employees/new", icon: UserAdd01Icon },
  { title: "Processar folha", description: "Folha de outubro 2026", href: "/payroll/2026-10", icon: MoneyBag02Icon },
  { title: "Registar ausência", description: "Férias, faltas ou licenças", href: "/leave?new=1", icon: BeachIcon },
  { title: "Adiantamento ou empréstimo", description: "Com plano de prestações", href: "/loans?new=1", icon: Coins01Icon },
  { title: "Pedido de reembolso", description: "Despesas com comprovativo", href: "/reimbursements?new=1", icon: Invoice01Icon },
  { title: "Gerar mapas fiscais", description: "IRT (AGT) e INSS", href: "/tax-filings", icon: DocumentValidationIcon },
];

/** Primary "Criar" button of the app, with the most frequent creation flows. */
export function CreateMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-1.5">
          <HugeiconsIcon icon={PlusSignIcon} aria-hidden />
          <span className="hidden sm:inline">Criar</span>
          <HugeiconsIcon icon={ArrowDown01Icon} className="hidden sm:block" aria-hidden />
          <span className="sr-only sm:hidden">Criar</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Criar novo</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {createActions.map((action) => (
          <DropdownMenuItem key={action.href} asChild className="gap-3 py-2">
            <Link href={action.href}>
              <span className="inline-flex size-8 items-center justify-center rounded-md border bg-muted/60 text-muted-foreground">
                <HugeiconsIcon icon={action.icon} className="size-4" aria-hidden />
              </span>
              <span>
                <span className="block font-medium">{action.title}</span>
                <span className="block text-xs text-muted-foreground">{action.description}</span>
              </span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
