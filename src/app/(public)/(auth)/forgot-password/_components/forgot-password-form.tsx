"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/config/app";

export function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!value.trim()) {
      setError("Indique o seu e-mail ou telemóvel.");
      return;
    }
    // The API answers the same way whether or not the account exists, to avoid revealing accounts.
    setSentTo(value.trim());
  };

  if (sentTo) {
    return (
      <div role="status">
        <span className="inline-flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white">
          <HugeiconsIcon icon={Mail01Icon} className="size-5" aria-hidden />
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">Verifique a sua caixa</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Se existir uma conta associada a <span className="font-medium text-foreground">{sentTo}</span>, enviámos uma ligação (ou um código por SMS) para
          redefinir a palavra-passe. É válida durante 30 minutos.
        </p>
        <Button asChild variant="outline" className="mt-8 h-10 w-full">
          <Link href={ROUTES.login}>Voltar a entrar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Link href={ROUTES.login} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" aria-hidden />
        Voltar
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Recuperar acesso</h1>
      <p className="mt-1 text-sm text-muted-foreground">Indique o e-mail ou o telemóvel da sua conta.</p>
      <form onSubmit={submit} noValidate className="mt-8 space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="identifier">E-mail ou telemóvel</Label>
          <Input
            id="identifier"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            autoComplete="username"
            className="h-10"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "identifier-error" : undefined}
          />
          {error && (
            <p id="identifier-error" role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </div>
        <Button type="submit" className="btn-glossy h-10 w-full">
          Enviar instruções
        </Button>
      </form>
    </div>
  );
}
