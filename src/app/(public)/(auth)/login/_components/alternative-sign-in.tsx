"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/config/app";
import { toastService } from "@/services/toast.service";

const PHONE = /^(\+244\s?)?9\d{2}\s?\d{3}\s?\d{3}$/;

/** Workers without e-mail sign in with their phone and a one-time SMS code (doc 05, 5.6). */
export function SmsSignInDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("+244 ");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const reset = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setStep("phone");
      setCode("");
      setError(null);
    }
  };

  const sendCode = (event: FormEvent) => {
    event.preventDefault();
    if (!PHONE.test(phone.trim())) {
      setError("Formato: +244 9XX XXX XXX");
      return;
    }
    setError(null);
    setStep("code");
    toastService.info("Código enviado por SMS", phone.trim());
  };

  const verify = (event: FormEvent) => {
    event.preventDefault();
    if (code.length !== 6) {
      setError("Introduza os 6 dígitos do código.");
      return;
    }
    reset(false);
    router.push("/portal");
  };

  return (
    <Dialog open={open} onOpenChange={reset}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-10" type="button">
          Entrar com telemóvel e código SMS
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{step === "phone" ? "Entrar com o telemóvel" : "Introduza o código"}</DialogTitle>
          <DialogDescription>
            {step === "phone" ? "Enviamos um código de 6 dígitos por SMS." : `Enviámos um código para ${phone.trim()}. É válido durante 5 minutos.`}
          </DialogDescription>
        </DialogHeader>

        {step === "phone" ? (
          <form id="sms-phone" onSubmit={sendCode} noValidate className="space-y-1.5">
            <Label htmlFor="sms-phone-input">Telemóvel</Label>
            <Input
              id="sms-phone-input"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "sms-error" : undefined}
            />
          </form>
        ) : (
          <form id="sms-code" onSubmit={verify} noValidate className="flex flex-col items-center gap-3">
            <Label htmlFor="sms-code-input" className="sr-only">
              Código de 6 dígitos
            </Label>
            <InputOTP id="sms-code-input" maxLength={6} value={code} onChange={setCode} autoFocus aria-describedby={error ? "sms-error" : undefined}>
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <Button type="button" variant="link" className="h-auto p-0 text-sm" onClick={() => toastService.info("Código reenviado", phone.trim())}>
              Reenviar código
            </Button>
          </form>
        )}
        {error && (
          <p id="sms-error" role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <DialogFooter>
          {step === "code" && (
            <Button variant="outline" onClick={() => setStep("phone")}>
              Alterar número
            </Button>
          )}
          <Button type="submit" form={step === "phone" ? "sms-phone" : "sms-code"}>
            {step === "phone" ? "Enviar código" : "Entrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Enterprise plan: the e-mail domain identifies the company's identity provider (OIDC / SAML). */
export function SsoSignInDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Indique o e-mail da empresa.");
      return;
    }
    const domain = email.split("@")[1];
    toastService.info("A redireccionar para o fornecedor de identidade", domain);
    setOpen(false);
    router.push(ROUTES.dashboard);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-10" type="button">
          Entrar com SSO da empresa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Entrar com SSO</DialogTitle>
          <DialogDescription>Microsoft Entra ID, Google Workspace ou outro fornecedor configurado pela sua empresa.</DialogDescription>
        </DialogHeader>
        <form id="sso-form" onSubmit={submit} noValidate className="space-y-1.5">
          <Label htmlFor="sso-email">E-mail da empresa</Label>
          <Input
            id="sso-email"
            type="email"
            autoComplete="email"
            placeholder="nome@empresa.co.ao"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError(null);
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "sso-error" : undefined}
          />
          {error && (
            <p id="sso-error" role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </form>
        <DialogFooter>
          <Button type="submit" form="sso-form">
            Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
