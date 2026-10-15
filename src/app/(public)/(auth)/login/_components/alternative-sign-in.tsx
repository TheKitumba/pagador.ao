"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useAfterSignIn } from "@/hooks/use-after-sign-in";
import { useRequestLoginCodeMutation, useVerifyLoginCodeMutation } from "@/queries/auth/mutation";
import { toastService } from "@/services/toast.service";

const PHONE = /^(\+244\s?)?9\d{2}\s?\d{3}\s?\d{3}$/;

/** Workers without e-mail sign in with their phone and a one-time SMS code (docs/05, 5.6). */
export function SmsSignInDialog() {
  const requestCode = useRequestLoginCodeMutation();
  const verifyCode = useVerifyLoginCodeMutation();
  const afterSignIn = useAfterSignIn();
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

  const send = () =>
    requestCode.mutate(phone.trim(), {
      // The API answers the same whether or not the number exists, so the message does too.
      onSuccess: () => {
        setStep("code");
        toastService.info("Se o número tiver conta, enviámos um código por SMS", phone.trim());
      },
      onError: toastService.apiError,
    });

  const sendCode = (event: FormEvent) => {
    event.preventDefault();
    if (!PHONE.test(phone.trim())) {
      setError("Formato: +244 9XX XXX XXX");
      return;
    }
    setError(null);
    send();
  };

  const verify = (event?: FormEvent) => {
    event?.preventDefault();
    if (code.length !== 6) {
      setError("Introduza os 6 dígitos do código.");
      return;
    }
    setError(null);
    verifyCode.mutate(
      { phone: phone.trim(), code },
      {
        onSuccess: ({ user }) => {
          if (!user) return;
          reset(false);
          afterSignIn(user);
        },
        onError: (apiError) => {
          setCode("");
          toastService.apiError(apiError);
        },
      },
    );
  };

  const pending = requestCode.isPending || verifyCode.isPending;

  return (
    <Dialog open={open} onOpenChange={reset}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-10 w-full" type="button">
          Entrar com telemóvel e código SMS
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{step === "phone" ? "Entrar com o telemóvel" : "Introduza o código"}</DialogTitle>
          <DialogDescription>
            {step === "phone" ? "Para trabalhadores sem e-mail. Enviamos um código de 6 dígitos por SMS." : `Enviámos um código para ${phone.trim()}. É válido durante 5 minutos.`}
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
            <InputOTP
              id="sms-code-input"
              maxLength={6}
              value={code}
              onChange={setCode}
              onComplete={() => verify()}
              autoFocus
              inputMode="numeric"
              autoComplete="one-time-code"
              aria-describedby={error ? "sms-error" : undefined}
            >
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <Button type="button" variant="link" className="h-auto p-0 text-sm" disabled={pending} onClick={send}>
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
          <Button type="submit" form={step === "phone" ? "sms-phone" : "sms-code"} disabled={pending}>
            {step === "phone" ? (requestCode.isPending ? "A enviar…" : "Enviar código") : verifyCode.isPending ? "A entrar…" : "Entrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
