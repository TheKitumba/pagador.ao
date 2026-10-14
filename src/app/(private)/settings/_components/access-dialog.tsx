"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Copy01Icon,
  Delete02Icon,
  Link01Icon,
  LockIcon,
  Mail01Icon,
  PlusSignIcon,
  Shield01Icon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { PersonAvatar } from "@/components/common/person-avatar";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { company } from "@/mocks/people";

export const roles = [
  "Administrador da conta",
  "Gestor de RH",
  "Técnico de RH",
  "Processador salarial",
  "Aprovador financeiro",
  "Chefia directa",
  "Recrutador",
  "Auditor externo",
] as const;

type Role = (typeof roles)[number];

const roleDescriptions: Record<Role, string> = {
  "Administrador da conta": "Gere a subscrição, as empresas, os utilizadores e as configurações.",
  "Gestor de RH": "Gere todo o ciclo do trabalhador, incluindo salários e dados bancários.",
  "Técnico de RH": "Operações do dia-a-dia, sem acesso a salários.",
  "Processador salarial": "Lançamentos, cálculo e revisão da folha. Não aprova a folha que calcula.",
  "Aprovador financeiro": "Aprova folhas e lotes de pagamento.",
  "Chefia directa": "Aprova pedidos da equipa e avalia o desempenho.",
  Recrutador: "Gere vagas e candidatos.",
  "Auditor externo": "Apenas leitura de mapas, relatórios e auditoria, com prazo de validade.",
};

function RolesSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <HugeiconsIcon icon={Shield01Icon} aria-hidden />
          Gerir papéis
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Papéis e permissões</SheetTitle>
          <SheetDescription>Permissões sensíveis (salários, saúde, disciplina) são atribuídas explicitamente.</SheetDescription>
        </SheetHeader>
        <ul className="mt-6 space-y-3">
          {roles.map((role) => (
            <li key={role} className="rounded-lg border p-3">
              <p className="text-sm font-medium">{role}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{roleDescriptions[role]}</p>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}

interface Member {
  name: string;
  email: string;
  role: Role;
  pending?: boolean;
  locked?: boolean;
}

const initialMembers: Member[] = [
  { name: "Isabel Neto", email: "isabel.neto@kianda.co.ao", role: "Administrador da conta", locked: true },
  { name: "Ana Mateus", email: "ana.mateus@kianda.co.ao", role: "Processador salarial" },
  { name: "Graça Mbemba", email: "graca.mbemba@kianda.co.ao", role: "Aprovador financeiro" },
  { name: "contabilidade@mukuxi.ao", email: "contabilidade@mukuxi.ao", role: "Auditor externo", pending: true },
];

function RolePicker({ value, onChange, disabled, label }: { value: Role; onChange: (role: Role) => void; disabled?: boolean; label: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button variant="outline" size="sm" className="w-44 justify-between font-normal" aria-label={`${label}: ${value}`}>
          <span className="truncate">{value}</span>
          <HugeiconsIcon icon={ArrowDown01Icon} className="text-muted-foreground" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuRadioGroup value={value} onValueChange={(next) => onChange(next as Role)}>
          {roles.map((role) => (
            <DropdownMenuRadioItem key={role} value={role}>
              {role}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Invite people and manage who can access the company account. */
export function AccessDialog() {
  const [members, setMembers] = useState(initialMembers);
  const [email, setEmail] = useState("");
  const [newRole, setNewRole] = useState<Role>("Técnico de RH");
  const [error, setError] = useState<string | null>(null);

  const invite = (event: FormEvent) => {
    event.preventDefault();
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Indique um e-mail válido.");
      return;
    }
    if (members.some((member) => member.email === value)) {
      setError("Esta pessoa já tem acesso.");
      return;
    }
    setMembers((current) => [...current, { name: value, email: value, role: newRole, pending: true }]);
    setEmail("");
    setError(null);
    toast.success("Convite enviado", { description: `${value} · ${newRole}` });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText("https://app.pagador.ao/convite/kianda-7f3a9c");
      toast.success("Ligação copiada");
    } catch {
      toast.error("Não foi possível copiar a ligação");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <HugeiconsIcon icon={UserAdd01Icon} aria-hidden />
          Convidar
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[640px]">
        <Tabs defaultValue="email">
          <div className="flex items-center gap-2 border-b px-4 py-3 pr-12">
            <TabsList className="h-auto gap-1 bg-transparent p-0">
              <TabsTrigger
                value="email"
                className="h-9 gap-2 rounded-lg border border-transparent px-3 data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:shadow-xs"
              >
                <HugeiconsIcon icon={Mail01Icon} className="size-4" aria-hidden />
                Convidar por e-mail
              </TabsTrigger>
              <TabsTrigger
                value="link"
                className="h-9 gap-2 rounded-lg border border-transparent px-3 data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:shadow-xs"
              >
                <HugeiconsIcon icon={Link01Icon} className="size-4" aria-hidden />
                Ligação de convite
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
            <DialogTitle className="text-lg font-semibold">Dar acesso à empresa</DialogTitle>
            <DialogDescription className="sr-only">Convide pessoas e escolha o papel de cada uma.</DialogDescription>

            <div className="mt-4 flex items-center gap-4 rounded-xl border p-3">
              <span aria-hidden className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 via-violet-500 to-fuchsia-500 text-lg font-bold text-white">
                {company.shortName[0]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{company.name}</p>
                <p className="text-sm text-muted-foreground">
                  NIF {company.nif} · Plano {company.plan}
                </p>
              </div>
              <span className="inline-flex size-9 items-center justify-center rounded-lg border text-muted-foreground" title="Conta privada">
                <HugeiconsIcon icon={LockIcon} className="size-4" aria-label="Conta privada" />
              </span>
            </div>

            <h3 className="mt-6 font-semibold">Quem tem acesso</h3>
            <p className="text-sm text-muted-foreground">Cada pessoa vê apenas o que o seu papel permite. Os papéis com acesso a salários exigem 2FA.</p>

            <TabsContent value="email" className="mt-4 space-y-4">
              <div className="flex items-center gap-3 rounded-xl border p-3">
                <span className="inline-flex size-9 items-center justify-center rounded-lg border text-muted-foreground">
                  <HugeiconsIcon icon={Shield01Icon} className="size-4" aria-hidden />
                </span>
                <span className="flex-1 text-sm font-medium">Apenas pessoas convidadas, com 2FA</span>
                <StatusBadge tone="success">Activo</StatusBadge>
              </div>

              <form onSubmit={invite} noValidate className="space-y-1.5">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <label htmlFor="invite-email" className="sr-only">
                    E-mail da pessoa a convidar
                  </label>
                  <Input
                    id="invite-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="E-mail da pessoa a convidar…"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? "invite-error" : undefined}
                    className="flex-1"
                  />
                  <RolePicker value={newRole} onChange={setNewRole} label="Papel do convidado" />
                  <Button type="submit" variant="outline">
                    <HugeiconsIcon icon={PlusSignIcon} aria-hidden />
                    Convidar
                  </Button>
                </div>
                {error && (
                  <p id="invite-error" role="alert" className="text-sm text-destructive">
                    {error}
                  </p>
                )}
              </form>

              <p className="pt-2 text-sm text-muted-foreground" aria-live="polite">
                {members.length} pessoas têm acesso:
              </p>
              <ul className="space-y-1">
                {members.map((member) => (
                  <li key={member.email} className="flex flex-wrap items-center gap-3 rounded-lg py-2">
                    <PersonAvatar name={member.name} size="md" status={member.pending ? undefined : "online"} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-medium">{member.pending ? member.email : member.name}</p>
                        {member.pending && <StatusBadge tone="info" dot={false}>Convite pendente</StatusBadge>}
                      </div>
                      {!member.pending && <p className="truncate text-sm text-muted-foreground">{member.email}</p>}
                    </div>
                    <RolePicker
                      value={member.role}
                      disabled={member.locked}
                      label={`Papel de ${member.name}`}
                      onChange={(role) =>
                        setMembers((current) => current.map((item) => (item.email === member.email ? { ...item, role } : item)))
                      }
                    />
                    <ConfirmDialog
                      tone="danger"
                      title={`Remover o acesso de ${member.pending ? member.email : member.name}?`}
                      description={<p>A pessoa deixa de conseguir entrar na conta da {company.shortName}. As sessões abertas são terminadas de imediato.</p>}
                      confirmLabel="Remover acesso"
                      onConfirm={() => {
                        setMembers((current) => current.filter((item) => item.email !== member.email));
                        toast.success("Acesso removido", {
                          description: member.email,
                          action: { label: "Anular", onClick: () => setMembers((current) => [...current, member]) },
                        });
                      }}
                      trigger={
                        <Button variant="outline" size="icon-sm" disabled={member.locked} aria-label={`Remover acesso de ${member.name}`}>
                          <HugeiconsIcon icon={Delete02Icon} />
                        </Button>
                      }
                    />
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="link" className="mt-4 space-y-3">
              <p className="text-sm">Qualquer pessoa com a ligação pode pedir acesso. Os pedidos ficam pendentes da sua aprovação.</p>
              <div className="flex gap-2">
                <Input readOnly value="https://app.pagador.ao/convite/kianda-7f3a9c" aria-label="Ligação de convite" className="font-mono text-xs" />
                <Button variant="outline" onClick={copyLink}>
                  <HugeiconsIcon icon={Copy01Icon} aria-hidden />
                  Copiar
                </Button>
              </div>
            </TabsContent>
          </div>

          <div className="flex items-center justify-between gap-3 border-t bg-muted/30 px-6 py-3">
            <RolesSheet />
            <Button size="sm" onClick={copyLink}>
              <HugeiconsIcon icon={Copy01Icon} aria-hidden />
              Copiar ligação
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
