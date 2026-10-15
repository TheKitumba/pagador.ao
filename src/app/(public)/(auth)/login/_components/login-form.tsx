"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/config/app";
import { useAfterSignIn } from "@/hooks/use-after-sign-in";
import { useLoginMutation, useVerifyTwoFactorMutation } from "@/queries/auth/mutation";
import { type LoginFormValues, loginSchema } from "@/schemas/auth";
import { toastService } from "@/services/toast.service";

import { SmsSignInDialog } from "./alternative-sign-in";

export function LoginForm() {
  const login = useLoginMutation();
  const afterSignIn = useAfterSignIn();
  const [challengeToken, setChallengeToken] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginFormValues) =>
    login.mutate(values, {
      onSuccess: (result) => {
        if (result.requiresTwoFactor && result.challengeToken) setChallengeToken(result.challengeToken);
        else if (result.user) afterSignIn(result.user);
      },
      onError: toastService.apiError,
    });

  if (challengeToken) {
    return <TwoFactorStep challengeToken={challengeToken} onBack={() => setChallengeToken(null)} />;
  }

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold tracking-tight text-white">Entrar no Pagador.ao</h1>
      <p className="mt-1.5 text-center text-sm text-muted-foreground">Bem-vindo de volta. Introduza os seus dados para continuar.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="nome@empresa.co.ao" autoComplete="email" className="h-10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Palavra-passe</FormLabel>
                  <Link href={ROUTES.forgotPassword} className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                    Esqueceu-se?
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" autoComplete="current-password" className="h-10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="btn-glossy h-10 w-full" disabled={login.isPending}>
            {login.isPending ? "A entrar…" : "Entrar"}
          </Button>
        </form>
      </Form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        ou
        <span className="h-px flex-1 bg-border" />
      </div>
      <SmsSignInDialog />

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Ainda não tem conta?{" "}
        <Link href={ROUTES.register} className="font-medium text-primary underline-offset-4 hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  );
}

/** Second step when the account has 2FA: a code from the authenticator app (POST /auth/2fa/verify). */
function TwoFactorStep({ challengeToken, onBack }: { challengeToken: string; onBack: () => void }) {
  const verify = useVerifyTwoFactorMutation();
  const afterSignIn = useAfterSignIn();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    if (code.length !== 6) {
      setError("Introduza os 6 dígitos da aplicação autenticadora.");
      return;
    }
    setError(null);
    verify.mutate(
      { challengeToken, code },
      {
        onSuccess: ({ user }) => user && afterSignIn(user),
        onError: (apiError) => {
          setCode("");
          toastService.apiError(apiError);
        },
      },
    );
  };

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold tracking-tight text-white">Verificação em dois passos</h1>
      <p className="mt-1.5 text-center text-sm text-muted-foreground">Introduza o código de 6 dígitos da sua aplicação autenticadora.</p>

      <form onSubmit={submit} noValidate className="mt-8 flex flex-col items-center gap-5">
        <Label htmlFor="two-factor-code" className="sr-only">
          Código de 6 dígitos
        </Label>
        <InputOTP
          id="two-factor-code"
          maxLength={6}
          value={code}
          onChange={setCode}
          onComplete={() => submit()}
          autoFocus
          inputMode="numeric"
          autoComplete="one-time-code"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "two-factor-error" : undefined}
        >
          <InputOTPGroup>
            {Array.from({ length: 6 }).map((_, index) => (
              <InputOTPSlot key={index} index={index} className="size-11 text-base" />
            ))}
          </InputOTPGroup>
        </InputOTP>
        {error && (
          <p id="two-factor-error" role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" className="btn-glossy h-10 w-full" disabled={verify.isPending}>
          {verify.isPending ? "A verificar…" : "Verificar"}
        </Button>
        <Button type="button" variant="ghost" className="h-auto p-0 text-sm" onClick={onBack}>
          Usar outra conta
        </Button>
      </form>
    </div>
  );
}
