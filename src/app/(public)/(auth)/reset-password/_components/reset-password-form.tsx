"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { ApiError } from "@api/lib/api-error";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/config/app";
import { useResetPasswordMutation } from "@/queries/auth/mutation";
import { type ResetPasswordFormValues, resetPasswordSchema } from "@/schemas/auth";
import { toastService } from "@/services/toast.service";

import { InvalidLink } from "../../_components/invalid-link";

export function ResetPasswordForm({ token }: { token: string }) {
  const reset = useResetPasswordMutation();
  const [state, setState] = useState<"form" | "done" | "expired">("form");

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = ({ password }: ResetPasswordFormValues) =>
    reset.mutate(
      { token, password },
      {
        onSuccess: () => setState("done"),
        onError: (error) => {
          const apiError = ApiError.from(error);
          if (apiError.code === "invalid_reset_token") setState("expired");
          else if (apiError.fieldErrors.password) form.setError("password", { message: apiError.fieldErrors.password.join(". ") });
          else toastService.apiError(apiError);
        },
      },
    );

  if (state === "expired") {
    return <InvalidLink title="Ligação expirada" description="A ligação já foi usada ou passou dos 30 minutos de validade. Peça uma nova." action="forgot" />;
  }

  if (state === "done") {
    return (
      <div role="status" className="text-center">
        <HugeiconsIcon icon={CheckmarkCircle02Icon} className="mx-auto size-11 text-success" aria-hidden />
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-white">Palavra-passe alterada</h1>
        <p className="mt-2 text-sm text-muted-foreground">Por segurança, terminámos as sessões abertas noutros dispositivos. Entre com a nova palavra-passe.</p>
        <Button asChild className="btn-glossy mt-8 h-10 w-full">
          <Link href={ROUTES.login}>Entrar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold tracking-tight text-white">Nova palavra-passe</h1>
      <p className="mt-1.5 text-center text-sm text-muted-foreground">Escolha uma palavra-passe com pelo menos 8 caracteres, letras e números.</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nova palavra-passe</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" className="h-10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repetir palavra-passe</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" className="h-10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="btn-glossy h-10 w-full" disabled={reset.isPending}>
            {reset.isPending ? "A guardar…" : "Guardar palavra-passe"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
