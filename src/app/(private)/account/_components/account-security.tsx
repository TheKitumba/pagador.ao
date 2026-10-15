"use client";

import { type FormEvent, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

import { ROLE_LABEL } from "@api/types/auth";
import { SectionCard } from "@/components/common/cards";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useSession } from "@/providers/session-provider";
import { useEnableTwoFactorMutation, useSetupTwoFactorMutation } from "@/queries/auth/mutation";
import { toastService } from "@/services/toast.service";

/** The signed-in user's own account: identity (from GET /auth/me) and two-factor authentication. */
export function AccountSecurity() {
  const user = useSession();

  return (
    <>
      <SectionCard title="Dados pessoais">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="me-name">Nome</Label>
            <Input id="me-name" value={user.name} readOnly />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="me-email">E-mail</Label>
            <Input id="me-email" type="email" value={user.email ?? "—"} readOnly />
          </div>
          <p className="text-sm text-muted-foreground sm:col-span-2">
            Papel: {user.roles.map((role) => ROLE_LABEL[role]).join(", ")}. Para alterar o nome, o e-mail ou o papel, fale com um administrador da conta.
          </p>
        </div>
      </SectionCard>

      <SectionCard title="Segurança">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-md">
            <p className="flex items-center gap-2 font-medium">
              Autenticação em dois passos
              <StatusBadge tone={user.twoFactorEnabled ? "success" : "warning"}>{user.twoFactorEnabled ? "Activa" : "Por activar"}</StatusBadge>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Além da palavra-passe, pede um código da aplicação autenticadora (Google Authenticator, Microsoft Authenticator ou outra) ao entrar.
              Recomendada para quem vê salários e pagamentos.
            </p>
          </div>
          {!user.twoFactorEnabled && <TwoFactorSetupDialog />}
        </div>
      </SectionCard>
    </>
  );
}

function TwoFactorSetupDialog() {
  const setup = useSetupTwoFactorMutation();
  const enable = useEnableTwoFactorMutation();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const start = () => {
    setOpen(true);
    setCode("");
    setError(null);
    setup.mutate(undefined, { onError: toastService.apiError });
  };

  const confirm = (event?: FormEvent) => {
    event?.preventDefault();
    if (code.length !== 6) {
      setError("Introduza os 6 dígitos que a aplicação mostra.");
      return;
    }
    setError(null);
    enable.mutate(code, {
      onSuccess: () => {
        setOpen(false);
        toastService.success("Autenticação em dois passos activada", "Na próxima entrada, vamos pedir o código da aplicação.");
      },
      onError: (apiError) => {
        setCode("");
        toastService.apiError(apiError);
      },
    });
  };

  return (
    <>
      <Button onClick={start}>Activar</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Activar autenticação em dois passos</DialogTitle>
            <DialogDescription>Leia o código QR com a aplicação autenticadora e introduza o código de 6 dígitos que ela mostra.</DialogDescription>
          </DialogHeader>

          {setup.data ? (
            <form id="two-factor-enable" onSubmit={confirm} noValidate className="flex flex-col items-center gap-4">
              <div className="rounded-xl bg-white p-3">
                <QRCodeSVG value={setup.data.otpauthUrl} size={176} title="Código QR para a aplicação autenticadora" />
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Sem câmara? Introduza a chave manualmente:
                <code className="mt-1 block select-all break-all rounded-md bg-muted px-2 py-1 font-mono text-[13px] text-foreground">{setup.data.secret}</code>
              </p>
              <Label htmlFor="two-factor-enable-code" className="sr-only">
                Código de 6 dígitos
              </Label>
              <InputOTP
                id="two-factor-enable-code"
                maxLength={6}
                value={code}
                onChange={setCode}
                onComplete={() => confirm()}
                inputMode="numeric"
                autoComplete="one-time-code"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "two-factor-enable-error" : undefined}
              >
                <InputOTPGroup>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {error && (
                <p id="two-factor-enable-error" role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
            </form>
          ) : (
            <div role="status" className="flex h-48 items-center justify-center">
              <span aria-hidden className="size-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
              <span className="sr-only">A preparar o código QR…</span>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" form="two-factor-enable" disabled={!setup.data || enable.isPending}>
              {enable.isPending ? "A activar…" : "Activar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
