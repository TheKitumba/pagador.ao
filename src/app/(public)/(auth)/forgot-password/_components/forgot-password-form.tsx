"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/config/app";
import { useForgotPasswordMutation } from "@/queries/auth/mutation";
import { type ForgotPasswordFormValues, forgotPasswordSchema } from "@/schemas/auth";
import { toastService } from "@/services/toast.service";

export function ForgotPasswordForm() {
  const forgot = useForgotPasswordMutation();
  const [sentTo, setSentTo] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = ({ email }: ForgotPasswordFormValues) =>
    forgot.mutate(email.trim(), {
      // The API answers the same whether or not the account exists, so the message does too.
      onSuccess: () => setSentTo(email.trim()),
      onError: toastService.apiError,
    });

  if (sentTo) {
    return (
      <div role="status" className="text-center">
        <span className="mx-auto inline-flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white">
          <HugeiconsIcon icon={Mail01Icon} className="size-5" aria-hidden />
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-white">Verifique a sua caixa</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Se existir uma conta com <span className="font-medium text-foreground">{sentTo}</span>, enviámos uma ligação para redefinir a palavra-passe. É
          válida durante 30 minutos.
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
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white">Recuperar acesso</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Indique o e-mail da sua conta. Se entra com o telemóvel, use o código por SMS na página de entrada.
      </p>
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
          <Button type="submit" className="btn-glossy h-10 w-full" disabled={forgot.isPending}>
            {forgot.isPending ? "A enviar…" : "Enviar ligação"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
